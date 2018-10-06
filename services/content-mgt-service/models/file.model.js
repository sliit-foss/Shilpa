/**
 * Created by nandunb on 9/24/17.
 */
'use strict';

const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    key: { type:String, required:true },
    type: { type:String, required:true },
    owner: { type:String, required:true },
    parent: { type: String },
    children: [
        { type: String }

        ],
    size: Number,
    shared_with: [ { type: String }]
});

module.exports = mongoose.model('File',fileSchema);