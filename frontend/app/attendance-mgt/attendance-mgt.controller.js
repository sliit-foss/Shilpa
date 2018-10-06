angular.module('clms.attendance-mgt', ['ngMessages']).config(['$mdIconProvider', function ($mdIconProvider) {

    $mdIconProvider.icon('md-close', 'img/icons/ic_close_24px.svg', 24);

}])

    .controller('attendanceCtrl', function (AttendanceFactory, $mdToast) {

        const self = this;

        self.sAttendance = [];
        self.dateAttendance = new Date();

        //Save Attendance details of a student
        this.saveAttendance = () => {

            AttendanceFactory.saveAttendance(self.sAttendance).then(function (data) {
                console.log(self.sAttendance);

                if (data.status == 200) {
                    self.showToast('success-toast', data.data.message);
                    self.Clear();
                }

                else {
                    self.showToast('error-toast', data.data.message);
                }

            })
        }

        //Get all attendance details by passing student class and date
        this.getAttendanceDetailsByFilter = () => {
            var month=self.dateAttendance.getMonth()+1;
            if(month<10)
                month='0'+month;

            var d=self.dateAttendance.getFullYear() + '-' +month+ '-' + self.dateAttendance.getDate();
            self.dateAttendance=d;
            AttendanceFactory.getAttendanceDetailsByFilter(self.sAttendance.sClass, self.dateAttendance).then((data) => {
                this.sAttendance = data.data;

            })
        }

        //Get all student list by passing student class
        this.getStudentListByClass = () => {

            AttendanceFactory.getStudentListByClass(self.sAttendance.sClass).then((data) => {

                this.sAttendance = data.data;

            })
        }


        //Clear all the forms and reset values
        this.Clear = () => {

            this.sAttendance = [];

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
    })