import React from 'react';

export default class ChatMenu extends React.Component {
    render() {
        return (
            <div className="chat-menu">
                <ul className="nav nav-pills nav-justified mb-0" id="pills-tab-justified" role="tablist">
                    <li className="nav-item">
                        <a 
                            className="nav-link active" 
                            id="pills-chat-tab-justified" 
                            data-toggle="pill" 
                            href="http://themesbox.in/admin-templates/gappa/html/dark/index.html#pills-chat-justified" 
                            role="tab" 
                            aria-controls="pills-chat-justified" 
                            aria-selected="true">
                            <i className="feather icon-message-circle"></i>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a 
                            className="nav-link" 
                            id="pills-addchat-tab-justified" 
                            data-toggle="pill" 
                            href="http://themesbox.in/admin-templates/gappa/html/dark/index.html#pills-addchat-justified" 
                            role="tab" 
                            aria-controls="pills-addchat-justified" 
                            aria-selected="false">
                            <i className="feather icon-edit-1"></i>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a 
                        className="nav-link" 
                        id="pills-profile-tab-justified" 
                        data-toggle="pill" 
                        href="http://themesbox.in/admin-templates/gappa/html/dark/index.html#pills-profile-justified" 
                        role="tab" 
                        aria-controls="pills-profile-justified" 
                        aria-selected="false">
                            <i className="feather icon-user"></i>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a 
                        className="nav-link" 
                        id="pills-setting-tab-justified" 
                        data-toggle="pill" 
                        href="http://themesbox.in/admin-templates/gappa/html/dark/index.html#pills-setting-justified" 
                        role="tab" 
                        aria-controls="pills-setting-justified" 
                        aria-selected="false">
                            <i className="feather icon-settings"></i>
                        </a>
                    </li>
                </ul>
            </div>
        )
    }
}