//dependencies
const mongoose = require('mongoose');
const Reminder = require('./reminder.module');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./server');
const should = chai.should();

chai.use(chaiHttp);

describe('Reminder', function () {

    this.timeout(15000);
    
    describe('GET reminders',function () {
        //get all reminders with username
        it('should get all the reminders',function (done) {

            chai.request(server)
                .get('/reminder/isuru')
                .end(function (err, res) {

                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                })
        })
    })

    describe('POST reminder',function () {
        //add a new reminder
        it('should get a reminder',function (done) {

            const reminder = new Reminder({

                reminderId:"12",
                title:"do home work",
                username:"isuru.p",
                insertedDate:new Date('207-10-02'),
                remindDate:new Date('2017-10-13'),
                description:"do all home works"
            });

            reminder.save(function (err) {
                chai.request(server)
                    .get('/reminder/isuru.p')
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        done();
                    })
            })
        })
    })

    describe('PUT reminders',function () {
        //update reminder with reminder ID
        it('should update reminder given reminder id',function (done) {

            const reminder = new Reminder({

                reminderId:"12",
                title:"do home work",
                username:"isuru.p",
                remindDate:new Date('2017-10-14'),
                description:"do all home works and compaire answers with other"
            });

            reminder.save(function (err,reminder) {

                chai.request(server)
                    .put('/reminder/12')
                    .send({
                        reminderId:"12",
                        title:"do home work",
                        username:"isuru.p",
                        remindDate:new Date('2017-10-14'),
                        description:"do all home works and compaire answers with other"})
                    .end(function (err, res) {
                        res.should.have.status(201);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Reminder updated');
                        done();
                    })

            })
        })

    });
    
    describe('DELETE reminder',function () {
        //delete reminder with given reminder id

        it('should delete reminder given reminder id',function (done) {

            chai.request(server)
                .delete('/reminder/12')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Reminder deleted');
                    done();
                })
        })
    });

    describe('POST reminder without user name',function () {
        //add reminder without user name
        it('should not save without user name', function (done) {

            const reminder = new Reminder({

                reminderId:"12",
                title:"do home work",
                username:"",
                remindDate:new Date('2017-10-14'),
                description:"do all home works and compaire answers with other"
            });

            chai.request(server)
                .post('/reminder')
                .send(reminder)
                .end(function (err, res) {

                    res.should.have.status(406);
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql('User name not set');
                    done();
                })
        })
    });

    describe('POST reminder without title',function () {

    //add reminder without title
    it('should not save without title', function (done) {

        const reminder = new Reminder({

            reminderId:"12",
            title:"",
            username:"Isuru.p",
            remindDate:new Date('2017-10-14'),
            description:"do all home works and compaire answers with other"
        });

        chai.request(server)
            .post('/reminder')
            .send(reminder)
            .end(function (err, res) {

                res.should.have.status(406);
                res.body.should.have.property('success').eql(false);
                res.body.should.have.property('message').eql('Title not set');
                done();
            })
    })
});

    describe('POST reminder without description',function () {
        //add reminder without description
        it('should not save without description', function (done) {

            const reminder = new Reminder({

                reminderId:"12",
                title:"do home work",
                username:"Isuru.p",
                remindDate:new Date('2017-10-14'),
                description:""
            });

            chai.request(server)
                .post('/reminder')
                .send(reminder)
                .end(function (err, res) {

                    res.should.have.status(406);
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql('Description not set');
                    done();
                })
        })
    });

})