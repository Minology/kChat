import React from 'react';
import {
    Switch,
    Route
} from 'react-router-dom';
import PrivateRoute from './PrivateRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import WebSocketInstance from '../services/WebSocket';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            isAuthenticated: false
        };

        this.authenticate = this.authenticate.bind(this);
    }

    authenticate(username, cb) {
        this.setState({ 
            username: username,
            isAuthenticated: true 
        });
        //WebSocketInstance.connect();
        cb();
    }

    render() {
        const {
            username,
            isAuthenticated
        } = this.state;

        return (
            <div>
                <Switch>
                    <Route exact path="/">
                        <HomePage />
                    </Route>
                    <Route exact path="/login">
                        <LoginPage authenticate={this.authenticate} />
                    </Route>
                    <PrivateRoute authed={isAuthenticated} path="/chat">
                        <ChatPage currentUser={username} />
                    </PrivateRoute>
                    <Route>
                        <h1>404 Not found</h1>
                    </Route>
                </Switch>
            </div>
        );
    }
}