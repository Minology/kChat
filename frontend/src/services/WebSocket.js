import config from '../config';

class WebSocketService {
    static instance = null;
    callbacks = {};

    static getInstance() {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    constructor() {
        this.socketRef = {};
    }

    connect(conversationId=0) {
        if (this.socketRef[conversationId]) return;

        const path = config.WS_PATH + conversationId + '/';
        this.socketRef[conversationId] = new ReconnectingWebSocket(path, null, {debug: true});

        this.socketRef[conversationId].onopen = () => {
            console.log('WebSocket at ' + conversationId + ' open');
        };

        this.socketRef[conversationId].onmessage = e => {
            this.socketNewMessage(e.data);
        };

        this.socketRef[conversationId].onerror = e => {
            console.log(e.message);
            this.socketRef[conversationId] = null;
        };

        this.socketRef[conversationId].onclose = () => {
            console.log("WebSocket closed at " + conversationId + " let's reopen");
        };
    }

    socketNewMessage(data) {
        const parsedData = JSON.parse(data);
        const command = parsedData.command;
        if (Object.keys(this.callbacks).length === 0) {
            return;
        }
        if (command === 'messages') {
            this.callbacks[command](parsedData.messages);
        }
        if (command === 'new_message') {
            this.callbacks[command](parsedData.message);
        }
        if (command == 'fetch_not_friends') {
            this.callbacks[command](parsedData.strangers);
        }
        if (command == 'fetch_friend_requests_of_user') {
            this.callbacks[command](parsedData.requests);
        }
        if (command == 'accept_friend_request') {
            this.callbacks[command](true);
        }
        if (command == 'decline_friend_request') {
            this.callbacks[command](parsedData.log == 'Decline friend request successful');
        }
        if (command == 'fetch_all_friends') {
            this.callbacks[command](parsedData.friends);
        }
        if (command == 'create_conversation') {
            this.callbacks[command]({
                successful: parsedData.log == 'successful',
                conversation: parsedData.conversation,
            });
        }
        if (command == 'add_user_to_conversation') {
            this.callbacks[command]({
                successful: parsedData.log == 'successful',
                username: parsedData.user.username,
            });
        }
        if (command == 'fetch_user_info') {
            this.callbacks[command](parsedData.user);
        }
    }

    fetchMessages(conversationId) {
        this.sendMessage(conversationId, { 
            command: 'fetch_messages', 
            conversation_id: conversationId,
        });
    }

    fetchNotFriends(username) {
        this.sendMessage(0, {
            command: 'fetch_not_friends',
            username: username,
        });
    }

    sendFriendRequest(fromUsername, toUsername) {
        this.sendMessage(0, {
            command: 'send_friend_request',
            from_username: fromUsername,
            to_username: toUsername
        });
    }
    
    fetchFriendRequests(username) {
        this.sendMessage(0, {
            command: 'fetch_friend_requests_of_user',
            to_username: username,
        });
    }

    acceptFriendRequest(fromUsername, toUsername) {
        this.sendMessage(0, {
            command: 'accept_friend_request',
            from_username: fromUsername,
            to_username: toUsername,
        });
    }

    declineFriendRequest(fromUsername, toUsername) {
        this.sendMessage(0, {
            command: 'decline_friend_request',
            from_username: fromUsername,
            to_username: toUsername,
        });
    }

    fetchFriends(username) {
        this.sendMessage(0, {
            command: 'fetch_all_friends',
            username: username,
        });
    }

    newChatMessage(message) {
        this.sendMessage(message.conversationId, { 
            command: 'new_message', 
            from: message.from,
            conversation_id: message.conversationId,
            attachment_type: message.attachmentType,
            message: message.content,
        }); 
    }

    newConversation(conversationName, creator) {
        this.sendMessage(0, {
            command: 'create_conversation',
            conversation_name: conversationName,
            username: creator,
        });
    }

    addUserToConversation(conversationId, username) {
        this.sendMessage(conversationId, {
            command: 'add_user_to_conversation',
            conversation_id: conversationId,
            username: username,
        });
    }

    fetchUserInfo(username) {
        this.sendMessage(0, {
            command: 'fetch_user_info',
            username: username,
        });
    }

    addCallbacks(callbackOfCommand) {
        Object.keys(callbackOfCommand).forEach((command) => {
            this.callbacks[command] = callbackOfCommand[command];
        });
    }
  
    sendMessage(conversationId, data) {
        try {
            this.socketRef[conversationId].send(JSON.stringify({ ...data }));
        }
        catch(err) {
            console.log(err.message);
        }  
    }

    state(conversationId) {
        return this.socketRef[conversationId].readyState;
    }

    waitForSocketConnection = (conversationId=0, timeout=5, callback) => {
        const socket = this.socketRef[conversationId];
        if (!socket) return;
        setTimeout(() => {
            if (socket.readyState === 1) {
                //console.log("Connection is made")
                if (callback) {
                    callback();
                }
                return;
            } else {
                console.log("wait for connection...")
                this.waitForSocketConnection(conversationId, timeout, callback);
            }
        }, timeout); // wait 5 milisecond for the connection...
    }

    connectAndWait = (conversationId=0, timeout=5, callback) => {
        this.connect(conversationId);
        this.waitForSocketConnection(conversationId, timeout, callback);
    }
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;