/**
 * Created by yoosufaadil on 10/25/17.
 */
'use strict'

// Dependencies
const mongoose = require('mongoose');

const ClassroomSchema = new mongoose.Schema({

    class: {type:String, required:true , unique:true},
    classtr: {type:String, required:true , unique:true},
});

const Classroom = mongoose.model('Classroom',ClassroomSchema);
module.exports = Classroom;