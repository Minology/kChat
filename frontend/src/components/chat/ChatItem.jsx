import React from 'react';
import {
    useHistory
} from 'react-router-dom';
import MessageTime from './conversation/MessageTime.js';

export default function ChatItem({ conversation, lastMessage }) {
    let history = useHistory();
    const currentConversation = history.location.pathname.split(/\//).reverse()[0];

    let getLastMessageTime = () => {
        if (lastMessage) {
            const messageTime = new MessageTime(lastMessage.message.created_at);
            return messageTime.toString();
        }
    }

    return (
        <a
            className={"nav-link" + (conversation.id == currentConversation? " active": "")}
            id={"chat-" + conversation.id + "-tab"}
            data-toggle="pill"
            role="tab"
            aria-controls={"chat-" + conversation.id}
            aria-selected={conversation.id == currentConversation}
            onClick={() => { history.push("/chat/" + conversation.id); }}
        >
            <div className={"media" + (conversation.id == currentConversation? " active": "")}>
                <div className="user-status"></div>
                <img 
                    className="align-self-center rounded-circle"
                    src={"../../../../public/assets/images/" + (conversation.id % 2 == 0? "boy": "girl") + ".svg"}
                    alt="User Image"/>
                <div className="media-body">
                    <h5>{ conversation.title }
                        { lastMessage && lastMessage.unreadCount > 0? 
                            <span className="badge badge-primary ml-2">{ lastMessage.unreadCount }</span>: ""
                        }
                        <span className="chat-timing"
                    >
                        { getLastMessageTime() }</span>
                    </h5>
                    <p>{ lastMessage? lastMessage.message.content: lastMessage }</p>
                </div>
            </div>
        </a>
    )
}