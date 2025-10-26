from rest_framework import generics, permissions
from django.shortcuts import get_object_or_404
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer

# backend/chat/views.py

from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer

# CreateAPIView provides a post method handler for creating a model instance.
class RegisterView(generics.CreateAPIView):
    """
    API endpoint that allows users to be created.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # AllowAny means any user, authenticated or not, can access this endpoint.
    permission_classes = [AllowAny]


class ChatRoomList(generics.ListAPIView):
    """
    API view to retrieve a list of all chat rooms.
    """
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    # Add this permission to ensure only authenticated users can see the room list.
    permission_classes = [permissions.IsAuthenticated]

class MessageList(generics.ListCreateAPIView):
    """
    API view to retrieve messages for a chat room or create a new message.
    """
    serializer_class = MessageSerializer
    # Only authenticated users can create messages, but anyone can read them.
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """
        This view should return a list of all the messages
        for the chat room as determined by the room_slug portion of the URL.
        """
        room_slug = self.kwargs['room_slug']
        return Message.objects.filter(chatroom__slug=room_slug)

    def perform_create(self, serializer):
        """
        This is called when a new message is created (POST request).
        We'll automatically set the user and chatroom.
        """
        room_slug = self.kwargs['room_slug']
        room = get_object_or_404(ChatRoom, slug=room_slug)
        # The user is automatically available from the request object
        # because of the IsAuthenticatedOrReadOnly permission.
        serializer.save(user=self.request.user, chatroom=room)
