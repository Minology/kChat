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

export default function Chat({ unauthenticate }) {
    const [tab, setTab] = useState("chat");
    const [prevTab, setPrevTab] = useState(tab);
    const [conversationList, setConversationList] = useState([]);
    const [lastMessage, setLastMessage] = useState({});
    const [errored, setErrored] = useState(false);
    const [friendRequestList, setFriendRequestList] = useState([]);
    const [selectingFriendRequest, setSelectingFriendRequest] = useState();
    const [userInfo, setUserInfo] = useState({});

    let fetchConversationList = () => {
        WebSocketInstance.connectAndWait(0, 100, () => {
            WebSocketInstance.addCallbacks({
                'conversations_of_user': (conversations) => {
                    let newConversationList = [];
                    
                    conversations.forEach(conversation => {
                        newConversationList = newConversationList.concat({
                            id: conversation.conversation_id,
                            title: conversation.title,
                            creator: conversation.creator_username,
                            created_at: conversation.created_at,
                        });
                        WebSocketInstance.connect(conversation.conversation_id);
                    });

                    setConversationList(newConversationList);
                },
            });
            WebSocketInstance.fetchConversations();
        });
    }

    let fetchFriendRequests = () => {
        WebSocketInstance.connectAndWait(0, 100, () => {
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
            WebSocketInstance.fetchFriendRequests();
        });
    }

    let fetchUserInfo = (callback) => {
        ClientInstance.getUserInfo()
            .then((response) => {
                setUserInfo(new UserInfo(
                    undefined,
                    response.data.username,
                    response.data.first_name,
                    response.data.last_name,
                    response.data.email,
                    response.data.quote,
                    response.data.place,
                    response.data.avatar
                ));
                callback();
            })
            .catch((error) => {
                //console.error('An error occurred: ' + error);
                setErrored(true);
                unauthenticate();
            })
    }

    useEffect(() => {
        fetchUserInfo(() => {
            fetchConversationList();
            fetchFriendRequests();
        });
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
                    currentUser={userInfo.username}
                    conversationList={conversationList}
                    setConversationList={setConversationList}
                />
            </ModalContainer>
            : tab == "friends"? (
                <div>
                    <ModalContainer modalName="addFriend" fullname="Add Friend">
                        <AddFriendModal />
                    </ModalContainer>
                    <ModalContainer modalName="friendRequest" fullname={"Friend Request From " + selectingFriendRequest}>
                        <FriendRequestModal
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
        if (prevTab != tab) {
            if (tab == "chat") fetchConversationList();
            else if (tab == "friends") fetchFriendRequests();
            
            setPrevTab(tab);
        }

        return <div
            className="tab-pane fade show active"
            id={"pills-" + tab + "-justified"}
            role="tabpanel"
            aria-labelledby={"pills-" + tab + "-tab-justified"}>
            {
                tab == "chat"? <ChatBar conversations={conversationList} lastMessage={lastMessage}/>
                : tab == "friends"?
                    <FriendRequestBar friendRequests={friendRequestList} setSelectingFriendRequest={setSelectingFriendRequest}/>
                : tab == "profile"? <ProfileBar userInfo={userInfo} unauthenticate={unauthenticate}/>
                : tab == "setting"? <SettingBar/>
                : <h4>Oops! An error occurred.</h4>
            }
        </div>
    }

    let match = useRouteMatch();
    let getConversationRoutes = () => {
        return conversationList.map((conversation, i) => (
            <Route key={i} exact path={`${match.path}/${conversation.id}`}>
                <Conversation currentUser={userInfo.username} details={conversation} updateLastMessage={updateLastMessage}/>
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