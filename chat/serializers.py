from rest_framework import serializers
from django.contrib.auth.models import User
from .models import ChatRoom, Message

# backend/chat/serializers.py

from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # We only want to accept these fields for registration
        fields = ('id', 'username', 'password', 'email')
        # Make the password write-only for security
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        """
        This method is called when we create a new user.
        It hashes the password before saving it to the database.
        """
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''), # email is optional
            password=validated_data['password']
        )
        return user





class MessageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'user', 'content', 'timestamp']


class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['id', 'name', 'slug']
