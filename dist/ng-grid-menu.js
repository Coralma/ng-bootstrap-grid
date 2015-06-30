angular.module('ng-grid-menu', [])
    .directive('gridMenu', [function() {
        return {
            restrict: 'A',
            priority : 0,
            terminal:false,
            replace: false,
            scope: false,
            link : function (scope, element, attrs) {
                var lastHeader = $(element).find('th:last');
                lastHeader.addClass("trSelected");
                /*var $lastTableHead = $("th:last");
                $lastTableHead.addClass("trSelected");
                $lastTableHead.append("<b>Exp</b>");*/
            }
        }
    }]);