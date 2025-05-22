from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatMessageViewSet, UserProfileViewSet, ConversationViewSet, NotificationViewSet, SubscriptionViewSet

router = DefaultRouter()
router.register(r'chatmessages', ChatMessageViewSet)
router.register(r'userprofiles', UserProfileViewSet)
router.register(r'conversations', ConversationViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'subscriptions', SubscriptionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
