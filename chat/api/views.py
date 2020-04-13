from django.contrib.auth import get_user_model
from rest_framework import permissions
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    DestroyAPIView,
    UpdateAPIView
)
from chat.models import Conversation, Participant
from chat.views import get_user
from .serializers import ConversationSerializer

User = get_user_model()


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


class ConversationUpdateView(UpdateAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    permission_classes = (permissions.IsAuthenticated, )


class ConversationDeleteView(DestroyAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    permission_classes = (permissions.IsAuthenticated, )
