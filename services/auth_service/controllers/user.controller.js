'use strict'

// Dependencies
const jwt = require('jsonwebtoken');

// Models
const User = require('../models/user.model');
const Group = require('../models/group.model');
const Notice = require('../models/notice.model');
const Log = require('../models/log.model');

const secret = 't0p$3cr3t!';


//Adds new user to the database
exports.addUser = function(req,res) {

    const user = new User(req.body);


    if (req.body.username==null || req.body.username=="") {

        res.status(406).json({ success:false, message:'Username not set'});
        return;

    } else if (req.body.password==null || req.body.password=="") {

        res.status(406).json({ success:false, message: 'Password not set'});
        return

    } else if (req.body.name==null || req.body.name==""){

        res.status(406).json({ success:false, message: 'Name not set'});
        return

    } else if (req.body.email==null || req.body.email==""){

        res.status(406).json({ success:false, message:'Email not set'});
        return

    } else if (req.body.permission==null || req.body.permission==""){

        res.status(406).json({ success: false, message: 'Permission not set'});
        return;

    } else if (!user.validateStudent()) {

        res.status(406).json({ success: false, message: 'Student ID not set'});
        return;

    }
    user.save(function(err) {

        if (err) {

            res.status(406).json({ success:false, message:'Username or email already exists!'});

         } else {

            res.status(201).json({ success:true, message: 'User created!'});

        }

    });
};



// Authenticates user when the credentials are given.
exports.authenticate = function(req,res) {

    User.findOne({ username: req.body.username }).select('username password email name permission').exec(function(err,user) {

        if (err)
            throw new Error(err);

        if (!user) {

            res.json({ success:false, message: 'Could not authenticate user!'});

        } else if (user) {

            // Validating passwords
            const validPassword = user.comparePassword(req.body.password);
            if (!validPassword) {

                res.status(401).json({ success:false, message:'Could not validate user!' });

            } else {

                // Setting up the JSON-Web-Token
                const token = jwt.sign({
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    permission: user.permission
                },secret, { expiresIn: '1h'});

                res.status(200).json({ success:true, message:'User authenticated!', token:token});
            }
        }
    })
};

// Authorize the user when the token is given
exports.authorize = function(req,res) {

    const token = req.body.token || req.body.query || req.headers['x-access-token'];

    if(token) {

        jwt.verify(token, secret, function(err, decoded) {

            if (err) {

                res.status(401).json({ success:false, message: 'Invalid Token'});

            } else {

                res.status(200).send(decoded);

            }
        })
    } else {

        res.status(406).json({ success:false, message: 'Token not set'});
        
    }
}

// Get all user details
exports.getAll = function(req, res) {

    User.find({}).select(' username email name permission studentId class level').exec(function(err, users){

        if (err) {

            res.json({ success:false, message: "Could not retrieve users"});

        } else {

            res.json(users);

        }
    })

};

// Delete the specified users from the database
exports.deleteUsers = function(req, res) {

    var userList = req.body.users;

    User.find({'_id':{'$in':userList}}).remove().exec(function(err,data){

        if (err || userList == undefined) {

            res.status(304).json({ success:false, message: "Could not delete user(s) record!"});

        } else {

            res.status(200).json({ success:true, message: "User(s) deleted!"});

        }
    })

};

// Update the specified user
exports.updateUser = function(req, res) {
    
    User.update({username: req.params.username}, {
        $set: {
            name: req.body.name,
            email: req.body.email,
            permission: req.body.permission,
            studentId: req.body.studentId,
            class: req.body.class,
            level: req.body.level
        }
    }, function (err) {

        if (err) {

            res.status(406).json({success: false, message: "Username or email already exists!"});

        } else {

            res.status(201).json({success: true, message: "User updated!"});

        }

    })
};

// Get a student's details when student ID is given
exports.getStudentDetails = function (req, res) {

    if (!req.params.studentId) {

        res.status(401).json({success: false, message: "Student ID not set!"});
        return;

    }

    User.findOne({studentId: req.params.studentId}).select("username name email permission studentId class level").exec(function (err, data) {

        if (err) {

            res.status(404).json({success: false, message:"Could not retrieve user!"});

        } else {

            res.json(data);

        }
    })
};

// Create a user group when the details are given
exports.createUserGroup = function (req, res) {

    if (req.body.groupName == "" || req.body.groupName == null) {

        res.status(406).json({success: false, message: 'Group name is not provided!'});
        return;

    } else if (req.body.description == "" || req.body.description == null) {

        res.status(406).json({success: false, message: 'Description is not provided!'});
        return;

    } else if (req.body.allowedSections == [] || req.body.allowedSections == null) {

        res.status(406).json({success: false, message: 'Allowed sections are not provided!'});
        return;

    } else if (req.body.members == [] || req.body.members == null) {

        res.status(406).json({success: false, message: 'Members are not included!'});
        return;

    }

    var newGroup = new Group(req.body);

    newGroup.save(function (err) {

        if (err) {

            res.status(304).json({success: false, message: err});
            return;

        } else {

            res.status(201).json({success: true, message: 'Group created successfully!'});
            return;
        }

    })

};

// Post a notice when details are given
exports.postNotices = function (req, res) {

    if (req.body.pdate == null || req.body.pdate == "") {

        res.status(406).json({success: false, message: "Date is required!"});
        return;

    } else if (req.body.subject == null || req.body.subject == "") {

        res.status(406).json({success: false, message: "Subject is required!"});
        return;

    }

    var notice = new Notice(req.body);

    notice.save(function (err, response) {


        if (err) {

            res.status(406).json({success: false, message: "Could not post the notice!"});
            return;

        } else {

            res.status(201).json({success: true, message: "Notice posted!"});
            return;
        }
    })
};

// Get all the notices
exports.getAllNotices = function (req, res) {


    Notice.find({}).select('pdate subject tags description').exec(function (err, notices) {

        if (err) {

            res.status(500).json({success: false, message: "Could not retrieve notices!"});

        } else {

            res.status(200).json(notices);

        }
    })
};

// Add a user log
exports.addUserLog = function (req, res) {

    if (req.body.ldate == "" || req.body.ldate == null) {

        res.status(406).json({success: false, message: "Date is not given!"});
        return;

    } else if (req.body.description == "" || req.body.description == null) {

        res.status(406).json({success: false, message: "Description is not given!"});
        return;

    }

    var newLog = new Log(req.body);

    newLog.save(function (err, response) {

        if (err) {

            res.status(500).json("Could not add log!");
            return;

        } else {

            res.status(201).json({success: true, message: "Log added successfully!"});
        }
    })
};

// Get all the logs
exports.getAllLogs = function (req, res) {

    Log.find({}).select('ldate description').exec(function (err, logs) {

        if (err) {

            res.status(500).json({success: false, message: "Could not retrieve logs!"});
            return;

        } else {

            res.status(200).json(logs);
            return;
        }
    })
}
