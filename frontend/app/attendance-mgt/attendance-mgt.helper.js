angular.module('clms.attendance-mgt')

    .factory('AttendanceFactory', function ($http) {
        let fac = {};
        var attendanceDetails = {};

        //Save attendance details of a student
        fac.saveAttendance = (data) => {
            return $http.post('http://localhost:9009/attendances', data).then((data) => {
                return data;
            }).catch((err) => {
                return err;
            })
        }


        //Get all the attendance details of a student by passing studentClass,Date
        fac.getAttendanceDetailsByFilter = (classname, date) => {
            return $http.get('http://localhost:9009/classes/' + classname + '/dates/' + date + '/attendances').then((data) => {
                return data;
            }).catch((err) => {
                return err;
            })
        }

        //Get class details of a class from Class room service
        fac.getStudentListByClass = (classname) => {
            return $http.get('http://localhost:9003/students/'+classname+'').then((data) => {
                return data;
            }).catch((err) => {
                return err;
            })
        }


        return fac;
    })