/**
 * Created by nandunb on 9/23/17.
 */
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const aws = require('aws-sdk');

//Controllers
const contentController = require('./controllers/file.controller');
const assignmentController = require('./controllers/assignment.controller');
const submissionController = require('./controllers/submission.controller');
const storageController = require('./controllers/storage.controller');

const app = express();

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

//Application Configurations
let port = process.env.PORT || 9004;

mongoose.connect('mongodb://cyb-isuru:pass123$@ds141264.mlab.com:41264/cyborgs-lms', () => {
    console.log('Connected to Database');
}, (err) => {
    throw new Error(err);
});

app.listen(port, (err) => {
    if (err) {
        throw new Error(err);
    } else {
        console.log("Server is listening on " + port);
    }
});

//Routes
//Files
app.get('/files', contentController.getAllFiles);
app.post('/files', contentController.uploadFile);
app.delete('/objects/:type', contentController.removeFile);

//Assignments
app.get('/assignments', assignmentController.getAllAssignments);
app.get('/assignments/:id', assignmentController.getAssignmentById);
app.get('assignments/classes/:id', assignmentController.getAssignmentByClassroom);
app.post('/assignments', assignmentController.createNewAssignment);
app.put('/assignments/:id', assignmentController.updateAssignment);
app.delete('/assignments/:id', assignmentController.deleteAssignment);

//Submissions
app.get('/assignments/:assignmentId/submissions', submissionController.getSubmissionsByAssignmentId);
app.get('/assignments/:assignmentId/submissions/users/:username', submissionController.getSubmissionByUsername);
app.post('/assignments/:assignmentId/submissions', submissionController.addSubmission);
app.put('/assignments/:assignmentId/submissions/:id', submissionController.updateSubmission);
app.delete('/assignments/:assignmentId/submissions/:id', submissionController.deleteSubmission);

//Storage
app.get('/storage', storageController.getStorageRecords);
app.get('/storage/users/:username', storageController.getFilesByDirectory);
app.get('/storage/users/:username/shared', storageController.getSharedFilesByUser);
app.get('/storage/users/:username/files/search', storageController.searchFiles);
app.get('/storage/users/:username/statistics', storageController.getStorageData);
app.post('/storage/users/:username/files', storageController.uploadFile);
app.post('/storage/users/:username/directories', storageController.createDirectory);
app.post('/storage/users/:username/shared', storageController.getSharedFilesByUser);
app.post('/storage/users/:username', storageController.setStorageSpace);
app.put('/storage/users/:username/files/:fileId/shared', storageController.shareFileWithGivenUsers);
app.put('/storage/users/:username', storageController.updateStorageSpace);
app.put('/storage/files/:id', storageController.updateFile);
app.delete('/storage/files', storageController.removeFile);


module.exports = app;