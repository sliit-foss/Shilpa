/**
 * Created by yoosufaadil on 10/18/17.
 */

'use strict'

// Dependencies
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const Student = require('./class.model');
const Timetable = require('./timetable.model');
const Lessonplan = require('./lessonplan.model');
const Classroom = require('./classroom.model');
const server = require('./server');

const should = chai.should();

chai.use(chaiHttp);

// class.model
describe('Student', function () {

    this.timeout(15000);
    var stu_id = null;

    let newStudent = new Student({

        sname: "dummy-student",
        admissionNo: "dummy-no",
        class: "dummy-class"

    });


    // Unit tests for POST routes
    describe('POST students', function () {

        // Unit test for add student route - add student
        it('should add a student when details are given', function (done) {

            const student = new Student({

                sname: "test-student",
                admissionNo: "testing-no",
                class: "testing-class"

            });

            chai.request(server)
                .post('/students')
                .send(student)
                .end(function (err, res) {

                    res.should.have.status(201);
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('message').eql('Student Added!');
                    done();
                })
        });

        // Unit test for add student route - add student with an existing admission no
        it('should not add a student with an existing admissionNo', function (done) {

            const student = new Student({

                sname : "test-student2",
                admissionNo: "testing-no",
                class: "testing-class"

            });

            chai.request(server)
                .post('/students')
                .send(student)
                .end(function (err, res) {

                    res.should.have.status(406);
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql('Admission Number already exists');
                    done();

                })
        });

        it('should not add a student without sname', function (done) {

            const student = new Student({

                sname : "",
                admissionNo: "testing-no",
                class: "testing-class"

            });

            chai.request(server)
                .post('/students')
                .send(student)
                .end(function (err, res) {

                    res.should.have.status(406);
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql('Name is not set');
                    done();

                })
        });

        it('should not add a student without admissionNo', function (done) {

            const student = new Student({

                sname : "test-name",
                admissionNo: "",
                class: "testing-class"

            });

            chai.request(server)
                .post('/students')
                .send(student)
                .end(function (err, res) {

                    res.should.have.status(406);
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql('Admission Number is not set');
                    done();

                })
        });

    });

    // Unit tests for GET routes
    describe('GET students', function () {

        // Unit test for get all students route
        it('should get all the students', function (done) {

            chai.request(server)
                .get('/students')
                .end(function (err, res) {

                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();

                })

        });

    });

    // Unit tests for deleting students
    describe('DELETE students', function () {

        it('should not delete a student when the admissionNo is not given', function (done) {

            chai.request(server)
                .delete('/students/:delete')
                .send({})
                .end(function (err, res) {

                    res.should.have.status(401);
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql('Admission No is not set!');
                    done();

                })
        })

    });

});

describe('Lessonplan', function () {

    this.timeout(15000);

    let newLessonplan = new Lessonplan({

        class: "dummy-student",
        term1: [{"subject" : "dummy-term1", "unit" : "dummy-unit"}],
        term2: [{"subject" : "dummy-term2", "unit" : "dummy-unit"}],
        term3: [{"subject" : "dummy-term3", "unit" : "dummy-unit"}]

    });


    describe('POST lessonplans', function () {

        // Unit test for add student route - add student
        it('should add a lessonplan when details are given', function (done) {

            const lessonplan = new Lessonplan({

                class: "test-class",
                term1: [
                    {
                        "subject" : "test",
                        "unit" : "test-unit"
                    },
                    {
                        "subject" : "test",
                        "unit" : "test-unit"
                    }
                ],
                term2: [
                    {
                        "subject" : "test",
                        "unit" : "test-unit"
                    },
                    {
                        "subject" : "test",
                        "unit" : "test-unit"
                    }
                ],
                term3: [
                    {
                        "subject" : "test",
                        "unit" : "test-unit"
                    },
                    {
                        "subject" : "test",
                        "unit" : "test-unit"
                    }
                ]

            });

            chai.request(server)
                .post('/lessonplans')
                .send(lessonplan)
                .end(function (err, res) {

                    res.should.have.status(201);
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('message').eql('Lessonplan Added!');
                    done();
                })
        });

    });

    // Unit tests for GET route
    describe('GET lessonplan', function () {

        // Unit test for get all lessonplan route
        it('should get all the lessonplan', function (done) {

            chai.request(server)
                .get('/lessonplans')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                })

        });

    });


    describe('PUT lessonplan',function () {
        //update lesson plan
        it('should update lessonplan given class',function (done) {

            const lessonplan = new Lessonplan({

                class: "test-class",
                term1: [
                    {
                        "subject" : "test",
                        "unit" : "test-unit"
                    },
                    {
                        "subject" : "test",
                        "unit" : "test-unit"
                    }
                ],
                term2: [
                    {
                        "subject" : "test",
                        "unit" : "test-unit"
                    },
                    {
                        "subject" : "test",
                        "unit" : "test-unit"
                    }
                ],
                term3: [
                    {
                        "subject" : "test",
                        "unit" : "test-unit"
                    },
                    {
                        "subject" : "test",
                        "unit" : "test-unit"
                    }
                ]

            });

            lessonplan.save(function (err,lessonplan) {

                chai.request(server)
                    .put('/lessonplans/test-class')
                    .send({
                        class: "test-class",
                        term1: [
                            {
                                "subject" : "test-update",
                                "unit" : "test-unit"
                            },
                            {
                                "subject" : "test-update",
                                "unit" : "test-unit"
                            }
                        ],
                        term2: [
                            {
                                "subject" : "test-update",
                                "unit" : "test-unit"
                            },
                            {
                                "subject" : "test",
                                "unit" : "test-unit"
                            }
                        ],
                        term3: [
                            {
                                "subject" : "test",
                                "unit" : "test-unit"
                            },
                            {
                                "subject" : "test",
                                "unit" : "test-unit"
                            }
                        ]

                    })
                    .end(function (err, res) {
                        res.should.have.status(201);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Lessonplan updated!');
                        done();
                    })

            })
        })

    });

})

describe('Timetable', function () {

    this.timeout(15000);

    let newTimetable = new Timetable({

        class: "dummy-student",
        monday: [{"subject": "dummy-monday"}],
        tuesday: [{"subject": "dummy-tuesday"}],
        wednesday: [{"subject": "dummy-wednesday"}],
        thursday: [{"subject": "dummy-thursday"}],
        friday: [{"subject": "dummy-friday"}]

    });


    describe('POST timetables', function () {

        // Unit test for add student route - add student
        it('should add a timetable when details are given', function (done) {

            const timetable = new Timetable({

                class: "test-class",
                monday: [
                    {
                        "subject": "test"
                    },
                    {
                        "subject": "test"
                    }
                ],
                tuesday: [
                    {
                        "subject": "test"
                    },
                    {
                        "subject": "test"
                    }
                ],
                wednesday: [
                    {
                        "subject": "test"
                    },
                    {
                        "subject": "test"
                    }
                ],
                thursday: [
                    {
                        "subject": "test"
                    },
                    {
                        "subject": "test"
                    }
                ],
                friday: [
                    {
                        "subject": "test"
                    },
                    {
                        "subject": "test"
                    }
                ]

            });

            chai.request(server)
                .post('/timetables')
                .send(timetable)
                .end(function (err, res) {

                    res.should.have.status(201);
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('message').eql('Timetable Added!');
                    done();
                })
        });

    })

    // Unit tests for GET route
    describe('GET timetable', function () {

        // Unit test for get all Timetable route
        it('should get all the timetable', function (done) {

            chai.request(server)
                .get('/timetables')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                })

        });

    });

    describe('PUT timetable', function () {
        //update timetable
        it('should update timetable if the class is given', function (done) {

            const timetable = new Timetable({

                class: "test-class",
                monday: [
                    {
                        "subject": "test"
                    },
                    {
                        "subject": "test"
                    }
                ],
                tuesday: [
                    {
                        "subject": "test"
                    },
                    {
                        "subject": "test"
                    }
                ],
                wednesday: [
                    {
                        "subject": "test"
                    },
                    {
                        "subject": "test"
                    }
                ],
                thursday: [
                    {
                        "subject": "test"
                    },
                    {
                        "subject": "test"
                    }
                ],
                friday: [
                    {
                        "subject": "test"
                    },
                    {
                        "subject": "test"
                    }
                ]

            });

            timetable.save(function (err, timetable) {

                chai.request(server)
                    .put('/timetables/test-class')
                    .send({
                        class: "test-class",
                        monday: [
                            {
                                "subject": "test-update"
                            },
                            {
                                "subject": "test-update"
                            }
                        ],
                        tuesday: [
                            {
                                "subject": "test"
                            },
                            {
                                "subject": "test"
                            }
                        ],
                        wednesday: [
                            {
                                "subject": "test"
                            },
                            {
                                "subject": "test"
                            }
                        ],
                        thursday: [
                            {
                                "subject": "test"
                            },
                            {
                                "subject": "test"
                            }
                        ],
                        friday: [
                            {
                                "subject": "test"
                            },
                            {
                                "subject": "test"
                            }
                        ]

                    })
                    .end(function (err, res) {
                        res.should.have.status(201);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Timetable updated!');
                        done();
                    })

            })
        })

    })
})

describe('Classroom', function () {

    this.timeout(15000);

    let newClassroom = new Classroom({

        class : "dummy-class",
        classtr : "dummy-teacher"


    });


    describe('POST classrooms', function () {

        // Unit test for add classroom route - add classroom
        it('should add a classroom when details are given', function (done) {

            const classroom = new Classroom({

                class : "test-class",
                classtr : "test-teacher"

            });

            chai.request(server)
                .post('/classrooms')
                .send(classroom)
                .end(function (err, res) {

                    res.should.have.status(201);
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('message').eql('Classroom Added!');
                    done();
                })
        });

        // Unit test for add classroom route - add classroom with an existing class
        it('should not add a classroom with an existing class', function (done) {

            const classroom = new Classroom({

                class : "test-class",
                classtr: "testing-teacher-2"

            });

            chai.request(server)
                .post('/classrooms')
                .send(classroom)
                .end(function (err, res) {

                    res.should.have.status(406);
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql('Class or Class Teacher already exists');
                    done();

                })
        });

        it('should not add a classroom without a class', function (done) {

            const classroom = new Classroom({

                class : "",
                classtr: "testing-teacher-2"

            });

            chai.request(server)
                .post('/classrooms')
                .send(classroom)
                .end(function (err, res) {

                    res.should.have.status(406);
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql('Class is not set');
                    done();

                })
        });

        it('should not add a classroom without a class teacher', function (done) {

            const classroom = new Classroom({

                class : "testing-class",
                classtr: ""

            });

            chai.request(server)
                .post('/classrooms')
                .send(classroom)
                .end(function (err, res) {

                    res.should.have.status(406);
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql('Class Teacher is not set');
                    done();

                })
        });


    })

    // Unit tests for GET route
    describe('GET classroom', function () {

        // Unit test for get all Timetable route
        it('should get all the classroom', function (done) {

            chai.request(server)
                .get('/classrooms')
                .end(function (err, res) {
                    res.body.should.be.a('array');
                    done();
                })

        });

    })

    // Unit tests for deleting classroom
    describe('DELETE classrooms', function () {

        it('should delete the classroom when the class is given', function (done) {

            let classrooms = [
                {class: "test-class"}
            ];

            chai.request(server)
                .delete('/classrooms/:delete')
                .send({"classrooms": classrooms})
                .end(function (err, res) {

                    res.should.have.status(200);
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('message').eql('Class deleted!');
                    done();

                })
        })


    });

})