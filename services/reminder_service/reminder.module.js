
'use strict'
// Dependencies
const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
    reminderId: {type:Number, required:true, unique:true},
    title:{type:String, required:true},
    username: {type:String, required:true},
    insertedDate: {type:Date, required:true},
    remindDate:{type:Date, required:true},
    description: {type:String, required:true}

});

ReminderSchema.pre('save', function (next,err) {
    if (err)
        return next(err);

    else {
        next();
    }
});

module.exports = mongoose.model('Reminder',ReminderSchema);

