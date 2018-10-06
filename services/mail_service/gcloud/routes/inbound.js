const Mail = require('../models/mail.model');

var inbound = {
    handler: function (request) {
        var envelope;
        var to;
        var payload   = request.payload;

        var incomingMessage = {

            subject: request.payload.subject,
            from: request.payload.from,
            to: request.payload.to,
            message: request.payload.text,
            date: new Date()
        }

        mail = new Mail(incomingMessage);
        
        mail.save(function (error, data) {

            if (error) {

                console.log(error);

            } else {

                console.log('Mail Saved!');
            }
        })

    }
};

server.addRoute({
    method  : 'POST',
    path    : '/inbound',
    config  : inbound
});
