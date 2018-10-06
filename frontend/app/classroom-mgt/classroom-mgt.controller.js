/**
 * Created by yoosufaadil on 9/19/17.
 */

'use strict';

angular.module('clms.classroom-mgt.controller', [])

    .controller('studentController', function (Student, $mdToast, $scope, $mdDialog, $timeout, $q) {
        const self = this;

        self.studentModel = {
            sname : "",
            admissionNo : ""
        };

        self.students = [];
        self.selected = [];

        self.limitOptions = [5, 10, 15];

        self.query = {
            order: 'sname',
            limit: 5,
            page: 1
        };

        self.results = [];
        self.studentM = {};

        self.searchStudents = function(data){
            Student.getStudentbyClass(data).then(function(res){
                self.results = res.data;
                console.log(res.data);
            }, err => {
                console.error(err);
            });
        };

        self.getStudentbyAdmission = function(data){
            Student.getStudentbyAdmission(data).then(function(res) {

                self.studentM = res.data;
                console.log(self.studentM);

                self.addStudenttoClass();

            }, err => {

                console.error(err);

            });
        };

        self.loadAllStudents = function () {

            Student.getStudents().then(function (res) {

                self.students = res.data;
                console.log(self.students);

            });

        };

        self.loadAllStudents();

        self.addStudenttoClass = function(){
            var studentM = {

                sname: self.studentM.name,
                admissionNo: self.studentM.studentId,
                class: self.studentM.class

            };

            self.addStudent(studentM);
        }

        self.addStudent = function (studentDetails){

            Student.addStudent(studentDetails).then(function (res) {

                if (res.data.success) {

                    self.students.push(studentDetails);
                    self.studentModel = {
                        sname : "",
                        admissionNo : ""

                    };

                    self.selected = [];
                    $scope.studentForm.$setPristine();
                    $scope.studentForm.$setUntouched();
                    self.showToast('success-toast', res.data.message);

                }
                else {

                    self.showToast('error-toast', res.data.message);

                }
            });

        };

        self.deleteStudent = function(admissionNo) {
            Student.deleteStudentbyAdmission(admissionNo).then(function (res) {

                if (res.data.success) {

                    self.showToast('success-toast', res.data.message);
                    self.loadAllStudents();

                } else {

                    self.showToast('error-toast', res.data.message);

                }

            })
        }

        self.showDeleteConfirmation = function (admissionNo) {

            var confirm = $mdDialog.confirm()
                .title('Do you need to delete the selected Student ?')
                .textContent('Selected Students will be deleted if you choose yes.')
                .targetEvent(event)
                .ok('YES')
                .cancel('NO');

            $mdDialog.show(confirm).then(function () {

                self.deleteStudent(admissionNo);

            })

        };

        self.showToast = function(type, message){

            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position('bottom')
                    .theme(type)
                    .hideDelay(1500)
                    .parent('studentForm')
            );

        }

        self.selectedItem  = null;
        self.searchText    = null;
        self.querySearch   = querySearch;

        function querySearch (query) {
            var results = query ? self.results.filter( createFilterFor(query) ) : self.results;
            var deferred = $q.defer();
            $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            return deferred.promise;
        }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(state) {
                return (state.studentId.indexOf(lowercaseQuery) === 0);
            };

        }
    })
    .controller('timetableController', function (Timetable, $mdToast, $scope, $mdDialog, $timeout) {
        const self = this;

        self.selectedIndex = 0;

        self.enableUpdateTab = false;

        self.timetable = {
            class : "",
            monday : [],
            tuesday : [],
            wednesday : [],
            thursday : [],
            friday : []
        };

        self.updateTimetable = {
            monday : [],
            tuesday : [],
            wednesday : [],
            thursday : [],
            friday : []
        };

        self.timetables = [];
        self.selected = [];

        self.limitOptions = [8, 10, 15];

        self.query = {
            order: 'subject',
            limit: 8,
            page: 1
        };

        self.subject = '';
        self.newTimetable = {
            class : "",
            monday : [],
            tuesday : [],
            wednesday : [],
            thursday : [],
            friday : []
        };

        self.day = {};
        self.day.Active = 2;

        self.updateTimetable = {};

        self.addSubject = function(day, subject) {

            switch(day){
                case '1':
                    self.newTimetable.monday.push({ subject: subject});
                    break;

                case '2':
                    self.newTimetable.tuesday.push({ subject: subject});
                    break;

                case '3':
                    self.newTimetable.wednesday.push({ subject: subject});
                    break;

                case '4':
                    self.newTimetable.thursday.push({ subject: subject});
                    break;

                case '5':
                    self.newTimetable.friday.push({ subject: subject});
                    break;

            }

            console.log(self.newTimetable);
        };

        self.addTimetable = function () {

            // if (self.timetable.class != "" &&  self.timetable.class != undefined &&
            //     self.timetable.monday != "" && self.timetable.monday != undefined &&
            //     self.timetable.tuesday != "" && self.timetable.tuesday != undefined &&
            //     self.timetable.wednesday != "" && self.timetable.wednesday != undefined &&
            //     self.timetable.thursday != "" && self.timetable.thursday != undefined &&
            //     self.timetable.friday != "" && self.timetable.friday != undefined  ) {

            Timetable.addTimetable(self.newTimetable).then(function (res) {

                if (res.data.success) {

                    self.timetables.push(self.newTimetable);
                    self.newTimetable = {

                        class: "",
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: []

                    };

                    self.selected = [];
                    $scope.timetableForm.$setPristine();
                    $scope.timetableForm.$setUntouched();
                    self.showToast('success-toast', res.data.message);
                }
                else {

                    self.showToast('error-toast', res.data.message);

                }
            });

            // }

        };


        self.loadAllTimetables = function () {

            Timetable.getTimetables().then(function (res) {

                self.timetables = res.data;

            });

        };

        self.getTimetable = function(time){
            Timetable.getTimetable(time).then(function(res){
                self.updateTimetable = res.data;
                console.log(self.updateTimetable);
            })
        }

        self.print = function(table){
            console.log(table);
        }

        self.loadAllTimetables();


        self.updateTable = function(table){
            Timetable.updateTimetable(table).then(function(res) {

                if(res.data.success) {

                    self.loadAllTimetables();
                    self.showToast('success-toast', res.data.message);
                    self.updateTimetable = {};
                }
                else {

                    self.showToast('error-toast', res.data.message);

                }




            });
        };

        /*self.navigateToTab = function (index) {

         self.selectedIndex = index;
         Object.assign(self.updateTimetable, self.selected[0]);

         self.isSelected();

         }

         self.isSelected = function () {

         if ( self.selected.length > 0 ) {

         self.enableUpdateTab = true;

         } else {

         self.showUpdateTab = null;

         }
         }

         self.updateSelectedTimetable = function () {

         Timetable.updateTimetable(self.updateTimetable).then(function (res) {

         if (res.data.success) {

         self.showToast('success-toast', res.data.message);
         self.loadAllTimetables();

         $timeout(function () {

         self.selectedIndex = 1;

         }, 2000)
         self.selected = [];
         } else {

         self.showToast('error-toast', res.data.message);

         }

         })

         };

         $scope.$watch('selected', function () {
         Timetable.setSelectedTimetable(self.selected);
         });
         */

        self.showToast = function(type, message){

            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position('bottom')
                    .theme(type)
                    .hideDelay(1500)
                    .parent('timetableForm')
            );

        }
    })
    .controller('lessonplanController', function (Lessonplan, $mdToast, $scope, $mdDialog, $timeout) {
        const self = this;

        self.selectedIndex = 0;

        self.lessonplans = [];
        self.selected = [];

        self.limitOptions = [5, 10, 15];

        self.query = {
            order: 'term1',
            limit: 5,
            page: 1
        };

        self.lessonplan = {
            class : "",
            term1 : [],
            term2 : [],
            term3 : []
        };

        self.newLessonplan = {
            class : "",
            term1 : [],
            term2 : [],
            term3 : []
        };

        self.updateLessonplan = {};

        self.loadAllLessonPlans = function () {

            Lessonplan.getLessonplans().then(function (res) {

                self.lessonplans = res.data;
                console.log(self.lessonplans);

            });

        };

        self.addLesson = function(term, subject, unit) {

            switch(term){
                case '1':
                    self.newLessonplan.term1.push({ subject: subject, unit: unit});
                    break;

                case '2':
                    self.newLessonplan.term2.push({ subject: subject, unit: unit});
                    break;

                case '3':
                    self.newLessonplan.term3.push({ subject: subject, unit: unit});
                    break;

            }

            console.log(self.newLessonplan);
            $scope.lessonplanForm.$setPristine();
            $scope.lessonplanForm.$setUntouched();

        };

        self.addLessonplan = function () {

            Lessonplan.addLessonplan(self.newLessonplan).then(function (res) {

                if (res.data.success) {

                    self.lessonplans.push(self.newLessonplan);
                    self.newLessonplan = {
                        class : "",
                        term1 : [],
                        term2 : [],
                        term3 : []
                    };
                    $scope.lessonplanForm.$setPristine();
                    $scope.lessonplanForm.$setUntouched();
                    self.selected = [];
                    self.showToast('success-toast', res.data.message);
                }
                else {

                    self.showToast('error-toast', res.data.message);

                }
            });

        };


        self.loadAllLessonPlans();

        self.getLessonplan = function(lesson){
            Lessonplan.getLessonplan(lesson).then(function(res){
                self.updateLessonplan = res.data;
                console.log(self.updateLessonplan);
            })
        }

        self.print = function(lesson){
            console.log(lesson);

        }


        self.updateLesson = function(lesson){
            Lessonplan.updateLessonplan(lesson).then(function(res) {

                self.loadAllLessonPlans();
                self.updateLessonplan = {};

            });
        };

        self.showToast = function(type, message){

            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position('bottom')
                    .theme(type)
                    .hideDelay(1500)
                    .parent('lessonplanForm')
            );

        }
    })
    .controller('classroomController', function (Classroom, $mdToast, $scope, $mdDialog, $timeout) {
        const self = this;

        self.classroom = {
            class : "",
            classtr : ""
        };

        self.classrooms = [];
        self.selected = [];

        self.limitOptions = [5, 10, 15];

        self.query = {
            order: 'classtr',
            limit: 5,
            page: 1
        };

        self.loadClassroom = function () {

            Classroom.getClassroom().then(function (res) {

                self.classrooms = res.data;
                console.log(self.classrooms);

            });

        };

        self.loadClassroom();

        self.addClassroom = function (classDetails){

            if (self.classroom.class != "" &&  self.classroom.class != undefined &&
                self.classroom.classtr != "" && self.classroom.classtr != undefined ) {

                Classroom.addClassroom(classDetails).then(function (res) {

                    if (res.data.success) {
                        self.classrooms.push(classDetails);

                        self.classroom = {
                            class : "",
                            classtr : ""
                        };

                        $scope.classroomForm.$setPristine();
                        $scope.classroomForm.$setUntouched();

                        self.selected = [];
                        self.showToast('success-toast', res.data.message);

                    }
                    else {

                        self.showToast('error-toast', res.data.message);

                    }
                });
            }

        };

        self.deleteClass = function(data) {

            Classroom.deleteClassroom(data).then(function (res) {
                if (res.data.success) {

                    self.showToast('success-toast', res.data.message);
                    self.loadClassroom();

                } else {

                    self.showToast('error-toast', res.data.message);

                }

            })
        }


        self.showDeleteConfirmation = function (data) {

            var confirm = $mdDialog.confirm()
                .title('Do you need to delete the selected Class ?')
                .textContent('Selected Class will be deleted if you choose yes.')
                .targetEvent(event)
                .ok('YES')
                .cancel('NO');

            $mdDialog.show(confirm).then(function () {

                self.deleteClass(data);

            })

        };

        self.showToast = function(type, message){

            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position('bottom')
                    .theme(type)
                    .hideDelay(1500)
                    .parent('classroomForm')
            );

        }
    })
    /*.controller('messageController', function (Message, $mdToast, $scope, $mdDialog, $timeout) {
        const self = this;

        self.message = {
            class : "",
            classtr : "",
            message : ""
        };

        self.messages = [];


        self.sendMessage = function (sendMessage){

            if (self.message.class != "" &&  self.message.class != undefined &&
                self.message.classtr != "" && self.message.classtr != undefined &&
                self.message.message != "" &&  self.message.message != undefined) {

                Message.sendMessage(sendMessage).then(function (res) {

                    if (res.data.success) {
                        self.messages.push(sendMessage);
                        $scope.messageForm.$setPristine();
                        $scope.messageForm.$setUntouched();

                        self.message = {
                            class : "",
                            classtr : "",
                            message : ""
                        };

                        self.showToast('success-toast', res.data.message);
                    }
                    else {

                        self.showToast('error-toast', res.data.message);

                    }
                });
            }

        };

        self.showToast = function(type, message){

            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position('bottom')
                    .theme(type)
                    .hideDelay(1500)
                    .parent('messageForm')
            );

        }
    });*/
    .controller('sendMailCtrl', function ($mdDialog, Mail, $mdToast, $timeout) {

        const self = this;

        self.mail = {

            toAddress: "",
            subject: "",
            message: ""

        };

        self.sendMail = function () {

            Mail.sendMail(self.mail).then(function (response) {

                if (response.data.success) {

                    $timeout(function () {

                        self.cancel();
                        self.showToast('success-toast', response.data.message, 'viewMail');

                    },1000)

                } else {

                    self.showToast('error-toast', response.data.message, 'sendMail');

                }
            })
        };

        self.cancel = function () {

            $mdDialog.cancel();

        }

        self.showToast = function(type, message, parent){

            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position('bottom')
                    .theme(type)
                    .hideDelay(1500)
                    .parent(parent)

            );

        }

    });
