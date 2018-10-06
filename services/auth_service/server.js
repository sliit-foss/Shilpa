
// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Controllers
const userController = require('./controllers/user.controller');
const config = require('./_config');

const app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Allow cross-origin resource sharing
app.use(cors());

// Setting a port to server to listen on
var port = process.env.PORT || 9001;

// Connecting to remote MongoDB instance
mongoose.connect(config.mongoURI[app.settings.env],function(){

    console.log('Connected to MongoDB : ' + app.settings.env);

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

// User Routes
app.post('/users',userController.addUser);
app.post('/users/authenticate', userController.authenticate);
app.get('/users/authorize', userController.authorize);
app.get('/users', userController.getAll);
app.post('/users/delete', userController.deleteUsers);
app.put('/users/:username', userController.updateUser)
app.get('/students/:studentId', userController.getStudentDetails);

// Group Routes
app.post('/groups', userController.createUserGroup);

// Notice Routes
app.post('/notices', userController.postNotices);
app.get('/notices', userController.getAllNotices);

// Log Routes
app.post('/logs', userController.addUserLog);
app.get('/logs', userController.getAllLogs);

module.exports = app;