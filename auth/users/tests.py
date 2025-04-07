from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.response import Response
from django.contrib.auth.models import User
from typing import cast

from .urls import NAMES

class AuthTests(APITestCase):
    client: APIClient

    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse(NAMES.REGISTER)
        self.login_url = reverse(NAMES.LOGIN)
        self.refresh_url = reverse(NAMES.REFRESH)
        self.current_user_url = reverse(NAMES.CURRENT_USER)

        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword123'
        }

    def test_register_user(self):
        # Setup

        # Act
        response = cast(Response, self.client.post(self.register_url, self.user_data))

        # Assert
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')

    def test_login_user(self):
        # Setup
        User.objects.create_user(**self.user_data)
        login_data = {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        }

        # Act
        response = cast(Response, self.client.post(self.login_url, login_data))

        # Assert
        assert isinstance(response, Response)
        assert response.data is not None

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_refresh_token(self):
        # Setup
        User.objects.create_user(**self.user_data)
        login_response = self.client.post(self.login_url, {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        })

        assert isinstance(login_response, Response)
        assert login_response.data is not None

        refresh_token = login_response.data['refresh']
        
        # Act
        response = cast(Response, self.client.post(self.refresh_url, {'refresh': refresh_token}))
        
        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data, "Response data should not be None")

        assert response.data is not None

        self.assertIn('access', response.data)

    def test_register_with_existing_username(self):
        # Setup
        User.objects.create_user(**self.user_data)

        # Act
        response = self.client.post(self.register_url, self.user_data)
        assert isinstance(response, Response)
        
        # Assert
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_current_user(self):
        # Setup
        self.client.post(self.register_url, self.user_data)
        login_response = cast(Response, self.client.post(self.login_url, {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        }))

        assert isinstance(login_response, Response)
        assert login_response.data is not None
        
        access_token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)

        # Act
        response = cast(Response, (self.client.get(self.current_user_url)))

        # Assert
        assert isinstance(response, Response)
        assert response.data is not None

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user_data['username'])
        self.assertEqual(response.data['email'], self.user_data['email'])

    def test_unauthenticated_access_to_current_user(self):        
        # Setup

        # Act
        response = self.client.get(self.current_user_url)

        # Assert
        assert isinstance(response, Response)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
