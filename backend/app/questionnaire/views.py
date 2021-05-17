from django.conf import settings
from rest_framework.exceptions import NotFound
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Questionnaire
from .serializers import (QuestionnaireCreateSerializer,
                          QuestionnaireDetailSerializer)


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
        paginator = LimitOffsetPagination()
        paginator_response = paginator.paginate_queryset(queryset, request)
        serializer = QuestionnaireDetailSerializer(paginator_response, many=True)
        return Response({
            'detail': serializer.data,
            'limit': paginator.limit,
            'offset': paginator.offset,
            'total': paginator.count
        }, status=HTTP_200_OK)

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


class QuestionnairDetaileApi(APIView):
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
        serialier = QuestionnaireDetailSerializer(questionnaire_obj)
        return Response({'detail': serialier.data}, status=HTTP_200_OK)

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
        return Response({'detail': {}}, status=HTTP_200_OK)


class QuestionnaireSharedApi(APIView):
    http_method_names = ['get']

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
        serialier = QuestionnaireDetailSerializer(questionnaire_obj)
        return Response({'detail': serialier.data}, status=HTTP_200_OK)
