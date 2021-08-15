module.exports = class UserClass {
    constructor(data, publicId, secureUrl) {
        this.src = secureUrl || undefined;
        this.alt = 'JK Beauty Room - ' + data.username;
        this.username = data.username || undefined;
        this.publicId = publicId || undefined;
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
