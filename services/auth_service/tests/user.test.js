'use strict'

process.env.NODE_ENV = 'test';

// Dependencies
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const User = require('../models/user.model');
const server = require('../server');
const Group = require('../models/group.model')
const Notice = require('../models/notice.model');
const Log = require('../models/log.model');

const should = chai.should();

chai.use(chaiHttp);

describe('User', function () {

    this.timeout(15000);
    var token = null;
    var stu_id = null;

    let newStudent = new User({

        username: "dummy-student",
        name: "dummy",
        email: "dummy@dummy.com",
        password: "password",
        permission: "student",
        studentId: "000000",
        class: "dummy-class",
        level: "dummy-level"

    });

    let newAdmin = new User({

        username: "dummy-admin",
        name: "dummy",
        email: "dummy@admin.com",
        password: "password",
        permission: "admin"

    })



    before(function (done) {

        User.collection.drop();

        newStudent.save(function (err, data) {

            stu_id = data._id;

        });

        newAdmin.save(function (err, data) {

        });

        done();

    });

    // Unit tests for POST routes
    describe('POST users', function () {

        // Unit test for add user route - add student
        it('should add a student when details are given', function (done) {

            let student = {

                username: "test-student",
                name: "testing",
                email: "teststudent@test.com",
                password: "test",
                permission: "student",
                studentId: "123760",
                class: "12-C",
                level: "G.C.E. (A/L) Maths"

            }

            chai.request(server)
                .post('/users')
                .send(student)
                .end(function (err, res) {

                    res.should.have.status(201);
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('message').eql('User created!');
                    done();
                })
        });

        // Unit test for add user route - add admin
        it('should add an admin when details are given', function (done) {

            let user = {

                username: "test-user",
                name: "testing",
                email: "testing@test.com",
                password: "test",
                permission: "admin"
            }

            chai.request(server)
                .post('/users')
                .send(user)
                .end(function (err, res) {

                    res.should.have.status(201);
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('message').eql('User created!');
                    done();

                })
        });

        // Unit test for add user route - add user with an existing email
        it('should not add a user with an existing email', function (done) {

            let user = {

                username: "dummy-admin",
                name: "testing2",
                email: "dummy@admin.com",
                password: "test",
                permission: "admin"

            }

            chai.request(server)
                .post('/users')
                .send(user)
                .end(function (err, res) {

                    res.should.have.status(406);
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql('Username or email already exists!');
                    done();

                })
        });

        // Unit test for add student - negative scenario
        it('should not add a user when a permission is not given', function (done) {

            let user = {

                username: "dummy-admin",
                name: "testing2",
                email: "dummy@admin.com",
                password: "test",
                permission: ""

            };

            chai.request(server)
                .post('/users')
                .send(user)
                .end(function (err, res) {

                    res.should.have.status(406);
                    done();
                })


        });

        // Unit test for add student - negative scenario
        it('should not add a user when the email is not given', function (done) {

            let user = {

                username: "dummy-admin",
                name: "testing2",
                email: "",
                password: "test",
                permission: ""

            };

            chai.request(server)
                .post('/users')
                .send(user)
                .end(function (err, res) {

                    res.should.have.status(406);
                    done();
                })


        });


    })

    // Unit tests for GET routes
    describe('GET users', function () {

        // Unit test for get all users route
        it('should get all the users', function (done) {

            chai.request(server)
                .get('/users')
                .end(function (err, res) {

                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();

                })

        });

        // Unit test for get student by student ID route
        it('should get student details', function (done) {

            chai.request(server)
                .get('/students/123760')
                .end(function (err, res) {

                    res.should.have.status(200);
                    res.body.should.have.property('username');
                    res.body.should.have.property('name');
                    res.body.should.have.property('email');
                    res.body.should.have.property('permission').eql('student');
                    res.body.should.have.property('studentId').eql("123760");
                    res.body.should.have.property('class');
                    res.body.should.have.property('level');
                    done();

                })
        });

        // Unit test for login route - positive scenario
        it('should return token', function (done) {

            let credentials = {

                username: "test-user",
                password: "test"

            }
            chai.request(server)
                .post('/users/authenticate')
                .send(credentials)
                .end(function (err, res) {

                    res.should.have.status(200);
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('message').eql('User authenticated!');
                    res.body.should.have.property('token')
                    token = res.body.token;
                    done();

                })
        });

        // Unit test for login route - negative scenario
        it('should not authenticate without password', function (done) {

            let credentials = {

                username: "test-user",
                password: ""

            }

            chai.request(server)
                .post('/users/authenticate')
                .send(credentials)
                .end(function (err, res) {

                    res.should.have.status(401);
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql('Could not validate user!');
                    done();

                })
        });

        // Unit test for authorization route
        it('should authorize user when the token is available in the header', function (done) {

            chai.request(server)
                .get('/users/authorize')
                .set('x-access-token', token)
                .end(function (err, res) {

                    res.should.have.status(200);
                    res.body.should.have.property('username');
                    res.body.should.have.property('name');
                    res.body.should.have.property('email');
                    res.body.should.have.property('permission');
                    res.body.should.have.property('iat');
                    res.body.should.have.property('exp');
                    done();

                })

        });

        // Unit test for get Student details
        it('Should not get student details when ID is not given', function (done) {

            chai.request(server)
                .get('/students/')
                .end(function (err, res) {

                    res.should.have.status(404)
                    done();
                })
        })


    })

    // Unit tests for deleting users
    describe('DELETE users', function () {

        it('should delete the user when the _id is given', function (done) {

            let users = [
                {_id: stu_id}
            ];

            chai.request(server)
                .post('/users/delete')
                .send({"users": users})
                .end(function (err, res) {

                    res.should.have.status(200);
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('message').eql('User(s) deleted!');
                    done();

                })
        });

        it('should not delete a user when the _id is not given', function (done) {

            chai.request(server)
                .post('/users/delete')
                .send({})
                .end(function (err, res) {

                    res.should.have.status(304);
                    done();

                })
        })

    });

});

// Unit tests for user groups
describe('Group', function () {

    this.timeout(15000);


    // before(function (done) {
    //
    //     Group.collection.drop();
    //
    //     done();
    //
    // });

    after(function (done) {

        Group.collection.drop();

        done();
    })

    describe('POST', function () {

        // Unit test for add user group
        it('should add a user group when the details are given', function (done) {

            let group = {

                groupName: "Test Group",
                description: "This is a test group",
                allowedSections: [{sectionName: "Test Section"}],
                members: [{username: "Test User", email: "test@test.com"}]
            };
            
            chai.request(server)
                .post('/groups')
                .send(group)
                .end(function (err, res) {

                    res.should.have.status(201);
                    done();
                })
        })

        it('should not add a user group when members are not given', function (done) {

            let group = {

                groupName: "Test Group",
                description: "This is a test group",
                allowedSections: [{sectionName: "Test Section"}],
                members: null

            }

            chai.request(server)
                .post('/groups')
                .send(group)
                .end(function (err, res) {

                    res.should.have.status(406);
                    done();
                })
        });

    })
});

// Unit tests for notices
describe('Notice', function () {

    this.timeout(15000);

    // Unit test for POST
    describe('POST', function () {

        // Unit test for post notice
        it('should add a notice when details are given', function (done) {

            var newDate = new Date();

            let notice = {
                pdate:newDate,
                subject: "Test subject",
                tags: [{tag: "Test tag"}],
                description: "This is a test notice"
            };

            chai.request(server)
                .post('/notices')
                .send(notice)
                .end(function (err, res) {

                    res.should.have.status(201);
                    done();
                })
        });

        // Unit test for post notice - negative scenario
        it('should not add a notice without a subject', function (done) {

            var newDate = new Date();

            let notice = {
                pdate:newDate,
                subject: "",
                tags: [{tag: "Test tag"}],
                description: "This is a test notice"
            };

            chai.request(server)
                .post('/notices')
                .send(notice)
                .end(function (err, res) {

                    res.should.have.status(406);
                    done();
                });

        })
    });

    describe('GET', function () {

        //Unit test for get all notices
        it('should get all the notices', function (done) {

            chai.request(server)
                .get('/notices')
                .end(function (err, res) {

                    res.should.have.status(200);
                    done();
                })

        });
    })
});

// Unit tests for logs
describe('Logs', function () {

    this.timeout(15000);

    // Unit tests for POST methods
    describe('POST', function () {

        // Unit test for adding a new log
        it('should add a new log when details are given', function (done) {

            var ldate = new Date();
            let log = {

                ldate: ldate,
                description: "This is a test log"

            };

            chai.request(server)
                .post('/logs')
                .send(log)
                .end(function (err, res) {

                    res.should.have.status(201);
                    done();

                })
        })
    })

    // Unit tests for GET methods
    describe('GET', function () {

        it('should get all the logs', function (done) {

            chai.request(server)
                .get('/logs')
                .end(function (err, res) {

                    res.should.have.status(200);
                    done();
                })
        })
    })
})