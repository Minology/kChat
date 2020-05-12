import React from 'react';
import SettingOption from '../../SettingOption.jsx';

export default class ConversationInfo extends React.Component {
    render() {
        const details = this.props.details;
        const isShown = this.props.isShown;
        const hide = this.props.hide;

        return (
            <div className={"chat-info" + (isShown? " show": "") }>
                    <div className="chat-info-head">
                        <div className="row align-items-center">
                            <div className="col-9">                                                
                                <h5>Conversation Info</h5>
                            </div>
                            <div className="col-3">
                                <ul className="list-inline float-right mb-0">
                                    <li className="list-inline-item">
                                        <a id="close-user-info" onClick={() => {hide();}}><i className="feather icon-x"></i></a>
                                    </li>
                                </ul>                                            
                            </div>
                        </div>
                    </div>
                    <div className="chat-info-body">
                        <div className="conversationbar">
                            <img className="conversation-pic img-fluid" src="../../../../public/assets/images/girl.svg" alt="conversation-pic"/> 
                            <h5>{details.title}</h5>
                        </div>
                        <div className="conversation-detail">
                            <p className="conversation-detail-header">People</p>
                            <div className="conversation-people">
                                <ul className="list-inline mb-0">
                                    <li className="list-inline-item">
                                        <a></a>
                                    </li>
                                </ul>
                            </div>
                            <p className="conversation-detail-header">Shared Files</p>
                            <div className="conversation-file">
                                <div className="user-media-slider slick-initialized slick-slider">
                                    <i className="feather icon-chevron-left slick-arrow"></i>
                                    <i className="feather icon-chevron-right slick-arrow"></i>
                                    <div className="slick-list draggable">
                                        <div className="slick-track">
                                            <div className="slick-slide" data-slick-index="0" aria-hidden="true" tabIndex="-1">
                                                <div>
                                                    <div className="conversation-file-slider-item">
                                                        <img src="../../../../public/assets/images/media_01.png" className="" alt="conversation-file"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="slick-slide" data-slick-index="1" aria-hidden="true">
                                                <div>
                                                    <div className="conversation-file-slider-item">
                                                        <img src="../../../../public/assets/images/media_02.png" className="" alt="conversation-file"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="slick-slide slick-current slick-active" data-slick-index="2" aria-hidden="false">
                                                <div>
                                                    <div className="conversation-file-slider-item">
                                                        <img src="../../../../public/assets/images/media_03.png" className="" alt="conversation-file"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="slick-slide slick-active" data-slick-index="3" aria-hidden="false">
                                                <div>
                                                    <div className="conversation-file-slider-item">
                                                        <img src="../../../../public/assets/images/media_04.png" className="" alt="conversation-file"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="slick-slide slick-active" data-slick-index="4" aria-hidden="false">
                                                <div>
                                                    <div className="conversation-file-slider-item">
                                                        <img src="../../../../public/assets/images/pdf.svg" className="" alt="conversation-file"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="slick-slide slick-active" data-slick-index="5" aria-hidden="false">
                                                <div>
                                                    <div className="conversation-file-slider-item">
                                                        <img src="../../../../public/assets/images/xls.svg" className="" alt="conversation-file"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="slick-slide slick-active" data-slick-index="6" aria-hidden="false" tabIndex="-1">
                                                <div>
                                                    <div className="conversation-file-slider-item">
                                                        <img src="../../../../public/assets/images/doc.svg" className="" alt="conversation-file"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="conversation-detail-header">Settings</p>
                            <div className="conversation-setting">
                                <SettingOption name="Mute Notification" style="custom-switch" />
                                <SettingOption name="Block Contact" style="custom-switch" />
                            </div>
                        </div>
                    </div>
            </div>
        );
    }
}