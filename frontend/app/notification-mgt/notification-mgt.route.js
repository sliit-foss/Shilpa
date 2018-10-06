'use strict';

angular.module('clms.notification-mgt.route',[])

.config(($stateProvider, $urlRouterProvider)=>{

    $stateProvider
        .state('dashboard.notification', {
            url: '/notification',
            templateUrl: 'app/notification-mgt/templates/view.html',
            controller: 'notificationCtrl as notification'
        })
})