from __future__ import unicode_literals
from django.db import models
from django.utils import timezone
from django.db.models.signals import post_save
from django.dispatch import receiver

from django.core.mail import send_mail
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
from django.utils.translation import ugettext_lazy as _
from .managers import UserManager
from django.conf import settings


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=30, blank=True)
    date_joined = models.DateTimeField(_('date joined'), auto_now_add=True)
    is_active = models.BooleanField(_('active'), default=True)
    is_staff = models.BooleanField(_('is_staff'), default=False)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    username = models.CharField(_('username'), max_length=30, unique=True)
    quote = models.CharField(_('quote'), max_length=60, blank=True)
    place = models.TextField(_('place'), blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def get_full_name(self):
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        return self.first_name

    def email_user(self, subject, message, from_email=None, **kwargs):
        send_mail(subject, message, from_email, [self.email], **kwargs)


class Conversation(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    title = models.CharField(max_length=40)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name = 'conversations')
    message_count = models.IntegerField(default=0)
    last_message_id = models.IntegerField(blank=True,null=True)

    def __str__(self):
        return self.title


class AttachmentType(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Message(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    message = models.TextField(default='')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='messages')
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name = 'messages')
    attachment_type = models.ForeignKey(AttachmentType, on_delete=models.CASCADE, related_name = 'messages')
    order_in_conversation = models.IntegerField()


class Participant(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name = 'participants')
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name = 'participants')
    last_seen_message_id = models.IntegerField(default=None, null=True, blank=True)

    def __str__(self):
        return self.user.username + ' - ' + self.conversation.title

    class Meta:
        unique_together = ('user', 'conversation')


class Attachment(models.Model):  
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name = 'attachments')
    url = models.CharField(max_length=254)


class Connection(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    from_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='connections')
    to_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('from_user', 'to_user')


class FriendRequest(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    from_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    to_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='friend_requests')
    request_message = models.TextField(blank=True,null=True)

    class Meta:
        unique_together = ('from_user', 'to_user')










