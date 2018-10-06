'use strick'

//Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Controllers
const analyticsController = require('./analytics.controller.js');


const app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Allow cross-origin resource sharing
app.use(cors());

// Setting a port to server to listen on
var port = process.env.PORT || 9011;

// Connecting to remote MongoDB instance
mongoose.connect('mongodb://cyb-isuru:pass123$@ds141264.mlab.com:41264/cyborgs-lms',function(){
    console.log('Connected to MongoDB');

}, function(err) {
    throw new Error(err);
});


app.listen(port, function (err) {

    if (err) {
        throw new Error(err);
    } else {
        console.log("Server is listening on " + port);
    }
});
// Routes
//app.get('/analytics/grade/:requestDetails',analyticsController.getGradeDetails);
app.get('/analytics/student/initDetails/:username',analyticsController.getinitialDetails);
app.post('/analytics/student/marks',analyticsController.getAllMarks);
app.get('/analytics/student',analyticsController.getStudentNames);
app.get('/analytics/student/class',analyticsController.getclass);
app.get('/analytics/student/history/:sId',analyticsController.getSelectedStudentDetails);
app.get('/analytics/student/attendance',analyticsController.getAttendance);
app.get('/analytics/student/class/:username',analyticsController.getCurrentClass);

//for testing
module.exports = app;
