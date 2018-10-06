'use strict'

angular.module('clms.user-mgt',['ngMessages', 'md.data.table'])

    .controller('mainCtrl', function ($mdDialog) {

        const self = this;

        self.showPostNoticeDialog = function (event) {

            $mdDialog.show({
                controller: "noticeCtrl as notice",
                templateUrl: "./app/user-mgt/templates/post-notice.html",
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
            })
                .then(function () {

                }, function () {

                });
        }
    })

    .controller('loginCtrl', function (Auth, $timeout, $location, $rootScope, $mdToast, $window) {

        const self = this;

        self.errorMessage = null;
        self.formData = {
            username: "",
            password: ""
        };

        self.doLogin = function (loginData) {
            if (loginData) {

                Auth.login(loginData).then(function (response) {
                    if (response.data.success === true) {

                        self.showLoginToast(response.data.message, 'success-toast')

                        $timeout (function () {

                            Auth.getUserDetails().then(function (response) {

                                $window.sessionStorage.setItem('username',response.data.username);
                                $window.sessionStorage.setItem('name',response.data.name);
                                $window.sessionStorage.setItem('permission',response.data.permission);
                                $window.sessionStorage.setItem('email',response.data.email);

                                var loginDate = new Date();
                                
                                var logData = {
                                    
                                    ldate: loginDate,
                                    description: response.data.username + " logged in to the system at "
                                }
                                
                                Auth.addLog(logData).then(function () {
                                    
                                }).catch(function () {
                                    
                                })

                                if (response.data.permission == "admin") {

                                    $location.path('/dashboard/administrator/console');

                                } else if (response.data.permission == "teacher") {

                                    $location.path('/dashboard/feed');

                                }else if (response.data.permission == "student") {

                                    $location.path('/dashboard/feed');

                                }else if (response.data.permission == "user") {

                                    $location.path('/dashboard/feed');

                                }
                            })

                        }, 2000);
                    } else if (response.data.success === false) {

                        self.showLoginToast(response.data.message, 'error-toast');

                    }
                }).catch(function (err) {

                    self.showLoginToast("Could not authenticate user", 'error-toast')
                })
            }
        }
        
        self.showLoginToast = function (message, theme) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position('bottom')
                    .theme(theme)
                    .hideDelay(1500)
                    .parent('toastParent')
            );
        }

    })

    .controller('userCtrl', function (User, $mdToast, $scope, $mdDialog, $timeout) {

        const self = this;

        self.selectedIndex = 0;

        self.enableUpdateTab = false;

        self.userModel = {

            username: "",
            password: "",
            confirmPassword: "",
            name: "",
            email: "",
            permission: "",
            studentId: "",
            class: "",
            level: ""

        }

        self.updateUserModel = {

            name: "",
            email: "",
            permission: "",
            studentId: "",
            class: "",
            level: ""

        }

        self.isFieldRequired = false;
        self.isUpdateFieldRequired = false;

        // Md-table config
        self.users = [];

        self.selected = [];

        self.limitOptions = [5, 10, 15];

        self.query = {
            order: 'username',
            limit: 5,
            page: 1
        };
        // End of Md-table config

        // Check whether the selected user is a student or not
        self.isStudent = function (command, value) {

            if (command == "add" && value == "student") {

                self.isFieldRequired = true;
                return true;

            } else if (command == "update" && value == "student") {

                self.isUpdateFieldRequired = true;
                return true;

            } else if(command == "add" && value != "student") {

                self.isFieldRequired = false
                return null;

            } else if (command == "update" && value != "student") {

                self.isUpdateFieldRequired = false;
                return null;

            }
        }

        // Add a new user to the system
        self.addNewUser = function (userData) {
            
            User.addUser(userData).then(function (response) {

                if (response.data.success) {

                    self.userModel = {};
                    self.selected = [];
                    $scope.userForm.$setPristine();
                    $scope.userForm.$setUntouched();

                    self.showToast('success-toast', response.data.message);
                    self.loadAllUsers();

                } else {

                    self.showToast('error-toast', response.data.message);

                }
            })
            
        }

        // Get all users when the application is loading
        self.loadAllUsers = function () {

            User.getAllUsers().then(function (response) {

                self.users = response.data;

            });

        }

        self.loadAllUsers();

        // Delete selected users
        self.deleteSelectedUsers = function () {

            User.deleteUsers({"users":self.selected}).then(function (response) {

                if (response.data.success) {
                    self.selected = [];
                    self.showToast('success-toast', response.data.message);
                    self.loadAllUsers();

                } else {

                    self.showToast('error-toast', response.data.message);

                }

            })
        };

        // Confirmation dialog for deleting users
        self.showDeleteConfirm = function (event) {
            
            var confirm = $mdDialog.confirm()
                .title('Do you need to delete the selected users ?')
                .textContent('All the selected users will be deleted if you choose yes.')
                .targetEvent(event)
                .ok('YES')
                .cancel('NO');
            
            $mdDialog.show(confirm).then(function () {

                self.deleteSelectedUsers();
                $scope.userTable.$setPristine();
                $scope.userTable.$setUntouched();
                
            }, function () {

            })
            
        }

        self.showCreateGroupDialog = function (event) {

            $mdDialog.show({
                controller: "groupCtrl as group",
                templateUrl: "./app/user-mgt/templates/add-group.html",
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
            })
                .then(function () {

                }, function () {

                });


        };

        self.navigateToTab = function (index) {

            self.selectedIndex = index;
            Object.assign(self.updateUserModel, self.selected[0]);

            self.isSelected();

        }

        self.isSelected = function () {

            if ( self.selected.length > 0 ) {

                self.enableUpdateTab = true;

            } else {

                self.showUpdateTab = null;

            }
        }

        self.updateSelectedUser = function () {

            User.updateUser(self.updateUserModel).then(function (response) {

                if (response.data.success) {

                    self.showToast('success-toast', response.data.message);
                    self.loadAllUsers();

                    $timeout(function () {

                        self.selectedIndex = 1;

                    }, 2000)
                    self.selected = [];
                } else {

                    self.showToast('error-toast', response.data.message);

                }

            })

        };

        $scope.$watch('selected', function () {
            User.setSelectedUsers(self.selected);
        });


        self.showToast = function(type, message){

            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position('bottom')
                    .theme(type)
                    .hideDelay(1500)
                    .parent('userForm')

            );

        }

    })

    .controller('groupCtrl', function (User, Group, $mdDialog, $timeout, $mdToast) {

        const self = this;

        self.readonly = false;
        self.selectedItem = null;
        self.searchText = null;
        self.querySearch = querySearch;
        self.groups = loadGroups();
        self.selectedGroups = [];
        self.numberChips = [];
        self.numberChips2 = [];
        self.numberBuffer = '';
        self.autocompleteDemoRequireMatch = true;
        self.transformChip = transformChip;

        self.initiatedGroup = {

            groupName: "",
            description: "",
            allowedSections: self.selectedGroups,
            members: User.getSelectedUsers()

        }

        /**
         * Return the proper object when the append is called.
         */
        function transformChip(chip) {
            // If it is an object, it's already a known chip
            if (angular.isObject(chip)) {
                return chip;
            }

            // Otherwise, create a new one
            return { name: chip, type: 'new' }
        }

        /**
         * Search for groups.
         */
        function querySearch (query) {
            var results = query ? self.groups.filter(createFilterFor(query)) : [];
            return results;
        }

        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(groups) {
                return (groups._lowername.indexOf(lowercaseQuery) === 0)
            };

        }

        // Cancels the dialog
        self.cancel = function () {
            $mdDialog.cancel();
        }

        function loadGroups() {
            var groups = [
                {
                    'name': 'User Management',
                },
                {
                    'name': 'Classroom Management',
                },
                {
                    'name': 'Grade Management',
                },
                {
                    'name': 'Notifications',
                },
                {
                    'name': 'Personal Storage'
                },
                {
                    'name': 'Analytics'
                }
            ];

            return groups.map(function (grp) {
                grp.sectionName = grp.name;
                grp._lowername = grp.name.toLowerCase();
                return grp;
            });
        }

        self.createUserGroup = function () {

            Group.createGroup(self.initiatedGroup).then(function (response) {

                if (response.status == 406) {

                    self.showToast('error-toast', response.data.message, 'addGroup');

                } else {

                    $timeout(function () {

                        self.cancel();
                        self.showToast('success-toast', response.data.message, 'viewUsers');

                    },1000)
                }

            }). catch(function (err) {

                self.showToast('error-toast', response.data.message, 'addGroup');

            })
        }

        self.showToast = function(type, message, parent){

            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position('bottom')
                    .theme(type)
                    .hideDelay(1500)
                    .parent(parent)

            );

        }
    })

    .controller('serviceCtrl', function (Mail, $mdDialog, $rootScope, $scope) {

        const self = this;
        self.mails = [];

        $rootScope.$on("GetAllMails", function () {

            self.getMails();

        });

        self.getMails = function () {

            Mail.getAllMails().then(function (response) {

                self.mails = response.data;
                console.log(self.mails);

                self.mails.sort(function(a){
                    return new Date() - new Date(a.date);
                });

            });

        };
        self.getMails();

        self.showViewMailDialog = function (event, index) {

            Mail.setMail(self.mails[index]);

            $mdDialog.show({
                controller: "viewMailCtrl as viewMail",
                templateUrl: "./app/user-mgt/templates/view-mail.html",
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
            })
                .then(function () {

                }, function () {

                });


        };

        self.showSendMailDialog = function (event) {

            $mdDialog.show({
                controller: "sendMailCtrl as send",
                templateUrl: "./app/user-mgt/templates/send-mail.html",
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
            })
                .then(function () {

                }, function () {

                });
        }

    })

    .controller('viewMailCtrl', function ($mdDialog, Mail, $rootScope) {

        const self = this;

        self.newMail = Mail.getMail();

        self.cancel = function () {

            $rootScope.$broadcast("GetAllMails", {});

            $mdDialog.cancel();

        }
    })

    .controller('sendMailCtrl', function ($mdDialog, Mail, $mdToast, $timeout) {

        const self = this;

        self.mail = {

            toAddress: "",
            subject: "",
            message: ""

        };

        self.sendMail = function () {

            Mail.sendMail(self.mail).then(function (response) {

                if (response.data.success) {

                    $timeout(function () {

                        self.cancel();
                        self.showToast('success-toast', response.data.message, 'viewMail');

                    },1000)

                } else {

                    self.showToast('error-toast', response.data.message, 'sendMail');

                }
            })
        };

        self.cancel = function () {

            $mdDialog.cancel();

        }

        self.showToast = function(type, message, parent){

            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position('bottom')
                    .theme(type)
                    .hideDelay(1500)
                    .parent(parent)

            );

        }

    })

    .controller('noticeCtrl', function ($mdDialog, User, $mdToast, $timeout) {

        const self = this;

        self.readonly = false;
        self.selectedItem = null;
        self.searchText = null;
        self.querySearch = querySearch;
        self.tags = loadTags();
        self.selectedTags = [];
        self.numberChips = [];
        self.numberChips2 = [];
        self.numberBuffer = '';
        self.autocompleteDemoRequireMatch = true;
        self.transformChip = transformChip;

        self.today = new Date();
        self.initiatedNotice = {

            pdate: self.today,
            subject: "",
            tags: self.selectedTags,
            description: ""

        }

        /**
         * Return the proper object when the append is called.
         */
        function transformChip(chip) {
            // If it is an object, it's already a known chip
            if (angular.isObject(chip)) {
                return chip;
            }

            // Otherwise, create a new one
            return { name: chip, type: 'new' }
        }

        /**
         * Search for groups.
         */
        function querySearch (query) {
            var results = query ? self.tags.filter(createFilterFor(query)) : [];
            return results;
        }

        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(tags) {
                return (tags._lowername.indexOf(lowercaseQuery) === 0)
            };

        }

        // Cancels the dialog
        self.cancel = function () {
            $mdDialog.cancel();
        }

        function loadTags() {
            var tags = [
                {
                    'name': 'Important',
                },
                {
                    'name': 'Teachers',
                },
                {
                    'name': 'Students',
                },
                {
                    'name': 'All',
                },
                {
                    'name': 'Holiday'
                },
                {
                    'name': 'Maintenance'
                }
            ];

            return tags.map(function (tg) {
                tg.tag = tg.name;
                tg._lowername = tg.name.toLowerCase();
                return tg;
            });
        }
        
        self.postTheNotice = function () {

            User.postNotice(self.initiatedNotice).then(function (response) {

                if (response.data.success) {

                    $timeout(function () {

                        self.cancel();
                        self.showToast('success-toast', response.data.message, 'viewMail');

                    },1000)

                } else {

                    self.showToast('error-toast', response.data.message, "postNotices")

                }

            })
        };

        self.showToast = function(type, message, parent){

            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position('bottom')
                    .theme(type)
                    .hideDelay(1500)
                    .parent(parent)

            );

        }

    })

    .controller('logCtrl', function (Auth) {

        const self = this;

        self.logs = [];

        Auth.getLogs().then(function (response) {

            console.log(response);
            if (response.data) {

                self.logs = response.data;
            }

        }).catch(function (err) {

        })

    })