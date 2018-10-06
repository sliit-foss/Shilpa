'use strick'

//Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Controllers
const reminderController = require('./reminder.controller');


const app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Allow cross-origin resource sharing
app.use(cors());

// Setting a port to server to listen on
var port = process.env.PORT || 9016;

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
app.post('/reminder',reminderController.addReminder);
app.get('/reminder/:username',reminderController.getReminderByUsername);
app.put('/reminder/:reminderId',reminderController.updateReminder);
app.delete('/reminder/:reminderId', reminderController.deleteReminder);

//for testing
module.exports = app;