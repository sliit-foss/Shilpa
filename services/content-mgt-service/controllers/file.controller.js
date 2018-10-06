/**
 * Created by nandunb on 9/23/17.
 */
'use strict';

const aws = require('aws-sdk');
const formidable = require('formidable');
const fs = require('fs');

const File = require('../models/file.model.js');

//aws configuration
aws.config.loadFromPath('./config.json');

let s3 =  new aws.S3({apiVersion: '2006-03-01'});
let uploadParams = {Bucket: 'cyborgs-lms',Key:'', Body:''};

/**
 * Upload a file
 * @param req
 * @param res
 */
exports.uploadFile = (req,res)=>{
    let form = new formidable.IncomingForm();

    let directoryName = '';

    if(req.query.directory){
        directoryName = req.query.directory;
    }

    form.parse(req, (err, fields, files)=>{

        if('file' in files == false){
            res.status(400).json({ success: false, message: "File not included!"});
            return;
        };

        if(err){
            res.status(400).json({success:false, message:"Could not read the file!"});
            return;
        };

        fs.readFile(files.file.path, (err,data)=>{

            if(err) {
                res.status(400).json({success:false, message:"Could not read the file!"});
                return;
            };

            let base64data = new Buffer(data, 'binary');

            s3.putObject({
                Bucket: uploadParams.Bucket,
                Key: directoryName+files.file.name,
                Body: base64data,
                ACL: 'public-read'
            }, (resp)=>{

                res.status(200).json({success:true, message: files.file.name+ " uploaded!"});

            })

        })
    })
};

/**
 * Get all available files in the bucket
 * @param req
 * @param res
 */
exports.getAllFiles = (req,res)=>{
    //check for parameters in the request
    if(req.query.directory){

        s3.listObjects({
            Bucket: uploadParams.Bucket,
            Delimiter: '/',
            Prefix: req.query.directory
        }, (err,data)=>{

            if(err)
                res.status(400).json({success:false, message:'Could not read the given folder!'});
            else
                res.status(200).json(data);
        })

    }else{

        s3.listObjects({
            Bucket: uploadParams.Bucket,
            Delimiter: '/'
        }, (err,data)=>{
            res.status(200).json(data);
        })

    }
};

/**
 * Remove a given file
 * @param req
 * @param res
 */
exports.removeFile = (req,res)=>{

    let key = "";

    switch(req.params.type){
        case 'dir':
            key = req.query.key+"/";
            break;
        case 'file':
            key = req.query.key;
            break;
        default:
            res.status(400).json({success:false, message: "Type undefined!"});
            return;
    }

    if(key == undefined || key == ""){
        res.status(400).json({success:false, message: "Key undefined!"});
        return;
    }

    s3.deleteObject({
        Bucket: uploadParams.Bucket,
        Key: req.query.key
    }, (err,data)=>{
        if(err)
            res.status(500).json({success:false, message:err});
        else{
            if(req.params.type == 'dir'){

                res.status(200).json({success:true, message: "Directory deleted!"});

            }else{

                res.status(200).json({success:true, message: key+" deleted!"});
            }
        }

    })
};

