module.exports = class ServiceClass {
    constructor(data) {
        this.name = data.name || undefined;
        this.additional = data.additional || undefined;
        this.price = data.price || undefined;
        this.secondPrice = data.secondPrice || undefined;
        this.hourlyPrice = data.hourlyPrice ? true : false;
        this.category = data.category || undefined;
    }
    filterService() {
        for (const key in this) {
            if (this[key] === undefined) {
                delete this[key];
            }
        }
        return this;
    }
    validateService(data) {
        return Object.keys(data).length === Object.keys(this).length;
    }
};
