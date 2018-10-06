/**
 * Created by nandunb on 9/19/17.
 */

'use strict';

angular.module('clms.dashboard.route', [])

.config(($stateProvider, $urlRouterProvider)=>{
    $urlRouterProvider
        .otherwise('/');

    $stateProvider
        .state('dashboard',{
            url:'/dashboard',
            templateUrl: 'app/dashboard/dashboard.html',
            controller: 'dashboardCtrl as dash'
        })

        .state('dashboard.feed',{
            url:'/feed',
            templateUrl: 'app/dashboard/feed.html',
            controller: 'feedCtrl as feed'
        })

})