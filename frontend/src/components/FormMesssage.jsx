import React from 'react';

export default function FormMessage({ type="info", message}) {
    return (
        <div>
            {message && message != ""?
            <div className={"alert alert-" + (type=="error"? "danger": type)}>{ message }</div>:undefined
            }
        </div>
    )
}