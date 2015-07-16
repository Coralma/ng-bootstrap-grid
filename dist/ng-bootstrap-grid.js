angular.module('ng-bootstrap-grid', [])
    .directive('bsGrid', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                options: '=',
                onSelect: '=',
                onPaginationChange: '=',
                onSortChanged: '='
            },
            link: function (scope, element, attrs) {
                scope.appScope = scope.$parent;
                scope.dataBackup = angular.copy(scope.options.data);
                scope.options.useExternalPagination = scope.options.useExternalPagination || false;
                scope.options.noDataMessage =  scope.options.noDataMessage || '没有找到匹配的结果';
                scope.columns = scope.options.columnDefs;
                scope.maxColumnNum = scope.columns.length - 1;
                if(scope.options.enableRowSelection) {
                    scope.columnNumber = scope.options.columnDefs.length + 1; //FIXME it remove the hidden column and selection function.
                } else {
                    scope.columnNumber = scope.options.columnDefs.length;
                }
                scope.initColumns = function(columns) {
                    _.forEach(columns, function(col) {
                        if(angular.isUndefined(col.enableSorting)) {
                            col.enableSorting = true;
                        }
                    });
                }
                scope.initColumns(scope.columns);
                scope.selectAll = function (isSelectAll) {
                    var rows = scope.options.data;
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
                scope.sortData = function(col, columns) {
                    if(!col.enableSorting) {
                        return;
                    }
                    var sortedData = {};
                    cleanOtherSort(col, columns);
                    col.sort = checkColSort(col.sort);
                    if(scope.options.useExternalPagination) {
                        if(scope.onSortChanged) {
                            scope.onSortChanged(scope.options.currentPage, scope.options.paginationPageSize, col.field, col.sort);
                        }
                    } else {
                        if(col.sort == null) {
                            sortedData = scope.dataBackup;
                        } else if(col.sort == 'asc'){
                            sortedData = _.sortBy(scope.options.data, col.field);
                        } else if(col.sort == 'desc'){
                            sortedData = _.sortBy(scope.options.data, col.field).reverse();
                        }
                        angular.copy(sortedData, scope.options.data);
                    }
                }

                var checkColSort = function(sort) {
                    if(sort == null) {
                        return 'asc';
                    } else if(sort == 'asc') {
                        return 'desc';
                    } else if(sort == 'desc') {
                        return null;
                    }
                }

                var cleanOtherSort = function(col, columns) {
                    _.forEach(columns, function(otherCol) {
                        if(col.field != otherCol.field) {
                            otherCol.sort = null;
                        }
                    });
                }

                scope.getSelectedRows = function() {
                    var selectedRows = [];
                    _.forEach(scope.options.data, function(item) {
                        if(item.selection) {
                            selectedRows.push(item);
                        }
                    });
                    return selectedRows;
                }

                // init explore api
                if(scope.options.onRegisterApi) {
                    scope.options.onRegisterApi({
                        getSelectedRows : function() {
                            return scope.getSelectedRows();
                        }
                    });
                }
            },
            template: "<div class='table-responsive'>\n" +
            "   <table class='table table-bordered table-hover table-striped'>\n" +
            "       <thead>\n" +
            "           <tr>\n" +
            "               <th ng-if='options.enableRowSelection' class='pagination-checkbox'>" +
            "                   <input type='checkbox' ng-click='selectAll(isSelectAll)' ng-model='isSelectAll'>" +
            "               </th>" +
            "               <th ng-repeat='col in columns' style='{{col.cellStyle}}' ng-class='col.enableSorting ? \"sortable-head\" : \"\"' ng-click='sortData(col, columns)'>" +
            "                   <div ng-if='col.headTemplate' compile='col.headTemplate' cell-template-scope='col.headTemplateScope'></div>" +
            "                   <div ng-if='!col.headTemplate' style='display:inline;'>{{col.headTemplate || col.displayName || col.field}}</div>" +
            "                   <div ng-if='col.sort == \"asc\"' style='display:inline;'><i class='glyphicon' ng-class='\"glyphicon glyphicon-triangle-bottom\"'></i></div>" +
            "                   <div ng-if='col.sort == \"desc\"' style='display:inline;'><i class='glyphicon' ng-class='\"glyphicon glyphicon-triangle-top\"'></i></div>" +
            /*"                   <div ng-if='$index == maxColumnNum && !scope.options.enableGridMenu' class='pull-right' style='display:inline;'><i class='glyphicon' ng-click='' ng-class='\"glyphicon glyphicon-cog\"' style='cursor:pointer;'></i>" +*/
            "                   </div>" +
            "               </th>\n" +
            "           </tr>\n" +
            "       </thead>\n" +
            "       <tbody>\n" +
            "           <tr ng-repeat='item in options.data'>\n" +
            "               <td ng-if='options.enableRowSelection' class='pagination-checkbox'><input type='checkbox' ng-model='item.selection' ng-click='selectRow(row)'></td>" +
            "               <td ng-repeat='col in columns' >\n" +
            "                   <div ng-if='col.cellTemplate' grid-compile='col.cellTemplate' cell-template-scope='col.cellTemplateScope'></div>\n" +
            "                   <div ng-if='!col.cellTemplate'>{{ item[col.field] }}</div>\n" +
            "               </td>\n" +
            "           </tr>\n" +
            "           <tr ng-if='options.data == null || options.data.length == 0'>" +
            "               <td colspan='{{columnNumber}}' class='no-data'>{{options.noDataMessage}}</td>" +
            "           </tr>" +
            "           <tr ng-if='options.useExternalPagination'>" +
            "               <td colspan='{{columnNumber}}'>" +
            "                   <div paged-grid-bar></div>" +
            "               </td>" +
            "           </tr>" +
            "       </tbody>\n" +
            "   </table>\n" +
            "</div>\n"
        }
    })
    .directive('gridCompile', [
        '$compile',
        function ($compile) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    scope.cellTemplateScope = scope.$eval(attrs.cellTemplateScope);
                    // Watch for changes to expression.
                    scope.$watch(attrs.gridCompile, function (new_val) {
                        var new_element = angular.element(new_val);
                        element.append(new_element);
                        $compile(new_element)(scope);
                    });
                }
            };
        }
    ])
    .directive('pagedGridBar', function() {
        return {
            restrict: 'A',
            link : function link(scope, el, attrs) {
                scope.options.currentPage = 1;
                scope.currentGroup = 0;

                scope.$watch('options.totalItems', function(data) {
                    pageChange();
                },true);

                scope.$watch('options.paginationPageSize', function(data) {
                    scope.options.currentPage = 1;
                    scope.currentGroup = 0;
                    scope.paged(scope.options.currentPage);
                    pageChange();
                },true);

                var pageChange = function() {
                    scope.options.paginationPageSizes = scope.options.paginationPageSizes || [10,25,50];
                    scope.options.paginationPageSize = scope.options.paginationPageSize || 10;
                    scope.options.totalItems = scope.options.totalItems || 0;
                    var maxSize = scope.options.totalItems / scope.options.paginationPageSize;
                    if(parseInt(maxSize) == maxSize) {
                        scope.maxNum = parseInt(maxSize);
                    } else {
                        scope.maxNum = parseInt(maxSize) + 1;
                    }
                    console.log('scope.maxNum is ' + scope.maxNum)
                    var numArray =[], itemArray = [], groupId= 0, itemId = 1, loopId = 1;
                    while(itemId <= scope.maxNum) {
                        itemArray.push(itemId++);
                        loopId++;
                        if(loopId == 11) {
                            groupId++;
                            loopId = 1;
                            numArray.push(itemArray);
                            itemArray = [];
                        }
                        if(itemId > scope.maxNum) {
                            numArray.push(itemArray);
                        }
                    }
                    scope.maxGroup = groupId;
                    scope.pageNums= numArray;
                    scope.itemNumberStart = function() {
                        if(scope.options.totalItems == 0) {
                            return 0;
                        }
                        return (scope.options.currentPage-1) * scope.options.paginationPageSize + 1;
                    }
                    scope.itemNumberEnd = function() {
                        var endNum = (scope.options.currentPage-1) * scope.options.paginationPageSize + scope.options.paginationPageSize;
                        if(endNum > scope.options.totalItems) {
                            return scope.options.totalItems;
                        } else {
                            return endNum;
                        }
                    }
                    scope.paged = function(pageNum) {
                        scope.options.currentPage = pageNum;
                        if(!angular.isUndefined(scope.onPaginationChange)) {
                            scope.onPaginationChange(scope.options.currentPage, scope.options.paginationPageSize);
                        }
                    }
                    var getGroup = function(page) {
                        var returnGroup = 0, group = 0;
                        _.forEach(scope.pageNums, function(groups) {
                            if(_.includes(groups, page)) {
                                returnGroup = group;
                            }
                            group++;
                        });
                        return returnGroup;
                    }
                    scope.previous = function() {
                        scope.options.currentPage--;
                        scope.currentGroup = getGroup(scope.options.currentPage);
                        scope.paged(scope.options.currentPage);
                    }
                    scope.next = function() {
                        scope.options.currentPage++;
                        scope.currentGroup = getGroup(scope.options.currentPage);
                        scope.paged(scope.options.currentPage);
                    }
                    scope.first= function() {
                        scope.currentGroup = 0;
                        scope.paged(1);
                    }
                    scope.last= function() {
                        /*scope.options.currentPage = scope.maxNum;*/
                        scope.currentGroup = scope.maxGroup;
                        scope.paged(scope.maxNum);
                    }
                    scope.nextGroup = function() {
                        scope.currentGroup++;
                        scope.paged(scope.currentGroup * scope.options.paginationPageSize + 1);
                        console.log('Next page num is ' + scope.currentGroup);
                    }
                    scope.previousGroup = function() {
                        /*scope.paged(scope.options.currentPage  - 1);*/
                        scope.paged(scope.currentGroup * scope.options.paginationPageSize);
                        scope.currentGroup--;
                        console.log('previous page num is ' + scope.currentGroup + " , maxGroup is" + scope.maxGroup);
                    }
                };
            },
            template:
            '<div class="grid-page-bar">' +
            '   <a href="javascript:void(0)" class="glyphicon glyphicon-step-backward paged-grid-ctrl-link paged-grid-link" ng-click="first()" ng-class="options.currentPage==1?\'not-active\':\'\'"></a>' +
            '   <a href="javascript:void(0)" class="glyphicon glyphicon-triangle-left paged-grid-ctrl-link2 paged-grid-link" ng-click="previous()" ng-class="options.currentPage==1?\'not-active\':\'\'"></a>' +
            '   <a href="javascript:void(0)" class="paged-grid-num-link paged-grid-link" ng-if="currentGroup > 0" ng-click="previousGroup()">...</a>' +
            '   <a href="javascript:void(0)" class="paged-grid-num-link paged-grid-link" ng-repeat="pageNum in pageNums[currentGroup]" ng-click="paged(pageNum)" ng-class="pageNum == options.currentPage ? \'paged-grid-link-active\' : \'\'">{{pageNum}}</a>' +
            '   <a href="javascript:void(0)" class="paged-grid-num-link paged-grid-link" ng-if="currentGroup < maxGroup" ng-click="nextGroup()">...</a>' +
            '   <a href="javascript:void(0)" class="glyphicon glyphicon-triangle-right paged-grid-ctrl-link3 paged-grid-link" ng-click="next()" ng-class="(options.currentPage == maxNum || maxNum == 0)?\'not-active\':\'\'"></a>' +
            '   <a href="javascript:void(0)" class="glyphicon glyphicon-step-forward paged-grid-ctrl-link paged-grid-link" ng-click="last()" ng-class="(options.currentPage==maxNum || maxNum == 0)?\'not-active\':\'\'"></a>' +
            '   <span class="data-count-desc">当前 {{itemNumberStart()}} - {{itemNumberEnd()}} 条，总共 {{options.totalItems}} 条</span>' +
            '    <div class="pull-right paged-display-list">' +
            '   <span>每页显示</span>' +
            '        <select ng-model="options.paginationPageSize" ng-options="di for di in options.paginationPageSizes"></select>' +
            '    </div>' +
            '</div>'
        };
    });