import React from 'react';
import {
    Link
} from 'react-router-dom';
import Profile from '../../auth/Profile.jsx';

export default function ProfileBar({ userInfo, unauthenticate }) {
    return (
        <div className="chat-profilebar">
            <div className="chat-left-headbar">
                <div className="row align-items-center">
                    <div className="col-9">
                        <ul className="list-unstyled mb-0">
                            <li className="media">
                                <img className="align-self-center mr-2" src="../../../../public/assets/images/logo.svg" alt="Generic placeholder image"/>
                                <div className="media-body">
                                    <h5 className="mb-0 mt-2">My Profile</h5>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="col-3">
                        <Link 
                            to="/login"
                            data-toggle="tooltip"
                            data-placement="right"
                            title=""
                            data-original-title="Logout"
                            onClick={unauthenticate}
                        >
                            <i className="feather icon-log-out"></i>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="chat-left-body">
                <div className="profilebar">
                    <img className="profile-pic img-fluid" src="../../../../public/assets/images/men.svg" alt="profile-pic"/>
                    <div className="profile-edit">
                        <i className="feather icon-camera upload-button"></i>
                        <input className="profile-upload" type="file" accept="image/*"/>
                    </div>
                    <h5>{ userInfo? userInfo.getFullName(): "" }</h5>
                    <p className="mb-0">Ha Noi, Vietnam</p>
                </div>
                <div className="profile-detail">
                    <Profile userInfo={userInfo}/>
                </div>
            </div>
        </div>
    )
}