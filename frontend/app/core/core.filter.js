/**
 * Created by nandunb on 10/17/17.
 */

'use strict';

angular.module('clms.core.filters', [])

    .filter('ago', function () {
        return function (input) {
            var date = new Date(input);
            var diff = Math.floor((new Date() - date) / 1000);

            var units = {
                'year': 31536000,
                'month': 2592000,
                'day': 86400,
                'hour': 3600,
                'minute': 60,
                'second': 1
            };

            var counter;
            for (var index in units) {
                counter = Math.floor(diff/units[index]);
                if (counter == 1) {
                    return counter + ' ' + index + ' ago';
                }else if(counter > 1){
                    return counter + ' ' + index + 's ago';
                }
            }

        };
    })


.filter('before', function () {
    return function (input, deadline) {
        var date = new Date(input);
        var deadlineDate = new Date(deadline);

        var units = {
            'year': 31536000,
            'month': 2592000,
            'day': 86400,
            'hour': 3600,
            'minute': 60,
            'second': 1
        };

        var counter;

        if(date < deadlineDate){
            var diff = Math.floor((deadlineDate - date) / 1000);

            for (var index in units) {
                counter = Math.floor(diff/units[index]);
                if (counter == 1) {
                    return counter + ' ' + index + ' before deadline.';
                }else if(counter > 1){
                    return counter + ' ' + index + 's before deadline.';
                }
            }
        }else{
            var diff = Math.floor((date - deadlineDate) / 1000);

            for (var index in units) {
                counter = Math.floor(diff/units[index]);
                if (counter == 1) {
                    return counter + ' ' + index + ' after deadline.';
                }else if(counter > 1){
                    return counter + ' ' + index + 's after deadline.';
                }
            }
        }



    };
});