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

    connect(conversationId) {
        if (this.socketRef[conversationId]) return;

        const path = config.API_PATH + conversationId + '/';
        this.socketRef[conversationId] = new ReconnectingWebSocket(path);

        this.socketRef[conversationId].onopen = () => {
            console.log('WebSocket at ' + conversationId + ' open');
        };

        this.socketRef[conversationId].onmessage = e => {
            this.socketNewMessage(e.data);
        };

        this.socketRef[conversationId].onerror = e => {
            console.log(e.message);
        };

        this.socketRef[conversationId].onclose = () => {
            console.log("WebSocket closed at " + conversationId + " let's reopen");
            this.connect();
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
    }

    fetchMessages(conversationId) {
        this.sendMessage({ 
            command: 'fetch_messages', 
            conversation_id: conversationId,
        });
    }

    newChatMessage(message) {
        this.sendMessage({ 
            command: 'new_message', 
            from: message.from,
            conversation_id: message.conversationId,
            attachment_type: message.attachmentType,
            message: message.content,
        }); 
    }

    addCallbacks(messagesCallback, newMessageCallback) {
        this.callbacks['messages'] = messagesCallback;
        this.callbacks['new_message'] = newMessageCallback;
    }
  
    sendMessage(data) {
        try {
            this.socketRef[data.conversation_id].send(JSON.stringify({ ...data }));
        }
        catch(err) {
            console.log(err.message);
        }  
    }

    state(conversationId) {
        return this.socketRef[conversationId].readyState;
    }

    waitForSocketConnection(conversationId, callback){
        const socket = this.socketRef[conversationId];
        const recursion = this.waitForSocketConnection;
        setTimeout(() => {
            if (socket.readyState === 1) {
                console.log("Connection is made")
                if (callback != null) {
                    callback();
                }
                return;
            } else {
                console.log("wait for connection...")
                recursion(callback);
            }
        }, 1); // wait 5 milisecond for the connection...
    }

}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;