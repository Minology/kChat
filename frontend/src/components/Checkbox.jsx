import React from 'react';

export default function Checkbox({ name, style="custom-checkbox" }) {
    let camelCase = (str) => {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
            { 
                return index == 0 ? word.toLowerCase() : word.toUpperCase(); 
            }).replace(/\s+/g, ''); 
    }

    return (
        <div className="row align-items-center pb-3">
            <div className="col-9">
                <h6 className="mb-0">{name}</h6>
            </div>
            <div className="col-3 text-right">
                <div className={"custom-control " + style}>
                    <input type="checkbox" className="custom-control-input" id={camelCase(name)}/>
                    <label className="custom-control-label" htmlFor={camelCase(name)}></label>
                </div>
            </div>
        </div>
    )
}