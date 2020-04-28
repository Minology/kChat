import React from 'react';
import FriendRequestItem from './FriendRequestItem.jsx';

export default function FriendRequestList({ friendRequests, setSelectingFriendRequest }) {

    let getFriendRequestList = () => {
        return friendRequests.map((friendRequest) =>
            <FriendRequestItem
                key={friendRequest.fromUser}
                friendRequest={friendRequest}
                setSelectingFriendRequest={setSelectingFriendRequest}
            />
        );
    }

    return (
        <div className="nav flex-column nav-pills chat-userlist" id="chat-list-tab" role="tablist" aria-orientation="vertical">
            { getFriendRequestList() }
        </div>
    )
}