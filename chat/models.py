from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class Conversation(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    title = models.CharField(max_length=40)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name = 'conversations')

    def __str__(self):
        return self.title


class AttachmentType(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Message(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    message = models.TextField(default='')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages')
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name = 'messages')
    attachment_type = models.ForeignKey(AttachmentType, on_delete=models.CASCADE, related_name = 'messages')


class Attachment(models.Model):  
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name = 'attachments')
    url = models.CharField(max_length=254)

    
class Participant(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name = 'participants')
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name = 'participants')

    def __str__(self):
        return self.user.username + ' of ' + self.conversation.title










