import React from 'react';
import ChatList from '../ChatList.jsx';
import ChatSearch from '../ChatSearch.jsx';

export default function ChatListBar({ conversations, lastMessage, handleChatSearch }) {
    return (
        <div className="chat-listbar">
            <div className="chat-left-headbar">
                <div className="row align-items-center">
                    <div className="col-9">
                        <ul className="list-unstyled mb-0">
                            <li className="media">
                                <img className="align-self-center mr-2" src="../../../../public/assets/images/logo.svg" alt="Generic placeholder image"/>
                                <div className="media-body">
                                    <h5 className="mb-0 mt-2">kChat</h5>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="col-3">
                        <a href="#" data-toggle="modal" data-target="#createGroup">
                            <i className="feather icon-edit-1"></i>
                        </a>
                    </div>
                </div>
            </div>
            <ChatSearch handleSearch={handleChatSearch} />
            <div className="chat-left-body">
                <ChatList conversations={conversations} lastMessage={lastMessage}/>
            </div>
        </div>
    )
}