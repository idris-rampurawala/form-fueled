from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.authentication import JWTAuthentication

QUESTIONNAIRE_LIST = reverse('questionnaire:list')
QUESTIONNAIRE_DETAIL = reverse('questionnaire:detail')
QUESTIONNAIRE_SHARED = reverse('questionnaire:detail')
