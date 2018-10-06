
angular.module('clms.reminder-mgt')

    .factory('Reminder',['$http',function ($http) {

        const reminderFactory = {};

        reminderFactory.getReminderByUsernameAndDate = function (username) {

            return $http.get("http://localhost:9016/reminder/".concat(username+'&needDate')).then(function (res) {
                return res;
            })
        }

        reminderFactory.getReminderByUsername = function (username) {

            return $http.get("http://localhost:9016/reminder/".concat(username+'&noNeedDate')).then(function (res) {
                return res;
            })
        }

        //save new reminder
        reminderFactory.addReminder = function (reminderDetails) {

            return $http.post("http://localhost:9016/reminder", reminderDetails).then(function (res) {

                return res;
            })
        }

        reminderFactory.updateReminder = function (details,reminderId) {

            return $http.put("http://localhost:9016/reminder/".concat(reminderId), details).then(function (res) {

                return res;
            })
        }

        reminderFactory.deleteReminder = function (id) {

            return $http.delete("http://localhost:9016/reminder/".concat(id)).then(function (res) {

                return res;
            })
        }

        return reminderFactory;
    }]);
