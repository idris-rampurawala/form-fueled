from django.urls import path

from . import views

app_name = 'questionnaire'

urlpatterns = [
    path('shared/<uuid:qid>/', views.QuestionnaireSharedApi.as_view(), name='shared'),
    path('<uuid:qid>/responses/', views.QuestionnaireResponsesApi.as_view(), name='response'),
    path('<uuid:qid>/', views.QuestionnaireDetailApi.as_view(), name='detail'),
    path('', views.QuestionnaireApi.as_view(), name='list'),
]
