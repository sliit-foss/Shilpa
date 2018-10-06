// Dependencies
const sendGrid = require('@sendgrid/mail');

const Mail = require('./mail.model');
const config = require('./_config');

exports.getAllMails = function (req, res) {

    Mail.find({}).select('subject from to message date type').exec(function (err, data) {

        if (err) {

            res.status(500).json({sucess: false, message: 'Could not retrieve mails!'});
            return;

        } else {

            res.status(200).json(data);
        }

    })
};

exports.updateType = function (req, res) {

    var id = req.params.mailId;

    Mail.update({_id: id}, {
        $set: {
            type: "read"
        }
    }, function (err) {

        if (err) {

            res.status(406).json({success: false, message: "Cannot update the mail type!"});

        } else {

            res.status(201).json({success: true, message: "Mail type updated!"});

        }

    })
};

exports.sendMail = function (req, res) {

    sendGrid.setApiKey(config.APIKeys.sendGrid);

    if (req.body.toAddress == null || req.body.toAddress == "") {

        res.status(400).json({success: false, message: "Recipient email address is required!"});
        return;

    }

    var message = {

        to: req.body.toAddress,
        from: "ishan@mail.ishanyapa.me",
        subject: req.body.subject,
        text: req.body.message

    }

    sendGrid.send(message);

    res.status(200).json({success: true, message: "Mail sent successfully!"});
    return;

}