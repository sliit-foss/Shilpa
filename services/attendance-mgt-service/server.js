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
var attendanceController = require('./attendance.controller');
var config=require('./_config.js');

//Database connection
mongoose.connect(config.mongoURI[app.settings.env], function () {

    console.log('Connected to MongoDB : ' + app.settings.env);

}, function (err) {
    throw new Error(err);
});

//Port for the server to listen on
var port = process.env.PORT || 9009;

app.listen(port, function () {
    console.log("Listening on port " + port);
});

app.post('/attendances', attendanceController.saveAttendance);
app.get('/classes/:sClass/dates/:dateAttendance/attendances', attendanceController.getAttendanceDetailsByFilter);
app.get('/attendances', attendanceController.getAttendanceDetails);

module.exports = app;