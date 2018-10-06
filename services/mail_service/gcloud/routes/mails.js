const Mail = require('../models/mail.model');
var mails = {

    handler: function (request) {

        var to = request.params.email;

        console.log('called! ' + to);

        Mail.find({'to': to}).select('subject from to message date').exec(function (err, mails) {

            if (err) {

                request.reply({success: false});
                //TODO get a reply from hapi server

            } else {

                var data = mails;
                console.log('executed!');
                request.reply(null, 'success').type('text/plain').code(200);
            }
        });

    }
}

server.addRoute({
    method: 'GET',
    path: '/mails/{email}',
    config: mails
})