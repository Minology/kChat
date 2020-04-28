import React from 'react';

export default class VoiceCall extends React.Component {
    render() {
        return (
            <a href="#" data-toggle="modal" data-target="#incomingVoiceCall">
                <i className="feather icon-phone"></i>
            </a>
        )
    }
}