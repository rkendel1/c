from django.contrib import admin
from .models import ChatMessage, Conversation

class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'timestamp')
    search_fields = ('user__username', 'message')



class ConversationAdmin(admin.ModelAdmin):
    list_display = ('user', 'timestamp')
    search_fields = ('user__username',)

admin.site.register(ChatMessage, ChatMessageAdmin)

admin.site.register(Conversation, ConversationAdmin)
