import React from 'react';

export default class ConversationInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: ''
        }
    }

    handleChange = (event) => {
        this.setState({ message: event.target.value});
    }

    handleSubmit = (event) => {
        this.props.sendMessage(this.state.message);
        this.setState({message: ''});
        event.preventDefault();
    }

    render() {
        const message = this.state.message;
        return (
            <div className="chat-messagebar">
                <form onSubmit={this.handleSubmit}>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <a href="#" id="button-addonmic">
                                <i className="feather icon-mic"></i>
                            </a>
                        </div>  
                        <input 
                            type="text"
                            value={message}
                            className="form-control" 
                            placeholder="Type a message..."
                            onChange={this.handleChange}
                            aria-label="Text"
                            ref="input"
                        />
                        <div className="input-group-append">
                            <a href="#" className="mr-3" id="button-addonlink">
                                <i className="feather icon-paperclip"></i>
                            </a>
                            <a id="button-addonsend" onClick={this.handleSubmit}>
                                <i className="feather icon-send" type="submit"></i>
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}