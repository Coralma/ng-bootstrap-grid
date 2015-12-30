angular.module('ng-bootstrap-category-grid', ['ng-bootstrap-compile'])
    .directive('categoryGrid', function($timeout) {
        var LIMIT_NUMBER = 30;
        return {
            restrict: 'E',
            replace: true,
            scope: {
                options: '=',
                onSelect: '=',
                rowRightClick: '='
            },
            link : function (scope, element, attrs) {
                scope.enableCategory = true;
                scope.columns = scope.options.columnDefs;
                scope.selectAllFlag = false;
                scope.appScope = scope.$parent;
                scope.categoryData = function(data) {
                    if(!angular.isUndefined(scope.options.enableCategory)) {
                        scope.enableCategory = scope.options.enableCategory;
                    } else {
                        scope.enableCategory = true;
                    }
                    var categoryRows = [],item = data[0], categorys=[], len = data.length, i = 0;
                    var categoryField = getCategoryField(scope.options.columnDefs);
                    initColumn();
                    data = sortData(data);
                    if(scope.enableCategory) {
                        while (i < len) {
                            item = data[i++];
                            var value = item[categoryField];
                            categorys.push(value);
                        }
                        var uniqCategorys = _.uniq(categorys);
                        var ucLen = uniqCategorys.length, j = 0, uniqCategoryItem = uniqCategorys[0];
                        while (j < ucLen) {
                            uniqCategoryItem = uniqCategorys[j++];
                            var categoryRow = {};
                            categoryRow.category = uniqCategoryItem;
                            categoryRow.$selection = false;
                            categoryRow.$initStatus = true;
                            categoryRow.items = _.filter(data, function (item) {
                                return item[categoryField] == uniqCategoryItem;
                            });
                            categoryRows.push(categoryRow);
                        }
                    } else {
                        var categoryRow = {};
                        categoryRow.category = 'no-category';
                        categoryRow.$selection = false;
                        categoryRow.$initStatus = true;
                        categoryRow.items = data;
                        categoryRows.push(categoryRow);
                    }
                    lazyLoadRows(categoryRows);
                }
                lazyLoadRows = function(categoryRows) {
                    var index = 0, realRows = [], lazyRows = [];
                    if(categoryRows.length == 1) {
                        if(categoryRows[0].items.length > LIMIT_NUMBER) {
                            realRows = _.take(categoryRows[0].items, LIMIT_NUMBER);
                            lazyRows = _.drop(categoryRows[0].items, LIMIT_NUMBER);
                            categoryRows[0].items = realRows;
                        }
                        scope.rows = categoryRows;
                        $timeout(function() {
                            _.forEach(lazyRows, function(lazyRow, n) {
                                scope.rows[0].items.push(lazyRow);
                            },0,false);
                        });
                    } else {
                        _.forEach(categoryRows, function(categoryRow, n) {
                            _.forEach(categoryRow.items, function(item, m) {
                                index++;
                            });
                            if(index > LIMIT_NUMBER && realRows.length > 0) {
                                lazyRows.push(categoryRow);
                            } else {
                                realRows.push(categoryRow);
                            }
                        });
                        scope.rows = realRows;
                        $timeout(function() {
                            _.forEach(lazyRows, function(lazyRow, n) {
                                scope.rows.push(lazyRow);
                            },0,false);
                        });
                    }
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
                    if(scope.options.enableRowSelection) {
                        scope.columnNumber = index + 1;
                    } else {
                        scope.columnNumber = index;
                    }
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
                    var rows = scope.rows;
                    for(var i=0; i < rows.length; i++) {
                        var row = rows[i];
                        var items = row.items;
                        for(var j=0; j < items.length; j++) {
                            var item = items[j];
                            item.$selection = isSelectAll;
                        }
                    }
                    scope.selectAllFlag = isSelectAll;
                };
                scope.selectRow = function(row) {
                    if(scope.onSelect) {
                        scope.onSelect(row);
                    }
                    //checkbox select all and un-check operation.
                    var uncheckedRow=_.find(scope.options.data,function(row){
                        return row.$selection==false || row.$selection==null;
                    });
                    scope.selectAllFlag = (uncheckedRow==null);
                }
                scope.getSelectedRows = function() {
                    var selectedRows = [];
                    _.forEach(scope.rows, function(row) {
                        _.forEach(row.items, function(item) {
                            if(item.$selection) {
                                selectedRows.push(item);
                            }
                        })
                    });
                    return selectedRows;
                }
                // init category
                scope.categoryData(scope.options.data);
                // init explore api
                if(scope.options.onRegisterApi) {
                    scope.options.onRegisterApi({
                        refresh :  function() {scope.categoryData(scope.options.data)},
                        changeCategoryType :  function(type) {
                            scope.enableCategory = type;
                        },
                        getSelectedRows : function() {
                            return scope.getSelectedRows();
                        }
                    });
                }
                scope.onRightClick = function(item) {
                    if(scope.rowRightClick) {
                        scope.rowRightClick(item);
                    }
                }
            },
            template:
            "<div class='table-responsive'>" +
            "   <table class='table table-bordered table-hover bs-grid category-table-striped' style='table-layout:fixed;'>" +
            "       <thead>" +
            "           <tr>" +
            "               <th ng-if='options.enableRowSelection' class='grid-checkbox-cell'>" +
            "                   <input type='checkbox' ng-click='selectAll(isSelectAll)' ng-model='isSelectAll' ng-checked='selectAllFlag'>" +
            "               </th>" +
            "               <th ng-repeat='col in columns track by col.field' style={{::col.cellStyle}} ng-if='col.visible'>" +
            "                   <div ng-if='!col.headTemplate'>{{ ::(col.headTemplate || col.displayName || col.field) }}</div>" +
            "               </th>" +
            "           </tr>" +
            "       </thead>" +
            "       <tbody ng-repeat='row in rows track by row.category'>" +
            "           <tr ng-click='row.$initStatus=!row.$initStatus' ng-if='enableCategory' class='category-tr'>" +
            "               <td colspan='{{::columnNumber}}'>" +
            "                   <i class='glyphicon panel-icon' ng-class='{\"glyphicon-chevron-down\": row.$initStatus, \"glyphicon-chevron-right\": !row.$initStatus}'></i><span class='category-title'>{{ ::row.category}}</span>" +
            "               </td>" +
            "           </tr>" +
            "           <tr ng-repeat='item in row.items track by $index' ng-show='row.$initStatus' context-menu='onRightClick(item)' data-target='rowMenu'>" +
            "               <td ng-if='options.enableRowSelection' class='grid-checkbox-cell'>" +
            "                   <input type='checkbox' ng-model='item.$selection' ng-click='selectRow(row)'>" +
            "               </td>" +
            "               <td ng-repeat='col in columns track by col.field' style='word-break:break-all;' ng-if='col.visible' title='{{ ::item[col.field] }}'>" +
            "                   <div ng-if='col.cellTemplate' compile='col.cellTemplate' cell-template-scope='col.cellTemplateScope'></div>" +
            "                   <div ng-if='!col.cellTemplate'>{{ ::item[col.field] }}</div>" +
            "               </td>" +
            "           </tr>" +
            "       </tbody>" +
            "   </table>" +
            "</div>"
        }
    });