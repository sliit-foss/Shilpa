/**
 * Routes module
 * Author: Nandun Bandara
 */
(() => {

    'use strict';

    const contentController = require('./controllers/file.controller');
    const assignmentController = require('./controllers/assignment.controller');
    const submissionController = require('./controllers/submission.controller');
    const storageController = require('./controllers/storage.controller');

    const init = app => {

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

    };

    module.exports = {
        init
    };

})();