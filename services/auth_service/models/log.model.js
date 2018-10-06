const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({

    ldate: {type: Date, required: true},
    description: {type: String, required: true}

});

module.exports = mongoose.model('Log', LogSchema);