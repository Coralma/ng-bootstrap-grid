angular.module('ng-bootstrap-grid', [])
    .directive('expandGrid', [function() {
        return {
            restrict: 'E',
            replace: true,
            priority : 10,
            scope: {
                options: '=',
                onSelect: '='
            },
            link : function (scope, element, attrs) {
                scope.columns = scope.options.columns;
                scope.maxColumnNum = scope.columns.length - 1;
                scope.data = scope.options.data;
                scope.$watch('options.data', function(data) {
                    var rows = [];
                    /*scope.rows = scope.options.data;*/
                    var data = scope.options.data;
                    _.forEach(data, function(d, key) {
                        var row = {item : d, expand: false, expandTemplate: scope.options.expandableRowTemplate};
                        rows.push(row);
                    });
                    scope.rows = rows;
                    scope.columnNumber = scope.options.columns.length + 1; //FIXME it remove the hidden column and selection function.
                    console.log(JSON.stringify(scope.rows, null, '\t'));
                });

                scope.selectAll = function(isSelectAll) {
                    console.log(isSelectAll);
                    _.forEach(scope.rows, function(row) {
                        row.item.selection = isSelectAll;
                    });
                };
                scope.selectRow = function(row) {
                    console.log('select a row.');
                }
                scope.expandClick = function(clickedRow) {
                    _.forEach(scope.rows, function(row) {
                        if(row != clickedRow) {
                            row.expand = false;
                            /*row.item.readonly = true;*/
                        }
                    });
                }

                scope.getUrlTemplate = function () {
                    return scope.options.expandableRowTemplate;
                };
            },
            template:
            "<div class='table-responsive'>\n" +
            "   <table class='table table-bordered' style='table-layout:fixed;'>\n" +
            "       <thead>\n" +
            "           <tr>\n" +
            "               <th ng-if='options.enableRowSelection' style='width:30px'>" +
            "                   <input type='checkbox' ng-click='selectAll(isSelectAll)' ng-model='isSelectAll'>" +
            "               </th>" +
            "               <th ng-repeat='col in columns' style={{col.cellStyle}} >" +
            "                   <div ng-if='col.headTemplate' compile='col.headTemplate' cell-template-scope='col.headTemplateScope'></div>" +
            "                   <div ng-if='!col.headTemplate' >{{col.headTemplate || col.displayName || col.field}}</div>" +
            "               </th>\n" +
            "           </tr>\n" +
            "       </thead>\n" +
            "       <tbody ng-repeat='row in rows'>\n" +
            "           <tr ng-dblclick='row.expand=!row.expand'>\n" +
            "               <td ng-if='options.enableRowSelection'><input type='checkbox' ng-model='row.item.selection' ng-click='selectRow(row)' ng-disabled='row.item.readonly'></td>" +
            "               <td ng-repeat='col in columns' style='word-break:break-all;'>\n" +
            "                   <div ng-if='col.cellTemplate' compile='col.cellTemplate' cell-template-scope='col.cellTemplateScope'></div>\n" +
            "                   <div ng-if='!col.cellTemplate' style='display:inline;float:left;'>{{ row.item[col.field] }}</div>\n" +
            "                   <div ng-if='$index == maxColumnNum' class='pull-right' style='display:inline;float:left;'><i class='glyphicon' ng-click='row.expand=!row.expand;expandClick(row)' ng-class='{\"glyphicon-chevron-down\": row.expand, \"glyphicon-chevron-right\": !row.expand}' style='cursor:pointer;'></i></div>" +
            "               </td>\n" +
            "           </tr>\n" +
            "           <tr ng-show='row.expand'>" +
            "               <td colspan='{{columnNumber}}'>" +
            "                   <div ng-include=\"row.expandTemplate\"></div>" +
            "               </td>\n" +
            "           </tr>\n" +
            "       </tbody>\n" +
            "   </table>\n" +
            "</div>\n"
        }
    }])
    .directive('compile', [
        '$compile',
        function ($compile) {
            return {
                restrict: 'A',
                link    : function (scope, element, attrs) {
                    scope.cellTemplateScope = scope.$eval(attrs.cellTemplateScope);
                    // Watch for changes to expression.
                    scope.$watch(attrs.compile, function (new_val) {
                        // Compile creates a linking function that can be used with any scope.
                        var link = $compile(new_val);
                        // Executing the linking function creates a new element.
                        var new_elem = link(scope);
                        // Which we can then append to our DOM element.
                        element.append(new_elem);
                    });
                }
            };
        }
    ]);