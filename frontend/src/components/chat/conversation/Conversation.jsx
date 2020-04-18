import React from 'react';
import ConversationInput from './ConversationInput.jsx';
import Call from './call/Call.jsx';
import MessageList from './MessageList.jsx';
import WebSocketInstance from '../../../services/WebSocket.js';

export default class Conversation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messageList: [],
            errored: false
        }

        this.waitForSocketConnection(() => {
            WebSocketInstance.addCallbacks(this.setMessageList.bind(this), this.addMessage.bind(this))
            WebSocketInstance.fetchMessages(this.props.details.id);
        });
    }

    waitForSocketConnection(callback) {
        const component = this;
        setTimeout(() => {
            // Check if websocket state is OPEN
            if (WebSocketInstance.state() === 1) {
                console.log("Connection is made")
                callback();
                return;
            } else {
              console.log("wait for connection...")
              component.waitForSocketConnection(callback);
            }
        }, 100); // wait 100 milisecond for the connection...
    }

    componentDidMount() {
        this.scrollToBottom();
    }
    
    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
    
    setMessageList(response) {
        let messageList = [];

        response.reverse().forEach(message => {
            messageList = messageList.concat({
                id: message.id,
                created_at: message.created_at,
                content: message.message,
                sender: message.sender,
                attachment_type: message.attachment_type,
            });
        });

        this.setState({ messageList: messageList});
    }

    addMessage(message) {
        this.setState({ messageList: [...this.state.messageList, {
            id: message.id,
            created_at: message.created_at,
            content: message.message,
            sender: message.sender,
            attachment_type: message.attachment_type,
        }]});
    }

    sendMessage = (message) => {
        const messageObject = {
            from: this.props.currentUser,
            conversationId: this.props.details.id,
            attachmentType: "Only text",
            content: message,
          };
        WebSocketInstance.newChatMessage(messageObject);
    }

    handleError = (error) => {
        this.setState({ errored: true });
        console.log('An error occurred: ' + error);
    }

    render() {
        const currentUser = this.props.currentUser;
        const details = this.props.details;
        const messageList = this.state.messageList;
        const errored = this.state.errored;
        return (
            <div className="chat-detail">
                <div className="chat-head">
                    <div className="row align-items-center">
                        <div className="col-6">                                                
                            <ul className="list-unstyled mb-0">
                                <li className="media">
                                    <div className="user-status"></div>
                                    <img className="align-self-center rounded-circle" src="../../../../public/assets/images/girl.svg" alt="Generic placeholder image"/>
                                    <div className="media-body">
                                        <h5>{ details.title }</h5>
                                        <p className="mb-0">Online</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="col-6">
                            <Call />
                        </div>
                    </div>
                </div>
                <div className="chat-body">
                    <div className="tab-content" id="chat-listContent">
                        {
                            errored? <h4>Oops! An error occurred.</h4>
                            :
                            <MessageList
                                currentUser={currentUser}
                                messages={messageList}
                            />
                        }
                        <div ref={(el) => { this.messagesEnd = el; }}/>
                    </div>
                </div>
                <div className="chat-bottom">
                    <ConversationInput sendMessage={this.sendMessage}/>
                </div>
            </div>
        )
    }
}