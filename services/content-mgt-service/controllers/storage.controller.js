/**
 * Created by nandunb on 10/26/17.
 */

'use strict';

const aws = require('aws-sdk');
const formidable = require('formidable');
const fs = require('fs');

const File = require('../models/file.model');
const Storage = require('../models/storage.model');

//aws configuration
aws.config.loadFromPath('./config.json');

let s3 =  new aws.S3({apiVersion: '2006-03-01'});
let uploadParams = {Bucket: 'cyborgs-lms',Key:'', Body:''};

exports.uploadFile = (req,res)=>{
    let form = new formidable.IncomingForm();

    let directoryName = '';

    console.log(req.headers.directory);

    if(req.headers.directory){
        directoryName = req.headers.directory;
    }

    if(req.params.username == 'undefined'){
        res.status(400).json({ success:false, message:"Username undefined!"});
        return;
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

            //save file in DB
            let file = new File({
                key: files.file.name,
                type: "file",
                owner: req.params.username,
                parent: directoryName,
                size: files.file.size
            });

            //add child


            file.save((err)=>{
                if(err){
                    res.status(500).json({ success: false, message: "Could not upload file!", errorObject:err});
                }else{
                    s3.putObject({
                        Bucket: uploadParams.Bucket,
                        Key: files.file.name,
                        Body: base64data,
                        ACL: 'public-read'
                    }, (resp)=>{

                        res.status(200).json({success:true, message: files.file.name+ " uploaded!"});

                    })
                }
            });
        })
    })
};

exports.createDirectory = (req,res)=>{
    let directoryName = req.body.directory;

    if(req.body.key == undefined || req.body.key == ""){
        res.status(400).json({success:false, message:"Directory name (key) undefined!"});
        return;
    }else if(req.params.username == "undefined"){
        res.status(400).json({ success:false, message: "Username undefined!"});
        return;
    }

    //save to db
    let directory = new File({
        key: directoryName + req.body.key+"/",
        owner: req.params.username,
        type: "directory",
        parent: req.body.parent,
        children: []
    });

    directory.save((err)=>{
        if(err){
            res.status(500).json({ success:false, message: "Could not create directory!", errorObject: err});
            return;
        }else{
            s3.upload({
                Bucket: uploadParams.Bucket,
                Key: directoryName+req.body.key+"/",
                Body: '',
                ACL: 'public-read'
            }, (err,data)=>{
                if(err)
                    res.status(500).json({success:false, message: "Could not create directory!"});
                else
                    res.status(200).json({success:true, message: "Directory created!"});
            })
        }
    });
};

exports.removeFile = (req,res)=>{

    let key = "";

    key = req.query.key;

    if(key == undefined || key == ""){
        res.status(400).json({success:false, message: "Key undefined!"});
        return;
    }

    File.remove({ key: req.query.key }, (err)=>{
        if(err){
            res.status(400).json({ success:false, message: "Could not delete file!"});
            return;
        }

        s3.deleteObject({
            Bucket: uploadParams.Bucket,
            Key: req.query.key
        }, (err,data)=>{
            if(err)
                res.status(500).json({success:false, message:err});
            else{
                    res.status(200).json({success:true, message: key+" deleted!"});
            }

        })

    });


};

exports.updateFile = (req,res)=>{
    if(req.body.key == undefined || req.body.key == ""){
        res.status(400).json({ success:false, message: "Key undefined!"});
    }else{
        File.update({ _id: req.params.id }, {
            $set:{
                key: req.body.key
            }
        }, (err)=>{
            if(err){
                res.status(500).json({ success:false, message: "Could not update the file!"});
                return;
            }

            s3.copyObject({
                Bucket: uploadParams.Bucket,
                CopySource: `${uploadParams}${req.body.oldKey}`,
                Key: req.body.key
            })
                .promise()
                .then(() =>
                    // Delete the old object
                    s3.deleteObject({
                        Bucket: uploadParams.Bucket,
                        Key: req.body.oldKey
                    }).promise().then(()=>{
                        res.status(200).json({ success:true, message: "File updated!"});
                    })
                )
                // Error handling is left up to reader
                .catch((e) => console.error(e))
        })
    }
};

exports.getFilesByDirectory = (req,res)=>{

    let dir = '';
    if(req.query.directory != undefined){
        dir = req.query.directory;
    }

    File.find({ parent: dir, owner: req.params.username }).select(" key type parent children ")
        .exec((err, files)=>{
            if(err){
                res.status(500).json({ success:false, message: "Could not retrieve files!", errorObject:err});
                return;
            }

            res.status(200).json({ success:true, response: files });
        })
};

exports.getSharedFilesByUser = (req,res)=>{
    File.find({ shared_with: req.params.username }).exec((err, files)=>{
        if(err){
            res.status(500).json({ success:false, message: "Could not retrieve shared files!", errorObject: err });
            return;
        }

        res.status(200).json({ success:true, response:files });
    })
};

exports.shareFileWithGivenUsers = (req,res)=>{
    File.update({ _id: req.params.fileId, owner: req.params.username },{
        $set:{
            shared_with: req.body.shared_with
        }
    }, (err)=>{
        if(err){
            res.status(500).json({ success:false, message: "Could not share file!"});
            return;
        }
        res.status(200).json({ success:true, message: "File shared!"});
    })
};

exports.searchFiles = (req,res)=>{
    console.log(req.query.query);
    File.find({ owner:req.params.username, key: { $regex: '.*' + req.query.query + '.*', $options: 'i' }}, (err, files)=>{
        if(err){
            res.status(500).json({ success:false, message: "Could not perform search!"});
            return;
        }
        res.status(200).json({ success:true, response: files });
    })
};

exports.getStorageData = (req,res)=>{
    let option = req.query.option;
    switch(option){
        case 'used':
            File.aggregate([{ $match : { owner: req.params.username }},
                { $group: {
                    _id: null,
                    total: {
                        $sum: "$size"
                    }
                }
                }], (err, response)=>{
                if(err){
                    res.status(500).json({ success:false, message: "Could not get used amount of space!"});
                    return;
                }
                if(response[0]){
                    res.status(200).json({ success:true, response: response[0].total});
                }else{
                    res.status(501).json({ success:true, message: "Could not complete the operation!"});
                }
            });
            break;
        case 'total':
            Storage.find({ username: req.params.username }).select('size').exec((err, storage)=>{
                if(err){
                    res.status(500).json({ success:false, message: "Could not retrieve user storage data!"});
                    return;
                }
                if(storage[0]){
                    res.status(200).json({ success:true, response: storage[0].size });
                }else{
                    res.status(501).json({ success:false, message: "Could not complete the operation!"});
                }
            });
            break;
        case 'available':
            let used = 0;
            File.aggregate([{ $match : { owner: req.params.username }},
                { $group: {
                    _id: null,
                    total: {
                        $sum: "$size"
                    }
                }
                }], (err, response)=>{
                if(err){
                    res.status(500).json({ success:false, message: "Could not get used amount of space!"});
                    return;
                }
                used = response[0].total;
                Storage.find({ username: req.params.username }).select('size').exec((err, storage)=>{
                    if(err){
                        res.status(500).json({ success:false, message: "Could not retrieve user storage data!"});
                        return;
                    }
                    if(storage[0]){
                        res.status(200).json({ success:true, response: (storage[0].size - used) }); //TODO: set calculated available storage
                    }else{
                        res.status(501).json({ success:false, message: "Could not complete the operation!" });
                    }

                });
            });
            break;
        default:
            res.status(400).json({ success:false, response: "Invalid options!"});
            break;
    }
};

exports.setStorageSpace = (req,res)=>{
    if(req.body.username == undefined || req.body.username == ''){
        res.status(400).json({ success:false, message: "Username undefined!"});
    }else if( req.body.size == undefined || req.body.size == ''){
        res.status(400).json({ success:false, message: "Size undefined!"});
    }else{
        let storage = new Storage(req.body);
        storage.save((err)=>{
            if(err){
                res.status(500).json({ success:false, message: "Could not save storage record!"});
                return;
            }
            res.status(200).json({ success:true, message: "Storage record created!"});
        })
    }
};

exports.updateStorageSpace = (req,res)=>{
    Storage.update({ username: req.params.username }, {
        $set:{
            username: req.params.username,
            size: req.body.size
        }
    }, (err)=>{
        if(err){
            res.status(500).json({  success:false, message: "Could not update storage record!"});
            return;
        }

        res.status(200).json({ success:true, message: "Storage record updated!"});
    })
};

exports.getStorageRecords = (req,res)=>{
    Storage.find({}).exec((err, records)=>{
        if(err){
            res.status(500).json({ success:false, message: "Could not retrieve storage records"});
            return;
        }
        res.status(200).json({ success:true, response:records});
    })
};





