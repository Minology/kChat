import React from 'react';
import WebSocketInstance from '../../../services/WebSocket.js';
import ConversationInput from './ConversationInput.jsx';
import Call from './call/Call.jsx';
import MessageList from './MessageList.jsx';
import MessageResponse from '../../../response_processors/MessageResponse.js';

export default class Conversation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messageList: [],
            errored: false
        }
        
        WebSocketInstance.connectAndWait(this.props.details.id, 100, () => {
            WebSocketInstance.addCallbacks({
                'messages': this.setMessageList,
                'new_message': this.getMessage,
                'update_last_seen_message': this.handleFailedUpdateRequest,
            });
            WebSocketInstance.fetchMessages(this.props.details.id);
        });
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
    
    setMessageList = (response) => {
        if (response.length == 0) return;
        let messageList = [];

        response.reverse().forEach(message => {
            messageList = messageList.concat(new MessageResponse(message, "ws"));
        });

        this.setState({ messageList: messageList});
        this.props.updateLastMessage(messageList[messageList.length - 1], true);
        WebSocketInstance.updateLastSeenMessage(this.props.details.id, messageList[messageList.length - 1].id);
    }

    getMessage = (message) => {
        message = new MessageResponse(message, "ws");
        const isSeen = message.conversationId == this.props.details.id;
        if (isSeen) {
            this.setState({ messageList: [...this.state.messageList, message]});
        }
        this.props.updateLastMessage(message, isSeen);
        WebSocketInstance.updateLastSeenMessage(this.props.details.id, message.id);
    }

    handleFailedUpdateRequest = (successful) => {
        const last_seen_message = this.state.messageList[this.state.messageList.length - 1];
        if (!successful) WebSocketInstance.updateLastSeenMessage(this.props.details.id, last_seen_message.id);
    }

    sendMessage = (message) => {
        const messageObject = {
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
        const conversationInfoShown = this.props.conversationInfoShown;
        const showConversationInfo = this.props.showConversationInfo;
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
                            <Call showConversationInfo={showConversationInfo}/>
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
                <div className={"chat-bottom" + (conversationInfoShown? " small":"")}>
                    <ConversationInput sendMessage={this.sendMessage}/>
                </div>
            </div>
        )
    }
}