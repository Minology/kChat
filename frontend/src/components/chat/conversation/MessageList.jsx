import React from 'react';
import Message from './Message.jsx';

export default function MessageList({ client, currentUser, messages }) {
    let getMessageList = () => {
        return messages.map((message, index) => 
            <Message 
                key={index}
                currentUser={currentUser}
                message={message}
                prevMessageTime={index > 0? messages[index - 1].created_at: 0}
            />
        );
    }

    return (
        <div className="tab-pane fade show active" id="chat-first" role="tabpanel" aria-labelledby="chat-first-tab">
            { 
                (messages.length > 0)?
                getMessageList()
                :
                <div className="empty-screen">
                    <img src="../../../../public/assets/images/empty-logo.png" className="img-fluid" alt="empty-logo"/>
                    <h4 className="my-3">No Conversation Yet.</h4>
                </div>
            }
        </div>
    )
}