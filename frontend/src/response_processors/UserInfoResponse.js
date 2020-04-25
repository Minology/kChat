export default class UserInfoResponse {
    constructor(response, protocol) {
        if (protocol == "http" || protocol == "https") {
            this.username = response.username;
            this.firstName = response.first_name;
            this.lastName = response.last_name;
            this.email = response.email;
            this.quote = response.quote;
            this.location = response.place;
            this.avatar = response.avatar;
        }
        if (protocol == "ws" || protocol == "wss") {
            this.username = response.username;
            this.firstName = response.first_name;
            this.lastName = response.last_name;
            this.email = response.email;
            this.quote = response.quote;
            this.location = response.place;
            this.avatar = response.avatar;
        }
    }

    getFullName = () => {
        return this.firstName + "  " + this.lastName;
    }
}