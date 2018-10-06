'use strict';

angular.module('clms.user-mgt.route',[])

.config(($stateProvider, $urlRouterProvider)=>{
    $urlRouterProvider
        .otherwise('/');

    $stateProvider
        .state('login',{
            url:'/login',
            templateUrl: 'app/user-mgt/login.html',
            controller: 'loginCtrl as login'
        })

        .state('dashboard.main-view',{
            url:'/administrator',
            templateUrl: 'app/user-mgt/main-view.html',
            controller: 'mainCtrl as main',
            permissions: ['admin']
        })

        .state('dashboard.main-view.console',{
            url:'/console',
            views: {
                'content':{
                    templateUrl: 'app/user-mgt/main-tab.html',
                    controller: 'mainCtrl as main'
                }
            },
            permissions: ['admin']

        })

        .state('dashboard.main-view.management', {
            url:'/management',
            views: {
                'content':{
                    templateUrl:'app/user-mgt/user-mgt.html',
                    controller: 'userCtrl as user'
                }
            },
            permissions: ['admin']

        })

        .state('dashboard.main-view.services', {
            url:'/services',
            views: {
                'content':{
                    templateUrl:'app/user-mgt/templates/user-services.html',
                    controller: 'serviceCtrl as service'
                }
            },
            permissions: ['admin']
        })

        .state('dashboard.main-view.logs', {
            url:'/logs',
            views: {
                'content':{
                    templateUrl:'app/user-mgt/templates/view-logs.html',
                    controller: 'logCtrl as logger'
                }
            },
            permissions: ['admin']
        })

        .state('dashboard.main-view.storage', {
            url:'/storage',
            views: {
                'content':{
                    templateUrl: 'app/user-mgt/templates/storage-manager.html'
                }
            },
            permissions: ['admin']
        })
})