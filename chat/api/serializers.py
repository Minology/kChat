from rest_framework import serializers

from chat.models import Conversation, Message, Participant, User, AttachmentType, Connection, FriendRequest

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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('__all__')
        read_only = ('id')


class AttachmentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttachmentType
        fields = ('__all__')
        read_only = ('id')


class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = ('__all__')
        read_only = ('id')


class ConnectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Connection
        fields = ('__all__')
        read_only = ('id')


class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ('__all__')
        read_only = ('id')

