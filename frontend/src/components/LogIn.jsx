import React from 'react';

export default class LogIn extends React.Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit() {
    }

    render() {
        return (
            <form>
                <input placeholder="Username" type="text" />
                <input placeholder="Password" type="password" />
                <button onClick={this.onSubmit}>Submit</button>
            </form>
        )
    }
}