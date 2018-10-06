'use strict';

//Dependencies
const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
    "sID": {type: String, required: true},
    "sName": {type: String, required: true},
    "sClass": {type: String, required: true},
    "cTerm": {type: Number, required: true},
    "sLevel": {type: String, required: true},
    "sRemarks": {type: String, required: false},
    "sAverage": {type: String, required: true},
    "sGrades": [],
    "sRemarksTags": []
});

const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;