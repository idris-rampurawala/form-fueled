from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

USER_REGISTER_URL = reverse('user:register')


class PublicTokenApiTests(TestCase):
    """Test the user registeration API (public)
    """

    def setUp(self):
        self.client = APIClient()

    def test_user_registeration(self):
        """Test register user
        """
        payload = {
            'email': 'test@formfueled.com',
            'password': 'test1@formfueled',
            'name': 'Test 1'
        }
        res = self.client.post(USER_REGISTER_URL, payload)

        self.assertEquals(res.status_code, status.HTTP_201_CREATED)

    def test_existing_user_registeration(self):
        """Test register existing user
        """
        payload = {
            'email': 'test@formfueled.com',
            'password': 'test1@formfueled',
            'name': 'Test 1'
        }
        _ = get_user_model().objects.create_user(
            email=payload['email'],
            password=payload['password'],
            name=payload['name']
        )
        res = self.client.post(USER_REGISTER_URL, payload)

        self.assertEquals(res.status_code, status.HTTP_400_BAD_REQUEST)
