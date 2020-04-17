import React, { useState } from 'react';
import ConversationInput from './ConversationInput.jsx';
import Call from './call/Call.jsx';
import MessageList from './MessageList.jsx';

export default function Conversation({ client, currentUser, details }) {
    const [messageList, setMessageList] = useState([]);
    const [fetched, setFetched] = useState(false);
    const [errored, setErrored] = useState(false);

    let handleResponse = (response) => {
        let results = [];

        response.forEach(message => {
            results = results.concat({
                id: message.id,
                created_at: message.created_at,
                content: message.message,
                sender: message.sender,
                attachment_type: message.attachment_type,
            });
        });

        setFetched(true);
        setMessageList(results);
    }

    let handleError = (error) => {
        setErrored(true);
        console.log('An error occurred: ' + error);
    }

    let fetchMessageList = () => {
        client.getMessageList(details.id)
            .then(handleResponse)
            .catch(handleError);
    }

    let getMessageList = () => {
        return <MessageList
            client={client}
            currentUser={currentUser}
            messages={messageList}
        />;
    }

    if (!fetched) fetchMessageList();
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
                        getMessageList()
                    }
                </div>
            </div>
            <div className="chat-bottom">
                <ConversationInput />
            </div>
        </div>
    )
}