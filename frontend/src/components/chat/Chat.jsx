import React, { useState } from 'react';
import {
    Switch,
    Route,
    Redirect,
    useRouteMatch
} from 'react-router-dom';
import NotFoundPage from '../NotFoundPage.jsx';
import Conversation from './conversation/Conversation.jsx';
import ChatMenu from './ChatMenu.jsx';
import ConversationListBar from './bars/ConversationListBar.jsx';

export default function Chat({ client, currentUser }) {
    const [conversationList, setConversationList] = useState([]);
    const [fetched, setFetched] = useState(false);
    const [errored, setErrored] = useState(false);

    let handleResponse = (response) => {
        let results = [];

        response.forEach(conversation => {
            results = results.concat({
                id: conversation.id,
                title: conversation.title,
                creator: conversation.creator,
                created_at: conversation.created_at,
            });
        });

        setFetched(true);
        setConversationList(results);
    }

    let handleError = (error) => {
        setErrored(true);
        console.log('An error occurred: ' + error);
    }

    let fetchConversationList = () => {
        client.getConversationList(currentUser)
            .then(handleResponse)
            .catch(handleError);
    }

    let match = useRouteMatch();
    let getConversationRoutes = () => {
        return conversationList.map((conversation, i) => (
            <Route key={i} path={`${match.path}/${conversation.id}`}>
                <Conversation currentUser={currentUser} details={conversation} />
            </Route>
        ));
    }

    if (!fetched) fetchConversationList();
    return (
        <div className="chat-layout">
            <div className="chat-leftbar">
                <div className="tab-content" id="pills-tab-justifiedContent">
                </div>
            </div>
            <div className="chat-rightbar">
                <Switch>
                    <Route exact path={match.path}>
                        {
                            (conversationList.length > 0)? <Redirect to={`${match.path}/${conversationList[0].id}`}/>
                            :
                            errored? <h4>Oops! An error occurred.</h4>
                            :
                            <p>Let's start a conversation!</p>
                        }
                    </Route>
                    { getConversationRoutes() }
                    <Route>
                        <NotFoundPage />
                    </Route>
                </Switch>
            </div>
        </div>
    )
}