import React from 'react';
import Checkbox from './Checkbox.jsx';

export default function SettingOption({ name, style="custom-checkbox" }) {
    return (
        <div className="row align-items-center pb-3">
            <div className="col-9">
                <h6 className="mb-0">{name}</h6>
            </div>
            <div className="col-3 text-right">
               <Checkbox name={name} style={style}/>
            </div>
        </div>
    )
}