from app.pagination import DefaultCursorPagination
from django.conf import settings
from django.db.models import Prefetch
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import QResponse, Questionnaire, QuestionnaireRespondent
from .serializers import (QuestionnaireCreateSerializer,
                          QuestionnaireDetailSerializer,
                          QuestionnaireResponseSerializer,
                          QuestionnaireResponsesSerializer)


class QuestionnaireApi(APIView):
    http_method_names = ['post', 'get']
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self, user_id):
        return Questionnaire.objects.filter(user_id=user_id).prefetch_related('question_set')

    def get(self, request):
        """ API to fetch a questionnaire with questions
        """
        queryset = self.get_queryset(request.user.id)
        paginator = DefaultCursorPagination()
        paginator_response = paginator.paginate_queryset(queryset, request)
        serializer = QuestionnaireDetailSerializer(paginator_response, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request, format=None):
        """ Creates a Questionnaire
        """
        serializer = QuestionnaireCreateSerializer(data=request.data, context={'user': request.user})
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        links = {
            'share': f'{settings.UI_BASE_URL}/questionnaire/{data.get("id")}',
            'responses': f'{settings.UI_BASE_URL}/questionnaire/{data.get("id")}/responses',
            'edit': f'{settings.UI_BASE_URL}/questionnaire/{data.get("id")}/edit'
        }
        data['links'] = links
        return Response({'detail': data}, status=HTTP_201_CREATED)


class QuestionnaireDetailApi(APIView):
    http_method_names = ['patch', 'get', 'delete']
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_object(self, user_id, pk):
        try:
            questionnaire_obj = Questionnaire.objects.prefetch_related('question_set').get(pk=pk, user_id=user_id)
            return questionnaire_obj
        except Questionnaire.DoesNotExist:
            raise NotFound

    def get(self, request, qid):
        """ API to fetch a questionnaire with questions
        """
        questionnaire_obj = self.get_object(request.user.id, qid)
        serializer = QuestionnaireDetailSerializer(questionnaire_obj)
        return Response({'detail': serializer.data}, status=HTTP_200_OK)

    def patch(self, request, qid):
        """ API to update a questionnaire
        """
        questionnaire_obj = self.get_object(request.user.id, qid)
        serializer = QuestionnaireCreateSerializer(
            questionnaire_obj,
            data=request.data,
            context={
                'user': request.user
            },
            partial=True)
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        links = {
            'share': f'{settings.UI_BASE_URL}/questionnaire/{data.get("id")}',
            'responses': f'{settings.UI_BASE_URL}/questionnaire/{data.get("id")}/responses',
            'edit': f'{settings.UI_BASE_URL}/questionnaire/{data.get("id")}/edit'
        }
        data['links'] = links
        return Response({'detail': data}, status=HTTP_200_OK)

    def delete(self, request, qid):
        """ Deletes a questionnaire and related data
        """
        questionnaire_obj = self.get_object(request.user.id, qid)
        questionnaire_obj.delete()
        return Response({'detail': 'Success deleted the resource.'}, status=HTTP_200_OK)


class QuestionnaireSharedApi(APIView):
    http_method_names = ['get', 'post']

    def get_object(self, pk):
        try:
            questionnaire_obj = Questionnaire.objects.prefetch_related('question_set').get(pk=pk)
            return questionnaire_obj
        except Questionnaire.DoesNotExist:
            raise NotFound

    def get(self, request, qid):
        """ API to fetch a questionnaire with questions (without authentication)
        """
        questionnaire_obj = self.get_object(qid)
        serializer = QuestionnaireDetailSerializer(questionnaire_obj)
        return Response({'detail': serializer.data}, status=HTTP_200_OK)

    def post(self, request, qid):
        """ API to save a questionnaire responses (without authentication)
        """
        questionnaire_obj = self.get_object(qid)
        serializer = QuestionnaireResponseSerializer(
            data=request.data, context={
                'questionnaire_obj': questionnaire_obj})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': 'Response saved successfully'}, status=HTTP_200_OK)


class QuestionnaireResponsesApi(APIView):
    http_method_names = ['get']
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_object(self, user_id, qid):
        try:
            questionnaire_obj = Questionnaire.objects.prefetch_related(
                Prefetch('responses', queryset=QuestionnaireRespondent.objects.prefetch_related(
                    Prefetch(
                        'respondent', queryset=QResponse.objects.select_related('question').all())
                ))).get(pk=qid, user_id=user_id)
            return questionnaire_obj
        except Questionnaire.DoesNotExist:
            raise NotFound

    def get(self, request, qid):
        """ API to fetch a questionnaire with questions
        """
        questionnaire_obj = self.get_object(request.user.id, qid)
        serializer = QuestionnaireResponsesSerializer(questionnaire_obj, many=False)
        return Response({'detail': serializer.data}, status=HTTP_200_OK)


class QuestionnaireResponsesListApi(APIView):
    http_method_names = ['get']
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self, user_id):
        return Questionnaire.objects.prefetch_related(
            Prefetch('responses', queryset=QuestionnaireRespondent.objects.prefetch_related(
                Prefetch(
                    'respondent', queryset=QResponse.objects.select_related('question').all())
            ))).filter(user_id=user_id)

    def get(self, request):
        """ API to fetch all questionnaires alongwith their responses
        """
        queryset = self.get_queryset(request.user.id)
        paginator = DefaultCursorPagination()
        paginator_response = paginator.paginate_queryset(queryset, request)
        serializer = QuestionnaireResponsesSerializer(paginator_response, many=True)
        return paginator.get_paginated_response(serializer.data)
