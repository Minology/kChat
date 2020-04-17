import React from 'react';
import PropTypes from 'prop-types';
import {
    Switch,
    Route
} from 'react-router-dom';
import PrivateRoute from './PrivateRoute.jsx';
import Client from '../client.js';
import NotFoundPage from './NotFoundPage.jsx';
import HomePage from './home/HomePage.jsx';
import LoginPage from './auth/LoginPage.jsx';
import ChatPage from './chat/ChatPage.jsx';
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
                        <ChatPage client={this.props.client} currentUser={username} />
                    </PrivateRoute>
                    <Route>
                        <NotFoundPage />
                    </Route>
                </Switch>
            </div>
        );
    }
}

App.propTypes = {
	client: PropTypes.instanceOf(Client)
}