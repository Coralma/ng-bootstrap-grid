angular.module("ng-grid-utils", [])
    .factory("gridService", ["$timeout", '$window', function ($timeout, $window) {
        return {
            calcGridSize: function (gridHolderElement, fixedHeight) {
                //console.log("calc grid size")
                var gridDiv = gridHolderElement.parent().children('div');
                var headerTbl = gridDiv.find('.table-head');
                var footerTbl = gridDiv.find('.table-foot');
                var bodyTbl = gridDiv.find('.table-body');
                var bodyDiv = bodyTbl.parent();
                var headerCols = headerTbl.find("th");
                var bodyCols = bodyTbl.find("th");

                var availableGridHeight = 0;
                if (fixedHeight > 0) {
                    availableGridHeight = fixedHeight;
                } else {
                    //自动计算Body的高度
                    availableGridHeight = $(window).height() - ($(document.body).height() - gridDiv.outerHeight());

                    //console.log(" $(window).height():"+ $(window).height()+" $(document.body).height():"+$(document.body).height()+" $(document).height():"+$(document).height() );
                    if (availableGridHeight <= 0) {
                        availableGridHeight = 200;
                    }
                }
                //Grid Body 高度
                var bodyDivHeight = 0;
                if(footerTbl){
                    bodyDivHeight = availableGridHeight - headerTbl.outerHeight() - footerTbl.outerHeight() - 2;
                }else{
                    bodyDivHeight = availableGridHeight - headerTbl.outerHeight() - 2;
                }
                var headerTblHeight = 0 - headerTbl.outerHeight();
                bodyTbl.css("margin-top", headerTblHeight);
                bodyDiv.height(bodyDivHeight);

                $timeout(function () {
                    for (var colIdx = 0; colIdx < bodyCols.length; colIdx++) {
                        if (colIdx != bodyCols.length - 1) {
                            $(headerCols[colIdx]).width($(bodyCols[colIdx]).width());
                        } else {
                            //计算滚动条宽度
                            $(headerCols[colIdx]).width($(bodyCols[colIdx]).width() + (bodyDiv[0].offsetWidth - bodyDiv[0].clientWidth) + "px");
                        }
                    }
                }, 0);
            }
        }
    }])
    .directive('compile', [
        '$compile',
        function ($compile) {
            return {
                /*require: '^form',*/
                restrict: 'A',
                link    : function (scope, element, attrs) {
                    scope.cellTemplateScope = scope.$eval(attrs.cellTemplateScope);
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
    }]);;