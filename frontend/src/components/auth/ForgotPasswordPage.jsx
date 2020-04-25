import React, { useState } from 'react';
import {
    useLocation,
    Link,
    Redirect
} from 'react-router-dom';
import AuthContainer from './AuthContainer.jsx';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [redirectToReferer, setRedirectToReferer] = useState(false);
    const [errored, setErrored] = useState(false);

    let handleResponse = (response) => {
        console.log(response);
    }   

    let handleError = (error) => {
        setErrored(true);
        console.log('An error occurred: ' + error);
    }

    let handleSubmit = (event) => {
        event.preventDefault();
    }

    let location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };
    if (redirectToReferer) {
        return (
            <Redirect to={from}/>
        )
    }

    return (
        <AuthContainer authName="forgot-password">
            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-head">
                            <Link to="/" className="logo">
                                <img src="../../../public/assets/images/logo.svg" className="img-fluid" alt="logo"/>
                            </Link>
                        </div>                                        
                        <h4 className="text-primary my-4">Forgot Password ?</h4>
                        <p className="mb-4">Enter the email address below to receive reset password instructions.</p>
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
                        <button type="submit" className="btn btn-success btn-lg btn-block font-18">Send Email</button>
                    </form>
                    <p className="mb-0 mt-3">{"Remember Password? "}
                        <Link to="/login">Log in</Link>
                    </p>
                </div>
            </div>
        </AuthContainer>
    )
}