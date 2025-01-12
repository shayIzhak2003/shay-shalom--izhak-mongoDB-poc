const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    name: String,
    subject: String,
    description: String,
    isOpen: Boolean,
    waitingHours: Number,
});

// Create Mongoose Model
const Property = mongoose.model('Property', propertySchema);

module.exports = {Property};