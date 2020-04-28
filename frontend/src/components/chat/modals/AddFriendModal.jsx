import React from 'react';
import WebSocketInstance from '../../../services/WebSocket.js';
import ChatSearch from '../ChatSearch.jsx';
import UserList from '../../UserList.jsx';

export default class AddRequestModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chosenUser: undefined,
            message: "",
            errored: false,
        }

        this.props.handleSearch();
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
        const strangerList = this.props.strangerList;
        const {
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
                    <ChatSearch handleSearch={this.props.handleSearch}/>
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