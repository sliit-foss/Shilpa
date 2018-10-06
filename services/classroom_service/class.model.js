/**
 * Created by yoosufaadil on 9/21/17.
 */
'use strict'

// Dependencies
const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({

    sname: {type:String,required:true},
    admissionNo: {type:String, required:true , unique:true},
    class: {type: String}

});

const Student = mongoose.model('Student',StudentSchema);
module.exports = Student;