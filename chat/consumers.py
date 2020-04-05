import json
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth import get_user_model
from asgiref.sync import async_to_sync
from .models import Message, Conversation, AttachmentType
from .views import get_last_10_messages, get_sender, get_conversation, get_attachment_type

User = get_user_model()


class ChatConsumer(WebsocketConsumer):
    
    # fetch last 10 messages of a group chat
    def fetch_messages(self, data):
        messages = get_last_10_messages(data['conversation_id'])
        content = {
            'command': 'messages',
            'messages': self.messages_to_json(messages)
        }
        self.send_message(content)

    # create the new message and save it in the database
    def new_message(self, data):
        sender = get_sender(data['from'])
        conversation = get_conversation(data['conversation_id'])
        attachment_type = get_attachment_type(data['attachment_type'])
        message = Message.objects.create(
            message = data['message'],
            sender = sender,
            conversation = conversation,
            attachment_type = attachment_type
        )
        content = {
            'command': 'new_message',
            'message': self.message_to_json(message)
        }
        return self.send_chat_message(content)
        
    def messages_to_json(self, messages):
        result = []
        for message in messages:
            result.append(self.message_to_json(message))
        return result

    def message_to_json(self, message):
        return {
            'id': message.id,
            'created_at': str(message.created_at),
            'updated_at': str(message.updated_at),
            'deleted_at': str(message.deleted_at),
            'message': message.message,
            'sender': message.sender.username,
            'conversation': message.conversation.id,
            'attachment_type': message.attachment_type.name,
        } 

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)

    def send_chat_message(self, message):
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    def send_message(self, message):
        self.send(text_data=json.dumps(message))

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        self.send(text_data=json.dumps(message))

    # TODO: conversation management
    def get_conversations_of_user(self, data):
        pass

    def add_user_to_conversation(self, data):
        pass

    def remove_user_from_conversation(self, data):
        pass

    def create_conversation(self, data):
        pass

    def remove_conversation(self, data):
        pass

    commands = {
        'fetch_messages': fetch_messages,
        'new_message': new_message,
        'get_conversations_of_user': get_conversations_of_user,
        'add_user_to_conversation': add_user_to_conversation,
        'remove_user_from_conversation': remove_user_from_conversation,
        'create_conversation': create_conversation,
        'remove_conversation': remove_conversation
    }