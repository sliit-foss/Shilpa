'use strict';

angular.module('clms.reminder-mgt',[])
    .controller('reminderCtrl',function(Reminder,$mdDialog,$mdToast,$scope,$location) {

        const self = this;

        self.reminders = {};
        self.loggedUser = sessionStorage.getItem('username');
        self.reminderStatus = false;
        self.showAll = false;
        self.selectedItem = {};


        self.formData = {
            username : "",
            title : "",
            remindDate : "",
            description : ""
        };
        //set a min date for calander
        self.minDate = new Date();

        //set logged user name
        self.formData.username = self.loggedUser;

        //reset fields
        self.resetAddReminderForm = function () {
            //reset input fields
            self.formData.username = "";
            self.formData.title = "";
            self.formData.description = "";
            self.formData.remindDate = "";
        };

        //save reminder
        self.addNewReminder = function (reminderDeatils){

            if (self.formData.title != "" &&  self.formData.title != undefined &&
                self.formData.remindDate != "" && self.formData.title != undefined &&
                self.formData.descriptions != "" &&  self.formData.title != undefined &&
                self.formData.username != ""  && self.formData.title != undefined ) {

                    Reminder.addReminder(reminderDeatils).then(function (res) {

                        if (res.data.success) {

                            //show succes massage and refresh fileds
                            self.resetAddReminderForm();
                            $scope.addReminderForm.$setPristine();
                            $scope.addReminderForm.$setUntouched();

                            self.showToastMessage('success-toast', res.data.message);

                            self.fillTable();
                        }
                        else {

                            //show message
                            self.showToastMessage('error-toast', res.data.message);
                        }
                    });
            }

        };

        //fill the view reminder table
        self.fillTable = function () {

            self.reminderStatus = false;

            //fill reminder table
            if(self.showAll){

                Reminder.getReminderByUsername(self.loggedUser).then(function (res) {

                    self.reminders = res.data.message;

                    //show no date message
                    if(res.data.message.length == 0){

                        self.reminderStatus = true;
                    }

                })

            }else{

                self.reminders = {};

                Reminder.getReminderByUsernameAndDate(self.loggedUser).then(function (res) {

                    self.reminders = res.data.message;

                    //show no date  message
                    if(res.data.message.length == 0){

                        self.reminderStatus = true;
                    }
                })
            }
        }

        //fill table on loading
        self.fillTable();

        //show Toast message
        self.showToastMessage = function(type, message){

            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position('bottom')
                    .theme(type)
                    .hideDelay(2000)
            );

        };

        //show selected reminder on edit window
        self.showOnEditMode = function(item,ev) {

            self.selectedItem = item;

            $mdDialog
                .show({

                controller: popupController,
                templateUrl: 'app/reminder-mgt/templates/edit-reminder.html',
                parent: angular.element(document.body),
                    targetEvent: ev,
                clickOutsideToClose:true,
                    fullscreen:true

            })
                .then(function() {

                })
        };

        //controller for manage popups
        function popupController ($scope) {

            //set values on form
             $scope.editformData = angular.copy(self.selectedItem);
             $scope.editformData.remindDate = new Date(self.selectedItem.remindDate);
             $scope.minDate = self.minDate;

             //edit
            $scope.editReminder = function (editformData) {

                if ($scope.editformData.title != "" &&  $scope.editformData.title != undefined &&
                    $scope.editformData.remindDate != "" && $scope.editformData.remindDate != undefined &&
                    $scope.editformData.description != "" &&  $scope.editformData.description != undefined) {

                    Reminder.updateReminder(editformData,$scope.editformData.reminderId).then(function (res) {

                        //check response
                        if(res.data.success){

                            self.showToastMessage('success-toast', res.data.message);

                            //fill table after updating
                            self.fillTable();

                            //close the window
                            $mdDialog.cancel();

                        }
                        else{
                            self.showToastMessage('error-toast', res.data.message);
                        }

                    })
                }

            };
            
            $scope.deleteReminder = function () {

                Reminder.deleteReminder($scope.editformData.reminderId).then(function (res) {

                    //check response
                    if(res.data.success){

                        self.showToastMessage('success-toast', res.data.message);

                        //fill table after deleting
                        self.fillTable();

                        //close the window
                        $mdDialog.cancel();

                    }
                    else{
                        self.showToastMessage('error-toast', res.data.message);
                    }
                })
            }

        }
    })