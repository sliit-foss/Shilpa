'use strict'

angular.module('clms.user-mgt')

    .directive('compareWith', [function () {

        return {

            require: "ngModel",
            scope: {
                otherModelValue: "=compareWith"
            },
            link: function (scope, element, attributes, ngModel) {

                ngModel.$validators.compareWith = function(modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function() {
                    ngModel.$validate();
                });
            }
        };
    }]);