import axios from 'axios';
import config from '../config';

const AxiosInstance = axios.create({
    baseURL: config.API_PATH,
    timeout: 5000,
    headers: {
        'Authorization': localStorage.getItem('refresh_token') ? "JWT " + localStorage.getItem('refresh_token') : null,
        'Content-Type': 'application/json',
        'accept': 'application/json'
    }
});

export default AxiosInstance;