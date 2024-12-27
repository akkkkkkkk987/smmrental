const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    minQuantity: {
        type: Number,
        required: true,
        default: 1
    },
    maxQuantity: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Service', serviceSchema);