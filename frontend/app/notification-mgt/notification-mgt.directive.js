angular.module('clms.notification-mgt')

    .directive('notificationAdd', function(){

        return {
            templateUrl: 'app/notification-mgt/templates/add-notification.html'
        };
    })
    .directive('notificationView', function(){

        return {
            templateUrl: 'app/notification-mgt/templates/view-notification.html'
        };
    })


