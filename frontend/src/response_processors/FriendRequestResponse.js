export default class FriendRequestResponse {
    constructor(response, protocol) {
        if (protocol == "http" || protocol == "https") {
            this.fromUser = response.from_username;
            this.message = response.request_message;
        }
        if (protocol == "ws" || protocol == "wss") {
            this.fromUser = response.from_user;
            this.message = response.request_message;
        }
    }
}