import React from 'react';
import CaseConvertor from '../../../utils/CaseConvertor.js';

export default function ModalContainer({ children, modalName, fullname }) {
    return (
        <div className={"modal " + CaseConvertor.dash_case(modalName) + "-modal fade"}
            id={modalName}
            tabIndex="-1"
            role="dialog"
            aria-labelledby={modalName + "Title"}
            aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id={modalName + "Title"}>{fullname}</h5>
                        </div>
                        { children }
                    </div>
                </div>
        </div>
    )
}