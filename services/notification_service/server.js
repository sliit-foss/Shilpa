'use strick'

//Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Controllers
const notificationController = require('./notification.controller');


const app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Allow cross-origin resource sharing
app.use(cors());

// Setting a port to server to listen on
var port = process.env.PORT || 9015;

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
app.post('/notification',notificationController.addNotification);
app.get('/notification/:username',notificationController.getNotificationByUsername);
app.get('/notification/class',notificationController.getAvailableClass);

//for testing
module.exports = app;