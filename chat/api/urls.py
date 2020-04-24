from django.urls import path

from .views import (
    ConversationListView,
    ConversationDetailView,
    ConversationCreateView,
    ConversationUpdateView,
    ConversationDeleteView,
    ConversationParticipantListView,
    ConversationNonParticipantListView,
    MessageListView,
    MessageDetailView,
    MessageCreateView,
    MessageUpdateView,
    MessageDeleteView,
    UserListView,
    UserDetailView,
    UserUpdateView,
    AttachmentTypeListView,
    ParticipantListView,
    ConnectionListView,
    FriendRequestListView,
)

app_name = 'chat'

urlpatterns = [
    path('conv/', ConversationListView.as_view()),
    path('conv/create/', ConversationCreateView.as_view()),
    path('conv/<pk>/', ConversationDetailView.as_view()),
    path('conv/<pk>/update/', ConversationUpdateView.as_view()),
    path('conv/<pk>/delete/', ConversationDeleteView.as_view()),
    path('conv/<pk>/in/', ConversationParticipantListView.as_view()),
    path('conv/<pk>/out/', ConversationNonParticipantListView.as_view()),
    path('message/', MessageListView.as_view()),
    path('message/create/', MessageCreateView.as_view()),
    path('message/<pk>/', MessageDetailView.as_view()),
    path('message/<pk>/update/', MessageUpdateView.as_view()),
    path('message/<pk>/delete/', MessageDeleteView.as_view()),
    path('user/', UserListView.as_view()),
    path('user/<pk>/', UserDetailView.as_view()),
    path('user/<pk>/update/', UserUpdateView.as_view()),
    path('attach_type/', AttachmentTypeListView.as_view()),
    path('participant/', ParticipantListView.as_view()),
    path('connection/', ConnectionListView.as_view()),
    path('fr_req/', FriendRequestListView.as_view()),
]