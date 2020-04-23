import React from 'react';
import {
    Switch,
    Route
} from 'react-router-dom';
import PrivateRoute from './PrivateRoute.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import HomePage from './home/HomePage.jsx';
import LoginPage from './auth/LoginPage.jsx';
import SignupPage from './auth/SignupPage.jsx';
import ForgotPasswordPage from './auth/ForgotPasswordPage.jsx';
import ChatPage from './chat/ChatPage.jsx';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: true
        };
    }

    authenticate = (callback) => {
        this.setState({ 
            isAuthenticated: true 
        });
        callback();
    }

    unauthenticate = () => {
        this.setState({
            isAuthenticated: false
        });
    }

    render() {
        const {
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
                    <Route exact path="/signup">
                        <SignupPage/>
                    </Route>
                    <Route exact path="/forgotpsw">
                        <ForgotPasswordPage/>
                    </Route>
                    <PrivateRoute authed={isAuthenticated} path="/chat">
                        <ChatPage unauthenticate={this.unauthenticate} />
                    </PrivateRoute>
                    <Route>
                        <NotFoundPage />
                    </Route>
                </Switch>
            </div>
        );
    }
}