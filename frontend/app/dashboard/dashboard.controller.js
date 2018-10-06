/**
 * Created by nandunb on 9/18/17.
 */
'use strict';

angular.module('clms.dashboard',[])

.controller('dashboardCtrl', function($mdSidenav, $mdDialog, $window, $location, Auth, $timeout){

    let self = this;
    self.username = $window.sessionStorage.username;
    self.name = $window.sessionStorage.name;
    self.permission = $window.sessionStorage.permission;
    self.email = $window.sessionStorage.email;
    self.userTitle = null;
    self.isLoading = false;
    self.notices = [];

    self.openUserSideBar = function() {
        $mdSidenav('right').toggle();
    };

    self.showNewClassroomPrompt = (ev)=>{
        let confirm = $mdDialog.prompt()
            .title('New Classroom')
            .placeholder('Classroom Name')
            .ok('Create')
            .cancel('Cancel');

        $mdDialog.show(confirm).then((result) => {
            $scope.status = 'You decided to name your dog ' + result + '.';
        }, () => {
            $scope.status = 'You didn\'t name your dog.';
        });
    }


    if (self.permission == "admin") {

        self.adminView = true;
        self.teacherView = true;
        self.studentView = true;

    } else if (self.permission == "student") {

        self.studentView = true;

    } else if (self.permission == "teacher") {

        self.teacherView = true;

    } else if (self.permission == "user") {

        self.userView = true;
        
    } 

    // Logout function for dashboard button
    self.logout = function () {

        self.isLoading = true;
        $timeout(function () {

            var logDate = new Date();
            var logData = {

                ldate: logDate,
                description: $window.sessionStorage.username + " logged out from the system at "
            }

            Auth.addLog(logData).then(function () {

            }).catch(function () {

            });

            Auth.logout();
            $location.path('/login');
            self.isLoading = false;

        },2000)



    }


})

.controller('feedCtrl', function(Dashboard){

    const self = this;
    self.notices = [];

    Dashboard.retrieveFeed().then(function (response) {


        if (response.data.success === false) {


        } else {

            self.notices = response.data;
            self.notices.sort(function(a){
                return new Date() - new Date(a.pdate);
            });
        }

    })

})