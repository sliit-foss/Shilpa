/**
 * Created by yoosufaadil on 9/30/17.
 */
'use strict'

// Dependencies
const mongoose = require('mongoose');

const LessonplanSchema = new mongoose.Schema({

    class : {type:String,required:true, unique:true},
    term1 : [{subject:{type:String, required:true},unit:{type:String, required:true}}],
    term2 : [{subject:{type:String, required:true},unit:{type:String, required:true}}],
    term3 : [{subject:{type:String, required:true},unit:{type:String, required:true}}]

});

const Lessonplan = mongoose.model('Lessonplan',LessonplanSchema);
module.exports = Lessonplan;