from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db.models.signals import post_save
from django.dispatch import receiver

User = get_user_model()


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    quote = models.TextField(default='', max_length=50)
    email = models.EmailField(unique=True,null=True)
    place = models.TextField(default='')
    avatar = models.URLField(default='')
    
    def __str__(self):
        return self.user.username

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


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
    name = models.CharField(max_length=100, unique=True)

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


class Participant(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name = 'participants')
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
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='connections')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('from_user', 'to_user')


class FriendRequest(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    from_user = models.ForeignKey(User, on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friend_requests')

    class Meta:
        unique_together = ('from_user', 'to_user')










