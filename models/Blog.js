const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: String,
        required: true,
        unique: true
    }
});

const BlogModel = mongoose.model('Blog', BlogSchema);
module.exports = BlogModel;
