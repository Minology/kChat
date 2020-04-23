import React, { useState, useEffect } from 'react';
import {
    Switch,
    Route,
    Redirect,
    useRouteMatch
} from 'react-router-dom';
import ModalContainer from './modals/ModalContainer.jsx';
import NewConversationModal from './modals/NewConversationModal.jsx';
import AddFriendModal from './modals/AddFriendModal.jsx';
import FriendRequestModal from './modals/FriendRequestModal.jsx';
import Conversation from './conversation/Conversation.jsx';
import ChatMenu from './ChatMenu.jsx';
import ChatBar from './bars/ChatBar.jsx';
import FriendRequestBar from './bars/FriendRequestBar.jsx';
import ProfileBar from './bars/ProfileBar.jsx';
import SettingBar from './bars/SettingBar.jsx';
import UserInfo from '../../UserInfo.js';
import WebSocketInstance from '../../services/WebSocket.js';
import ClientInstance from '../../Client.js';

export default function Chat({ currentUser }) {
    const [tab, setTab] = useState("chat");
    const [conversationList, setConversationList] = useState([]);
    const [lastMessage, setLastMessage] = useState({});
    const [errored, setErrored] = useState(false);
    const [friendRequestList, setFriendRequestList] = useState([]);
    const [selectingFriendRequest, setSelectingFriendRequest] = useState();
    const [userInfo, setUserInfo] = useState();

    let handleResponse = (response) => {
        let results = [];

        response.data.forEach(conversation => {
            results = results.concat({
                id: conversation.id,
                title: conversation.title,
                creator: conversation.creator,
                created_at: conversation.created_at,
            });
            WebSocketInstance.connect(conversation.id);
        });

        setConversationList(results);
    }

    let handleError = (error) => {
        setErrored(true);
        console.log('An error occurred: ' + error);
    }

    let fetchConversationList = () => {
        ClientInstance.getConversationList(currentUser)
            .then(handleResponse)
            .catch(handleError);
    }

    let fetchFriendRequests = () => {
        WebSocketInstance.connect();

        WebSocketInstance.waitForSocketConnection(0, 100, () => {
            WebSocketInstance.addCallbacks({
                'fetch_friend_requests_of_user': (friendRequests) => {
                    let newFriendRequestList = [];
                    
                    friendRequests.forEach(friendRequest => {
                        newFriendRequestList = newFriendRequestList.concat({
                            fromUser: friendRequest.from_user
                        });
                    });

                    setFriendRequestList(newFriendRequestList);
                },
            });
            WebSocketInstance.fetchFriendRequests(currentUser);
        });
    }

    let fetchUserInfo = () => {
        WebSocketInstance.connect();

        WebSocketInstance.waitForSocketConnection(0, 100, () => {
            WebSocketInstance.addCallbacks({
                'fetch_user_info': (response) => {
                    setUserInfo(new UserInfo(
                        response.user_id,
                        response.username,
                        response.first_name,
                        response.last_name,
                        response.email,
                        response.quote,
                        response.place
                    ));
                },
            });
            WebSocketInstance.fetchUserInfo(currentUser);
        });
    }

    useEffect(() => {
        fetchConversationList();
        fetchFriendRequests();
        fetchUserInfo();
    }, []);

    let updateLastMessage = (message, isSeen) => {
        let newLastMessage = JSON.parse(JSON.stringify(lastMessage));
        newLastMessage[message.conversationId] = {
            message: message,
            unreadCount: (
                isSeen? 0
                : lastMessage[message.conversationId]? lastMessage[message.conversationId]['unreadCount'] + 1
                : 1
            )
        };
        setLastMessage(newLastMessage);
    }
    
    let getModals = () => {
        return  tab == "chat"?
            <ModalContainer modalName="createGroup" fullname="Create Group">
                <NewConversationModal 
                    currentUser={currentUser}
                    conversationList={conversationList}
                    setConversationList={setConversationList}
                />
            </ModalContainer>
            : tab == "friends"? (
                <div>
                    <ModalContainer modalName="addFriend" fullname="Add Friend">
                        <AddFriendModal currentUser={currentUser}/>
                    </ModalContainer>
                    <ModalContainer modalName="friendRequest" fullname={"Friend Request From " + selectingFriendRequest}>
                        <FriendRequestModal
                            currentUser={currentUser}
                            fromUser={selectingFriendRequest}
                            friendRequestList={friendRequestList}
                            setFriendRequestList={setFriendRequestList}
                        />
                    </ModalContainer>
                </div>
            )
            : undefined
    }

    let getBar = () => {
        return <div
            className="tab-pane fade show active"
            id={"pills-" + tab + "-justified"}
            role="tabpanel"
            aria-labelledby={"pills-" + tab + "-tab-justified"}>
            {
                tab == "chat"? <ChatBar conversations={conversationList} lastMessage={lastMessage}/>
                : tab == "friends"? 
                    <FriendRequestBar friendRequests={friendRequestList} setSelectingFriendRequest={setSelectingFriendRequest}/>
                : tab == "profile"? <ProfileBar userInfo={userInfo}/>
                : tab == "setting"? <SettingBar/>
                : <h4>Oops! An error occurred.</h4>
            }
        </div>
    }

    let match = useRouteMatch();
    let getConversationRoutes = () => {
        return conversationList.map((conversation, i) => (
            <Route key={i} exact path={`${match.path}/${conversation.id}`}>
                <Conversation currentUser={currentUser} details={conversation} updateLastMessage={updateLastMessage}/>
            </Route>
        ));
    }

    return (
        <div className="chat-layout">
            { getModals() }
            <div className="chat-leftbar">
                <div className="tab-content" id="pills-tab-justifiedContent">
                    { getBar() }
                </div>
                <ChatMenu setTab={setTab}/>
            </div>
            <div className="chat-rightbar">
                <Switch>
                    <Route exact path={match.path}>
                        {
                            (conversationList.length > 0)? <Redirect to={`${match.path}/${conversationList[0].id}`}/>
                            :
                            errored? <h4>Oops! An error occurred.</h4>
                            :
                            <div className="empty-screen">
                                <img src="../../../public/assets/images/empty-logo.png" className="img-fluid" alt="empty-logo"/>
                                <h4 className="my-3">Let's start a conversation!</h4>
                            </div>
                        }
                    </Route>
                    { getConversationRoutes() }
                    <Route>
                        <Redirect to={`${match.path}`} />
                    </Route>
                </Switch>
            </div>
        </div>
    )
}