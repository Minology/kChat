import React from 'react';

export default function ChatSearch() {
    return (
        <div className="chat-left-search">
            <div className="input-group">
                <input
                    type="search"
                    className="form-control"
                    placeholder="Search"
                    aria-label="Search"
                    aria-describedby="chat-left-search-btn"/>
                <div className="input-group-append">
                    <button className="btn" type="submit">
                        <i className="feather icon-search"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}