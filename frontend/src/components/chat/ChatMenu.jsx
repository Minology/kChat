import React from 'react';

export default function ChatMenu({ setTab }) {
    const tabs = [
        { name: "chat", icon: "icon-message-circle" },
        { name: "friends", icon: "icon-users" },
        { name: "profile", icon: "icon-user" },
        { name: "setting", icon: "icon-settings" }
    ];

    let getTabs = () => {
        return tabs.map((tab, index) =>
            <li className="nav-item" key={index}>
                <a 
                    className={"nav-link" + (index == 0? " active": "")}
                    id={"pills-" + tab.name + "-tab-justified"}
                    data-toggle="pill"
                    role="tab" 
                    aria-controls={"pills-" + tab.name + "-justified"}
                    aria-selected={index == 0? "true": "false"}
                    onClick={() => { setTab(tab.name) }}
                >
                    <i className={"feather " + tab.icon}></i>
                </a>
            </li>
        );
    }

    return (
        <div className="chat-menu">
            <ul className="nav nav-pills nav-justified mb-0" id="pills-tab-justified" role="tablist">
                { getTabs() }
            </ul>
        </div>
    )
}