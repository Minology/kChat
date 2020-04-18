import React from 'react';
import ChatItem from './ChatItem.jsx';

export default function ChatList({ conversations, lastMessage }) {

    let getChatList = () => {
        return conversations.map((conversation) =>
            <ChatItem
                key={conversation.id}
                conversation={conversation}
                lastMessage={lastMessage[conversation.id]}
            />
        );
    }

    return (
        <div className="nav flex-column nav-pills chat-userlist" id="chat-list-tab" role="tablist" aria-orientation="vertical">
            { getChatList() }
        </div>
    )
}