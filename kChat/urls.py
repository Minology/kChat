from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('admin/doc/', include('django.contrib.admindocs.urls')),
    path('chat/', include('chat.api.urls', namespace='chat')),

    # The view from the urlpattern below is for sample only
    path('chat/', include('chat.urls', namespace='chatview')),

    #logAPI
    path('logAPI/', include('logAPI.urls')),

]
