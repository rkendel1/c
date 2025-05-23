from django.test import TestCase

# Create your tests here.
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .models import UserProfile

class UserProfileViewSetTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.login(username='testuser', password='testpassword')

    def test_retrieve_user_profile(self):
        user_profile = UserProfile.objects.create(
            user=self.user,
            address='123 Main St',
            city='Anytown',
            otp_code='123456',
            status='active'
        )
        url = f'/api/userprofiles/{user_profile.id}/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['address'], '123 Main St')

    def test_update_user_profile(self):
        user_profile = UserProfile.objects.create(
            user=self.user,
            address='123 Main St',
            city='Anytown',
            otp_code='123456',
            status='active'
        )
        url = f'/api/userprofiles/{user_profile.id}/'
        data = {'address': '456 Elm St', 'city': 'Othertown', 'otp_code': '654321', 'status': 'inactive'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(UserProfile.objects.get().address, '456 Elm St')