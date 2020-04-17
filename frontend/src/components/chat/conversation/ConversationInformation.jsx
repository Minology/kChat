import React from 'react';

export default class ConversationInformation extends React.Component {
    render() {
        return (
            <div className="dropdown">
                <a href="#" className="" id="chatDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i className="feather icon-more-vertical-"></i>
                </a>
                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="chatDropdown">
                    <a className="dropdown-item font-14" href="#" id="view-user-info">View User Info</a>
                    <a className="dropdown-item font-14" href="#">Search</a>
                    <a className="dropdown-item font-14" href="#">Archive</a>
                    <a className="dropdown-item font-14" href="#">Mute</a>
                    <a className="dropdown-item font-14" href="#">Export Chat</a>
                    <a className="dropdown-item font-14" href="#">Clear Message</a>
                </div>
            </div>
        );
    }
}