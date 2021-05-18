from django.db import transaction
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .enums import QuestionTypesEnum
from .models import QResponse, Question, Questionnaire, QuestionnaireRespondent


class QuestionOptionCreateSerializer(serializers.Serializer):
    """Serializer for questions' option create
    """
    text = serializers.CharField()
    sequence = serializers.IntegerField(required=False, default=1)


class QuestionCreateSerializer(serializers.Serializer):
    """Serializer for question create
    """
    # id field is only required if updating the action in update flow
    # If not found then action would be created rather than updating
    id = serializers.IntegerField(required=False)
    text = serializers.CharField()
    qtype = serializers.ChoiceField(choices=QuestionTypesEnum.choices)
    options = serializers.ListField(
        child=serializers.JSONField(),
        required=False,
        min_length=0,
        max_length=5
    )

    def validate_options(self, attrs):
        result_attrs = []
        for attr in attrs:
            serializer = QuestionOptionCreateSerializer(data=attr)
            serializer.is_valid(raise_exception=True)
            result_attrs.append(serializer.data)
        return result_attrs

    def validate(self, attrs):
        qtype = attrs.get('qtype')
        if qtype == QuestionTypesEnum.TEXT.value:
            # remove options if any
            attrs['options'] = []
        elif qtype == QuestionTypesEnum.MCSS.value:
            # error if options not found
            if not attrs.get('options'):
                raise serializers.ValidationError({
                    'options': 'This field is required.'
                })
        return attrs


class QuestionnaireCreateSerializer(serializers.Serializer):
    """Serializer for questionnaire create
    """
    name = serializers.CharField(max_length=100)
    description = serializers.CharField()
    questions = serializers.ListField(
        child=serializers.JSONField(),
        min_length=1,
        max_length=100  # for sanity, keeping maximum questions per questionnaire to 100
    )

    def validate_questions(self, attrs):
        result_attrs = []
        for attr in attrs:
            serializer = QuestionCreateSerializer(data=attr)
            serializer.is_valid(raise_exception=True)
            result_attrs.append(serializer.data)
        return result_attrs

    def create(self, validated_data):
        """Create a new questionnaire with questions
        """
        with transaction.atomic():
            questionnaire_obj = Questionnaire.objects.create(
                name=validated_data.get('name'),
                description=validated_data.get('description'),
                user=self.context.get('user')
            )
            question_obj_list = []
            for question in validated_data.get('questions'):
                question_obj_list.append(
                    Question(
                        questionnaire=questionnaire_obj,
                        question_text=question.get('text'),
                        question_type=question.get('qtype'),
                        options=question.get('options')
                    )
                )
            question_objects = Question.objects.bulk_create(question_obj_list)
            for i, question in enumerate(question_objects):
                validated_data['questions'][i]['id'] = question.id
            validated_data['id'] = questionnaire_obj.id

        return validated_data

    def update(self, instance, validated_data):
        """Partial updates existing questionnaire with questions
        """
        with transaction.atomic():
            instance.name = validated_data.get('name')
            instance.description = validated_data.get('description')
            instance.save()

            if validated_data.get('questions'):
                request_questions = validated_data.get('questions')
                questions_to_update = []
                req_questions_invalid_index = [i for i, d in enumerate(request_questions)]
                for question in instance.question_set.all():
                    req_question_index = [
                        i
                        for i, d in enumerate(request_questions)
                        if d.get('id', None) == question.id
                    ]
                    if len(req_question_index) > 0:
                        index = req_question_index[0]
                        question.question_text = request_questions[index].get('text', question.question_text)
                        question.question_type = request_questions[index].get('qtype', question.question_type)
                        question.options = request_questions[index].get('options', question.options)
                        questions_to_update.append(
                            question
                        )
                        req_questions_invalid_index.remove(index)

                Question.objects.bulk_update(
                    questions_to_update, [
                        'question_text', 'question_type', 'options', 'updated_at'])

                if len(req_questions_invalid_index):
                    # remove fake data
                    for q in req_questions_invalid_index:
                        del request_questions[q]
        return validated_data


class QuestionDetailSerializer(serializers.ModelSerializer):
    text = serializers.CharField(source='question_text')
    qtype = serializers.CharField(source='question_type')

    class Meta:
        model = Question
        fields = ['id', 'text', 'qtype', 'options', 'created_at', 'updated_at']


class QuestionnaireDetailSerializer(serializers.ModelSerializer):
    questions = QuestionDetailSerializer(many=True, source='question_set')

    class Meta:
        model = Questionnaire
        fields = ['id', 'name', 'description', 'created_at', 'updated_at', 'questions']


class QuestionResponseSerializer(serializers.Serializer):
    """Serializer for saving question response
    """
    id = serializers.IntegerField()
    options = serializers.ListField(
        child=serializers.CharField(),
        min_length=1,
        max_length=5
    )


class QuestionnaireResponseSerializer(serializers.Serializer):
    """Serializer for saving questionnaire response
    """
    respondent_email = serializers.EmailField()
    questions = QuestionResponseSerializer(many=True)

    def create(self, validated_data):
        """Create a new questionnaire with questions
            All questions are mandatory
        """
        questionnaire_obj = self.context.get('questionnaire_obj')
        respondent_email = validated_data['respondent_email']
        # check if response is already received
        if QuestionnaireRespondent.objects.filter(
                questionnaire_id=questionnaire_obj.id, respondent_email=respondent_email).exists():
            raise ValidationError(detail='Response already received.')

        valid_question_ids = {q.id for q in questionnaire_obj.question_set.all()}
        with transaction.atomic():
            questionnaire_respondent_obj = QuestionnaireRespondent.objects.create(
                questionnaire=questionnaire_obj,
                respondent_email=respondent_email
            )
            qresponse_obj_list = []
            for question in validated_data.get('questions'):
                if question['id'] in valid_question_ids:
                    qresponse_obj_list.append(
                        QResponse(
                            questionnaire_respondent=questionnaire_respondent_obj,
                            question_id=question['id'],
                            answers=question['options']
                        )
                    )
                    valid_question_ids.remove(question['id'])

            if len(valid_question_ids) > 0:
                raise ValidationError(
                    detail='Please add a response to all the questions. All questions are mandatory')
            QResponse.objects.bulk_create(qresponse_obj_list)
        return questionnaire_obj


class QResponseSerializer(serializers.ModelSerializer):
    text = serializers.SerializerMethodField()
    qtype = serializers.SerializerMethodField()
    options = serializers.SerializerMethodField()

    def get_text(self, obj):
        return obj.question.question_text

    def get_qtype(self, obj):
        return obj.question.question_type

    def get_options(self, obj):
        return obj.question.options

    class Meta:
        model = QResponse
        fields = ['text', 'options', 'qtype', 'answers']


class QuestionnaireAnswersSerializer(serializers.ModelSerializer):
    """ Serializer to fetch a responses of a Questionnaire
    """
    questions = QResponseSerializer(many=True, source='respondent')

    class Meta:
        model = QuestionnaireRespondent
        fields = ['respondent_email', 'created_at', 'questions']


class QuestionnaireResponsesSerializer(serializers.ModelSerializer):
    """ Serializer to fetch all the responses of a Questionnaire
    """
    responses = QuestionnaireAnswersSerializer(many=True)

    class Meta:
        model = Questionnaire
        fields = ['id', 'name', 'description', 'updated_at', 'created_at', 'responses']
