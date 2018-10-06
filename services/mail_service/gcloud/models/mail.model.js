const mongoose = require('mongoose');

const mailSchema = new mongoose.Schema({

    subject:{type: String, required: true},
    from:{type: String, required: true},
    to:{type: String, required: true},
    message:{type: String, required: false},
    date: {type: String, required: true},
    type: {type: String, required: false, default: "unread"}

});

module.exports = mongoose.model('Mail', mailSchema);