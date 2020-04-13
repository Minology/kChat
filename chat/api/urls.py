from django.urls import path, re_path

from .views import (
    ConversationListView,
    ConversationDetailView,
    ConversationCreateView,
    ConversationUpdateView,
    ConversationDeleteView
)

app_name = 'chat'

urlpatterns = [
    path('', ConversationListView.as_view()),
    path('create/', ConversationCreateView.as_view()),
    path('<pk>/', ConversationDetailView.as_view()),
    path('<pk>/update/', ConversationUpdateView.as_view()),
    path('<pk>/delete/', ConversationDeleteView.as_view())
]