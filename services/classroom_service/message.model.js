/**
 * Created by yoosufaadil on 10/27/17.
 */
'use strict'

// Dependencies
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({

    class : {type:String,required:true},
    classtr : {type:String, required:true},
    message : {type:String, required:true}

});

const Message = mongoose.model('Message',MessageSchema);
module.exports = Message;