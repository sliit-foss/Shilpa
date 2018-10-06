'use strict'
// Models
const Notification = require('./notification.model');
const User = require('./user.model');
const ClassRoom = require('./classroom.model');

//Methods
exports.addNotification = function (req,res) {

    const notification = new Notification();
    notification.notificationId = 0;
    notification.username = req.body.username;
    notification.class = req.body.class;
    notification.publishedDateTime = req.body.publishedDateTime;
    notification.description = req.body.description;
    notification.title = req.body.title;

    Notification.find({},function (err,docs) {
        var lastId=0;
        if(err){
            res.status(503).json({ success:false, message:err});
            return;
        }

        for(var j=0;j<docs.length;j++) {
            notification.notificationId = docs[j].notificationId;
        }
        notification.notificationId++;

        //save
        notification.save(function (err) {

            if(req.body.username == null || req.body.username == ""){

                res.status(406).json({ success:false, message:'Username not set'});

            }else if(req.body.class == null || req.body.class == ""){

                res.status(406).json({ success:false, message:'Class not set'});

            }else if(req.body.publishedDateTime == null || req.body.publishedDateTime == ""){

                res.status(406).json({ success:false, message:'Published date and time not set'});

            }else if(req.body.title == null || req.body.title ==""){

                res.status(406).json({ success:false, message:'Title not set'});

            } else if(req.body.description == null || req.body.description == ""){

                res.status(406).json({ success:false, message:'Description not set'});

            }else{
                if(err){

                    res.status(503).json({ success:false, message:'Server error.Try again later'+err});

                }else {
                    res.status(201).json({ success:true, message: 'Notification Added'});
                }
            }
        })
    })
};


exports.getNotificationByUsername = function (req,res) {

    var username = req.params.username;
    var className ="";

    //get the class of current user
    User.find({'username':username},function (err,docs) {

        if(err){

            res.status(503).json({ success:false, message:'Server error.Try again later'});
        }
        else{

                className = docs[0].class;

            //get notifications
            Notification.find({'class':className},function (err,data) {

                if(err){

                    res.status(503).json({ success:false, message:'Server error.Try again later '});
                }
                else{

                    if(data.length == 0){

                        res.status(204).json({ success:true, message:data, className:className})
                    }
                    else{

                        res.status(201).json({ success:true, message:data, className:className});
                    }

                }
            })
        }
    })



};

exports.getAvailableClass = function (req, res) {

  ClassRoom.find({},function (err,data) {
      if(err){
          res.json(err);
      }
      else{
          res.json(data);
      }
  })

}




