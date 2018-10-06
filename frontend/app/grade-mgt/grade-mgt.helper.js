angular.module('clms.grade-mgt')

    .factory('GradeFactory', function ($http) {
        let fac = {};
        var gradeDetails = {};

        //Save grade details of a student
        fac.saveGrade = (data) => {
            return $http.post('http://localhost:9008/grades', data).then((data) => {
                return data;
            }).catch((err) => {
                return err;
            })
        }

        //Update grade details of a student
        fac.updateGrade = (data) => {
            return $http.put('http://localhost:9008/students/'+data.sID+'/terms/'+data.cTerm+'/classes/'+data.sClass+'/grades', data).then((data) => {
                return data;
            }).catch((err) => {
                return err;
            })
        }

        //Get all the grade details of a student by passing studentID
        fac.getGradesById = (id) => {
            return $http.get('http://localhost:9008/grades/students/'.concat(id)).then((data) => {
                return data;
            }).catch((err) => {
                return err;
            })
        }

        //Get all the grade details of a student by passing studentClass
        fac.getGradeDetailsByClass = (classname) => {
            return $http.get('http://localhost:9008/grades/classes/'.concat(classname)).then((data) => {
                return data;
            }).catch((err) => {
                return err;
            })
        }

        //Get all the grade details of a student by passing studentClass,StudentID,StudentTerm
        fac.getGradeDetailsByFilter = (id, classname, term) => {

            return $http.get('http://localhost:9008/students/' + id + '/classes/' + classname + '/terms/' + term + '/grades').then((data) => {
                return data;
            }).catch((err) => {
                return err;
            })
        }

        //Get all the student details of a student by passing studentID to Auth service
        fac.getStudentsById = (id) => {
            return $http.get('http://localhost:9001/students/'.concat(id)).then((data) => {
                return data;
            }).catch((err) => {
                return err;
            })
        }

        //Set grade details of a student
        fac.setGradeDetails = (details) => {
            gradeDetails = details;

        }

        fac.getGradeDetails = () => {
            return gradeDetails;
        }

        return fac;
    })