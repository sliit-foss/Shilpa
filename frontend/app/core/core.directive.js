/**
 * Created by nandunb on 9/22/17.
 */
'use strict';

angular.module('clms.core.directives',[])

.directive('clmsContentLoading', function(){
    return{
        restrict: 'E',
        scope:{

        },
        templateUrl: 'app/core/templates/content-loading.html',
        link: (scope)=>{
            console.log('content loading called');
        }
    }
})

.directive('clmsContentEmpty', function(){
    return{
        restrict: 'E',
        scope:{

        },
        templateUrl: 'app/core/templates/content-empty.html',
        link: (scope)=>{

        }
    }
})