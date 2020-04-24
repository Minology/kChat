import React from 'react';
import ClientInstance from '../../../services/Client.js';
import WebSocketInstance from '../../../services/WebSocket.js';
import ChatSearch from '../ChatSearch.jsx';
import UserList from '../../UserList.jsx';
import UserInfoResponse from '../../../response_processors/UserInfoResponse.js';

export default class AddRequestModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            strangerList: [],
            chosenUser: undefined,
            message: "",
            errored: false,
        }

        this.getNotFriendList();
    }

    getNotFriendList = (query) => {
        ClientInstance.getNotFriendList(query)
            .then((response) => {
                let newStrangerList = response.data.map(stranger => new UserInfoResponse(stranger, "http"));
        
                this.setState({strangerList: newStrangerList});
            })
            .catch((error) => {
                console.error('An error occurred: ' + error);
                this.setState({errored: true});
            })
    }

    handleChange = (event) => {
        const targetedUser = event.target.name;

        this.setState({
            chosenUser: targetedUser
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        WebSocketInstance.connectAndWait(0, 100, () => {
            WebSocketInstance.sendFriendRequest(this.state.chosenUser, this.state.message);
        });
        this.refs.hiddenButton.click();
    }

    render() {
        const {
            strangerList,
            chosenUser,
            message,
            errored,
        } = this.state;
        return (
            <div className="modal-body">
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <textarea
                            className="form-control"
                            name="groupDesc"
                            id="groupDescAddFriend"
                            rows="5"
                            value={message}
                            placeholder="Enter Message"
                            onChange={(e) => {e.preventDefault(); this.setState({message: e.target.value});}}
                        />
                    </div>
                    <p className="add-friend-header">Send Friend Request To: {chosenUser} ?</p>
                    <div className="added-users"></div>
                    <ChatSearch handleSearch={this.getNotFriendList}/>
                    <div className="add-friend-list">
                        {
                            errored?<h4>Oops! An error occurred.</h4>
                            :
                            <UserList 
                                userInfos={strangerList}
                                infosToHide={{"quote": true}}
                                withCheckbox={true}
                                oneOnly={true}
                                chosenUser={chosenUser}
                                onChange={this.handleChange}
                            />
                        }
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