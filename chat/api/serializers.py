from rest_framework import serializers

from chat.models import Conversation, Message, Participant, User, AttachmentType, Connection, FriendRequest

class ConversationSerializer(serializers.ModelSerializer):
    creator_name = serializers.CharField(source='creator.username')

    class Meta:
        model = Conversation
        fields = ['id', 'created_at', 'updated_at', 'deleted_at', 'title', 'message_count', 'last_message_id', 'creator_name']
        read_only = ('id')

    
class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.username')

    class Meta:
        model = Message
        fields = ['id', 'created_at', 'updated_at', 'deleted_at', 'message', 'sender_name', 'conversation', 'attachment_type', 'order_in_conversation']
        read_only = ('id')


class AttachmentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttachmentType
        fields = ('__all__')
        read_only = ('id')


class ParticipantSerializer(serializers.ModelSerializer):
    participant_username = serializers.CharField(source='user.username')

    class Meta:
        model = Participant
        fields = ['id', 'created_at', 'updated_at', 'deleted_at', 'participant_username', 'conversation', 'last_seen_message_id']
        read_only = ('id')


class ConnectionSerializer(serializers.ModelSerializer):
    from_username = serializers.CharField(source='from_user.username')
    to_username = serializers.CharField(source='to_user.username')

    class Meta:
        model = Connection
        fields = ['id', 'created_at', 'from_username', 'to_username']
        read_only = ('id')


class FriendRequestSerializer(serializers.ModelSerializer):
    from_username = serializers.CharField(source='from_user.username')
    to_username = serializers.CharField(source='to_user.username')

    class Meta:
        model = FriendRequest
        fields = ['id', 'created_at', 'from_username', 'to_username', 'request_message']
        read_only = ('id')

