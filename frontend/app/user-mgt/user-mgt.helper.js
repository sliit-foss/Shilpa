'use strict'

angular.module('clms.user-mgt')

    .factory('Auth',['$http', 'AuthToken', '$q', function ($http, AuthToken, $q) {

        const authFactory = {};

        // Logs in the user when the correct credentials are given
        authFactory.login = function (loginData) {

            // Authenticates the user by sending credentials to the backend
            return $http.post("http://localhost:9001/users/authenticate", loginData).then(function (response) {

                AuthToken.setAuthToken(response.data.token);
                return response;

            });
        };

        // Add logs whenever a user logs in or logs out
        authFactory.addLog = function (logData) {

            return $http.post("http://localhost:9001/logs", logData).then(function (response) {

                return response;

            });
        };

        // Get all user logs
        authFactory.getLogs = function () {

            return $http.get("http://localhost:9001/logs").then(function (response) {

                return response;

            })
        }

        // Logs out the user by removing the token from the session storage
        authFactory.logout = function () {

            AuthToken.setAuthToken();

        }

        // Authorize the user by using the token
        authFactory.getUserDetails = function () {

            if (AuthToken.getAuthToken()) {

                return $http.get("http://localhost:9001/users/authorize");

            } else {

                $q.reject({ message: "Authentication token not set" });

            }
        };
        
        authFactory.isLoggedIn = function () {

            if (AuthToken.getAuthToken()) {

                return true;

            } else {

                return false;
            }
        }

        return authFactory;
    }])

    .factory('AuthToken',['$window', function ($window) {

        const tokenFactory = {};

        // Store the auth tokens in local storage
        tokenFactory.setAuthToken = function (token) {

            if (token) {

                return $window.sessionStorage.setItem('token',token);

            } else {

                $window.sessionStorage.clear();

            }
        }

        // Return auth token from the local storage
        tokenFactory.getAuthToken = function () {

            return $window.sessionStorage.getItem('token');

        }

        return tokenFactory;


    }])

    // Adding tokens into request headers
    .factory('AuthInterceptors', ['AuthToken', function(AuthToken){

        const authInterceptorsFactory = {};

        authInterceptorsFactory.request = function(req) {

            const authToken = AuthToken.getAuthToken();

            if (authToken) {

                req.headers['x-access-token'] = authToken;

            }

            return req;
        }

        return authInterceptorsFactory;

    }])


    .factory('User', ['$http',function ($http) {
        
        const userFactory = {};
        var selectedUsers = [];
        
        userFactory.addUser = function (userData) {
            return $http.post('http://localhost:9001/users',userData).then(function (response) {

                return response;

            }).catch(function (err) {

                return err;

            })
        };

        userFactory.getAllUsers = function () {

            return $http.get('http://localhost:9001/users').then(function (response) {

                return response;

            }).catch(function (err) {

                return err;

            })

        };

        userFactory.deleteUsers = function (userIds) {

            return $http.post('http://localhost:9001/users/delete', userIds).then(function (response) {

                return response;

            }).catch(function (err) {

                return err;

            })
        };

        userFactory.updateUser = function (userData) {

            return $http.put('http://localhost:9001/users/'+userData.username, userData).then(function (response) {

                return response;

            }).catch(function (err) {

                return err;

            })
        }

        userFactory.setSelectedUsers = function (userData) {

           selectedUsers = userData;

        }

        userFactory.getSelectedUsers = function () {

            selectedUsers.map(function (user) {

                user.wanted = true;

                return user;

            })

            return selectedUsers;

        }

        userFactory.postNotice = function (noticeData) {

            return $http.post('http://localhost:9001/notices', noticeData).then(function (response) {

                return  response;

            }).catch(function (err) {

                return err;

            })
        }

        return userFactory;
        
    }])

    .factory('Group', ['$http', function ($http) {

        const groupFactory = {};

        groupFactory.createGroup = function (groupData) {

            return $http.post('http://localhost:9001/groups', groupData).then(function (response) {

                return response;

            }).catch(function (err) {

                return err;
            });


        };

        return groupFactory;

    }])

    .factory('Mail', ['$http', function ($http) {

        const mailFactory = {};
        var mail = {};
        var controllerRef = null;

        mailFactory.getAllMails = function () {

            return $http.get('http://localhost:9006/mails').then(function (response) {

                 return response;

            }).catch(function (err) {

                return err;
            });

        };

        mailFactory.setMail = function (mailData) {

            mail = mailData;

            $http.put('http://localhost:9006/mails/'+mail._id).then(function (response) {
                
            })
        }

        mailFactory.getMail = function () {

            return mail;
        }

        mailFactory.sendMail = function (mailData) {

            return $http.post('http://localhost:9006/mails', mailData).then(function (response) {

                return response;

            }).catch(function (err) {

                return err;

            })
        }

        return mailFactory;
    }])