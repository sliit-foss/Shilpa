'use strict'

angular.module('clms.dashboard')

    .factory('Dashboard', ['$http', function ($http) {

        const dashboardFactory = {};

        dashboardFactory.retrieveFeed = function () {

            return $http.get('http://localhost:9001/notices').then(function (response) {

                return response;

            }).catch(function (err) {

                return err;

            })
        };

        return dashboardFactory;

    }])