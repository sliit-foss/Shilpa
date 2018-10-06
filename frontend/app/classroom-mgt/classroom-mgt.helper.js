/**
 * Created by yoosufaadil on 9/19/17.
 */
'use strict';

angular.module('clms.classroom-mgt',[])

    .factory('Student',['$http',function ($http) {
        const studentFactory = {};
        var selectedStudents = [];

        studentFactory.getStudents = function () {

            return $http.get('http://localhost:9003/students').then(function (res) {
                return res;
            })

        };

        studentFactory.getStudentbyClass = function(data){

            return $http.get('http://localhost:9003/students/' + data).then(function (res) {
                return res;
            })

        };

        studentFactory.getStudentbyAdmission = function(data){

            return $http.get('http://localhost:9001/students/' + data).then(function (res) {
                return res;
            })

        };

        studentFactory.addStudent = function (data) {

            return $http.post('http://localhost:9003/students', data).then(function (res) {
                return res;
            })

        };

        studentFactory.deleteStudent = function (data) {

            return $http.delete('http://localhost:9003/students/delete', data).then(function (res) {
                return res;
            })

        };

        studentFactory.deleteStudentbyAdmission = function (data) {

            return $http.delete('http://localhost:9003/students/' + data).then(function (res) {
                return res;
            })

        };

        studentFactory.setSelectedStudents = function (studentData) {

            selectedStudents = studentData;

        }

        studentFactory.getSelectedStudents = function () {

            selectedStudents.map(function (st) {

                st.wanted = true;

                return st;

            })

            return selectedStudents;

        }

        return studentFactory;
    }])
    .factory('Timetable',['$http',function($http){

        const timetableFactory = {};

        timetableFactory.getTimetables = function () {

            return $http.get('http://localhost:9003/timetables').then(function (res) {
                return res;
            })

        };

        timetableFactory.getTimetable = function (data) {

            return $http.get('http://localhost:9003/timetables/' + data).then(function (res) {
                return res;
            })

        };

        timetableFactory.addTimetable = function (data) {

            return $http.post('http://localhost:9003/timetables', data).then(function (res) {
                return res;
            })

        };

        timetableFactory.updateTimetable = function (data) {

            return $http.put('http://localhost:9003/timetables/'+data.class, data).then(function (res) {

                return res;

            }).catch(function (err) {

                return err;

            })
        }

        return timetableFactory;

    }])
    .factory('Lessonplan',['$http',function($http) {

        const lessonplanFactory = {};

        lessonplanFactory.getLessonplans = function () {

            return $http.get('http://localhost:9003/lessonplans').then(function (res) {
                return res;
            })

        };

        lessonplanFactory.getLessonplan = function (data) {

            return $http.get('http://localhost:9003/lessonplans/' + data).then(function (res) {
                return res;
            })

        };

        lessonplanFactory.addLessonplan = function (data) {

            return $http.post('http://localhost:9003/lessonplans', data).then(function (res) {
                return res;
            })

        };

        lessonplanFactory.updateLessonplan = function (data) {

            return $http.put('http://localhost:9003/lessonplans/'+data.class, data).then(function (res) {

                return res;

            }).catch(function (err) {

                return err;

            })
        }

        return lessonplanFactory;

    }])
    .factory('Classroom',['$http',function ($http) {
        const classroomFactory = {};

        classroomFactory.getClassroom= function () {

            return $http.get('http://localhost:9003/classrooms').then(function (res) {
                return res;
            })

        };

        classroomFactory.addClassroom = function (data) {

            return $http.post('http://localhost:9003/classrooms', data).then(function (res) {
                return res;
            })

        };

        classroomFactory.deleteClassroom = function (data) {

            return $http.delete('http://localhost:9003/classrooms/' + data).then(function (res) {
                return res;
            })

        };

        return classroomFactory;
    }])
    // .factory('Message',['$http',function ($http) {
    //     const messageFactory = {};
    //
    //     messageFactory.sendMessage = function (data) {
    //
    //         return $http.post('http://localhost:9003/messages', data).then(function (res) {
    //             return res;
    //         })
    //
    //     };
    //
    //     return messageFactory;
    // }]);
    .factory('Mail', ['$http', function ($http) {

        const mailFactory = {};
        var mail = {};
        var controllerRef = null;

        mailFactory.getAllMails = function () {

            return $http.get('http://localhost:9006/mails').then(function (response) {

                return response;

            }).catch(function (err) {

                return err;
            });

        };

        mailFactory.setMail = function (mailData) {

            mail = mailData;

            $http.put('http://localhost:9006/mails/'+mail._id).then(function (response) {

            })
        }

        mailFactory.getMail = function () {

            return mail;
        }

        mailFactory.sendMail = function (mailData) {

            return $http.post('http://localhost:9006/mails', mailData).then(function (response) {

                return response;

            }).catch(function (err) {

                return err;

            })
        }

        return mailFactory;
    }]);