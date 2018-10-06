'use strict';

//Dependencies
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    "sClass": {type: String },
    "aDate": {type: Date},
    "attendanceRecodes": [{
        "sID": {type: String},
        "sName": {type: String},
        "aStatus": {type: Number}
    }]
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;