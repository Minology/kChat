import json
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth import get_user_model
from asgiref.sync import async_to_sync
from .models import Message, Conversation, AttachmentType, Participant
from .views import get_last_10_messages, get_user, get_conversation, get_attachment_type

User = get_user_model()


class ChatConsumer(WebsocketConsumer):
    # fetch last 10 messages of a group chat
    def fetch_messages(self, data):
        messages = get_last_10_messages(data['conversation_id'])
        content = {
            'command': 'messages',
            'messages': self.messages_to_json(messages)
        }
        self.send_data(content)

    # create the new message and save it in the database
    def new_message(self, data):
        sender = get_user(data['from'])
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

    # Send data to frontend
    def send_data(self, data):
        self.send(text_data=json.dumps(data))

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        self.send_data(message)

    
    def fetch_participants_of_conversation(self, data):
        conversation = get_conversation(data['conversation_id'])
        participants = Participant.objects.filter(conversation=conversation)
        content = {
            'command': 'participants_of_conversation',
            'participants': self.users_to_json(participants)
        }
        self.send_data(content)

    def fetch_users_outside_of_conversation(self, data):
        conversation = get_conversation(data['conversation_id'])
        participants = Participant.objects.filter(conversation=conversation)
        participants_id = []
        for participant in participants:
            participants_id.append(participant.id)
        outsiders = User.objects.exclude(id__in=participants_id)
        content = {
            'command': 'users_outside_of_conversation',
            'outsiders': self.users_to_json(outsiders)
        }
        self.send_data(content)

    def fetch_conversations_of_user(self, data):
        user = get_user(data['username'])
        conversations = Participant.objects.filter(user=user)
        content = {
            'command': 'conversations_of_user',
            'conversations': self.conversations_to_json(conversations)
        }
        self.send_data(content)     


    def add_user_to_conversation(self, data):
        conversation = get_conversation(data['conversation_id'])
        user = get_user(data['username'])
        Participant.objects.create(
            conversation=conversation,
            user=user
        )
        content = {
            'command': 'add_user_to_conversation',
            'user': self.user_to_json(user),
            'log': 'successful'
        }
        self.send_data(content)  

    def remove_user_from_conversation(self, data):
        Participant.objects.filter(id=data['participant_id']).delete()
        content = {
            'command': 'remove_user_from_conversation',
            'log': 'successful'
        }
        self.send_data(content)  

    def create_conversation(self, data):
        user = get_user(data['username'])
        conversation = Conversation.objects.create(
            title=data['conversation_name'],
            creator=user,
        )
        Participant.objects.create(
            conversation = conversation,
            user=user
        )
        content = {
            'command': 'create_conversation',
            'conversation': self.conversation_to_json(conversation),
            'log': 'successful'
        }
        self.send_data(content)  

    def remove_conversation(self, data):
        Conversation.objects.filter(id=data['conversation_id']).delete()
        content = {
            'command': 'remove_conversation',
            'log': 'successful'
        }
        self.send_data(content)  


    def users_to_json(self, users):
        result = []
        for user in users:
            result.append(self.user_to_json(user))
        return result

    def user_to_json(self, user):
        return {
            'user_id': user.id,
            'username': user.username,            
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
        } 

    def conversations_to_json(self, conversations):
        result = []
        for conversation in conversations:
            result.append(self.conversation_to_json(conversation))
        return result       

    def conversation_to_json(self, conversation):
        return {
            'conversation_id': conversation.id,
            'title': conversation.title,
            'creator_username': conversation.creator.username,
            'creator_id': conversation.creator.id,
            'created_at': str(conversation.created_at),
            'updated_at': str(conversation.updated_at),
            'deleted_at': str(conversation.deleted_at),
        } 

    # Commands received from frontend
    commands = {
        'fetch_messages': fetch_messages,
        'new_message': new_message,
        'fetch_participants_of_conversation': fetch_participants_of_conversation,
        'fetch_users_outside_of_conversation': fetch_users_outside_of_conversation,
        'fetch_conversations_of_user': fetch_conversations_of_user,
        'add_user_to_conversation': add_user_to_conversation,
        'remove_user_from_conversation': remove_user_from_conversation,
        'create_conversation': create_conversation,
        'remove_conversation': remove_conversation
    }