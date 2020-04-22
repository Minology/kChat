from django.contrib.auth import get_user_model
from rest_framework import permissions
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    DestroyAPIView,
    RetrieveUpdateAPIView,
)
from chat.models import Conversation, Participant, Message, User, AttachmentType, Connection, FriendRequest
from chat.views import get_user, get_conversation
from .serializers import ConversationSerializer, MessageSerializer, UserSerializer, AttachmentTypeSerializer, ParticipantSerializer,ConnectionSerializer, FriendRequestSerializer


class ConversationListView(ListAPIView):
    serializer_class = ConversationSerializer
    permission_classes = (permissions.AllowAny, )

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
    permission_classes = (permissions.AllowAny, )

      
class ConversationCreateView(CreateAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    permission_classes = (permissions.IsAuthenticated, )


class ConversationUpdateView(RetrieveUpdateAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    permission_classes = (permissions.IsAuthenticated, )


class ConversationDeleteView(DestroyAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    permission_classes = (permissions.IsAuthenticated, )


class MessageListView(ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = (permissions.AllowAny, )

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
    permission_classes = (permissions.AllowAny, )


class MessageCreateView(CreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = (permissions.IsAuthenticated, )


class MessageUpdateView(RetrieveUpdateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = (permissions.IsAuthenticated, )


class MessageDeleteView(DestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = (permissions.IsAuthenticated, )


class UserListView(ListAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny, )

    def get_queryset(self):
        queryset = User.objects.all()
        username = self.request.query_params.get('username', None)
        if username is not None:
            queryset = User.objects.filter(username=username)
        return queryset


class UserDetailView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny, )


class UserUpdateView(RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated, )


class AttachmentTypeListView(ListAPIView):
    queryset = AttachmentType.objects.all()
    serializer_class = AttachmentTypeSerializer
    permission_classes = (permissions.AllowAny, )


class ParticipantListView(ListAPIView):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer
    permission_classes = (permissions.AllowAny, )


class ConnectionListView(ListAPIView):
    queryset = Connection.objects.all()
    serializer_class = ConnectionSerializer
    permission_classes = (permissions.AllowAny, )   


class FriendRequestListView(ListAPIView):
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequestSerializer
    permission_classes = (permissions.AllowAny, )       




