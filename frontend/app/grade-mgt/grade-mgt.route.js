'use strict';

angular.module('clms.grade-mgt.route',[])

.config(($stateProvider, $urlRouterProvider)=>{
    //implement your states here
    $stateProvider
    .state('dashboard.grade',{
        url:'/grade',
        templateUrl: 'app/grade-mgt/add-grades-main.html',
        controller: 'gradeCtrl as grade',
        // permissions: ['admin', 'teacher']
    })
})

