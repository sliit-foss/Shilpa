
// Dependencies
const express = require('express');
const mongoose = require('mongoose');

const config = require('./_config');
const routes = require('./routes');


const app = express();

app.use(express.static(__dirname));

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
routes.init(app);

module.exports = app;