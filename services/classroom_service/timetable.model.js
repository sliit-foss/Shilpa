/**
 * Created by yoosufaadil on 9/30/17.
 */
'use strict'

// Dependencies
const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({

    class: {type:String,required:true, unique:true},
    monday: [{subject:{type:String, required:true}}],
    tuesday: [{subject:{type:String, required:true}}],
    wednesday: [{subject:{type:String, required:true}}],
    thursday: [{subject:{type:String, required:true}}],
    friday: [{subject:{type:String, required:true}}]

});

const Timetable = mongoose.model('Timetable',TimetableSchema);
module.exports = Timetable;