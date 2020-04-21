from rest_framework import serializers

from chat.models import Conversation, Message

class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ('__all__')
        read_only = ('id')

    
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('__all__')
        read_only = ('id')