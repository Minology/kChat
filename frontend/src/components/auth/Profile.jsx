import React from 'react';

export default function Profile({ userInfo={} }) {
    const infos = [
        { name: "username", fullname: "Username", type: "text", icon: "icon-user", value: userInfo.username, readOnly: true },
        { name: "location", fullname: "Location", type: "text", icon: "icon-edit-1", value: userInfo.location, readOnly: false },
        { name: "status", fullname: "Status", type: "text", icon: "icon-message-square", value: userInfo.quote, readOnly: false },
        { name: "emailid", fullname: "Email ID", type: "email", icon: "icon-mail", value: userInfo.email, readOnly: true },
        { name: "password", fullname: "Password", type: "password", icon: "icon-lock", value: "********", readOnly: false }
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
                            defaultValue={ info.value }
                            readOnly={ info.readOnly }
                            aria-label={ info.initialValue }
                            aria-describedby={ "button-addon-group-" + info.name }
                        />
                        {
                            info.readOnly? undefined:
                            <div className="input-group-append">
                                <button className="btn btn-link" type="button" id={ "button-addon-group-" + info.name }>Update</button>
                            </div>
                        }
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