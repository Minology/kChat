import React from 'react';
import ChatSearch from '../ChatSearch.jsx';
import UserList from '../../UserList.jsx';
import WebSocketInstance from '../../../services/WebSocket.js';
import UserInfo from '../../../UserInfo.js';

export default class AddRequestModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            strangerList: [],
            chosenUser: undefined,
        }
        
        WebSocketInstance.connect();
        
        WebSocketInstance.waitForSocketConnection(0, 100, () => {
            WebSocketInstance.addCallbacks({
                'fetch_not_friends': this.setStrangerList,
            });
            WebSocketInstance.fetchNotFriends(this.props.currentUser);
        });
    }

    setStrangerList = (strangers) => {
        let newStrangerList = strangers.map(stranger => {
            return new UserInfo(
                stranger.user_id,
                stranger.username,
                stranger.first_name,
                stranger.last_name,
                stranger.email,
                undefined,
                stranger.place
            );
        });

        this.setState({strangerList: newStrangerList});
    }

    handleChange = (event) => {
        const targetedUser = event.target.name;

        this.setState({
            chosenUser: targetedUser
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        WebSocketInstance.sendFriendRequest(this.props.currentUser, this.state.chosenUser);
        this.refs.hiddenButton.click();
    }

    render() {
        const strangerList = this.state.strangerList;
        const chosenUser = this.state.chosenUser;
        return (
            <div className="modal-body">
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <textarea className="form-control" name="groupDesc" id="groupDescAddFriend" rows="5" placeholder="Enter Message"></textarea>
                    </div>
                    <p className="add-friend-header">Send Friend Request To: {chosenUser} ?</p>
                    <div className="added-users"></div>
                    <ChatSearch />
                    <div className="add-friend-list">
                        <UserList 
                            userInfos={strangerList} 
                            withCheckbox={true}
                            oneOnly={true}
                            chosenUser={chosenUser}
                            onChange={this.handleChange}/>
                    </div>
                    <div className="mt-3 text-center">
                        <button type="submit" className="btn btn-primary">
                            <i className="feather icon-plus mr-2"></i>
                            Add Friend
                        </button>
                    </div>
                    <div ref="hiddenButton" data-dismiss="modal"></div>
                </form>
            </div>
        )
    }
}