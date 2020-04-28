import React from 'react';
import {
    Switch,
    Route
} from 'react-router-dom';
import AxiosInstance from '../services/Axios.js';
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
            isAuthenticated: true,
            remember: true
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
        localStorage.removeItem('refresh_token');
        AxiosInstance.defaults.headers['Authorization'] = null;
    }

    setRemember = (remember) => {
        this.setState({
            remember: remember
        });
    }

    componentCleanup = () => {
        if (!this.state.remember) {
            localStorage.removeItem('refresh_token');
            AxiosInstance.defaults.headers['Authorization'] = null;
        }
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.componentCleanup);
    }

    componentWillUnmount() {
        this.componentCleanup();
        window.removeEventListener('beforeunload', this.componentCleanup);
    }

    render() {
        const {
            isAuthenticated,
            remember
        } = this.state;

        return (
            <div>
                <Switch>
                    <Route exact path="/">
                        <HomePage />
                    </Route>
                    <Route exact path="/login">
                        <LoginPage
                            unauthenticate={this.unauthenticate}
                            authenticate={this.authenticate}
                            remember={remember}
                            setRemember={this.setRemember}
                        />
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