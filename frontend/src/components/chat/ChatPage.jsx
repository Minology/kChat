import React from 'react';
import {
    Switch,
    Route,
    useRouteMatch
} from 'react-router-dom';
import Chat from './Chat.jsx';

export default function ChatPage({ client, currentUser }) {
    let match = useRouteMatch();
    return (
        <Switch>
            <Route path={match.path}>
                <Chat client={client} currentUser={currentUser} />
            </Route>
        </Switch>
    )
}