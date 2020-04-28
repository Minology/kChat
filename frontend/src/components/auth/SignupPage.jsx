import React, { useState } from 'react';
import {
    Link
} from 'react-router-dom';
import ClientInstance from '../../services/Client.js';
import AuthContainer from './AuthContainer.jsx';
import Checkbox from '../Checkbox.jsx';
import FormMesssage from '../FormMesssage.jsx';

export default function SignupPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRePassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [didAgree, setDidAgree] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");

    let handleResponse = (response) => {
        console.log(response.data.detail);
        setSuccessMessage(response.data.detail);
        setError("");
        setUsername("");
        setEmail("");
        setFirstName("");
        setLastName("");
        setDidAgree(false);
    }   

    let handleError = (error) => {
        setSuccessMessage("");
        if (!error.response) {
            console.error(error);
            return;
        }
        const errorObject = error.response.data;
        //console.error('An error occurred: ' + JSON.stringify(errorObject));
        if (Object.keys(errorObject).length == 0) return;
        setError(errorObject[Object.keys(errorObject)[0]][0]);
    }

    let handleSubmit = (event) => {
        event.preventDefault();
        if (!didAgree) return;
        ClientInstance.postSignup(username, email, password, repassword, firstName, lastName)
            .then(handleResponse)
            .catch(handleError);
        
        setPassword("");
        setRePassword("");
    }

    return (
        <AuthContainer authName="register">
            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-head">
                            <Link to="/" className="logo">
                                <img src="../../../public/assets/images/logo.svg" className="img-fluid" alt="logo"/>
                            </Link>
                        </div>                                        
                        <h4 className="text-primary my-4">Sign Up !</h4>
                        <FormMesssage type="success" message={successMessage}/>
                        <FormMesssage type="error" message={error}/>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                placeholder="Username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                            />
                        </div>
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
                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control"
                                id="re-password"
                                placeholder="Re-Type Password"
                                value={repassword}
                                onChange={e => setRePassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                id="firstname"
                                placeholder="First Name"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                id="lastname"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                            />
                        </div>
                        <div className="form-row mb-3">
                            <div className="col-sm-12">
                                <Checkbox
                                    name={"I Agree to Terms & Conditions of kChat"}
                                    showName={true}
                                    style="custom-checkbox text-left"
                                    checked={didAgree}
                                    onChange={(e) => {setDidAgree(e.target.checked)}}
                                    required={true}
                                />                             
                            </div>
                        </div>
                        <button type="submit" className="btn btn-success btn-lg btn-block font-18">Register</button>
                    </form>
                    <p className="mb-0 mt-3">{"Already have an account? "}
                        <Link to="/login">Log in</Link>
                    </p>
                </div>
            </div>
        </AuthContainer>
    )
}