import React from 'react';
import {
    Switch,
    Route,
    useRouteMatch
} from 'react-router-dom';
import Chat from './Chat.jsx';
import ModalContainer from './modals/ModalContainer.jsx';
import NewConversationModal from './modals/NewConversationModal.jsx';

export default function ChatPage({ client, currentUser }) {
    let match = useRouteMatch();
    return (
        <Switch>
            <Route path={match.path}>
                <ModalContainer modalName="createGroup" fullname="Create Group">
                    <NewConversationModal currentUser={currentUser}/>
                </ModalContainer>
                <Chat client={client} currentUser={currentUser} />
            </Route>
        </Switch>
    )
}