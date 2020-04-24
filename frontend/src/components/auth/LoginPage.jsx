import React, { useState } from 'react';
import {
    useLocation,
    Link,
    Redirect
} from 'react-router-dom';
import AxiosInstance from '../../services/Axios.js';
import ClientInstance from '../../services/Client.js';
import AuthContainer from './AuthContainer.jsx';
import Checkbox from '../Checkbox.jsx';
import FormMesssage from '../FormMesssage.jsx';

export default function LoginPage({ unauthenticate, authenticate, remember, setRemember }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirectToReferer, setRedirectToReferer] = useState(false);
    const [error, setError] = useState("");

    let handleResponse = (response) => {
        AxiosInstance.defaults.headers['Authorization'] = "Token " + response.data.key;
        localStorage.setItem('refresh_token', response.data.key);
        authenticate(() => {
            setRedirectToReferer(true);
        });
    }

    let handleError = (error) => {
        if (!error.response) {
            console.error(error);
            return;
        }
        const errorObject = error.response.data;
        //console.error('An error occurred: ' + JSON.stringify(errorObject));
        if (Object.keys(errorObject).length == 0) return;
        const errorMessage = errorObject[Object.keys(errorObject)[0]][0];
        if (errorMessage == "E-mail is not verified.") {
            setError(errorMessage);
        }
        else setError("Incorrect email or password.");
    }

    let handleSubmit = (event) => {
        event.preventDefault();
        unauthenticate();
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
                        <FormMesssage type="error" message={error}/>
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