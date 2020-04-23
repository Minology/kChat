import AxiosInstance from './services/Axios.js';

class Client {
    static instance = null;

    static getInstance() {
        if (!Client.instance) {
            Client.instance = new Client();
        }
        return Client.instance;
    }

    /**
     * Makes a GET request to the given API endpoint with the given params and
     * returns the response in JSON format,
     * or throws an error.
     * @param {String} endpoint
     * @param {Object} params
     */
    async _get(endpoint, params) {
        try {
            const response = AxiosInstance.get(endpoint, {params: params});
            return await response;
        } catch (e) {
            throw e;
        }
    }

    async getConversationList(username) {
        const params = {
            username: username,
        };
        
        return await this._get('chat/conv', params);
    }

    async _post(endpoint, data) {
        try {
            const response = AxiosInstance.post(endpoint, data);
            return await response;
        } catch (e) {
            throw e;
        }
    }

    async postLogin(email, password) {
        const data = {
            email: email,
            password: password,
        }

        return await this._post('accounts/login/', data);
    }

    async postSignup(username, email, password, repassword, firstName, lastName) {
        const data = {
            username: username,
            email: email,
            password1: password,
            password2: repassword,
            first_name: firstName,
            last_name: lastName,
        }

        return await this._post('accounts/registration/', data);
    }
}

const ClietInstance = Client.getInstance();

export default ClietInstance;