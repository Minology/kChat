import React from 'react';
import WebSocketInstance from '../../../services/WebSocket.js';
import { ModalBody } from './styles.jsx';

export default class FriendRequestModal extends React.Component {
    constructor(props) {
        super(props);
        WebSocketInstance.connect();

        WebSocketInstance.waitForSocketConnection(0, 100, () => {
            WebSocketInstance.addCallbacks({
                'accept_friend_request': this.handleResponse,
                'decline_friend_request': this.handleResponse,
            });
        });
    }

    handleResponse = (successful) => {
        if (successful) {
            this.refs.hiddenButton.click();
            this.props.setFriendRequestList(
                this.props.friendRequestList.filter((friendRequest) => { return friendRequest.fromUser != this.props.fromUser})
            );
        }
    }

    handleAccept = () => {
        WebSocketInstance.acceptFriendRequest(this.props.currentUser, this.props.fromUser);
    }

    handleDecline = () => {
        WebSocketInstance.declineFriendRequest(this.props.currentUser, this.props.fromUser);
    }

    render() {
        const fromUser = this.props.fromUser;
        return (
            <ModalBody>
                <img src="../../../../public/assets/images/men.svg" alt="avatar" className="rounded-circle"/>
                <h5>{fromUser}</h5>
                <p></p>
                <button type="button" className="btn btn-success mr-3" onClick={this.handleAccept}>
                    <i className="feather icon-check mr-2"></i>Accept
                </button>
                <button type="button" className="btn btn-danger" onClick={this.handleDecline}>
                    <i className="feather icon-x mr-2"></i>Reject
                </button>
                <div ref="hiddenButton" data-dismiss="modal"></div>
            </ModalBody>
        )
    }
}