import React, { useState } from 'react';
import {
    useLocation,
    Link,
    Redirect
} from 'react-router-dom';
import AuthContainer from './AuthContainer.jsx';
import ClientInstance from '../../Client.js';
import Checkbox from '../Checkbox.jsx';
import AxiosInstance from '../../services/Axios.js';

export default function LoginPage({ authenticate }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [redirectToReferer, setRedirectToReferer] = useState(false);
    const [errored, setErrored] = useState(false);

    let handleResponse = (response) => {
        if (remember) {
            AxiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.key;
            localStorage.setItem('refresh_token', response.data.key);
        }
        authenticate('newl', () => {
            setRedirectToReferer(true);
        });
    }

    let handleError = (error) => {
        setErrored(true);
        console.error('An error occurred: ' + error);
    }

    let handleSubmit = (event) => {
        event.preventDefault();
        ClientInstance.postLogin(email, password)
            .then(handleResponse)
            .catch(handleError);
    }

    let location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };
    if (redirectToReferer) {
        return (
            <Redirect to={from}/>
        )
    }

    return (
        <AuthContainer authName="login">
            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-head">
                            <Link to="/" className="logo">
                                <img src="../../../public/assets/images/logo.svg" className="img-fluid" alt="logo"/>
                            </Link>
                        </div>                                        
                        <h4 className="text-primary my-4">Log in !</h4>
                        <div className="form-group">
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-row mb-3">
                            <div className="col-sm-6">
                                <Checkbox
                                    name="Remember Me"
                                    showName={true}
                                    style="custom-checkbox text-left"
                                    checked={remember}
                                    onChange={(e) => {setRemember(e.target.checked)}}
                                />                            
                            </div>
                            <div className="col-sm-6">
                                <div className="forgot-psw"> 
                                    <Link to="/forgotpsw" id="forgot-psw" className="font-14">Forgot Password?</Link>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-success btn-lg btn-block font-18">Log in</button>
                    </form>
                    <p className="mb-0 mt-3">{"Don't have a account? "}
                        <Link to="/signup">Sign up</Link>
                    </p>
                </div>
            </div>
        </AuthContainer>
    )
}