from django.urls import path

from .views import (
    ConversationListView,
    ConversationDeleteView,
    ConversationParticipantListView,
    ConversationNonParticipantListView,
    MessageListView,
    MessageDetailView,
    UserListView,
    UserConversationsListView,
    UserFriendsOutOfConversationListView,
    UserFriendListView,
    UserNotFriendListView,
    UserFriendRequestView,
    AttachmentTypeListView,
)

app_name = 'chat'

urlpatterns = [
    path('conv/', ConversationListView.as_view()),
    path('conv/<pk>/delete/', ConversationDeleteView.as_view()),
    path('conv/<pk>/in/', ConversationParticipantListView.as_view()),
    path('conv/<pk>/out/', ConversationNonParticipantListView.as_view()),
    path('message/', MessageListView.as_view()),
    path('message/<pk>/', MessageDetailView.as_view()),
    path('user/', UserListView.as_view()),
    path('user/conv/', UserConversationsListView.as_view()),
    path('user/conv/<pk>/out/', UserFriendsOutOfConversationListView().as_view()),
    path('user/fr/', UserFriendListView.as_view()),
    path('user/not_fr/', UserNotFriendListView.as_view()),
    path('user/fr_req/', UserFriendRequestView.as_view()),
    path('attach_type/', AttachmentTypeListView.as_view()),
]