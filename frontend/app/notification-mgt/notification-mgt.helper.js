angular.module('clms.notification-mgt')

    .factory('Notification',['$http',function ($http) {
        const notificationFactory = {};

        notificationFactory.getNotificationByUsername = function (username) {
            return $http.get("http://localhost:9015/notification/".concat(username)).then(function (res) {
                return res;
            })
        }

        notificationFactory.addNotification = function (data) {
            return $http.post("http://localhost:9015/notification", data).then(function (res) {
                return res;
            })
        }

        notificationFactory.updateNotification = function (data) {
            return $http.put("http://localhost:9015/notification", data).then(function (res) {
                return res;
            })
        }

        notificationFactory.deleteNotification = function (id) {
            return $http.delete("http://localhost:9015/notification/".concat(id)).then(function (res) {
                return res;
            })
        }

        return notificationFactory;
    }]);
