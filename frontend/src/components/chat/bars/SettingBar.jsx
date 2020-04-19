import React from 'react';
import SettingOption from '../../SettingOption.jsx';

export default function SettingBar() {
    const generalOptions = ["Notification Sounds", "New Message Alerts", "Show Mini Messages in Sidebar"];
    let getGeneralSettings = () => {
        return generalOptions.map((option, index) => <SettingOption key={index} name={option}/>);
    }

    const privacyOptions = ["Read Receipts", "Show Profile Picture", "Allow Messages from Strangers"];
    let getPrivacySettings = () => {
        return privacyOptions.map((option, index) => <SettingOption key={index} name={option} style="custom-switch"/>);
    }

    const designOptions = ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"];
    let getDesignSettings = () => {
        return designOptions.map((option, index) =>
            <div key={index} className={"form-check-inline checkbox-" + option}>
                <input type="checkbox" id={"customCheckboxInline" + (index + 5)} name="customCheckboxInline2"/>
                <label htmlFor={"customCheckboxInline" + (index + 5)}></label>
            </div>
        );
    }

    return (
        <div className="chat-settingbar">
            <div className="chat-left-headbar">
                <div className="row align-items-center">
                    <div className="col-9">
                        <ul className="list-unstyled mb-0">
                            <li className="media">
                                <img className="align-self-center mr-2" src="../../../../public/assets/images/logo.svg" alt="Generic placeholder image"/>
                                <div className="media-body">
                                    <h5 className="mb-0 mt-2">Setting</h5>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="col-3">
                        <div className="dropdown">
                            <a href="#" id="settingDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="feather icon-more-vertical-"></i>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="settingDropdown">
                                <a className="dropdown-item font-14" href="#">Reset to Defaults</a>
                                <a className="dropdown-item font-14" href="#">Backup</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="chat-left-body">
                <p className="setting-header">General Settings</p>
                <div className="general-setting">
                    { getGeneralSettings() }
                </div>
                <p className="setting-header">Privacy Settings</p>
                <div className="privacy-setting">
                    { getPrivacySettings() }
                </div>
                <p className="setting-header">Design Settings</p>
                <div className="design-setting custom-checkbox-button">
                    { getDesignSettings() }
                </div>
            </div>
        </div>
    )
}