import React, { useState } from 'react';
import {
    useLocation,
    Redirect
} from 'react-router-dom';

export default function LoginPage({ authenticate }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirectToReferer, setRedirectToReferer] = useState(false);

    let location = useLocation();

    let { from } = location.state || { from: { pathname: "/" } };
    let handleSubmit = () => {
        authenticate(username, () => {
            setRedirectToReferer(true);
        });
    }

    if (redirectToReferer) {
        return (
            <Redirect to={from}/>
        )
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={username}
                placeholder="Username"
                onChange={e => setUsername(e.target.value)}
                required
            /><br/>
            <input
                type="password"
                value={password}
                placeholder="Password"
                onChange={e => setPassword(e.target.value)}
            /><br/>
            <button type="submit">Log in</button>
        </form>
    )
}