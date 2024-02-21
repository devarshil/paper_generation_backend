

const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sub: { type: String, required: true },
    std: { type: Number, required: true},
    sem: { type: Number, required: true },
    isLocked: { type: Boolean, required: true },
    created_at: {
        default: new Date(),
        type: Date
    },
    updated_at: {
        default: new Date(),
        type: Date
    },
    deleted_at: {
        default: null,
        type: Date
    }
});

module.exports = mongoose.model('Chapter', chapterSchema);