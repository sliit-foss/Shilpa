'use strict'

process.env.NODE_ENV = 'test';

// Dependencies
const chai = require('chai');
const mongoose = require('mongoose');
const chaiHttp = require('chai-http');

const server = require('./server');
const Grade = require('./grade.model');

const should = chai.should();
chai.use(chaiHttp);

describe('Grades', function () {

    this.timeout(15000);

    let newGrade = new Grade({

        sID: 'AB123',
        sName: 'TestStudent',
        sClass: '10C',
        cTerm: 2,
        sLevel: 'G.C.E. (A/L) Maths',
        sRemarks: 'TestRemarks',
        sGrades: '',
        sAverage: '38.96',
        sRemarksTags: ''

    });

    before(function (done) {

        Grade.collection.drop();

        newGrade.save(function (err, data) {

        });

        done();

    });

    //Unit Tests for POST grades
    describe('POST grades', function () {

        //Add valid grade details to a particular student
        it('Should add a new grade when details are given', function (done) {

            let grade = {

                studentId: '123456',
                name: 'Nihal Perera',
                class: '10C',
                cTerm: 2,
                level: 'G.C.E. (A/L) Maths',
                remarksnote: 'Week hand writing',
                avg: '38.96',
            }

            chai.request(server)
                .post('/grades')
                .send(grade)
                .end(function (err, res) {


                    res.should.have.status(200);
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('message').eql('Grades Successfully Recorded. !');
                    done();
                })
        });

        //Add incomplete grade details to a particular student
        it('Should not add a new grade if term is not selected', function (done) {

            let grade = {

                studentId: '123456',
                name: 'Nihal Perera',
                class: '10C',
                level: 'G.C.E. (A/L) Maths',
                remarksnote: 'Week hand writing',
                cTerm: '',
                avg: '38.96',
            }

            chai.request(server)
                .post('/grades')
                .send(grade)
                .end(function (err, res) {

                    res.should.have.status(500);
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql('Error Recording Data. !');
                    done();
                })
        });

        //Add invalied  grade details to a particular student
        it('Should not add a new grade if student id is null or undifined', function (done) {

            let grade = {

                studentId: '',
                name: 'Nihal Perera',
                class: '10C',
                cTerm: 2,
                level: 'G.C.E. (A/L) Maths',
                remarksnote: 'Week hand writing',
                avg: '38.96',
            }

            chai.request(server)
                .post('/grades')
                .send(grade)
                .end(function (err, res) {

                    res.should.have.status(400);
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('error').eql('sID undefined');
                    done();
                })
        });

    })

    // Unit tests for GET routes
    describe('GET grades', function () {

        // Unit test for get all grades route
        it('Should get all the grades', function (done) {

            chai.request(server)
                .get('/grades')
                .end(function (err, res) {

                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();

                })

        });

        // Unit test for get grades by student ID route
        it('Should get grades details for a specific student', function (done) {

            chai.request(server)
                .get('/grades/students/AB123')
                .end(function (err, res) {

                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();

                })
        });

        // Unit test for get grades by student class route
        it('Should get grades details for a specific class', function (done) {

            chai.request(server)
                .get('/grades/classes/10C')
                .end(function (err, res) {

                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();


                })
        });

        // Unit test for get grades by filter route
        it('Should get grades details for a specific student in a specific class for a specific term,', function (done) {

            chai.request(server)
                .get('/students/AB123/classes/10C/terms/3/grades')
                .end(function (err, res) {

                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();

                })
        });

    })

})

