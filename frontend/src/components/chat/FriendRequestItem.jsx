import React from 'react';

export default function FriendRequestItem({ fromUser, setSelectingFriendRequest }) {
    return (
        <a
            className="nav-link"
            id={"request-" + fromUser + "-tab"}
            data-toggle="modal"
            data-target="#friendRequest"
            role="tab"
            aria-controls={"request-" + fromUser}
            onClick={() => {setSelectingFriendRequest(fromUser);}}
        >
            <div className="media">
                <div className="user-status"></div>
                <img 
                    className="align-self-center rounded-circle"
                    src={"../../../../public/assets/images/" + "boy.svg"}
                    alt="User Image"/>
                <div className="media-body">
                    <h5>{ fromUser }</h5>
                    <p></p>
                </div>
            </div>
        </a>
    )
}