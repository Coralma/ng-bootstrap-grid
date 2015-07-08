angular.module('ng-bootstrap-grid', [])
    .directive('paginationGrid', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                options: '=',
                onSelect: '=',
                onPaginationChange: '=',
                onPaginationBegin: '=',
                onPaginationEnd: '='
            },
            link: function (scope, element, attrs) {
                scope.columns = scope.options.columns;
                scope.maxColumnNum = scope.columns.length - 1;
                scope.columnNumber = scope.options.columns.length + 1; //FIXME it remove the hidden column and selection function.
                scope.data = scope.options.data;
                /*console.log(scope.columns);
                 console.log(scope.data);
                 for(var dataKey in scope.data){
                 for(var colKey in scope.columns) {
                 console.log("dataKey:"+dataKey + " , colKey : " + colKey);
                 var row = scope.data[dataKey];
                 var f = scope.columns[colKey];
                 console.log("row : " + row + ", f : " + f.field + ", rs: " + row[f.field]);
                 }
                 }*/

                scope.selectAll = function (isSelectAll) {
                    console.log(isSelectAll);
                    var rows = scope.data;
                    for (var i = 0; i < rows.length; i++) {
                        var row = rows[i];
                        row.selection = isSelectAll;
                    }
                };
                scope.selectRow = function (row) {
                    if (scope.onSelect) {
                        scope.onSelect(row);
                    }
                }
            },
            template: "<div class='table-responsive'>\n" +
            "   <table class='table table-bordered table-hover table-striped'>\n" +
            "       <thead>\n" +
            "           <tr>\n" +
            "               <th ng-if='options.enableRowSelection' class='pagination-checkbox'>" +
            "                   <input type='checkbox' ng-click='selectAll(isSelectAll)' ng-model='isSelectAll'>" +
            "               </th>" +
            "               <th ng-repeat='col in columns' style={{col.cellStyle}} >" +
            "                   <div ng-if='col.headTemplate' compile='col.headTemplate' cell-template-scope='col.headTemplateScope'></div>" +
            "                   <div ng-if='!col.headTemplate' style='display:inline;float:left;'>{{col.headTemplate || col.displayName || col.field}}</div>" +
            "                   <div ng-if='$index == maxColumnNum && !scope.options.enableGridMenu' class='pull-right' style='display:inline;float:left;'><i class='glyphicon' ng-click='' ng-class='\"glyphicon glyphicon-cog\"' style='cursor:pointer;'></i></div>" +
            "               </th>\n" +
            "           </tr>\n" +
            "       </thead>\n" +
            "       <tbody>\n" +
            "           <tr ng-repeat='item in data'>\n" +
            "               <td ng-if='options.enableRowSelection' class='pagination-checkbox'><input type='checkbox' ng-model='item.selection' ng-click='selectRow(row)'></td>" +
            "               <td ng-repeat='col in columns' >\n" +
            "                   <div ng-if='col.cellTemplate' compile='col.cellTemplate' cell-template-scope='col.cellTemplateScope'></div>\n" +
            "                   <div ng-if='!col.cellTemplate'>{{ item[col.field] }}</div>\n" +
            "               </td>\n" +
            "           </tr>\n" +
            "           <tr>" +
            "           <tr ng-if='data == null || data.length == 0'>" +
            "               <td colspan='{{columnNumber}}'>{{options.noDataMessage}}</td>" +
            "           </tr>" +
            "           <tr><td colspan='{{columnNumber}}'>" +
            "               <nav class='page-nav'>\n" +
            "               <ul class='pagination'>\n" +
            "                   <li>\n" +
            "                       <a href='#' aria-label='Previous' class='not-active'>\n" +
            "                           <span aria-hidden='true' class='glyphicon glyphicon-step-backward'></span>\n" +
            "                       </a>\n" +
            "                   </li>\n" +
            "                   <li>\n" +
            "                       <a href='#' aria-label='Previous' class='not-active'>\n" +
            "                           <span aria-hidden='true' class='glyphicon glyphicon-triangle-left'></span>\n" +
            "                       </a>\n" +
            "                   </li>\n" +
            "                   <li><a href=''>1</a></li>\n" +
            "                   <li><a href=''>2</a></li>\n" +
            "                   <li><a href=''>3</a></li>\n" +
            "                   <li><a href=''>4</a></li>\n" +
            "                   <li><a href=''>5</a></li>\n" +
            "                   <li>\n" +
            "                       <a href='' aria-label='Next'>\n" +
            "                           <span aria-hidden='true' class='glyphicon glyphicon-triangle-right'></span>\n" +
            "                       </a>\n" +
            "                   </li>\n" +
            "                   <li>\n" +
            "                       <a href='' aria-label='Next'>\n" +
            "                           <span aria-hidden='true' class='glyphicon glyphicon-step-forward'></span>\n" +
            "                       </a>\n" +
            "                   </li>\n" +
            "               </ul>\n" +
            "               </nav>" +
            "           </td></tr>" +
            "       </tbody>\n" +
            "   </table>\n" +
            "</div>\n"
        }
    })
    .directive('compile', [
        '$compile',
        function ($compile) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
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
    ])
    .directive('compile', [
        '$compile',
        function ($compile) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
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