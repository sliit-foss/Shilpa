'use strict'
// Models
const Reminder = require('./reminder.module');

exports.addReminder = function (req, res){

    const reminder = new Reminder();
    reminder.reminderId =0;
    reminder.username = req.body.username;
    reminder.title = req.body.title;
    reminder.insertedDate = new Date();
    reminder.remindDate =  req.body.remindDate;
    reminder.description = req.body.description;

    Reminder.find({},function (err,docs) {

        var lastId=0;

        if(err){

            res.status(503).json({ success:false, message:'reminder ID not set'});
            return;
        }

        for(var j=0;j<docs.length;j++) {

            reminder.reminderId = docs[j].reminderId;
        }

        reminder.reminderId++;

        //increment remindDate by 1
        reminder.remindDate.setDate(reminder.remindDate.getDate() + 1);

        //save
        reminder.save(function (err) {

            if(req.body.username == null || req.body.username == ""){

               res.status(406).json({ success:false, message:'User name not set'});

            }else if(req.body.remindDate == null || req.body.remindDate == ""){

                res.status(406).json({ success:false, message:'Remind Date not set'});

            }else if(req.body.description == null || req.body.description == ""){

                res.status(406).json({ success:false, message:'Description not set'});

            }else if(req.body.title == null || req.body.title ==""){

                res.status(406).json({ success:false, message:'Title not set'});

            }else{

                if(err){

                    res.status(503).json({ success:false, message:'Server error.Try again later. '+err});

                }else {
                    res.status(201).json({ success:true, message: 'Reminder created'});
                }
            }
        })
    })

};

exports.getReminderByUsername = function (req, res) {

    var inputParms = (req.params.username).split("&");

    //set date of today and tomorrow
    var today = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if(inputParms[1] == "needDate"){

        Reminder.find({'username':inputParms[0], 'remindDate':{"$gte" : today, "$lt":tomorrow} },function (err,docs) {

            if(err){

                res.status(503).json({ success:false, message:'Server error.Try again later'});
            }
            else{

                res.status(200).json({success:true, message:docs});
            }


        })
    }else{

        Reminder.find({'username':inputParms[0]},function (err,docs) {

            if(err){

                res.status(503).json({ success:false, message:'Server error.Try again later'});
            }
            else{
                res.status(200).json({success:true, message:docs});
            }
        })
    }


};


exports.updateReminder = function (req, res) {

    Reminder.update({reminderId: req.params.reminderId}, {

        $set: {
            title: req.body.title,
            remindDate: req.body.remindDate,
            description: req.body.description

        }
    }, function (err, data) {

        if (err) {

            res.status(503).json({success: false, message: 'Server error.Try again later' + err});

        }else {

            res.status(201).json({success: true, message: 'Reminder updated'});

        }
    })
};

exports.deleteReminder = function (req, res) {

    Reminder.find({reminderId: req.params.reminderId}).remove().exec(function (err, data) {
        if(err){

            res.status(304).json({ success:false, message: "Server error.Try again later"});

        }else{

            res.status(200).json({ success:true, message: "Reminder deleted"});

        }
    })
}


exports.getReminderById= function (req,res) {

    var id = req.params.id;

    Reminder.find({'reminderId':id},function (err,docs) {

        if(err){

            res.status(503).json({ success:false, message:'Server error.Try again later'});
        }else{

            res.status(200).json({success:true, message:'Reminder deleted'});
        }

    })
};

