'use strict';

angular.module('clms.analytics.route',[])

.config(($stateProvider, $urlRouterProvider)=>{

    $stateProvider
        .state('dashboard.analytics', {
            url: '/analytics/student',
            templateUrl: 'app/analytics/templates/main-view.html',
            controller: 'analyticsCtrl as analytics'
        })
})