//dependencies
const mongoose = require('mongoose');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./server');
const should = chai.should();

chai.use(chaiHttp);

describe('Analytics',function () {
    this.timeout(15000);


    describe('GET Initial Details',function () {
        //get all reminders with username
        it('should get all the grade given username',function (done) {

            chai.request(server)
                .get('/analytics/student/initDetails/isuru.p')
                .end(function (err, res) {

                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                })
        })
    })

    describe('POST Get marks by given details',function () {
        //add a new reminder
        it('should get a marks',function (done) {

            const details = {

                reminderId:"12",
                title:"do home work",
                username:"",
                remindDate:new Date('2017-10-14'),
                description:"do all home works and compaire answers with other"
            };

            chai.request(server)
                .post('/analytics/student/marks')
                .send(details)
                .end(function (err, res) {

                    res.should.have.status(200);
                    res.body.should.have.property('success').eql(true);
                    res.body.should.be.a('object');
                    done();
                })
        })
    })

    describe('GET Students',function () {
        //get all reminders with username
        it('should get all available students',function (done) {

            chai.request(server)
                .get('/analytics/student')
                .end(function (err, res) {

                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                })
        })
    })

    describe('GET class',function () {
        //get all reminders with username
        it('should get all available classes',function (done) {

            chai.request(server)
                .get('/analytics/student/class')
                .end(function (err, res) {

                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                })
        })
    })


    describe('GET history',function () {
        //get all reminders with username
        it('should get all available student details',function (done) {

            chai.request(server)
                .get('/analytics/student/history/BC123')
                .end(function (err, res) {

                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                })
        })
    })
    describe('GET Atttendance',function () {
        //get all reminders with username
        it('should get all available student attendance',function (done) {

            chai.request(server)
                .get('/analytics/student/attendance')
                .end(function (err, res) {

                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                })
        })
    })

    describe('GET current class of selected student',function () {
        //get all reminders with username
        it('should get all available student attendance',function (done) {

            chai.request(server)
                .get('/analytics/student/class/isuru.p')
                .end(function (err, res) {

                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                })
        })
    })
})