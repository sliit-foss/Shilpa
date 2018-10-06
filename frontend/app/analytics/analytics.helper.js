'use strict'
angular.module('clms.analytics')

   .factory('Analytics',['$http',function ($http) {

       const analyticsFactory = {};

       analyticsFactory.getclassNames = function (username) {

           return $http.get("http://localhost:9011/analytics/student/initDetails/".concat(username)).then(function (res) {
               return res;
           })
       }
       analyticsFactory.getSelectedStudentHistory = function (sId) {

           return $http.get("http://localhost:9011/analytics/student/history/".concat(sId)).then(function (res) {
               return res;
           })
       }
       
       analyticsFactory.getAllMarks = function (marksDetails) {

           return $http.post("http://localhost:9011/analytics/student/marks",marksDetails).then(function (res) {

               return res;
           })
       }

       analyticsFactory.getAllStudentNames = function () {

         return  $http.get("http://localhost:9011/analytics/student").then(function (res) {
             return res;
         })

       }


       analyticsFactory.getAllClass = function () {

           return $http.get("http://localhost:9011/analytics/student/class").then(function (res) {

               return res;
           })
       }

       analyticsFactory.getAttendance = function () {

           return $http.get("http://localhost:9011/analytics/student/attendance/").then(function (res) {
               return res;
           })
       }

       analyticsFactory.getStudentClass = function (username) {

           return $http.get("http://localhost:9011/analytics/student/class/".concat(username)).then(function (res) {
               return res;
           })
       }

       
       return analyticsFactory;

   }])