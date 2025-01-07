const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/notesApplication");

const userSchema = mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    picture: {
        type: Buffer,
        default: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
    },
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'notes',
        required: true
    }]
})


module.exports = mongoose.model('user', userSchema);