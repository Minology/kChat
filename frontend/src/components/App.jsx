import React from 'react';
import {
    Switch,
    Route
} from 'react-router-dom';
import LogIn from './LogIn.jsx'
import Chat from './Chat.jsx'

export default class App extends React.Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path="/login">
                        <LogIn />
                    </Route>
                    <Route path="/chat">
                        <Chat />
                    </Route>
                    <Route>
                        <h1>Not found</h1>
                    </Route>
                </Switch>
            </div>
        );
    }
}