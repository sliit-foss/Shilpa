
'use strict';

angular.module('clms.reminder-mgt.route',[])

    .config(($stateProvider, $urlRouterProvider)=>{

        $stateProvider

            .state('dashboard.reminder',{
                url:'/reminder',
                templateUrl: 'app/reminder-mgt/templates/view-reminder.html',
                controller: 'reminderCtrl as reminder'
            })

    })