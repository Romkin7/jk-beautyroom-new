module.exports = class ContentClass {
    constructor(data, publicId, secureUrl) {
        this.src = secureUrl || '';
        this.title = data.title || undefined;
        this.publicId = publicId || '';
        this.alt = 'JK Beauty Room - ' + data.title;
        this.category = data.category || undefined;
        this.body= data.body || undefined;
    }
    filterContent() {
        for (const key in this) {
            if (this[key] === undefined) {
                delete this[key];
            }
        }
        return this;
    }
    validateContent(data) {
        return Object.keys(data).length === Object.keys(this).length;
    }
};
