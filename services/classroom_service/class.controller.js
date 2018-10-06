/**
 * Created by yoosufaadil on 9/21/17.
 */
'use strict'

const Student = require('./class.model.js');
const Timetable = require('./timetable.model.js');
const Lessonplan = require('./lessonplan.model.js');
const Classroom = require('./classroom.model');
const Message = require('./message.model');
const User = require('./user.model');


exports.addStudent = function (req,res){
    const student = new Student();
    student.sname = req.body.sname;
    student.admissionNo = req.body.admissionNo;
    student.class = req.body.class;

    if (req.body.sname == null || req.body.sname == ""){

        res.status(406).json({ success:false, message:'Name is not set'});

    }else if (req.body.admissionNo == null || req.body.admissionNo == ""){

        res.status(406).json({ success:false, message: 'Admission Number is not set'});

    }else{

        student.save(function(err){
            if (err){

                res.status(406).json({ success:false, message:'Admission Number already exists'});

            } else{

                res.status(201).json({ success:true, message: 'Student Added!'});

            }
        });
    }
}

// Add Timetable
exports.addTimetable = function (req,res) {
    const timetable = new Timetable(req.body);

    timetable.save(function(err){
        if (err){

            res.status(406).json({ success:false, message:'Time Table already exists for this class'});

        } else{

            res.status(201).json({ success:true, message: 'Timetable Added!'});

        }
    });

}

// Add Lessonplan
exports.addLessonplan = function (req,res) {
    const lessonplan = new Lessonplan(req.body);

    lessonplan.save(function(err){
        if (err){

            res.status(406).json({ success:false, message:'Lesson plan already exists for this class'});

        } else{

            res.status(201).json({ success:true, message: 'Lessonplan Added!'});

        }
    });

}

// Delete Student Function
exports.deleteStudentbyAdmissionNo = function(req,res){

    if (!req.params.admissionNo) {

        res.status(401).json({success: false, message: "Admission No is not set!"});
        return;

    }

    Student.findOneAndRemove({ admissionNo: req.params.delete }).exec(function(err,data) {
        if (err) {

            res.status(304).json({success: false, message: "Could not delete Student record!"});

        }

        res.status(200).json({ success:true, message: "Student deleted!"});

    });

};

// Get All Students
exports.getStudents = function(req,res){
    Student.find({},function(err, getStudents){
        if(err){

            res.json({ success:false, message: "Could not retrieve Students"})

        }else{

            res.json(getStudents);

        }
    })
};

// Get student by class
exports.getStudentsbyClass = function(req, res){
    User.find({ class: req.params.class, permission: "student"}).exec().then(results => {

        res.json(results);

    }, err => {

        console.error(err);
        res.send(err);

    });
};

// Get Timetables
exports.getTimetables = function(req,res) {
    Timetable.find({},function(err, getTimetables) {
        if(err) {

            res.json({ success : false, message : "Could not retrieve Timetable"})

        } else {

            res.json(getTimetables);

        }
    })
}

// Get Timetable
exports.getTimetable = function(req,res) {
    Timetable.findOne({"class": req.params.class},function(err, getTimetable) {

        res.json(getTimetable);

    })
}

// Get Lessonplans
exports.getLessonplans = function(req,res) {
    Lessonplan.find({},function(err, getLessonplans) {

        res.json(getLessonplans);

    })
}

// Get Lessonplan
exports.getLessonplan = function(req,res) {

    Lessonplan.findOne({"class": req.params.class},function(err, getLessonplan) {

        res.json(getLessonplan);

    })
}

// Update timetable for specified class
exports.updateTimetable = function(req, res) {

    Timetable.update({class: req.params.class}, {

        $set: {
            monday : req.body.monday,
            tuesday : req.body.tuesday,
            wednesday : req.body.wednesday,
            thursday : req.body.thursday,
            friday : req.body.friday
        }

    }, function (err) {

        res.status(201).json({success: true, message: "Timetable updated!"});

    })
};

// Update lessonplan for specified class
exports.updateLessonplan = function(req, res) {

    Lessonplan.update({class: req.params.class}, {

        $set: {
            term1 : req.body.term1,
            term2 : req.body.term2,
            term3 : req.body.term3
        }

    }, function (err) {

        res.status(201).json({success: true, message: "Lessonplan updated!"});

    })
};

// Add Classroom
exports.addClassroom = function (req,res){
    const classroom = new Classroom();
    classroom.class = req.body.class;
    classroom.classtr = req.body.classtr;

    if (req.body.class == null || req.body.class == ""){

        res.status(406).json({ success:false, message:'Class is not set'});

    }else if (req.body.classtr == null || req.body.classtr == ""){

        res.status(406).json({ success:false, message: 'Class Teacher is not set'});

    }else{

        classroom.save(function(err){
            if(err) {
                res.status(406).json({success: false, message : 'Class or Class Teacher already exists'});
            }
            else {
                res.status(201).json({success: true, message: 'Classroom Added!'});

            }
        });
    }
};

// Get Classroom
exports.getClassroom = function(req,res) {
    Classroom.find({},function(err, getClassroom) {
        /*if(err) {

         res.json({ success : false, message : "Could not retrieve Class"})

         } else {*/

        res.json(getClassroom);

        //}
    })
};

// Delete Student Function
exports.deleteClassroom = function(req,res){

    Classroom.findOneAndRemove({ class: req.params.delete }).exec(function(err,data) {

        res.status(200).json({ success:true, message: "Class deleted!"});

    });

};

// Add Classroom
/*
 exports.sendMessage = function (req,res){
 const message = new Message();
 message.class = req.body.class;
 message.classtr = req.body.classtr;
 message.message = req.body.message;

 if (req.body.class == null || req.body.class == ""){

 res.status(406).json({ success:false, message:'Class is not set'});

 }else if (req.body.classtr == null || req.body.classtr == ""){

 res.status(406).json({ success:false, message: 'Class Teacher is not set'});

 }else if (req.body.message == null || req.body.message == "") {

 res.status(406).json({success: false, message: 'Message is not set'});

 }else {

 message.save(function(err){
 if (err){

 res.status(406).json({ success:false, message:'Your Message cannot be sent'});

 } else{

 res.status(201).json({ success:true, message: 'Message sent!'});

 }
 });
 }
 };
 */



