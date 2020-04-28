import React from 'react';
import {
    Route,
    Redirect
} from 'react-router-dom';

// A wrapper for <Route> that redirects to the login screen
// if the user is not yet authenticated.

export default function PrivateRoute({ children, authed, ...rest }) {
    return (
        <Route
            {...rest}
            render = {({ location }) =>
                authed ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}