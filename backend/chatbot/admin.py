from django.contrib import admin
from .models import ChatMessage, UserProfile, Conversation

class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'timestamp')
    search_fields = ('user__username', 'message')

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'address', 'city', 'otp_code', 'status')
    search_fields = ('user__username', 'address', 'city')

class ConversationAdmin(admin.ModelAdmin):
    list_display = ('user', 'timestamp')
    search_fields = ('user__username',)

admin.site.register(ChatMessage, ChatMessageAdmin)
admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(Conversation, ConversationAdmin)
