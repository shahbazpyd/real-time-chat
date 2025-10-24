from django.urls import re_path
from . import consumers

# We will add our consumers here later
websocket_urlpatterns = [
    # This regex matches ws/chat/ANY_SLUG/
    re_path(r'ws/chat/(?P<room_slug>[\w-]+)/$', consumers.ChatConsumer.as_asgi()),
]