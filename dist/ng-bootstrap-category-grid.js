angular.module('ng-bootstrap-grid', [])
    .directive('categoryGrid', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                options: '=',
                onSelect: '='
                /*expandOn: '=',
                 onSelect: '&',
                 onClick: '&',
                 initialSelection: '@',
                 treeControl: '='*/
            },
            link : function (scope, element, attrs) {
                scope.columns = scope.options.columns;
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

                scope.$watch('options.data', function(data) {
                    var categoryRows = [],item = data[0], categorys=[], len = data.length, i = 0;
                    var categoryField = getCategoryField(scope.options.columns);
                    console.log("categoryColumn : "+ JSON.stringify(categoryField));
                    initColumn();

                    while(i < len) {
                        item = data[i++];
                        var value = item[categoryField];
                        categorys.push(value);
                    }
                    var uniqCategorys = _.uniq(categorys);
                    var ucLen = uniqCategorys.length, j = 0, uniqCategoryItem = uniqCategorys[0];
                    console.log("uniqCategorys: " + JSON.stringify(uniqCategorys) + ", ucLen: " + ucLen);
                    while(j < ucLen) {
                        uniqCategoryItem = uniqCategorys[j++];
                        var categoryRow= {};
                        categoryRow.category = uniqCategoryItem;
                        categoryRow.selection = false;
                        categoryRow.initStatus = true;
                        categoryRow.items = _.filter(data, function(item) {
                            return item[categoryField] == uniqCategoryItem;
                        });
                        categoryRows.push(categoryRow);
                        console.log(JSON.stringify(categoryRow.items));
                    }
                    scope.rows = categoryRows;
                    console.log(JSON.stringify(scope.rows, null, '\t'));
                });

                initColumn = function() {
                    var index = 0;
                    // set the visible column
                    _.forEach(scope.columns, function(col) {
                        if(angular.isUndefined(col.visible)) {
                            col.visible = true;
                            index++;
                        } else if(col.visible){
                            index++;
                        }
                    });
                    scope.columnNumber = index + 1; //FIXME it remove the hidden column and selection function.
                }
                getCategoryField = function(cols) {
                    var cf = _.result(_.find(cols, function(chr) {
                        return chr.category == true;
                    }), 'field');
                    return cf;
                };
                scope.selectAll = function(isSelectAll) {
                    console.log(isSelectAll);
                    var rows = scope.rows;
                    for(var i=0; i < rows.length; i++) {
                        var row = rows[i];
                        var items = row.items;
                        for(var j=0; j < items.length; j++) {
                            var item = items[j];
                            item.selection = isSelectAll;
                        }
                    }
                };
                scope.selectRow = function(row) {
                    if(scope.onSelect) {
                        scope.onSelect(row);
                    }
                }
            },
            template:
            "<div class='table-responsive'>\n" +
            "   <table class='table table-bordered table-hover' style='table-layout:fixed;'>\n" +
            "       <thead>\n" +
            "           <tr>\n" +
            "               <th ng-if='options.enableRowSelection' class='cate-radio-cell'>" +
            "                   <input type='checkbox' ng-click='selectAll(isSelectAll)' ng-model='isSelectAll'>" +
            "               </th>" +
            "               <th ng-repeat='col in columns' style={{col.cellStyle}} ng-if='col.visible'>" +
            "                   <div ng-if='col.headTemplate' compile='col.headTemplate' cell-template-scope='col.headTemplateScope'></div>" +
            "                   <div ng-if='!col.headTemplate' >{{col.headTemplate || col.displayName || col.field}}</div>" +
            "               </th>\n" +
            "           </tr>\n" +
            "       </thead>\n" +
            "       <tbody ng-repeat='row in rows'>\n" +
            "           <tr ng-click='row.initStatus=!row.initStatus'>\n" +
            "               <td colspan='{{columnNumber}}'>" +
            "               <i class='glyphicon panel-icon' ng-class='{\"glyphicon-chevron-down\": row.initStatus, \"glyphicon-chevron-right\": !row.initStatus}'></i><span style='padding-left: 10px'>{{row.category}}</span>" +
            "               </td>\n" +
            "           </tr>\n" +
            "           <tr ng-repeat='item in row.items' ng-show='row.initStatus'>\n" +
            "               <td ng-if='options.enableRowSelection' class='cate-radio-cell'>" +
            "                   <input type='checkbox' ng-model='item.selection' ng-click='selectRow(row)'>" +
            "               </td>" +
            "               <td ng-repeat='col in columns' style='word-break:break-all;' ng-if='col.visible'>\n" +
            "                   <div ng-if='col.cellTemplate' compile='col.cellTemplate' cell-template-scope='col.cellTemplateScope'></div>\n" +
            "                   <div ng-if='!col.cellTemplate'>{{ item[col.field] }}</div>\n" +
            "               </td>\n" +
            "           </tr>\n" +
            "       </tbody>\n" +
            "   </table>\n" +
            "" +
            "</div>\n"
        }
    })
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