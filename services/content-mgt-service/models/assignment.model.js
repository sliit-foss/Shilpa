/**
 * Created by nandunb on 10/17/17.
 */

'use strict';

const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    classroomId: {type: String, required: true},
    name: {type: String, required:true},
    description: { type: String },
    submissionDate: { type: Date }
});

module.exports = mongoose.model('Assignment', assignmentSchema);