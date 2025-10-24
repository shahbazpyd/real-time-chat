import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get the room slug from the URL
        self.room_slug = self.scope['url_route']['kwargs']['room_slug']
        self.room_group_name = f'chat_{self.room_slug}'

        # Join the room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # Accept the WebSocket connection
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # This method is called when we receive a message from the WebSocket
    async def receive(self, text_data):
        # For now, we'll just echo the message back to the group
        # In the future, we'll save it to the database first
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message', # This corresponds to the method name below
                'message': text_data
            }
        )

    # This method is called when a message is sent to the group
    async def chat_message(self, event):
        message = event['message']

        # Send the message to the client's WebSocket
        await self.send(text_data=message)