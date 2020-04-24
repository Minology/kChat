import React, { useState } from 'react';

export default function ChatSearch({ handleSearch }) {
    const [query, setQuery] = useState("");

    let handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (handleSearch) handleSearch(query);
    }

    return (
        <div className="chat-left-search">
            <div className="input-group">
                <input
                    type="search"
                    className="form-control"
                    value={query}
                    placeholder="Search"
                    aria-label="Search"
                    aria-describedby="chat-left-search-btn"
                    onChange={(e) => {e.preventDefault(); setQuery(e.target.value);}}
                    onKeyPress={(e) => {if (e.key == 'Enter') handleSubmit(e);}}
                />
                <div className="input-group-append">
                    <button className="btn" onClick={handleSubmit}>
                        <i className="feather icon-search"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}