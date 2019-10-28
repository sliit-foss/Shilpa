/**
 *  Routes for auth service
 *  Author: Nandun Bandara
 */
(() => {

    'use strict';

    const userController = require('./controllers/user.controller');

    const init = app => {

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

    };

    module.exports = {
        init
    };

})();