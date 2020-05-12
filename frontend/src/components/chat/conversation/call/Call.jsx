import React from 'react';
import VoiceCall from './VoiceCall.jsx';
import VideoCall from './VideoCall.jsx';
import ConversationMenu from '../ConversationMenu.jsx';

export default class Call extends React.Component {
    render() {
        const icons = [
            <VoiceCall />,
            <VideoCall />,
            <ConversationMenu showConversationInfo={this.props.showConversationInfo}/>,
            <a href="#" className="back-arrow">
                <i className="feather icon-x"></i>
            </a>
        ];

        return (
            <ul className="list-inline float-right mb-0">
                {icons.map((icon, i) => (
                    <li key={i} className="list-inline-item">{ icon }</li>
                ))}
            </ul>
        );
    }
}