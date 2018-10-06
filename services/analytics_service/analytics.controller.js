'use strict'
// Models
const Analytics = require('./analytics.module.js');
const User = require('./user.model.js');
const Grade = require('./grade.model.js');
const Attendance = require('./attendance.model');

/*
 exports.getGradeDetails = function (req, res) {

 var inputParms = (req.params.requestDetails).split("&");

 //check request
 if(inputParms[0] == "class"){
 Analytics.find({'sClass':inputParms[1]})
 }
 if(inputParms[0] == "student"){

 }

 } */

exports.getinitialDetails = function (req, res) {

    var studentName = req.params.username;

    User.find({'username':studentName },function (err,docs) {

        var studentID = docs[0].studentId;

        if(err){
            res.status(503).json({ success:false, message:'Server error.Try again later'});
        }else{

            Grade.find({'sID':studentID},function (err,details) {

                if(err){

                    res.status(503).json({ success:false, message:'Server error.Try again later'});
                }
                else{
                    res.status(200).json({success:true, message:details});
                }

            })
        }

    })
}

exports.getSelectedStudentDetails = function (req, res) {


    Grade.find({'sID':req.params.sId},function (err,details) {

        if(err){

            res.status(503).json({ success:false, message:'Server error.Try again later'});
        }
        else{
            res.status(200).json({success:true, message:details});
        }

    })

}

exports.getclass = function (req, res) {

    Grade.find({},function (err,details) {

        if(err){

            res.status(503).json({ success:false, message:'Server error.Try again later'});
        }
        else{
            res.status(200).json({success:true, message:details});
        }

    })
}

exports.getCurrentClass = function (req, res) {

    User.find({'username':req.params.username},function (err,data) {

        if(err){

            res.status(503).json({ success:false, message:'Server error.Try again later'});
        }
        else{

            res.status(200).json({success:true, message:data});
        }
    })
}


exports.getAllMarks = function (req, res) {

    var selectedClass = req.body.class;
    var selectedTerm = req.body.term;
    var selectedSubject = req.body.subject;

    Grade.find({'sClass':selectedClass,'cTerm':selectedTerm},function (err,data) {

        if(err){
            res.status(503).json({ success:false, message:'Server error.Try again later'});
        }
        else{
            res.status(200).json({success:true,message:data});
        }


    })
};

exports.getStudentNames = function (req, res) {

    Grade.find({},function (err,data) {

        if(err){

            res.status(503).json({ success:false, message:'Server error.Try again later'});
        }
        else{

            res.status(200).json({success:true,message:data});
        }
    })
}

exports.getAttendanceStudentNames = function (req, res) {

    Attendance.find({},function (err, data) {

        if(err){

            res.status(503).json({ success:false, message:'Server error.Try again later'});
        }
        else{

            res.status(200).json({success:true, message:details});
        }
    })
}

exports.getAttendance = function (req, res) {

    Attendance.find({},function (err,details) {

        if(err){

            res.status(503).json({ success:false, message:'Server error.Try again later'});

        }
        else{

            res.status(200).json({success:true, message:details});
        }
    })
}

