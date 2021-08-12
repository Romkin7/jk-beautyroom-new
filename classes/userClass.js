module.exports = class UserClass {
    constructor(data) {
        this.username = data.username || undefined;
        this.email = data.email || undefined;
        this.password = data.password || undefined;
    }
    filterUser() {
        for (const key in this) {
            if (this[key] === undefined) {
                delete this[key];
            }
        }
        return this;
    }
    validateUser(data) {
        return Object.keys(data).length === Object.keys(this).length;
    }
};