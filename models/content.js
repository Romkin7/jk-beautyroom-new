const { Schema, model } = require('mongoose');

const contentSchema = new Schema(
    {
        src: {
            type: String,
        },
        alt: { type: String },
        title: { type: String, required: true },
        body: { type: String, trim: true, required: true },
        publicId: { type: String },
        category: { type: String, required: true },
    },
    {
        timestamps: true,
        usePushEach: true,
    },
);

module.exports = model('Content', contentSchema);
