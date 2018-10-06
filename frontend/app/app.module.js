/**
 * Created by Nandun Bandara on 9/18/17.
 */
'use strict';

angular.module('clms', [
    'clms.routes',
    'clms.core',
    'clms.analytics',
    'clms.attendance-mgt',
    'clms.classroom-mgt',
    'clms.content-mgt',
    'clms.dashboard',
    'clms.grade-mgt',
    'clms.notification-mgt',
    'clms.reminder-mgt',
    'clms.user-mgt',
    'clms.classroom-mgt.controller'
])

    .config(function($httpProvider){

        // Pushing auth interceptor into httpProvider
        $httpProvider.interceptors.push('AuthInterceptors');
    })

    .controller('testController', function($scope){
        this.message = "test message";
        $scope.testMessage = "$scope test message";
    })

    .run(function ($rootScope, $location, Auth, $window) {

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){

            if (!Auth.isLoggedIn()) {

                if (toState.url == '/') {

                    $location.path('/');

                } else {

                    $location.path('/login');

                }

            } else {

                Auth.getUserDetails().then(function (response) {

                    if (response) {

                        $rootScope.user = response.data;

                        if (toState.name == 'login') {

                            $location.path('/dashboard/feed')

                        }

                        if (toState.permissions) {

                            console.log(toState.url);

                            if ($rootScope.user) {

                                if($rootScope.user.permission != toState.permissions[0] && $rootScope.user.permission == "teacher") {

                                    $location.path("/dashboard/attendance");

                                } else if ($rootScope.user.permission == toState.permissions[0] && $rootScope.user.permission == "admin") {

                                    if (toState.url == "/attendance") {

                                        $location.path("/dashboard/attendance");

                                    } else {

                                        $location.path("/dashboard/administrator"+toState.url);

                                    }


                                } else {

                                    $location.path('/dashboard/feed');
                                }
                            }

                        }

                    } else {

                        $location.path('/login');

                    }
                })
            }

        })

    })
