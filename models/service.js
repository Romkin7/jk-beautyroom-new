const { Schema, model } = require('mongoose');

const serviceSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        additional: { type: String },
        price: {
            type: Number,
            required: true,
        },
        secondPrice: {
            type: Number,
        },
        discountedPrice: { type: Number },
        hourlyPrice: { type: Boolean, default: false },
        category: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
        usePushEach: true,
    },
);

module.exports = model('Service', serviceSchema);
