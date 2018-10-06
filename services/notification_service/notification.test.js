//dependencies
const mongoose = require('mongoose');
const Notification = require('./notification.model');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./server');
const should = chai.should();

chai.use(chaiHttp);

describe('Notification', function () {

    this.timeout(15000);

    describe('GET notifications',function () {
        //get all notification
        it('Should get all the notifications',function (done) {

            chai.request(server)
                .get('/notification/isuru.p')
                .end(function (err, res) {

                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    done();
                })
        })
    })
    
    describe('POST notification',function () {

        //add a new notification
        it('Should be a response',function (done) {

            const notification = new Notification({

                notificationId:"15",
                username :"isuruPrasd",
                class : "12-D",
                publishedDateTime:new Date('2017-05-02'),
                description : "there is a meeting tomorrow",
                title : "class meeting"

            });

            notification.save(function (err) {

                chai.request(server)
                    .get('/notification/isuru.p')
                    .end(function (err, res) {

                        res.should.have.status(201);
                        res.body.should.be.a('object');
                        done();
                    })
            })



            })

    })
    //add a new notification without class
    it('should not save without class name', function (done) {

        const notification = new Notification({

            notificationId:"15",
            username :"isuruPrasd",
            class : "",
            publishedDateTime:new Date('2017-05-02'),
            description : "there is a meeting tomorrow",
            title : "class meeting"

        });

        chai.request(server)
            .post('/notification')
            .send(notification)
            .end(function (err, res) {

                res.should.have.status(406);
                res.body.should.have.property('success').eql(false);
                res.body.should.have.property('message').eql('Class not set');
                done();
            })
    });

    //add a new notification without date
    it('should not save without published date', function (done) {

        const notification = new Notification({

            notificationId:"15",
            username :"isuruPrasd",
            class : "13-D",
            publishedDateTime:"",
            description : "there is a meeting tomorrow",
            title : "class meeting"

        });

        chai.request(server)
            .post('/notification')
            .send(notification)
            .end(function (err, res) {

                res.should.have.status(406);
                res.body.should.have.property('success').eql(false);
                res.body.should.have.property('message').eql('Published date and time not set');
                done();
            })
    });

    //add a new notification without user name
    it('should not save without user name', function (done) {

        const notification = new Notification({

            notificationId:"15",
            username :"",
            class : "13-D",
            publishedDateTime:new Date('2017-05-02'),
            description : "there is a meeting tomorrow",
            title : "class meeting"

        });

        chai.request(server)
            .post('/notification')
            .send(notification)
            .end(function (err, res) {

                res.should.have.status(406);
                res.body.should.have.property('success').eql(false);
                res.body.should.have.property('message').eql('Username not set');
                done();
            })
    });

    //add a new notification without title
    it('should not save without title', function (done) {

        const notification = new Notification({

            notificationId:"15",
            username :"IsuruPrasad",
            class : "13-D",
            publishedDateTime:new Date('2017-05-02'),
            description : "there is a meeting tomorrow",
            title : ""

        });

        chai.request(server)
            .post('/notification')
            .send(notification)
            .end(function (err, res) {

                res.should.have.status(406);
                res.body.should.have.property('success').eql(false);
                res.body.should.have.property('message').eql('Title not set');
                done();
            })
    });

    //add a new notification without title
    it('should not save without description', function (done) {

        const notification = new Notification({

            notificationId:"15",
            username :"IsuruPrasad",
            class : "13-D",
            publishedDateTime:new Date('2017-05-02'),
            description : "",
            title : "class meeting"

        });

        chai.request(server)
            .post('/notification')
            .send(notification)
            .end(function (err, res) {

                res.should.have.status(406);
                res.body.should.have.property('success').eql(false);
                res.body.should.have.property('message').eql('Description not set');
                done();
            })
    });
})




