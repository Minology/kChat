import React from 'react';

export default function Profile({ currentUser }) {
    const infos = [
        { name: "username", fullname: "Username", type: "text", icon: "icon-user", initialValue: currentUser },
        { name: "location", fullname: "Location", type: "text", icon: "icon-edit-1", initialValue: "Ha Noi, Vietnam" },
        { name: "status", fullname: "Status", type: "text", icon: "icon-message-square", initialValue: "I am a developer." },
        { name: "emailid", fullname: "Email ID", type: "email", icon: "icon-mail", initialValue: "demo@example.com"},
        { name: "password", fullname: "Password", type: "password", icon: "icon-lock", initialValue: "********"}
    ];

    let getProfile = () => {
        return infos.map((info, index) =>
            <li className="media" key={index}>
                <i className={"feather " + info.icon + " align-self-center"}></i>
                <div className="media-body">
                    <p>{ info.fullname }</p>
                    <div className="input-group">
                        <input 
                            type={info.type}
                            className="form-control"
                            value={ info.initialValue }
                            aria-label={ info.initialValue }
                            aria-describedby={ "button-addon-group-" + info.name }
                            onChange={(e) => {e.preventDefault();}}
                        />
                        <div className="input-group-append">
                            <button className="btn btn-link" type="button" id={ "button-addon-group-" + info.name }>Update</button>
                        </div>
                    </div>
                </div>
            </li>
        );
    }

    return (
        <ul className="list-unstyled mb-0">
            { getProfile() }
        </ul>
    )
}