/**
 * Created by nandunb on 9/23/17.
 */
'use strict';

const express = require('express');
const mongoose = require('mongoose');

const routes = require('./routes');
const middleware = require('./middleware');

const app = express();

//Middleware
middleware.init(app);


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
routes.init(app);


module.exports = app;