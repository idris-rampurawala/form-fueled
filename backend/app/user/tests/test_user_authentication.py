from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.authentication import JWTAuthentication

USER_TOKEN_URL = reverse('user:token_obtain_pair')
USER_REFRESH_TOKEN_URL = reverse('user:token_refresh')
USER_DETAILS_URL = reverse('user:details')


class PublicTokenApiTests(TestCase):
    """Test the user authentication API (public)
    """

    def setUp(self):
        self.user_creds = {
            'email': 'test@formfueled.com',
            'password': 'password123'
        }
        self.user = get_user_model().objects.create_user(
            email=self.user_creds['email'],
            password=self.user_creds['password']
        )
        self.client = APIClient()

    def test_user_token(self):
        """Test to generate user tokens
        """
        payload = {'email': self.user_creds['email'], 'password': self.user_creds['password']}
        res = self.client.post(USER_TOKEN_URL, payload)

        self.assertIn('access', res.data)
        self.assertIn('refresh', res.data)
        validated_token = JWTAuthentication().get_validated_token(res.data['access'])
        self.assertEquals(JWTAuthentication().get_user(validated_token), self.user)

    def test_user_token_invalid_credentials(self):
        """Test user authentication with invalid credentials
        """
        payload = {'email': self.user_creds['email'], 'password': 'something'}
        res = self.client.post(USER_TOKEN_URL, payload)

        self.assertNotIn('access', res.data)
        self.assertNotIn('refresh', res.data)
        self.assertEquals(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_refresh_token(self):
        """Test to generate user token from refresh token
        """
        payload = {'email': self.user_creds['email'], 'password': self.user_creds['password']}
        res = self.client.post(USER_TOKEN_URL, payload)
        user_refresh_token = res.data['refresh']

        payload = {'refresh': user_refresh_token}
        res = self.client.post(USER_REFRESH_TOKEN_URL, payload)

        self.assertIn('access', res.data)
        validated_token = JWTAuthentication().get_validated_token(res.data['access'])
        self.assertEquals(JWTAuthentication().get_user(validated_token), self.user)


class PrivateUserApiTests(TestCase):
    """Test the user API (private)
    """

    def setUp(self):
        self.user_creds = {
            'email': 'test@formfueled.com',
            'password': 'password123'
        }
        self.user = get_user_model().objects.create_user(
            email=self.user_creds['email'],
            password=self.user_creds['password']
        )
        self.client = APIClient()

    def test_authenticated_user_details(self):
        """Test fetch user details of an authenticated user
        """
        self.client.force_authenticate(self.user)
        res = self.client.get(USER_DETAILS_URL)

        self.assertEquals(res.data['email'], self.user.email)
        self.assertEquals(res.data['name'], self.user.name)

    def test_unauthenticated_user_details(self):
        """Test fetch user details without authentication
        """
        res = self.client.get(USER_DETAILS_URL)

        self.assertEquals(res.status_code, status.HTTP_401_UNAUTHORIZED)
