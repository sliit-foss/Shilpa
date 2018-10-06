/**
 * Created by nandunb on 11/4/17.
 */

'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');

const mongoose = require('mongoose');

const server = require('./../server');

const should = chai.should();
chai.use(chaiHttp);

describe('Storage', ()=>{
    it('should get all the storage records', (done)=>{
        chai.request(server)
            .get('/storage')
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.should.not.be.null;
                done();
            })
    });
});
