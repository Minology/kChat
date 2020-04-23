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
from .serializers import ConversationSerializer, MessageSerializer, UserSerializer, AttachmentTypeSerializer, \
    ParticipantSerializer, ConnectionSerializer, FriendRequestSerializer


class ConversationListView(ListAPIView):
    serializer_class = ConversationSerializer
    permission_classes = (permissions.AllowAny,)

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


class ConversationDetailView(RetrieveAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    permission_classes = (permissions.AllowAny,)


class ConversationCreateView(CreateAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    permission_classes = (permissions.IsAuthenticated,)


class ConversationUpdateView(RetrieveUpdateAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    permission_classes = (permissions.IsAuthenticated,)


class ConversationDeleteView(DestroyAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    permission_classes = (permissions.IsAuthenticated,)


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


import logging

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


class MessageCreateView(CreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = (permissions.IsAuthenticated,)


class MessageUpdateView(RetrieveUpdateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = (permissions.IsAuthenticated,)


class MessageDeleteView(DestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = (permissions.IsAuthenticated,)


class UserListView(ListAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        queryset = User.objects.all()
        username = self.request.query_params.get('username', None)
        if username is not None:
            queryset = User.objects.filter(username=username)
        return queryset


class UserDetailView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)


class UserUpdateView(RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)


class AttachmentTypeListView(ListAPIView):
    queryset = AttachmentType.objects.all()
    serializer_class = AttachmentTypeSerializer
    permission_classes = (permissions.AllowAny,)


class ParticipantListView(ListAPIView):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer
    permission_classes = (permissions.AllowAny,)


class ConnectionListView(ListAPIView):
    queryset = Connection.objects.all()
    serializer_class = ConnectionSerializer
    permission_classes = (permissions.AllowAny,)


class FriendRequestListView(ListAPIView):
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequestSerializer
    permission_classes = (permissions.AllowAny,)
