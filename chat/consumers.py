import json
import traceback
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .models import Message, Conversation, AttachmentType, Participant, Connection, FriendRequest, User
from .views import get_last_10_messages, get_user, get_conversation, get_attachment_type, get_participant, get_user_by_email
from django.core.exceptions import PermissionDenied
from django.db import IntegrityError


class ChatConsumer(WebsocketConsumer):
    def fetch_messages(self, data):
        conversation = get_conversation(data['conversation_id'])
        get_participant(self.user, conversation)
        messages = get_last_10_messages(data['conversation_id'])
        json_messages = self.messages_to_json(messages)
        content = {
            'command': 'messages',
            'messages': json_messages,
        }
        return content

    def new_message(self, data):
        conversation = get_conversation(data['conversation_id'])
        sender = self.user
        get_participant(sender, conversation)
        conversation = get_conversation(data['conversation_id'])
        conversation.message_count += 1
        attachment_type = get_attachment_type(data['attachment_type'])
        message = Message.objects.create(
            message = data['message'],
            sender = sender,
            conversation = conversation,
            attachment_type = attachment_type,
            order_in_conversation = conversation.message_count,
        )
        conversation.last_message_id = message.id
        conversation.save()
        content = {
            'command': 'new_message',
            'message': self.message_to_json(message)
        }
        self.send_chat_message(content)
        return content
        
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
        self.user = self.scope['user']
        if self.user.is_anonymous:
            self.close()
        else:
            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name,
                self.channel_name
            )
            self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)
        content = {}
        try:
            content = self.commands[data['command']](self, data)
            content['log'] = 'Command executed successfully'
        except Exception as e:
            content['log'] = str(e.__class__.__name__) + " error : " + str(e.__context__)
            traceback.print_exc()
        finally:
            self.send_data(content)
            

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

    def chat_message(self, event):
        message = event['message']


    def add_user_to_conversation(self, data):
        conversation = get_conversation(data['conversation_id'])
        if conversation.creator.id != self.user.id:
            raise PermissionDenied('You don\'t have permission to add user to conversation %s' % conversation.title)
        user = get_user(data['username'])
        Participant.objects.create(
            conversation=conversation,
            user=user
        )
        content = {
            'command': 'add_user_to_conversation',
            'user': self.user_to_json(user),
        }
        return content  

    def remove_user_from_conversation(self, data):
        conversation = get_conversation(data['conversation_id'])
        if conversation.creator.id != self.user.id:
            raise PermissionDenied('You don\'t have permission to remove user from conversation %s' % conversation.title)
        user = get_user(data['username'])
        if user == self.user:
            participants = Participant.objects.filter(conversation=conversation)
            if (participants.count() > 1):
                new_owner = get_user(data['new_owner_username'])
                success = False
                for participant in participants:
                    if participant.user == new_owner:
                        conversation.creator = new_owner
                        conversation.save()
                        success = True
                        break
                if success == False:
                    raise IntegrityError('New owner isn\'t a participant of conversation %s' % conversation.title)
                Participant.objects.filter(user=user, conversation=conversation).delete()
            else:
                Participant.objects.filter(user=user, conversation=conversation).delete()
                conversation.delete()
        else:
            Participant.objects.filter(user=user, conversation=conversation).delete()
        content = {
            'command': 'remove_user_from_conversation',
        }
        return content  

    def create_conversation(self, data):
        user = self.user
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
        }
        return content  


    def fetch_user_info(self, data):
        user = self.user
        content = {
            'command': 'fetch_user_info',
            'user': self.user_to_json(user)
        }
        return content     
    

    def send_friend_request(self, data):
        from_user = self.user
        to_user = get_user(data['to_username'])
        connection = Connection.objects.filter(from_user=from_user, to_user=to_user)
        if (connection is not None):
            raise IntegrityError('Connection already exists')
        request_message = data['request_message']
        request, created = FriendRequest.objects.get_or_create(
            from_user=from_user,
            to_user=to_user, 
            request_message=request_message
        )
        content = {
            'command': 'send_friend_request',
            'request': self.friend_request_to_json(request)
        }
        return content


    def accept_friend_request(self, data):
        from_user = get_user(data['from_username'])
        to_user = self.user
        FriendRequest.objects.filter(from_user=from_user, to_user=to_user).delete()
        connections = []
        connections.append(Connection.objects.get_or_create(from_user=from_user, to_user=to_user)[0])
        connections.append(Connection.objects.get_or_create(from_user=to_user, to_user=from_user)[0])
        content = {
            'command': 'accept_friend_request',
        }
        return content

    def discard_friend_request(self, data):
        from_user = get_user(data['from_username'])
        to_user = self.user
        FriendRequest.objects.filter(from_user=from_user, to_user=to_user).delete()
        content = {
            'command': 'discard_friend_request',
        }       
        return content

    def remove_friend(self, data):
        from_user = self.user
        to_user = get_user(data['friend_username'])
        Connection.objects.filter(from_user=from_user, to_user=to_user).delete()
        Connection.objects.filter(from_user=to_user, to_user=from_user).delete()
        content = {
            'command': 'remove_friend',
        }
        return content
        

    def fetch_conversations_last_message_from_user(self, data):
        user = self.user
        participants = Participant.objects.filter(user=user)
        messages = []
        unread_counts = []
        for participant in participants:
            conversation = participant.conversation
            message = Message.objects.filter(conversation=conversation).latest('created_at')
            last_seen_message = Message.objects.filter(pk=participant.last_seen_message_id)[0]
            unread_counts.append(message.order_in_conversation - last_seen_message.order_in_conversation)
            messages.append(message)
        content = {
            'command': 'last_messages',
            'last_messages': self.messages_to_json(messages),
            'unread_counts': unread_counts,
        }        
        return content

    def update_last_seen_message(self, data):
        user = self.user
        conversation = get_conversation(data['conversation_id'])
        participant = get_participant(user=user, conversation=conversation)
        if (participant.last_seen_message_id is None) or (participant.last_seen_message_id < data['last_seen_message_id']):
            participant.last_seen_message_id = data['last_seen_message_id']
            participant.save() 
        content = {
            'command': 'update_last_seen_message',
        }
        return content

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
            'quote': user.quote,
            'place': user.place,
        } 

    def conversations_to_json(self, conversations):
        result = []
        for conversation in conversations:
            result.append(self.conversation_to_json(conversation))
        return result       

    def conversation_to_json(self, conversation):
        return {
            'created_at': str(conversation.created_at),
            'updated_at': str(conversation.updated_at),
            'deleted_at': str(conversation.deleted_at),
            'conversation_id': conversation.id,
            'title': conversation.title,
            'creator_username': conversation.creator.username,
            'creator_id': conversation.creator.id,
            'message_count': conversation.message_count,
            'last_message_id': conversation.last_message_id,
        } 

    def friend_requests_to_json(self, requests):
        result = []
        for request in requests:
            result.append(self.friend_request_to_json(request))
        return result

    def friend_request_to_json(self, request):
        return {
            'created_at': str(request.created_at),
            'from_user': request.from_user.username,
            'to_user': request.to_user.username,
            'request_message': request.request_message,
        }

    # Commands received from frontend
    commands = {
        'fetch_messages': fetch_messages,
        'new_message': new_message,
        'add_user_to_conversation': add_user_to_conversation,
        'remove_user_from_conversation': remove_user_from_conversation,
        'create_conversation': create_conversation,
        'fetch_user_info': fetch_user_info,
        'send_friend_request': send_friend_request,
        'accept_friend_request': accept_friend_request,
        'discard_friend_request': discard_friend_request,
        'remove_friend': remove_friend,
        'update_last_seen_message': update_last_seen_message,
        'fetch_conversations_last_message_from_user': fetch_conversations_last_message_from_user,
    }