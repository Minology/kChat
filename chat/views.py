from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.shortcuts import render, get_object_or_404
from django.utils.safestring import mark_safe
from .models import Message, Conversation, AttachmentType
import json

User = get_user_model()


def get_last_10_messages(conversation_id):
    conversation = get_object_or_404(Conversation, id=conversation_id)
    messages = conversation.messages.all().order_by('-created_at')[:10]
    return messages

def get_sender(username):
    return get_object_or_404(User, username=username)

def get_conversation(conversation_id):
    return get_object_or_404(Conversation, pk=conversation_id)

def get_attachment_type(attachment_type):
    return get_object_or_404(AttachmentType, name=attachment_type)

def index(request):
    return render(request, 'chat/index.html', {})

@login_required
def room(request, room_name):
    return render(request, 'chat/room.html', {
        'room_name_json': mark_safe(json.dumps(room_name)),
        'username': mark_safe(json.dumps(request.user.username)), 
    })