from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from .models import ChatMessage, UserProfile, Conversation

class ChatMessageViewSetTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.login(username='testuser', password='testpassword')

    def test_create_chat_message(self):
        url = '/api/chatmessages/'
        data = {'user': self.user.id, 'message': 'Hello, world!'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ChatMessage.objects.count(), 1)
        self.assertEqual(ChatMessage.objects.get().message, 'Hello, world!')

    def test_retrieve_chat_message(self):
        chat_message = ChatMessage.objects.create(user=self.user, message='Hello, world!')
        url = f'/api/chatmessages/{chat_message.id}/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Hello, world!')

class UserProfileViewSetTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.login(username='testuser', password='testpassword')

    def test_retrieve_user_profile(self):
        user_profile = UserProfile.objects.create(user=self.user, address='123 Main St', city='Anytown', otp_code='123456', status='active')
        url = f'/api/userprofiles/{user_profile.id}/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['address'], '123 Main St')

    def test_update_user_profile(self):
        user_profile = UserProfile.objects.create(user=self.user, address='123 Main St', city='Anytown', otp_code='123456', status='active')
        url = f'/api/userprofiles/{user_profile.id}/'
        data = {'address': '456 Elm St', 'city': 'Othertown', 'otp_code': '654321', 'status': 'inactive'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(UserProfile.objects.get().address, '456 Elm St')

class ConversationViewSetTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.login(username='testuser', password='testpassword')

    def test_retrieve_conversation(self):
        conversation = Conversation.objects.create(user=self.user)
        url = f'/api/conversations/{conversation.id}/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user'], self.user.id)

    def test_update_conversation(self):
        conversation = Conversation.objects.create(user=self.user)
        chat_message = ChatMessage.objects.create(user=self.user, message='Hello, world!')
        url = f'/api/conversations/{conversation.id}/'
        data = {'messages': [chat_message.id]}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Conversation.objects.get().messages.count(), 1)
