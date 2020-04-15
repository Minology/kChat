import React from 'react';
import {
    Switch,
    Route,
    Redirect,
    useRouteMatch
} from 'react-router-dom';
import Conversation from './Conversation.jsx';

export default function Chat() {
    let match = useRouteMatch();
    return (
        <div>
            <h1>Chat</h1>
            <Switch>
                <Route exact path={match.path}>
                    <Redirect to={`${match.path}/1`}/>
                </Route>
                <Route path={`${match.path}/:id`}>
                    <Conversation />
                </Route>
            </Switch>
        </div>
    )
}