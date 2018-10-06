/**
 * Created by nandunb on 11/2/17.
 */

const mongoose = require('mongoose');

const storageSchema = new mongoose.Schema({
    username: { type:String, required:true },
    size: Number
});

module.exports = mongoose.model('Storage',storageSchema);