'use strict';

//Dependencies
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    "sClass": {type: String, required: true},
    "aDate": {type: Date, required: true},
    "attendanceRecodes": [{
        "sID": {type: String, required: true},
        "sName": {type: String, required: true},
        "aStatus": {type: Number, required: true}
    }]
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;