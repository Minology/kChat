import React from 'react';
import Checkbox from './Checkbox.jsx';

export default function UserList({ userInfos=[], withCheckbox=false, checkedUsers={}, onChange, oneOnly=false, chosenUser }) {
    let getUserList = () => {
        return userInfos.map((userInfo, index) =>
            <li key={index} className="media">
                <img className="align-self-center rounded-circle" src="../../public/assets/images/boy.svg" alt="Generic placeholder image"/>
                <div className="media-body">
                    <h5><span>{userInfo.getFullName() + " (" + userInfo.username + ")"}</span></h5>
                    { userInfo.quote? <p>{userInfo.quote}</p>:undefined }
                    { userInfo.location? <p>{userInfo.location}</p>:undefined }
                </div>
                {
                    withCheckbox?
                    (oneOnly?
                    <Checkbox name={userInfo.username} checked={userInfo==chosenUser} onChange={onChange}/>
                    :
                    <Checkbox name={userInfo.username} checked={checkedUsers[userInfo.username]} onChange={onChange}/>):{}
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