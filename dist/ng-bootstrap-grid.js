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
                scope.columns = scope.options.columnDefs;
                scope.maxColumnNum = scope.columns.length - 1;
                scope.columnNumber = scope.options.columnDefs.length + 1; //FIXME it remove the hidden column and selection function.
                scope.selectAll = function (isSelectAll) {
                    console.log(isSelectAll);
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
                            scope.onSortChanged(col);
                        }
                    } else {
                        if(col.sort == null) {
                            sortedData = scope.dataBackup;
                        } else if(col.sort == 'ace'){
                            sortedData = _.sortBy(scope.options.data, col.field);
                        } else if(col.sort == 'desc'){
                            sortedData = _.sortBy(scope.options.data, col.field).reverse();
                        }
                        angular.copy(sortedData, scope.options.data);
                        console.log('sortData');
                    }
                }

                var checkColSort = function(sort) {
                    if(sort == null) {
                        return 'ace';
                    } else if(sort == 'ace') {
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
            "                   <div ng-if='col.sort == \"ace\"' style='display:inline;'><i class='glyphicon' ng-class='\"glyphicon glyphicon-triangle-bottom\"'></i></div>" +
            "                   <div ng-if='col.sort == \"desc\"' style='display:inline;'><i class='glyphicon' ng-class='\"glyphicon glyphicon-triangle-top\"'></i></div>" +
            "                   <div ng-if='$index == maxColumnNum && !scope.options.enableGridMenu' class='pull-right' style='display:inline;float:left;'><i class='glyphicon' ng-click='' ng-class='\"glyphicon glyphicon-cog\"' style='cursor:pointer;'></i>" +
                /*"                   <ul></ul>" +*/
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
            "               <td colspan='{{columnNumber}}'>{{options.noDataMessage}}</td>" +
            "           </tr>" +
            "           <tr ng-if='!scope.options.useExternalPagination'>" +
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
                scope.currentPage = 1;
                scope.currentGroup = 0;

                scope.$watch('options.totalItems', function(data) {
                    pageChange();
                },true);

                scope.$watch('options.paginationPageSize', function(data) {
                    scope.currentPage = 1;
                    scope.currentGroup = 0;
                    scope.paged(scope.currentPage);
                    pageChange();
                },true);

                var pageChange = function() {
                    scope.options.paginationPageSizes = scope.options.paginationPageSizes || [10,25,50];
                    scope.options.paginationPageSize = scope.options.paginationPageSize || 10;
                    scope.options.totalItems = scope.options.totalItems || 0;
                    scope.maxNum = parseInt(scope.options.totalItems / scope.options.paginationPageSize) + 1;
                    console.log('maxNum is ' + scope.maxNum);
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
                    console.log('Page Num is ' + numArray);
                    scope.itemNumberStart = function() {
                        return (scope.currentPage-1) * scope.options.paginationPageSize + 1;
                    }
                    scope.itemNumberEnd = function() {
                        var endNum = (scope.currentPage-1) * scope.options.paginationPageSize + scope.options.paginationPageSize;
                        if(endNum > scope.options.totalItems) {
                            return scope.options.totalItems;
                        } else {
                            return endNum;
                        }
                    }
                    scope.paged = function(pageNum) {
                        scope.currentPage = pageNum;
                        if(!angular.isUndefined(scope.onPaginationChange)) {
                            scope.onPaginationChange(scope.currentPage, scope.options.paginationPageSize);
                        }
                        console.log('Clicked page num is ' + pageNum);
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
                        scope.currentPage--;
                        scope.currentGroup = getGroup(scope.currentPage);
                        scope.paged(scope.currentPage);
                    }
                    scope.next = function() {
                        scope.currentPage++;
                        scope.currentGroup = getGroup(scope.currentPage);
                        scope.paged(scope.currentPage);
                    }
                    scope.first= function() {
                        scope.currentGroup = 0;
                        scope.paged(1);
                    }
                    scope.last= function() {
                        /*scope.currentPage = scope.maxNum;*/
                        scope.currentGroup = scope.maxGroup;
                        scope.paged(scope.maxNum);
                    }
                    scope.nextGroup = function() {
                        scope.currentGroup++;
                        scope.paged(scope.currentGroup * scope.options.paginationPageSize + 1);
                        console.log('Next page num is ' + scope.currentGroup);
                    }
                    scope.previousGroup = function() {
                        /*scope.paged(scope.currentPage  - 1);*/
                        scope.paged(scope.currentGroup * scope.options.paginationPageSize);
                        scope.currentGroup--;
                        console.log('previous page num is ' + scope.currentGroup + " , maxGroup is" + scope.maxGroup);
                    }
                };
            },
            template:
            '<div class="grid-page-bar">' +
            '   <a href="javascript:void(0)" class="glyphicon glyphicon-step-backward paged-grid-ctrl-link paged-grid-link" ng-click="first()" ng-class="currentPage==1?\'not-active\':\'\'"></a>' +
            '   <a href="javascript:void(0)" class="glyphicon glyphicon-triangle-left paged-grid-ctrl-link2 paged-grid-link" ng-click="previous()" ng-class="currentPage==1?\'not-active\':\'\'"></a>' +
            '   <a href="javascript:void(0)" class="paged-grid-num-link paged-grid-link" ng-if="currentGroup > 0" ng-click="previousGroup()">...</a>' +
            '   <a href="javascript:void(0)" class="paged-grid-num-link paged-grid-link" ng-repeat="pageNum in pageNums[currentGroup]" ng-click="paged(pageNum)" ng-class="pageNum == currentPage ? \'paged-grid-link-active\' : \'\'">{{pageNum}}</a>' +
            '   <a href="javascript:void(0)" class="paged-grid-num-link paged-grid-link" ng-if="currentGroup < maxGroup" ng-click="nextGroup()">...</a>' +
            '   <a href="javascript:void(0)" class="glyphicon glyphicon-triangle-right paged-grid-ctrl-link3 paged-grid-link" ng-click="next()" ng-class="currentPage==maxNum?\'not-active\':\'\'"></a>' +
            '   <a href="javascript:void(0)" class="glyphicon glyphicon-step-forward paged-grid-ctrl-link paged-grid-link" ng-click="last()" ng-class="currentPage==maxNum?\'not-active\':\'\'"></a>' +
            '   <span class="data-count-desc">��ǰ {{itemNumberStart()}} - {{itemNumberEnd()}} �����ܹ� {{options.totalItems}} ��</span>' +
            '    <div class="pull-right paged-display-list">' +
            '   <span>ÿҳ��ʾ</span>' +
            '        <select ng-model="options.paginationPageSize" ng-options="di for di in options.paginationPageSizes"></select>' +
            '    </div>' +
            '</div>'
        };
    });