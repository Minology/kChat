import React from 'react';
import {
    useParams
} from 'react-router-dom';

export default function Conversation() {
    let { id } = useParams();
    return (
        <h3>Conversation { id }</h3>
    )
}