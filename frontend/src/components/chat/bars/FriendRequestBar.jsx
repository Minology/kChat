import React from 'react';
import ChatSearch from '../ChatSearch.jsx';
import FriendRequestList from '../FriendRequestList.jsx';

export default function FriendsBar({ friendRequests, setSelectingFriendRequest }) {
    return (
        <div className="chat-friendrequestbar">
            <div className="chat-left-headbar">
                <div className="row align-items-center">
                    <div className="col-9">
                        <ul className="list-unstyled mb-0">
                            <li className="media">
                                <img className="align-self-center mr-2" src="../../../../public/assets/images/logo.svg" alt="Generic placeholder image"/>
                                <div className="media-body">
                                    <h5 className="mb-0 mt-2">Friend Requests</h5>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="col-3">
                        <a href="#" data-toggle="modal" data-target="#addFriend">
                            <i className="feather icon-users"></i>
                        </a>
                    </div>
                </div>
            </div>
            <ChatSearch />
            <div className="chat-left-body">
                <FriendRequestList friendRequests={friendRequests} setSelectingFriendRequest={setSelectingFriendRequest}/>
            </div>
        </div>
    )
}