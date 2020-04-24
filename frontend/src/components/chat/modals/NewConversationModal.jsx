import React from 'react';
import ChatSearch from '../ChatSearch.jsx';
import UserList from '../../UserList.jsx';
import WebSocketInstance from '../../../services/WebSocket.js';
import UserInfo from '../../../UserInfo.js';

export default class NewConversationModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            friendList: [],
            newConversation: "",
            usersToAdd: {},
        }
        
        WebSocketInstance.connectAndWait(0, 100, () => {
            WebSocketInstance.addCallbacks({
                'fetch_all_friends': this.setFriendList,
                'create_conversation': this.addUsers,
                'add_user_to_conversation': this.handleFailedAddUserRequest,
            });
            WebSocketInstance.fetchFriends();
        });
    }

    setFriendList = (friends) => {
        let newFiendList = friends.map(friend => {
            return new UserInfo(
                friend.user_id,
                friend.username,
                friend.first_name,
                friend.last_name,
                friend.email,
                friend.quote,
                undefined
            );
        });

        this.setState({friendList: newFiendList});
    }

    addUsers = (response) => {
        if (response.successful) {
            const conversation = response.conversation;
            this.props.setConversationList([...this.props.conversationList, {
                id: conversation.conversation_id,
                title: conversation.title,
                creator: conversation.creator_username,
                created_at: conversation.created_at,
            }]);
            if (this.props.currentUser != response.conversation.creator_username) return;

            WebSocketInstance.connectAndWait(conversation.conversation_id, 100, () => {
                Object.keys(this.state.usersToAdd).filter((k) => this.state.usersToAdd[k]).forEach((username) => {
                    WebSocketInstance.addUserToConversation(conversation.conversation_id, username);
                });
            });
            this.setState({
                newConversation: "",
            });
            this.refs.hiddenButton.click();
        }
        else {
            if (this.props.currentUser != response.conversation.creator_username) return;
            console.log("Creating new conversation failed. Let's try again...");
            WebSocketInstance.newConversation(this.state.newConversationName);
        }
    }

    handleFailedAddUserRequest = (response) => {
        if (!response.successful) {
            console.log("Add " + response.username + " failed!");
            //WebSocketInstance.addUserToConversation(this.conversation.conversation_id, response.username);
        }
    }

    handleNameChange = (event) => {
        this.setState({
            newConversation: event.target.value
        });
    }

    handleUsersChange = (event) => {
        const targetedUser = event.target.name;

        let newUsersToAdd = JSON.parse(JSON.stringify(this.state.usersToAdd));
        newUsersToAdd[targetedUser] = event.target.checked;
        this.setState({
            usersToAdd: newUsersToAdd
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        WebSocketInstance.newConversation(this.state.newConversation);
    }

    getUsersToAddAvatars = () => {
        return Object.keys(this.state.usersToAdd).filter((k) => this.state.usersToAdd[k]).map((user, index) =>
            <div key={index} className="avatar">
                <a href="#" data-toggle="tooltip" data-placement="top" title="" data-original-title={user}>
                <img src="../../../../public/assets/images/boy.svg" alt={user} className="rounded-circle"/>
                </a>
            </div>
        );
    }

    render() {
        const friendList = this.state.friendList;
        const newConversationName = this.state.newConversation;
        const usersToAdd = this.state.usersToAdd;
        return (
            <div className="modal-body">
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <input 
                            type="text"
                            value={newConversationName}
                            className="form-control"
                            id="groupName"
                            placeholder="Enter Group Name"
                            onChange={this.handleNameChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <textarea className="form-control" name="groupDesc" id="groupDescCreateGroup" rows="3" placeholder="Enter Group Description"></textarea>
                    </div>
                    <p className="create-group-header">Add Users</p>
                    <div className="added-users">
                        <div className="avatar-group">
                            { this.getUsersToAddAvatars() }
                        </div>
                    </div>
                    <ChatSearch />
                    <div className="add-users-list">
                        <UserList userInfos={friendList} withCheckbox={true} checkedUsers={usersToAdd} onChange={this.handleUsersChange}/>
                    </div>
                    <div className="mt-3 text-center">
                        <button type="submit" className="btn btn-primary">
                            <i className="feather icon-plus mr-2"></i>
                            Create Group
                        </button>
                    </div>
                    <div ref="hiddenButton" data-dismiss="modal"></div>
                </form>
            </div>
        )
    }
}