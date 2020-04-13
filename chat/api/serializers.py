from rest_framework import serializers

from chat.models import Conversation

class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ('__all__')
        read_only = ('id')