import React from 'react';
import CaseConvertor from '../utils/CaseConvertor.js';

export default function Checkbox({ name, showName=false, style="custom-checkbox", checked=false, onChange}) {
    if (!onChange) checked=undefined;
    return (
        <div className={"custom-control " + style}>
            <input 
                name={name}
                type="checkbox"
                className="custom-control-input"
                id={CaseConvertor.camelCase(name)}
                checked={checked}
                onChange={onChange}/>
            <label className="custom-control-label" htmlFor={CaseConvertor.camelCase(name)}>
                {showName? name: undefined}
            </label>
        </div>
    )
}