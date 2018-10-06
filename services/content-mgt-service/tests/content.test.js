/**
 * Created by nandunb on 10/20/17.
 */

'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');

const mongoose = require('mongoose');

const server = require('./../server');

const should = chai.should();
chai.use(chaiHttp);

describe('Files', ()=>{
    //Test GET route to get all the files
    it('should get all the files in the root directory', (done)=>{
        chai.request(server)
            .get('/files')
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.Contents.should.not.be.undefined;
                res.body.Contents.should.be.a('array');
                done();
            });
    });

    //Test GET route to get all the files in a given directory
    it('should get all the files in the given directory', (done)=>{
        chai.request(server)
            .get('/files')
            .query({ directory: '/Test Dir/'})
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.Contents.should.not.be.undefined;
                res.body.Contents.should.be.a('array');
                done();
            });
    });


    //Test POST route to upload a file to a given directory
    it('should upload the provided file to the given directory', (done)=>{
        chai.request(server)
            .post('/files')
            .attach('file', fs.readFileSync('tests/test-assets/test.jpg'), '/Test/test.jpg')
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.should.not.be.null;
                res.body.should.have.property("success").eql(true);
                res.body.should.have.property("message");
                done();
            });
    });

    //Test POST route to upload a file when the file is not provided
    it('should not upload a file when a file is not provided', (done)=>{
        chai.request(server)
            .post('/files')
            .end((err,res)=>{
                res.should.have.status(400);
                res.body.should.not.be.null;
                res.body.should.have.property("success").eql(false);
                res.body.should.have.property("message").eql("File not included!");
                done();
            });
    });
});

describe('Files and Directories', ()=>{
    //Test DELETE route to delete a file
    it('should delete the given file', (done)=>{
        chai.request(server)
            .delete('/objects/file')
            .query({ key: "test.jpg"})
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.should.have.property("success").eql(true);
                done();
            });

    });

    //Test DELETE route to delete a file without the key
    it('should not delete a file without the key', (done)=>{
        chai.request(server)
            .delete('/objects/file')
            .end((err,res)=>{
                res.should.have.status(400);
                res.body.should.have.property("success").eql(false);
                res.body.should.have.property("message").eql("Key undefined!");
                done();
            });
    });

    //Test DELETE route to delete object without providing the type
    it('should not delete when type is not provided', (done)=>{
        chai.request(server)
            .delete('/object')
            .query({ key: "testDir_123"})
            .end((err,res)=>{
                res.should.have.status(404);
                done();
            });
    });
});