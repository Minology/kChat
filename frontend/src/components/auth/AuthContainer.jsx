import React from 'react';

export default function AuthContainer({ children, authName}) {
    return (
        <div id="containerbar" className="containerbar authenticate-bg">
            <div className="container">
                <div className={"auth-box " + authName + "-box"}>
                    <div className="row no-gutters align-items-center justify-content-center">
                        <div className="col-md-6 col-lg-5">
                            <div className="auth-box-right">
                                { children }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}