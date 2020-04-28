export default class MessageResponse {
    constructor(response, protocol) {
        if (protocol == "http" || protocol == "https") {
            this.id = response.id;
            this.conversationId = response.conversation;
            this.created_at = response.created_at;
            this.content = response.message;
            this.sender = response.sender_name;
            this.attachment_type = response.attachment_type;
        }
        if (protocol == "ws" || protocol == "wss") {
            this.id = response.id;
            this.conversationId = response.conversation;
            this.created_at = response.created_at;
            this.content = response.message;
            this.sender = response.sender;
            this.attachment_type = response.attachment_type;
        }
    }
}