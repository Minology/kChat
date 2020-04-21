from django.urls import path

from .views import (
    ConversationListView,
    ConversationDetailView,
    ConversationCreateView,
    ConversationUpdateView,
    ConversationDeleteView,
    MessageListView,
    MessageDetailView,
    MessageCreateView,
    MessageUpdateView,
    MessageDeleteView
)

app_name = 'chat'

urlpatterns = [
    path('conv/', ConversationListView.as_view()),
    path('conv/create/', ConversationCreateView.as_view()),
    path('conv/<pk>/', ConversationDetailView.as_view()),
    path('conv/<pk>/update/', ConversationUpdateView.as_view()),
    path('conv/<pk>/delete/', ConversationDeleteView.as_view()),
    path('message/', MessageListView.as_view()),
    path('message/create/', MessageCreateView.as_view()),
    path('message/<pk>/', MessageDetailView.as_view()),
    path('message/<pk>/update/', MessageUpdateView.as_view()),
    path('message/<pk>/delete/', MessageDeleteView.as_view()),
]