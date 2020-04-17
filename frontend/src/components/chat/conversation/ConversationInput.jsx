import React from 'react';

export default class ConversationInput extends React.Component {
    render() {
        return (
            <div className="chat-messagebar">
                <form>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <a href="#" id="button-addonmic">
                                <i className="feather icon-mic"></i>
                            </a>
                        </div>  
                        <input type="text" className="form-control" placeholder="Type a message..." aria-label="Text"/>
                        <div className="input-group-append">
                            <a href="#" className="mr-3" id="button-addonlink">
                                <i className="feather icon-paperclip"></i>
                            </a>
                            <a href="#" id="button-addonsend">
                                <i className="feather icon-send"></i>
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}