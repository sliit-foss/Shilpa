var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Allow cross origin resource sharing
app.use(cors());

//Controller
var gradeController = require('./grade.controller');
var config = require('./_config.js');
//Database connection
mongoose.connect(config.mongoURI[app.settings.env], function () {

    console.log('Connected to MongoDB : ' + app.settings.env);

}, function (err) {
    throw new Error(err);
});

//Port for the server to listen on
var port = process.env.PORT || 9008;

app.listen(port, function () {
    console.log("Listening on port " + port);
});

//All grade routes - Start
//Get all grade details
app.get('/grades', gradeController.getAllgradeDetails);

//Get all grade details of a student by passing studentID
app.get('/grades/students/:id', gradeController.getGradeDetails);

//Get all the grade details of a student by passing studentClass
app.get('/grades/classes/:classname', gradeController.getGradeDetailsByClass);

//Get all the grade details of a student by passing studentClass,StudentID,StudentTerm
app.get('/students/:studentid/classes/:classname/terms/:term/grades', gradeController.getGradeDetailsByFilter);

//Save grade details of a student
app.post('/grades', gradeController.saveGradeDetails);

//Update grade details of a student
app.put('/students/:studentId/terms/:cTerm/classes/:class/grades', gradeController.updateGradeDetails);
//All grade routes - End

module.exports = app;