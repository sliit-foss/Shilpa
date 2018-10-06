'use strict'

// Dependencies
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {type:String, lowercase:true, required:true, unique:true},
    password: {type:String, required:true},
    name: {type:String, required:true},
    email: {type:String, lowercase:true, required:true, unique:true},
    permission: {type:String, required:true},
    studentId: {type:String},
    class: {type:String},
    level: {type:String}
});

module.exports = mongoose.model('User',UserSchema);