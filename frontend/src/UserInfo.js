export default class UserInfo {
    constructor(id, username, firstName, lastName, email, quote, location, avatar) {
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.quote = quote;
        this.location = location;
        this.avatar = avatar;
    }

    getFullName = () => {
        return this.firstName + "  " + this.lastName;
    }
}