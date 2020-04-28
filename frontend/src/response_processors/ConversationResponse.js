export default class ConversationResponse {
    constructor(response, protocol) {
        if (protocol == "http" || protocol == "https") {
            this.id = response.id;
            this.title = response.title;
            this.creator = response.creator_name;
            this.created_at = response.created_at;
        }
        if (protocol == "ws" || protocol == "wss") {
            this.id = response.conversation_id;
            this.title = response.title;
            this.creator = response.creator_name;
            this.created_at = response.created_at;
        }
    }
}