import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from "./components/App.jsx";
import Client from "./client.js";

const BASE_URL = 'http://localhost:8000/';
var client = new Client(BASE_URL);

ReactDOM.render(
    <Router>
        <App client={client}/>
    </Router>,
    document.getElementById("root"));