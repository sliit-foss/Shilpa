'use strict'

angular.module('clms.notification-mgt')

    .controller('notificationCtrl',function (Notification,$location,$mdToast, $window) {

        const self = this;

        let user_role = $window.sessionStorage.getItem('permission');

        if(user_role == 'student'){
            self.isStudent = true;
            self.isTeacher = false;
        }else if(user_role == 'teacher'){
            self.isStudent = false;
            self.isTeacher = true;
        }

        //get current user name
        self.logedUser="";
        self.logedUser = sessionStorage.getItem('username');
        console.log('logged user: '+self.logedUser);

        self.notifications={};
        self.notificationForm = {};

        self.formData ={
            username : "",
            class : "",
            publishedDateTime : "",
            description : "",
            title :""
        };

        //store all available classes
        self.classes = [
            {"className":"12M"},
            {"className":"10C"},
            {"className":"13M"},
        ];
        self.userClass="";


        //get notifications using username
        Notification.getNotificationByUsername(self.logedUser).then(function (res) {

            if( res.status == 406){

                //manage error

            }else if(res.status == 204) {

                self.userClass = res.data.className;

            }else{

                self.notifications = res.data.message;
                self.userClass = res.data.className;
            }


        });

        //reset fields
        self.resetAddNotification = function () {

            //reset input fields
            self.formData.username = "";
                self.formData.title = "";
            self.formData.class = "";
            self.formData.description = "";
        };

        //validate and save notifications
        self.save = function (details) {

            //set username
                self.formData.username = self.logedUser;
            //set date
            self.formData.publishedDateTime = new Date();

            //validate
            if(self.formData.username != "" &&  self.formData.username != undefined &&
                self.formData.class != "" && self.formData.class != undefined &&
                self.formData.publishedDateTime != "" && self.formData.publishedDateTime != undefined &&
                self.formData.description != "" && self.formData.description != undefined &&
                self.formData.title != "" && self.formData.title != undefined
            ){
                //save
                Notification.addNotification(details).then(function (res) {

                    if(res.data.success){

                        //show message
                        self.showToastMessage('success-toast', res.data.message);

                        self.resetAddNotification();

                        self.notificationForm.$setPristine();
                        self.notificationForm.$setUntouched();
                    }
                    else{

                        //show message
                        self.showToast('error-toast', res.data.message);
                    }
                })
            }

        }

        //show Toast message
        self.showToastMessage = function(type, message){

            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position('bottom')
                    .theme(type)
                    .hideDelay(1500)
            );

        }
    })