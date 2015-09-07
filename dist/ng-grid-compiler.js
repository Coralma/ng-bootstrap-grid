angular.module('ng-bootstrap-compile', [])
    .directive('compile', [
        '$compile','$timeout',
        function ($compile,$timeout) {
            return {
                /*require: '^form',*/
                restrict: 'A',
                link    : function (scope, element, attrs) {
                    /*scope.cellTemplateScope = scope.$eval(attrs.cellTemplateScope);*/
                    // Watch for changes to expression.
                    scope.$watch(attrs.compile, function (new_val) {
                        var new_element = angular.element(new_val);
                        element.append(new_element);
                        $compile(new_element)(scope);
                    });
                }
            };
        }
    ])
    .filter('decimalFilter', ['$filter', function($filter) {
        return function(input){
            return $filter('number')(input, 2);
        }
    }]);