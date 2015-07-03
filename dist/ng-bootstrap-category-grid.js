angular.module('ng-bootstrap-grid', [])
    .directive('categoryGrid', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                options: '=',
                onSelect: '='
            },
            link : function (scope, element, attrs) {
                scope.enableCategory = true;
                scope.columns = scope.options.columnDefs;
                scope.data = scope.options.data;
                scope.appScope = scope.$parent;
                scope.categoryData = function(data) {
                    if(!angular.isUndefined(scope.options.enableCategory)) {
                        scope.enableCategory = scope.options.enableCategory;
                    }
                    var categoryRows = [],item = data[0], categorys=[], len = data.length, i = 0;
                    var categoryField = getCategoryField(scope.options.columnDefs);
                    /*console.log("categoryColumn : "+ JSON.stringify(categoryField));*/
                    initColumn();
                    data = sortData(data);
                    while(i < len) {
                        item = data[i++];
                        var value = item[categoryField];
                        categorys.push(value);
                    }
                    var uniqCategorys = _.uniq(categorys);
                    var ucLen = uniqCategorys.length, j = 0, uniqCategoryItem = uniqCategorys[0];
                    /*console.log("uniqCategorys: " + JSON.stringify(uniqCategorys) + ", ucLen: " + ucLen);*/
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
                        /*console.log(JSON.stringify(categoryRow.items));*/
                    }
                    scope.rows = categoryRows;
                    /*console.log(JSON.stringify(scope.rows, null, '\t'));*/
                }

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
                };
                sortData = function(data) {
                    var sortList = _.filter(scope.columns, function(col) {
                        return col['enableSorting'] == true;
                    });
                    _.forEach(sortList, function(sortDef) {
                        data = _.sortByOrder(data, [sortDef.field], ['asc'])
                    })
                    return data;
                }

                getCategoryField = function(cols) {
                    var cf = _.result(_.find(cols, function(chr) {
                        return chr.category == true;
                    }), 'field');
                    return cf;
                };
                scope.selectAll = function(isSelectAll) {
                    /*console.log(isSelectAll);*/
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
                scope.getSelectedRows = function() {
                    var selectedRows = [];
                    _.forEach(scope.rows, function(row) {
                        _.forEach(row.items, function(item) {
                            if(item.selection) {
                                selectedRows.push(item);
                            }
                        })
                    });
                    return selectedRows;
                }
                // init category
                scope.categoryData(scope.data);
                // init explore api
                scope.options.onRegisterApi({
                    refresh :  function() {scope.categoryData(scope.data)},
                    getSelectedRows : function() {
                        return scope.getSelectedRows();
                    }
                });
            },
            template:
            "<div class='table-responsive'>" +
            "   <table class='table table-bordered table-hover bs-grid' style='table-layout:fixed;'>" +
            "       <thead>" +
            "           <tr>" +
            "               <th ng-if='options.enableRowSelection' class='cate-radio-cell'>" +
            "                   <input type='checkbox' ng-click='selectAll(isSelectAll)' ng-model='isSelectAll'>" +
            "               </th>" +
            "               <th ng-repeat='col in columns' style={{col.cellStyle}} ng-if='col.visible'>" +
            "                   <div ng-if='col.headTemplate' compile='col.headTemplate' cell-template-scope='col.headTemplateScope'></div>" +
            "                   <div ng-if='!col.headTemplate' >{{col.headTemplate || col.displayName || col.field}}</div>" +
            "               </th>" +
            "           </tr>" +
            "       </thead>" +
            "       <tbody ng-repeat='row in rows'>" +
            "           <tr ng-click='row.initStatus=!row.initStatus' ng-if='enableCategory'>" +
            "               <td colspan='{{columnNumber}}'>" +
            "               <i class='glyphicon panel-icon' ng-class='{\"glyphicon-chevron-down\": row.initStatus, \"glyphicon-chevron-right\": !row.initStatus}'></i><span style='padding-left: 10px'>{{row.category}}</span>" +
            "               </td>" +
            "           </tr>" +
            "           <tr ng-repeat='item in row.items' ng-show='row.initStatus'>" +
            "               <td ng-if='options.enableRowSelection' class='cate-radio-cell'>" +
            "                   <input type='checkbox' ng-model='item.selection' ng-click='selectRow(row)'>" +
            "               </td>" +
            "               <td ng-repeat='col in columns' style='word-break:break-all;' ng-if='col.visible' title='{{ item[col.field] }}'>" +
            "                   <div ng-if='col.cellTemplate' compile='col.cellTemplate' cell-template-scope='col.cellTemplateScope'></div>" +
            "                   <div ng-if='!col.cellTemplate'>{{ item[col.field] }}</div>" +
            "               </td>" +
            "           </tr>" +
            "       </tbody>" +
            "   </table>" +
            "</div>"
        }
    })
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
    ]);