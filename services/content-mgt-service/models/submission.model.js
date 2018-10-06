/**
 * Created by nandunb on 10/24/17.
 */

'use strict';

const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment'},
    username: {type:String, lowercase:true, required:true},
    files:[String],
    dateOfSubmission: { type: Date, required: true }
});

module.exports = mongoose.model("Submission", submissionSchema);