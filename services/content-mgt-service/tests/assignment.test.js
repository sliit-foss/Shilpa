/**
 * Created by nandunb on 10/22/17.
 */

'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');

const mongoose = require('mongoose');

const server = require('./../server');

const should = chai.should();
chai.use(chaiHttp);

describe('Assignments', ()=>{
    it('should get all the assignments', (done)=>{
        chai.request(server)
            .get('/assignments')
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.should.not.be.null;
                done();
            })
    })
});