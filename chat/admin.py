from django.contrib import admin
from .models import Conversation, AttachmentType, Attachment, Message, Participant

# Register your models here.

admin.site.register(Conversation)
admin.site.register(AttachmentType)
admin.site.register(Attachment)
admin.site.register(Message)
admin.site.register(Participant)
