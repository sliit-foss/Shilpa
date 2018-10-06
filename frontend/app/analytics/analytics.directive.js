angular.module('clms.analytics')

    .directive('anlyticsStudent', function(){

        return {
            templateUrl: 'app/analytics/templates/main-view-student.html'
        };
    })
    .directive('anlyticsTeacher', function(){

        return {
            templateUrl: 'app/analytics/templates/main-view-teacher.html'
        };
    })


