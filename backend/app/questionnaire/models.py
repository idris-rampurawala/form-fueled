import uuid

from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField
from django.db import models

from .enums import QuestionTypesEnum


class Questionnaire(models.Model):
    """Questionnaire base (resembles a form)
    """
    # id will also serve as a token for a shareable URL of this Questionnaire
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)  # form owner
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user.email} - {self.name}'


class Question(models.Model):
    """Questions for a Questionnaire
    """
    questionnaire = models.ForeignKey(Questionnaire, on_delete=models.CASCADE)
    question_text = models.TextField()
    question_type = models.CharField(
        max_length=20,
        choices=QuestionTypesEnum.choices,
        default=QuestionTypesEnum.TEXT.value)
    options = ArrayField(  # for QuestionTypesEnum.TEXT, this will be null
        models.JSONField(default=dict),
        blank=True,
        null=True,
        size=5  # limiting the options to 5
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.questionnaire.name} - {self.question_text}'


class QuestionnaireRespondent(models.Model):
    """Questionnaire respondent signifies an entry per response to a questionnaire
    """
    questionnaire = models.ForeignKey(Questionnaire, related_name='responses', on_delete=models.CASCADE)
    respondent_email = models.EmailField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['questionnaire', 'respondent_email']  # unique response per email to a questionnaire

    def __str__(self):
        return f'{self.questionnaire} - {self.respondent_email}'


class QResponse(models.Model):
    """Questions' responses for a Questionnaire
    """
    question = models.ForeignKey(Question, related_name='answers', on_delete=models.CASCADE)
    questionnaire_respondent = models.ForeignKey(
        QuestionnaireRespondent,
        related_name='respondent',
        on_delete=models.CASCADE)
    answers = ArrayField(  # any response will be saved here.
        models.TextField()
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.question} - {self.questionnaire_respondent}'
