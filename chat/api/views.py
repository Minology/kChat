from django.contrib.auth import get_user_model
from rest_framework import permissions, status
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    DestroyAPIView,
    RetrieveUpdateAPIView,
)
from rest_framework.response import Response

from chat.models import Conversation, Participant, Message, User, AttachmentType, Connection, FriendRequest
from chat.views import get_user, get_conversation
from .serializers import ConversationSerializer, MessageSerializer, AttachmentTypeSerializer, \
    ParticipantSerializer, ConnectionSerializer, FriendRequestSerializer
from django.core.exceptions import PermissionDenied
from accounts.serializers import UserDetailsSerializer
import logging


class ConversationListView(ListAPIView):
    serializer_class = ConversationSerializer
    permission_classes = (permissions.IsAdminUser, )
    
    def get_queryset(self):
        queryset = Conversation.objects.all()
        username = self.request.query_params.get('username', None)
        if username is not None:
            user = get_user(username)
            participants = Participant.objects.filter(user=user)
            queryset = []
            for participant in participants:
                queryset.append(participant.conversation)
        return queryset


class ConversationParticipantListView(ListAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer

    def list(self, request, *args, **kwargs):
        error_notfound = {'detail': 'Resource not found'}
        error_forbidden = {'detail': 'Forbidden resource'}
        instance = self.get_object()

        # check anonymous
        user = self.request.user
        if user.is_anonymous:
            return Response(error_forbidden, status=status.HTTP_403_FORBIDDEN)

        # get conversation
        if instance is None:
            return Response(error_msg, status=status.HTTP_404_NOT_FOUND)

        # get participants
        participants = Participant.objects.filter(conversation=instance)
        serializer = ParticipantSerializer(participants, many=True)

        # check superuser
        if user.is_superuser:
            return Response(serializer.data)

        # check participating
        for participant in participants:
            if participant.user.id == user.id:
                return Response(serializer.data)

        return Response(error_forbidden, status=status.HTTP_403_FORBIDDEN)


class ConversationNonParticipantListView(ListAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer

    def list(self, request, *args, **kwargs):
        error_notfound = {'detail': 'Resource not found'}
        error_forbidden = {'detail': 'Forbidden resource'}
        instance = self.get_object()

        # check anonymous
        user = self.request.user
        if user.is_anonymous:
            return Response(error_forbidden, status=status.HTTP_403_FORBIDDEN)

        # get conversation
        if instance is None:
            return Response(error_msg, status=status.HTTP_404_NOT_FOUND)

        # get participants
        participants = Participant.objects.filter(conversation=instance)
        participants_id = []
        for participant in participants:
            participants_id.append(participant.user.id)
        outsiders = User.objects.exclude(id__in=participants_id)[:50]
        serializer = UserDetailsSerializer(outsiders, many=True)

        # check superuser
        if user.is_superuser:
            return Response(serializer.data)

        # check participating
        for participant in participants:
            if participant.user.id == user.id:
                return Response(serializer.data)

        return Response(error_forbidden, status=status.HTTP_403_FORBIDDEN)  


class ConversationDeleteView(DestroyAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer

    def destroy(self, request, *args, **kwargs):
        error_notfound = {'detail': 'Resource not found'}
        error_forbidden = {'detail': 'Forbidden resource'}
        instance = self.get_object()

        # check anonymous
        user = self.request.user
        if user.is_anonymous:
            return Response(error_forbidden, status=status.HTTP_403_FORBIDDEN)

        # get conversation
        if instance is None:
            return Response(error_msg, status=status.HTTP_404_NOT_FOUND)

        if (user.id != instance.creator.id):
            return Response(error_forbidden, status=status.HTTP_403_FORBIDDEN)

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class MessageListView(ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = (permissions.IsAdminUser,)

    def get_queryset(self):
        queryset = Message.objects.all()
        conversation_id = self.request.query_params.get('conv', None)
        if conversation_id is not None:
            conversation = get_conversation(conversation_id)
            queryset = Message.objects.filter(conversation_id=conversation_id)
        return queryset


class MessageDetailView(RetrieveAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def retrieve(self, request, *args, **kwargs):
        # prepare data
        error_msg = {'detail': 'Resource not found'}
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        # user_id
        auth_token = self.request.auth
        user_id = auth_token.user_id

        # check superuser
        user = User.objects.filter(id=user_id)
        if len(user) != 1:
            return Response(error_msg, status=status.HTTP_404_NOT_FOUND)
        if user[0].is_superuser:
            return Response(serializer.data)

        # conversation_id
        message_id = instance.id
        conversation = Message.objects.filter(id=message_id)
        if len(conversation) != 1:
            return Response(error_msg, status=status.HTTP_404_NOT_FOUND)
        conversation_id = conversation[0].conversation_id

        # check participating
        participant = Participant.objects.filter(user_id=user_id, conversation_id=conversation_id)
        if len(participant) != 1:
            return Response(error_msg, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.data)


class UserListView(ListAPIView):
    serializer_class = UserDetailsSerializer
    permission_classes = (permissions.IsAdminUser,)

    def get_queryset(self):
        queryset = User.objects.all()
        username = self.request.query_params.get('username', None)
        if username is not None:
            queryset = User.objects.filter(username=username)
        return queryset


class UserConversationsListView(ListAPIView):
    serializer_class = UserDetailsSerializer
    queryset = {}

    def list(self, request, *args, **kwargs):
        error_forbidden = {'detail': 'Forbidden resource'}

        # check anonymous
        user = self.request.user
        if user.is_anonymous:
            return Response(error_forbidden, status=status.HTTP_403_FORBIDDEN)

        participants = Participant.objects.filter(user=user)
        conversations = []
        for participant in participants:
            conversations.append(participant.conversation)

        # search by contain keyword in title    
        contain_keyword = self.request.query_params.get('contain', None)
        if contain_keyword is not None:
            tem_conv = []
            for conversation in conversations:
                if contain_keyword in conversation.title:
                    tem_conv.append(conversation)
            conversations = tem_conv

        serializer = ConversationSerializer(conversations, many=True)

        return Response(serializer.data)


class UserFriendsOutOfConversationListView(ListAPIView):
    serializer_class = ConversationSerializer
    queryset = Conversation.objects.all()

    def list(self, request, *args, **kwargs):
        error_forbidden = {'detail': 'Forbidden resource'}

        # check anonymous
        user = self.request.user
        if user.is_anonymous:
            return Response(error_forbidden, status=status.HTTP_403_FORBIDDEN)

        # check user in conversation
        conversation = self.get_object()
        participant = Participant.objects.filter(user=user, conversation=conversation)
        if not participant:
            return Response(error_forbidden, status=status.HTTP_403_FORBIDDEN)

        participants = Participant.objects.filter(conversation=conversation)
        participants_user = []
        for participant in participants:
            participants_user.append(participant.user)

        connections = user.connections.all()
        friends = []
        for connection in connections:
            friends.append(connection.to_user)
        
        # get friends out of conversation
        friends_outside = []
        for friend in friends:
            if friend not in participants_user:
                friends_outside.append(friend)

        serializer = UserDetailsSerializer(friends_outside, many=True)
        return Response(serializer.data)


class UserFriendListView(ListAPIView):
    serializer_class = UserDetailsSerializer
    queryset = {}

    def list(self, request, *args, **kwargs):
        error_forbidden = {'detail': 'Forbidden resource'}

        # check anonymous
        user = self.request.user
        if user.is_anonymous:
            return Response(error_forbidden, status=status.HTTP_403_FORBIDDEN)

        connections = user.connections.all()
        friends = []
        for connection in connections:
            friends.append(connection.to_user)
        serializer = UserDetailsSerializer(friends, many=True)

        return Response(serializer.data)


class UserNotFriendListView(ListAPIView):
    serializer_class = UserDetailsSerializer
    queryset = {}

    def list(self, request, *args, **kwargs):
        error_forbidden = {'detail': 'Forbidden resource'}

        # check anonymous
        user = self.request.user
        if user.is_anonymous:
            return Response(error_forbidden, status=status.HTTP_403_FORBIDDEN)

        connections = user.connections.all()
        friends_id = [user.id]
        for connection in connections:
            friends_id.append(connection.to_user.id)

        username_contain = self.request.query_params.get('contain', '')

        strangers = User.objects.exclude(id__in=friends_id)
        strangers = strangers.filter(username__contains=username_contain)[:50]
        serializer = UserDetailsSerializer(strangers, many=True)

        return Response(serializer.data)


class UserFriendRequestView(ListAPIView):
    serializer_class = UserDetailsSerializer
    queryset = {}

    def list(self, request, *args, **kwargs):
        error_forbidden = {'detail': 'Forbidden resource'}

        # check anonymous
        user = self.request.user
        if user.is_anonymous:
            return Response(error_forbidden, status=status.HTTP_403_FORBIDDEN)

        friend_requests = user.friend_requests.all()
        serializer = FriendRequestSerializer(friend_requests, many=True)

        return Response(serializer.data)  


class AttachmentTypeListView(ListAPIView):
    queryset = AttachmentType.objects.all()
    serializer_class = AttachmentTypeSerializer
    permission_classes = (permissions.IsAdminUser,)