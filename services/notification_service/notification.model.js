'use strict'

// Dependencies
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    notificationId: {type:Number, required:true, unique:true},
    username: {type:String, required:true},
    class: {type:String, required:true},
    publishedDateTime: {type:Date, required:true},
    description: {type:String, required:true},
    title: {type:String, required:true}

});

NotificationSchema.pre('save', function (next,err) {
    if (err)
        return next(err);

    else {
        next();
    }
});

module.exports = mongoose.model('Notification',NotificationSchema);