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
        
        const token = localStorage.getItem('refresh_token');
        if (!token) return;

        const path = config.WS_PATH + conversationId + '/?token=' + token;
        this.socketRef[conversationId] = new ReconnectingWebSocket(path, null, {debug: false});

        this.socketRef[conversationId].onopen = () => {
            console.log('WebSocket at ' + conversationId + ' open');
        };

        this.socketRef[conversationId].onmessage = e => {
            this.socketNewMessage(e.data);
        };

        this.socketRef[conversationId].onerror = e => {
            //console.log(e.message);
            this.socketRef[conversationId] = null;
        };

        this.socketRef[conversationId].onclose = () => {
            console.log("WebSocket closed at " + conversationId + " let's reopen");
        };
    }

    socketNewMessage(data) {
        const parsedData = JSON.parse(data);

        //console.log(parsedData);
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
        if (command == 'last_messages') {
            this.callbacks[command]({
                last_messages: parsedData.last_messages,
                unread_counts: parsedData.unread_counts,
            });
        }
        if (command == 'update_last_seen_message') {
            this.callbacks[command](parsedData.log == 'Command executed successfully');
        }
        if (command == 'send_friend_request') {
            //console.log(parsedData);
        }
        if (command == 'accept_friend_request') {
            this.callbacks[command](true);
        }
        if (command == 'discard_friend_request') {
            this.callbacks[command](parsedData.log == 'Command executed successfully');
        }
        if (command == 'create_conversation') {
            this.callbacks[command]({
                successful: parsedData.log == 'Command executed successfully',
                conversation: parsedData.conversation,
            });
        }
        if (command == 'add_user_to_conversation') {
            this.callbacks[command]({
                successful: parsedData.log == 'Command executed successfully',
                username: parsedData.user.username,
            });
        }
    }

    fetchMessages(conversationId) {
        this.sendMessage(conversationId, { 
            command: 'fetch_messages', 
            conversation_id: conversationId,
        });
    }

    fetchLastMessages() {
        this.sendMessage(0, {
            command: 'fetch_conversations_last_message_from_user',
        })
    }

    updateLastSeenMessage(conversationId, messageId) {
        this.sendMessage(conversationId, { 
            command: 'update_last_seen_message',
            conversation_id: conversationId,
            last_seen_message_id: messageId,
        });
    }

    sendFriendRequest(toUsername, message) {
        this.sendMessage(0, {
            command: 'send_friend_request',
            to_username: toUsername,
            request_message: message,
        });
    }

    acceptFriendRequest(fromUsername) {
        this.sendMessage(0, {
            command: 'accept_friend_request',
            from_username: fromUsername,
        });
    }

    declineFriendRequest(fromUsername) {
        this.sendMessage(0, {
            command: 'discard_friend_request',
            from_username: fromUsername,
        });
    }

    newChatMessage(message) {
        this.sendMessage(message.conversationId, { 
            command: 'new_message',
            conversation_id: message.conversationId,
            attachment_type: message.attachmentType,
            message: message.content,
        }); 
    }

    newConversation(conversationName) {
        this.sendMessage(0, {
            command: 'create_conversation',
            conversation_name: conversationName,
        });
    }

    addUserToConversation(conversationId, username) {
        this.sendMessage(conversationId, {
            command: 'add_user_to_conversation',
            conversation_id: conversationId,
            username: username,
        });
    }

    fetchUserInfo() {
        this.sendMessage(0, {
            command: 'fetch_user_info',
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