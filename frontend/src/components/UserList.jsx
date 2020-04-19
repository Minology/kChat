import React from 'react';
import Checkbox from './Checkbox.jsx';

export default function UserList({ excludedUsers=[], withCheckbox=false, checkedUsers={}, onChange }) {
    let users = ["userk", "userh", "usera", "usert", "admin"];
    users = users.filter((user) => excludedUsers.indexOf(user) < 0);

    let getUserList = () => {
        return users.map((user, index) =>
            <li key={index} className="media">
                <img className="align-self-center rounded-circle" src="../../public/assets/images/boy.svg" alt="Generic placeholder image"/>
                <div className="media-body">
                    <h5><span>{user}</span></h5>
                    <p></p>
                </div>
                {
                    withCheckbox?
                    <Checkbox name={user} checked={checkedUsers[user]} onChange={onChange}/>:{}
                }
            </li>
        );
    }

    return (
        <ul className="list-unstyled">
            { getUserList() }
        </ul>
    )
}