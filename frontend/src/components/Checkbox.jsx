import React from 'react';
import CaseConvertor from '../utils/CaseConvertor.js';

export default function Checkbox({ name, style="custom-checkbox", checked=false, onChange}) {
    return (
        <div className={"custom-control " + style}>
            <input 
                name={name}
                type="checkbox"
                className="custom-control-input"
                id={CaseConvertor.camelCase(name)}
                defaultChecked={checked}
                onChange={onChange}/>
            <label className="custom-control-label" htmlFor={CaseConvertor.camelCase(name)}></label>
        </div>
    )
}