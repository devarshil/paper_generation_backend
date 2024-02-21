
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    chapter: { type: String, required: true },
    std: { type: Number, required: true},
    sem: { type: Number, required: true},
    sub: { type: String, required: true },
    marks: { type: Number, required: true },
    options: {
        a : String,
        b : String,
        c : String,
        d : String,
    },
    image_url: {type: String, required: false},
    answer: {type: String, required: false},
    isAnswered: {type: Boolean, required: true},
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

module.exports = mongoose.model('Question', questionSchema);