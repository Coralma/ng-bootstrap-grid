angular.module('ui.ccc.gridTextInput', [])
    .directive('gridTextInput', ['$timeout', function ($timeout) {
        return {
            restrict: 'EA',
            require: 'ngModel',
            link: function (scope, el, attrs, ngModelCtrl) {

            },
            template:"<div>" +
                      " <span></span>" +
                      "</div>"
    }
}]);