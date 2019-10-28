/**
 * Created by nandunb on 9/23/17.
 */
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

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
routes.init(app);


module.exports = app;