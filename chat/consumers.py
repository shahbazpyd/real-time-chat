import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from .models import ChatRoom, Message
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_slug = self.scope['url_route']['kwargs']['room_slug']
        self.room_group_name = f"chat_{self.room_slug}"

        # Authenticate user from WebSocket scope
        self.user = await self.get_authenticated_user()
        if not self.user:
            await self.close()
            return

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        print(f"WebSocket connected for user {self.user.username} to room {self.room_slug}")

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print(f"WebSocket disconnected for user {self.user.username} from room {self.room_slug}")

    async def receive(self, text_data):
        print(f"Received message from WebSocket: {text_data}")
        """
        Receive message from WebSocket.
        Expects a JSON string with a 'message' key.
        """
        text_data_json = json.loads(text_data)
        message_content = text_data_json['message']
        print(f"Received message content: {message_content}")


        # Save message to database
        message_obj = await self.save_message(self.user, self.room_slug, message_content)
        print('message object:', message_obj)

        # Send message to room group
        layer_obj = await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message', # This calls the chat_message method below
                'message': message_obj['content'],
                'user': message_obj['user'],
                'timestamp': message_obj['timestamp'],
                'id': message_obj['id']
            }
        )
        print('layer object:', layer_obj)

    async def chat_message(self, event):
        """
        Receive message from room group and send it to WebSocket.
        """
        message = event['message']
        user = event['user']
        timestamp = event['timestamp']
        message_id = event['id']
        print(f"Sending message to WebSocket: {message}")

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'id': message_id,
            'user': user,
            'content': message,
            'timestamp': timestamp,
        }))

    @database_sync_to_async
    def get_authenticated_user(self):
        """
        Authenticates the user using the JWT token from the WebSocket scope.
        """
        try:
            # Channels stores the query string in scope['query_string']
            # We expect the token to be passed as a query parameter like ?token=<JWT>
            query_string = self.scope['query_string'].decode('utf8')
            token_param = next((param.split('=')[1] for param in query_string.split('&') if param.startswith('token=')), None)

            if token_param:
                access_token = AccessToken(token_param)
                user_id = access_token['user_id']
                user = User.objects.get(id=user_id)
                return user
            return None
        except (InvalidToken, TokenError, User.DoesNotExist) as e:
            print(f"WebSocket authentication failed: {e}")
            return None

    @database_sync_to_async
    def save_message(self, user, room_slug, content):
        """
        Saves a new message to the database.
        """
        try:
            room = ChatRoom.objects.get(slug=room_slug)
            message = Message.objects.create(user=user, chatroom=room, content=content)
            # Return serialized message data for consistency
            return {
                'id': message.id,
                'user': message.user.username,
                'content': message.content,
                'timestamp': message.timestamp.isoformat() # ISO format for easy parsing in JS
            }
        except ChatRoom.DoesNotExist:
            print(f"ChatRoom with slug {room_slug} not found.")
            return None