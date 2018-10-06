process.env.NODE_ENV = 'development';

// Dependencies
var Hapi = require('hapi');
const mongoose = require('mongoose');
const config = require('./_config');
const dotenv = require('dotenv');
dotenv.load();

var port = parseInt(process.env.PORT) || 3000;
server = new Hapi.Server(+port, '0.0.0.0', { cors: true });

mongoose.connect(config.mongoURI[process.env.NODE_ENV],function(){

    console.log('Connected to MongoDB : ' + process.env.NODE_ENV);

}, function(err) {
    throw new Error(err);
});

require('./routes');

server.start(function() {
    console.log('Server started at: ' + server.info.uri);
});
