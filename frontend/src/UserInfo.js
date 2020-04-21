export default class UserInfo {
    constructor(id, username, firstName, lastName, email, quote, location) {
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.quote = quote;
        this.location = location;
    }

    getFullName = () => {
        return this.firstName + "  " + this.lastName;
    }
}