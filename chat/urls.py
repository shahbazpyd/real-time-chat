from django.urls import path
from . import views

urlpatterns = [
    # This will be our /api/chat/register/ endpoint
    path('register/', views.RegisterView.as_view(), name='auth_register'),
    path('rooms/', views.ChatRoomList.as_view(), name='chatroom-list'),
    # The <slug:room_slug> part captures the slug from the URL
    path('rooms/<slug:room_slug>/messages/', views.MessageList.as_view(), name='message-list'),
] 
