import React from 'react';

export default class ConversationListBar extends React.Component {
    render() {
        return (
            <div className="tab-pane fade show active" id="pills-chat-justified" role="tabpanel" aria-labelledby="pills-chat-tab-justified">
                <div className="chat-listbar">
                    <div className="chat-left-headbar">
                        <div className="row align-items-center">
                            <div className="col-9">
                                <ul className="list-unstyled mb-0">
                                    <li className="media">
                                        <img className="align-self-center mr-2" src="../../../../public/logo.svg" alt="Generic placeholder image"/>
                                        <div className="media-body">
                                            <h5 className="mb-0 mt-2">Chat</h5>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-3">
                                <a href="http://themesbox.in/admin-templates/gappa/html/dark/login.html" data-toggle="tooltip" data-placement="right" title="" data-original-title="Logout">
                                    <i className="feather icon-log-out"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}