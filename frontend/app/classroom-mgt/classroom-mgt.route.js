/**
 * Created by yoosufaadil on 9/19/17.
 */
'use strict';

angular.module('clms.classroom-mgt.route',[])

    .config(($stateProvider, $urlRouterProvider)=>{
    //implement your states here
    $stateProvider
    .state('dashboard.class',{

        url:'/class',
        templateUrl:'app/classroom-mgt/classroom-mgt.html',

    })
    .state('dashboard.student',{

        url:'/student',
        templateUrl:'app/classroom-mgt/student-mgt.html',
        controller: 'studentController as student'

    })
    .state('dashboard.timetable',{

        url:'/timetable',
        templateUrl:'app/classroom-mgt/timetable-mgt.html',
        controller: 'timetableController as timetable'

    })
    .state('dashboard.lessonplan',{

        url:'/lessonplan',
        templateUrl:'app/classroom-mgt/lessonplan-mgt.html',
        controller: 'lessonplanController as lessonplan'

    })
    .state('dashboard.classroom',{

        url:'/classroom',
        templateUrl:'app/classroom-mgt/class-mgt.html',
        controller: 'classroomController as class'

    })
    .state('dashboard.message',{

        url:'/message',
        templateUrl:'app/classroom-mgt/message-mgt.html',
        // controller: 'messageController as msg'

    });

})
