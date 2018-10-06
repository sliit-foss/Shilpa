angular.module('clms.grade-mgt', ['ngMessages']).config(['$mdIconProvider', function ($mdIconProvider) {

    $mdIconProvider.icon('md-close', 'img/icons/ic_close_24px.svg', 24);

}])

    .controller('gradeCtrl', function (GradeFactory, $mdToast, $mdDialog, $window) {

        const self = this;

        self.readonly = false;
        self.remarksTags = [];
        self.sGrades = [];
        self.sGradeKeys = [];
        self.studentGrades = [];
        self.viewGradeDetails = {};
        self.permission = $window.sessionStorage.getItem('permission');

        // Sets the permission of view student grades
        if (self.permission == "student") {

            self.studentView = true;

        } else if (self.permission == "teacher" || self.permission == "admin") {

            self.teacherView = true;
            self.studentView = true;

        }

        //Calculate average of a student
        this.calAvg = () => {

            var count = Object.keys(self.studentGrades.sGrades).length;
            var sum = 0;

            for (var x in self.studentGrades.sGrades)
                sum += parseInt(self.studentGrades.sGrades[x]);

            this.studentGrades.avg = parseFloat(sum / count).toFixed(2);

        }

        //Calculate average of a student
        this.calAvgUpdate = () => {

            var count = Object.keys(self.studentGrades.sGrades[0]).length;
            var z = self.studentGrades.sGrades[0];
            var sum = 0;

            for (var x in z)
                sum += parseInt(z[x]);

            this.studentGrades.avg = parseFloat(sum / count).toFixed(2);

        }

        //Save grade details of a student
        this.saveGrades = () => {

            this.studentGrades.remarks = self.remarksTags;

            GradeFactory.saveGrade(self.studentGrades).then(function (data) {

                if (data.status == 200) {

                    self.showToast('success-toast', data.data.message);

                    self.Clear();

                }

                else {

                    self.showToast('error-toast', data.data.message);

                }

            })
        }

        //Update grade details of a student
        this.updateGrade = () => {

            this.studentGrades.remarks = self.remarksTags;

            GradeFactory.updateGrade(self.studentGrades).then(function (data) {

                if (data.status == 200) {

                    self.showToast('success-toast', data.data.message);

                    self.Clear();

                }

                else {

                    self.showToast('error-toast', data.data.message);

                }

            })
        }

        //Get all the grade details of a student by passing studentID
        this.getGradesById = () => {

            GradeFactory.getGradesById(self.studentGrades.sID).then((data) => {

                self.sGrades = data.data;
                self.sGradeKeys = Object.keys(self.sGrades[0].sGrades[0]);


            })
        }

        //Get all the student details of a student by passing studentID to Auth service
        this.getStudentsById = (id) => {

            GradeFactory.getStudentsById(id).then((data) => {

                this.studentGrades = data.data;
                this.studentGrades.avg = 0;

            })
        }
        this.getGradeDetailsByFilter = () => {

            GradeFactory.getGradeDetailsByFilter(self.studentGrades.sID, self.studentGrades.sClass, self.studentGrades.cTerm).then((data) => {

                this.studentGrades = data.data;
                this.studentGrades = this.studentGrades[0];
                this.studentGrades.avg = 0;

            })
        }

        //Get all the grade details of a student by passing studentClass
        this.getGradeDetailsByClass = () => {

            GradeFactory.getGradeDetailsByClass(self.studentGrades.sClass).then((res) => {

                self.sGrades = res.data;

            })
        }

        //Clear all the forms and reset values
        this.Clear = () => {

            this.studentGrades = [];
            this.remarksTags = [];
            this.studentGrades.avg = 0;
            this.sGrades = [];

        }

        //Show toast messages
        this.showToast = function (type, message) {

            $mdToast.show(
                $mdToast.simple()

                    .textContent(message)
                    .position('bottom')
                    .theme(type)
                    .hideDelay(1500)
                    .parent('userForm')
            );
        }

        //Show the marks dailog box in student reoport card view
        self.showMarkDialog = function (event, $index) {

            GradeFactory.setGradeDetails(self.sGrades[$index]);

            $mdDialog.show({

                controller: "markCtrl as mark",
                templateUrl: "./app/grade-mgt/templates/show-marks.html",
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,

            })

                .then(function () {

                }, function () {

                });


        };


        //Show the marks dailog box in student report card view
        self.showClassMarkDialog = function (event, $index) {

            GradeFactory.setGradeDetails(self.sGrades[$index]);

            $mdDialog.show({

                controller: "markCtrl as mark",
                templateUrl: "./app/grade-mgt/templates/show-class-marks.html",
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,

            })
                .then(function () {

                }, function () {

                });


        };
    })

    //Mark controller to set the marks taken form grade factory
    .controller('markCtrl', function (GradeFactory, $mdDialog) {

        var self = this;

        self.markDetails = GradeFactory.getGradeDetails();

        // Cancel the  opened dialog box
        self.cancel = function () {

            $mdDialog.cancel();

        }
    })