# chat/routing.py
from django.urls import re_path
from django.conf.urls import url
from . import consumers

websocket_urlpatterns = [
    #url(r"^front(end)/$", consumers.ChatConsumer),
    re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer),
]