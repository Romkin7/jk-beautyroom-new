module.exports = class GalleryItemClass {
    constructor(data, publicId, secureUrl) {
        this.src = secureUrl || undefined;
        this.title = data.title || undefined;
        this.alt = "JK Beauty Room Tmi  - "+ data.title;
        this.publicId = publicId || undefined;
        this.category = data.category || undefined;
    }
    filterGalleryItem() {
        for (const key in this) {
            if (this[key] === undefined) {
                delete this[key];
            }
        }
        return this;
    }
    validateGalleryItem(data) {
        return Object.keys(data).length === Object.keys(this).length;
    }
};
