'use strict'

const attendance = require('./attendance.model');


//Get all the attendance details by passing studentClass
exports.getAttendanceDetailsByFilter = function (req, res) {

    var sClass = req.params.sClass;
    var aDate = req.params.dateAttendance;


    attendance.find({'sClass': sClass, 'aDate': aDate}, function (err, docs) {

        if (err) {
            res.status(500).json({success: false, error: err, message: "Error Retrieving Data. !"});
        }

        else {
            res.json(docs);
        }

    })
};

//Save attendance details of a class
exports.saveAttendance = function (req, res) {
    if (req.body.sClass == "" || req.body.aDate == "")
        res.status(400).json({success: false, error: 'Date/Class undefined'});
    else {
        var attendanceObj = new attendance();
        attendanceObj.sClass = req.body.sClass;
        attendanceObj.aDate = req.body.aDate;
        attendanceObj.attendanceRecodes = req.body.attendanceRecodes;

        attendanceObj.save(function (err, data) {
            if (err) {
                res.status(500).json({success: false, error: err, message: "Error Recording Data. !"});
            }
            else {
                res.status(200).json({success: true, data: data, message: "Attendance Successfully Recorded. !"});
            }
        })
    }
}

//Get all attendance details
exports.getAttendanceDetails = function (req, res) {

    attendance.find({}, function (err, docs) {

        if (err) {
            res.status(500).json({success: false, error: err, message: "Error Retrieving Data. !"});
        }

        else {
            res.json(docs);
        }

    })
};