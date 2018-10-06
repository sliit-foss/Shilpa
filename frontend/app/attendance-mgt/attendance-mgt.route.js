'use strict';

angular.module('clms.attendance-mgt.route', [])

    .config(($stateProvider, $urlRouterProvider) => {
        $stateProvider
            .state('dashboard.attendance', {
                url: '/attendance',
                templateUrl: 'app/attendance-mgt/add-attendance-main.html',
                controller: 'attendanceCtrl as attendance',
                permissions: ['admin', 'teacher']
            })
    })