import json
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth import get_user_model
from asgiref.sync import async_to_sync
from .models import Message, Conversation, AttachmentType, Participant, Connection, FriendRequest
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
        participants = Participant.objects.filter(user=user)
        conversations = []
        for participant in participants:
            conversations.append(participant.conversation)
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

    def search_conversation(self, data):
        conversations = Conversation.objects.filter(title__contains = data['text'])
        content = {
            'command': 'search_conversation',
            'conversations': self.conversations_to_json(conversations)
        }
        self.send_data(content) 

    def search_user(self, data):
        users = User.objects.filter(username__contains = data['text'])
        content = {
            'command': 'search_user',
            'users': self.users_to_json(users)
        }
        self.send_data(content)

    def fetch_user_info(self, data):
        user = get_user(data['username'])
        content = {
            'command': 'fetch_user_info',
            'user': self.user_to_json(user)
        }
        self.send_data(content)

    def fetch_all_users_info(self):
        content = {
            'command': 'fetch_all_users_info',
            'users': self.users_to_json(User.objects.all())
        }
        self.send_data(content)

    def fetch_not_friends(self, data):
        user = get_user(data['username'])
        connections = user.connections.all()
        friends_id = [user.id]
        for connection in connections:
            friends_id.append(connection.to_user.id)
        strangers = User.objects.exclude(id__in=friends_id)
        content = {
            'command': 'fetch_not_friends',
            'strangers': self.users_to_json(strangers)
        }
        self.send_data(content)

    def fetch_all_friends(self, data):
        user = get_user(data['username'])
        connections = user.connections.all()
        friends = []
        for connection in connections:
            friends.append(connection.to_user)
        content = {
            'command': 'fetch_all_friends',
            'friends': self.users_to_json(friends)
        }
        self.send_data(content)

    def send_friend_request(self, data):
        from_user = get_user(data['from_username'])
        to_user = get_user(data['to_username'])
        request, created = FriendRequest.objects.get_or_create(
            from_user=from_user,
            to_user=to_user
        )
        content = {
            'command': 'send_friend_request',
            'request': self.friend_request_to_json(request)
        }
        self.send_data(content)

    def fetch_friend_requests_of_user(self, data):
        to_user = get_user(data['to_username'])
        requests = to_user.friend_requests.all()
        content = {
            'command': 'fetch_friend_requests_of_user',
            'requests': self.friend_requests_to_json(requests)
        }
        self.send_data(content)

    def accept_friend_request(self, data):
        from_user = get_user(data['from_username'])
        to_user = get_user(data['to_username'])
        FriendRequest.objects.filter(from_user=from_user, to_user=to_user).delete()
        connections = []
        connections.append(Connection.objects.get_or_create(from_user=from_user, to_user=to_user)[0])
        connections.append(Connection.objects.get_or_create(from_user=to_user, to_user=from_user)[0])
        content = {
            'command': 'accept_friend_request',
            'connections': self.friend_requests_to_json(connections)
        }
        self.send_data(content)

    def decline_friend_request(self, data):
        from_user = get_user(data['from_username'])
        to_user = get_user(data['to_username'])
        FriendRequest.objects.filter(from_user=from_user, to_user=to_user).delete()
        content = {
            'command': 'decline_friend_request',
            'log': 'Decline friend request successful',
        }        
        self.send_data(content)

    def remove_friend(self, data):
        from_user = get_user(data['username'])
        to_user = get_user(data['friend_username'])
        Connection.objects.filter(from_user=from_user, to_user=to_user).delete()
        Connection.objects.filter(from_user=to_user, to_user=from_user).delete()
        content = {
            'command': 'remove_friend',
            'log': 'Remove friend successful',
        }
        self.send_data(content)

    def fetch_friends_outside_of_conversation(self, data):
        conversation = get_conversation(data['conversation_id'])
        participants = Participant.objects.filter(conversation=conversation)
        participants_id = []
        for participant in participants:
            participants_id.append(participant.id)

        user = get_user(data['username'])
        connections = user.connections.all()
        friends = []
        for connection in connections:
            friends.append(connection.to_user)
        
        friends_outside = []
        for friend in friends:
            if friend.id not in participants_id:
                friends_outside.append(friend)

        content = {
            'command': 'friends_outside_of_conversation',
            'friends_outside': self.users_to_json(friends_outside)
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
            'email': user.profile.email,
            'quote': user.profile.quote,
            'place': user.profile.place,
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
        'remove_conversation': remove_conversation,
        'search_conversation': search_conversation,
        'search_user': search_user,
        'fetch_user_info': fetch_user_info,
        'fetch_all_users_info': fetch_all_users_info,
        'fetch_not_friends': fetch_not_friends,
        'fetch_all_friends': fetch_all_friends,
        'send_friend_request': send_friend_request,
        'fetch_friend_requests_of_user': fetch_friend_requests_of_user,
        'accept_friend_request': accept_friend_request,
        'decline_friend_request': decline_friend_request,
        'remove_friend': remove_friend,
        'fetch_friends_outside_of_conversation': fetch_friends_outside_of_conversation,
    }