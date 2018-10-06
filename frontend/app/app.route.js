/**
 * Created by nandunb on 9/19/17.
 */

'use strict';

angular.module('clms.routes', [
    'ui.router',
    'clms.analytics.route',
    'clms.attendance-mgt.route',
    'clms.classroom-mgt.route',
    'clms.content-mgt.route',
    'clms.dashboard.route',
    'clms.grade-mgt.route',
    'clms.notification-mgt.route',
    'clms.reminder-mgt.route',
    'clms.user-mgt.route'
])

.config(($stateProvider, $urlRouterProvider)=>{
    $urlRouterProvider
        .otherwise('/');

    $stateProvider
        .state('home',{
            url:'/',
            templateUrl: 'app/core/home.html'
        })
})