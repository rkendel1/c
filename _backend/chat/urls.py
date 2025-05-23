from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatMessageViewSet, ConversationViewSet

router = DefaultRouter()
router.register(r'chatmessages', ChatMessageViewSet)

router.register(r'conversations', ConversationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
