/**
 * Created by nandunb on 10/17/17.
 */

'use strict';

const Assignment = require('../models/assignment.model');

/**
 * Get assignment by Id
 * @param req
 * @param res
 */
exports.getAssignment = (req,res)=>{
    Assignment.find({_id: req.params.id}, (err,data)=>{
        if(err){
            res.status(400).json({success:false, message:"Could not retrieve assignment!"});
        }else{
            res.status(200).json({success:true, data:data})
        }
    })
};

/**
 * Used to create a new assignment within a given classroom
 * @param req
 * @param res
 */
exports.createNewAssignment = (req,res)=>{
    if(req.body.classroomId == undefined || req.body.classroomId == "") {
        res.status(406).json({success:false, message:"Classroom undefined!"});
    }
    else if(req.body.name == undefined || req.body.name == ""){
        res.status(406).json({success:false, message: "Assignment title undefined!"});
    }
    else{
        let assignment = new Assignment(req.body);

        assignment.save((err)=>{
            if(err){
                res.status(400).json({success:false, message: "Could not save the assignment!"});
            }else{
                res.status(200).json({success:true, message:"Assignment created!"});
            }
        })
    }
};


exports.getAllAssignments = (req,res)=>{
    Assignment.find({}).select(' classroomId name description submissionDate ').exec((err,assignments)=>{
        if(err){
            res.status(500).json({success:false, message:"Could to retrieve assignments!"});
        }else{
            res.status(200).json({success:true, data:assignments});
        }
    })
};

exports.getAssignmentByClassroom = (req,res)=>{
    Assignment.find({classroomId: req.params.classroomId}).select('classroomId name description submissionDate')
        .exec((err,assignment)=>{
            if(err){
                res.status(500).json({success:false, message:"Could not retrieve assignment!"});
            }else{
                res.status(200).json({success:true, data:assignment});
            }
        })
};

exports.getAssignmentById = (req,res)=>{
    Assignment.find({_id:req.params.id}).select('classroomId name description submissionDate')
        .exec((err,assignment)=>{
            if(err){
                res.status(500).json({success:false, message:"Could not retrieve assignment!"});
            }else{
                res.status(200).json({success:true, data:assignment});
            }
        })
}

/**
 *
 * @param req
 * @param res
 */
exports.deleteAssignment = (req,res)=>{
    Assignment.remove({_id:req.params.id}, (err)=>{
        if(err){
            res.status(400).json({success:false, message:"Could not delete assignment!"});
        }else{
            res.status(200).json({success:true, message:"Assignment deleted!"});
        }
    })
};

/**
 * Update assignment
 * @param req
 * @param res
 */
exports.updateAssignment = (req,res)=>{
    Assignment.update({_id:req.params.id},
        {
            $set:{
                classroomId: req.body.classroomId,
                name:req.body.name,
                description: req.body.description,
                submissionDate: req.body.submissionDate
            }
        }, (err)=>{
            if(err){
                res.status(500).json({ success:false, message: "Could not update assignment!"});
            }else{
                res.status(200).json({ success:true, message: "Assignment updated!" });
            }
        })
};