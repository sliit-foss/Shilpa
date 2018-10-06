'use strict'

const grade = require('./grade.model');

//Get all grade details
exports.getAllgradeDetails = function (req, res) {

    grade.find({}, function (err, docs) {

        if (err) {
            res.status(500).json({success: false, error: err, message: "Error Retrieving Data. !"});
        }

        else {
            res.json(docs);
        }

    })
};

//Get all grade details of a student by passing studentID
exports.getGradeDetails = function (req, res) {

    var id = req.params.id;

    grade.find({'sID': id}, function (err, docs) {

        if (docs == null) {
            res.status(500).json({success: false, error: err, message: "Error Retrieving Data. !"});
        }

        else {
            res.json(docs);
        }

    })
};

//Get all the grade details of a student by passing studentClass
exports.getGradeDetailsByClass = function (req, res) {

    var classname = req.params.classname;

    grade.find({'sClass': classname}, function (err, docs) {

        if (err) {
            res.status(500).json({success: false, error: err, message: "Error Retrieving Data. !"});
        }

        else {
            res.json(docs);
        }

    })
};

//Get all the grade details of a student by passing studentClass,StudentID,StudentTerm
exports.getGradeDetailsByFilter = function (req, res) {

    var classname = req.params.classname;
    var studentid = req.params.studentid;
    var term = req.params.term;

    grade.find({'sClass': classname, 'sID': studentid, 'cTerm': term}, function (err, docs) {

        if (err) {
            res.status(500).json({success: false, error: err, message: "Error Retrieving Data. !"});
        }

        else {
            res.json(docs);
        }

    })
};

// Update grade details of a student
exports.updateGradeDetails = function (req, res) {

    grade.update({sID: req.params.studentId, cTerm: req.params.cTerm, sClass: req.params.class}, {
        $set: {
            sName: req.body.sName,
            sLevel: req.body.sLevel,
            sRemarks: req.body.sRemarks,
            sGrades: req.body.sGrades,
            sAverage: req.body.sAverage,
            sRemarksTags: req.body.sRemarksTags
        }
    }, function (err) {

        if (err) {

            res.status(401).json({success: false, message: "Error Updating Grade Records!"});

        } else {

            res.status(200).json({success: true, message: "Grades updated!"});

        }

    })
};

//Save grade details of a student
exports.saveGradeDetails = function (req, res) {
    if (req.body.studentId == undefined || req.body.studentId == "")
        res.status(400).json({success: false, error: 'sID undefined'});
    else {
        var gradeObj = new grade();
        gradeObj.sID = req.body.studentId;
        gradeObj.sName = req.body.name;
        gradeObj.sClass = req.body.class;
        gradeObj.cTerm = req.body.cTerm;
        gradeObj.sLevel = req.body.level;
        gradeObj.sRemarks = req.body.remarksnote;
        gradeObj.sGrades = req.body.sGrades;
        gradeObj.sAverage = req.body.avg;
        gradeObj.sRemarksTags = req.body.remarks;

        gradeObj.save(function (err, data) {
            if (err) {
                res.status(500).json({success: false, error: err, message: "Error Recording Data. !"});
            }
            else {
                res.status(200).json({success: true, data: data, message: "Grades Successfully Recorded. !"});
            }
        })
    }
}




