import React from 'react';
import MessageTime from './MessageTime.js';

export default function Message({ currentUser, message, prevMessageTime }) {
    let getClassName = () => {
        return "chat-message " + (currentUser == message.sender ? "chat-message-right" : "chat-message-left");
    }

    let getMessage = () => {
        switch (message.attachment_type) {
            case 1:
                return getTextMessage(message.content);
        }
    }

    let getTextMessage = (text) => {
        let lines = text.split(/\r?\n/);
        lines = lines.map((line, index) => {
            return index == 0? line : (<br/>,{line});
        });
        return (
            <span>{lines}</span>
        )
    }

    const messageTime = new MessageTime(message.created_at);
    let getMessageTimeBadge = () => {
        if (!messageTime.isOnSameDayWith(prevMessageTime)) {
            return (
                <div className="chat-day text-center mb-3">
                    <span className="badge badge-secondary-inverse">{ messageTime.toString() }</span>
                </div>
            )
        }
    }

    return (
        <div className={ getClassName() }>
            { getMessageTimeBadge() }
            <div className="chat-message-text">
                { getMessage() }
            </div>
            <div className="chat-message-meta">
                <span>{ messageTime.toTimeString() }<i className="feather icon-check ml-2"></i></span>
            </div>
        </div>
    )
}