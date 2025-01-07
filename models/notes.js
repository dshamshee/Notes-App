const mongoose = require('mongoose');

const notesSchema = mongoose.Schema({
    title: String,
    note: String,
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('note', notesSchema);