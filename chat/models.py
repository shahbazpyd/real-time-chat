from django.db import models
from django.conf import settings # Import settings to reference AUTH_USER_MODEL

# Create your models here.
class ChatRoom(models.Model):
    """
    Represents a chat room where users can exchange messages.
    """
    name = models.CharField(max_length=255, unique=True)
    # A slug is a short label for something, containing only letters, numbers, underscores or hyphens.
    # It's often used in URLs.
    slug = models.SlugField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created_at',) # Order chat rooms by creation date, newest first

    def __str__(self):
        return self.name


class Message(models.Model):
    """
    Represents a single message within a chat room.
    """
    chatroom = models.ForeignKey(ChatRoom, related_name='messages', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('timestamp',) # Order messages by timestamp, oldest first

    def __str__(self):
        return f'Message from {self.user.username} in {self.chatroom.name} at {self.timestamp}'
