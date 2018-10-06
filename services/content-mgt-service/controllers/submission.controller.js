/**
 * Created by nandunb on 10/24/17.
 */

'use strict';

const Submission = require('../models/submission.model');

exports.addSubmission = (req,res)=>{
    if(req.body.assignment == undefined || req.body.assignment == ""){
        res.status(400).json({ success:false, message: "Assignment ID undefined!"});
        return;
    }else if(req.body.username == undefined || req.body.username == ""){
        res.status(400).json({ success:false, message: "User undefined!"});
        return;
    }else if(req.body.files.length == 0){
        res.status(400).json({ success:false, message: "Files not added!"});
        return;
    }else if(req.body.dateOfSubmission == undefined || req.body.dateOfSubmission == ""){
        res.status(400).json({ success:false, message: "Date of Submission undefined!"});
        return;
    }else{
        let submission = new Submission(req.body);
        submission.save((err)=>{
            if(err){
                res.status(500).json({ success:false, message: "Could not submit submission!", error:err});
                return;
            }else{
                res.status(200).json({ success:true, message: "Submission submitted!"});
            }
        })
    }
};

exports.getSubmissionsByAssignmentId = (req,res)=>{
    Submission.find({ assignment: req.params.assignmentId }).select(' assignment username files dateOfSubmission ').exec((err, submissions)=> {
        if (err) {
            res.status(500).json({success: false, message: "Could not retrieve submissions!"});
        } else {
            res.status(200).json({success: true, data: submissions});
        }
    })
};

exports.getSubmissionByUsername = (req,res)=>{
    Submission.find({ username: req.params.username, assignment: req.params.assignmentId }).select(' assignment username files dateOfSubmission ').exec((err, submissions)=>{
        if(err){
            res.status(500).json({ success: false, message: "Could not retrieve submissions!"});
        }else{
            res.status(200).json({ success:true, data: submissions});
        }
    })
};

exports.updateSubmission = (req,res)=>{
    if(req.body.username == undefined || req.body.username == ""){
        res.status(400).json({ success:false, message: "User undefined!"});
        return;
    }else if(req.body.files.length == 0){
        res.status(400).json({ success:false, message: "Files not added!"});
        return;
    }else if(req.body.dateOfSubmission == undefined || req.body.dateOfSubmission == ""){
        res.status(400).json({ success:false, message: "Date of Submission undefined!"});
        return;
    }else{
        Submission.update({ _id: req.params.id }, {
            $set:{
                username: req.body.username,
                files: req.body.files,
                dateOfSubmission: req.body.dateOfSubmission
            }
        }, (err)=>{
            if(err){
                res.status(500).json({ success:false, message: "Could not update submission!"});
            }else{
                res.status(200).json({ success:true, message: "Submission updated!"});
            }
        })
    }
};

exports.deleteSubmission = (req,res)=>{
    Submission.remove({ _id: req.params.id }, (err)=>{
        if(err){
            res.status(500).json({ success:false, message: "Could not delete submission!"});
        }else{
            res.status(200).json({ success:true, message: "Submission deleted!"});
        }
    })
};