/**
 * Created by nandunb on 9/19/17.
 */
'use strict';

angular.module('clms.content-mgt.route',[])

.config(($stateProvider, $urlRouterProvider)=>{
    //implement your states here
    $stateProvider
        .state('dashboard.content', {
            url: '/content',
            templateUrl: 'app/content-mgt/content.html'
        })

        .state('dashboard.storage', {
            url: '/storage',
            templateUrl: 'app/content-mgt/templates/personal-storage.html'
        })

        .state('dashboard.assignments', {
            url: '/assignments',
            templateUrl: 'app/content-mgt/templates/assignment-manager.html'
        })
})