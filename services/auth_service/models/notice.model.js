const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({

    pdate: {type: Date, required: true},
    subject: {type: String, required: true},
    tags: [{tag: {type:String, required: false}}],
    description: {type: String, required: false}

});

module.exports = mongoose.model('Notice', NoticeSchema);