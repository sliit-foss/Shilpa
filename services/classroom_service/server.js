/**
 * Created by yoosufaadil on 9/21/17.
 */

// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Controllers
const classController = require('./class.controller');
const config = require('./_config');

const app = express();

app.use(express.static(__dirname));

// Allow cross-origin resource sharing
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Setting a port to server to listen on
var port = process.env.PORT || 9003;

// Connecting to remote MongoDB instance
mongoose.connect(config.mongoURI[app.settings.env],function(){

    console.log('Connected to MongoDB : ' + app.settings.env);

}, function(err) {
    throw new Error(err);
});

// Listening to port 9003
app.listen(port, function (err) {

    if (err) {
        throw new Error(err);
    } else {
        console.log("Server is listening on " + port);
    }
});

// Student Routes
app.post('/students',classController.addStudent);
app.delete('/students/:delete', classController.deleteStudentbyAdmissionNo);
app.get('/students', classController.getStudents);
app.get('/students/:class', classController.getStudentsbyClass);

// Timetable Route
app.post('/timetables',classController.addTimetable);
app.get('/timetables',classController.getTimetables);
app.get('/timetables/:class',classController.getTimetable);
app.put('/timetables/:class',classController.updateTimetable);

// Lessonplan Route
app.post('/lessonplans',classController.addLessonplan);
app.get('/lessonplans',classController.getLessonplans);
app.get('/lessonplans/:class',classController.getLessonplan);
app.put('/lessonplans/:class',classController.updateLessonplan);

// Classroom Route
app.post('/classrooms',classController.addClassroom);
app.get('/classrooms',classController.getClassroom);
app.delete('/classrooms/:delete', classController.deleteClassroom);

// Message Route
//app.post('/messages',classController.sendMessage);


module.exports = app;