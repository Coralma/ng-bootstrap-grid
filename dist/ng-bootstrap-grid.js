angular.module('ng-bootstrap-grid', [])
    .directive('ngGrid', function () {
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
            "                   <div ng-if='$index == maxColumnNum && !scope.options.enableGridMenu' class='pull-right' style='display:inline;float:left;'><i class='glyphicon' ng-click='' ng-class='\"glyphicon glyphicon-cog\"' style='cursor:pointer;'></i>" +
            /*"                   <ul></ul>" +*/
            "                   </div>" +
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
            "           <tr>" +
            "               <td colspan='{{columnNumber}}'>" +
            "                   <div paged-grid-bar></div>" +
            "               </td>" +
            "           </tr>" +
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
                /*scope.columns = scope.options.columns;
                scope.maxColumnNum = scope.columns.length - 1;
                scope.columnNumber = scope.options.columns.length + 1; //FIXME it remove the hidden column and selection function.
                scope.data = scope.options.data;
                console.log(scope.data);*/
                scope.displayList = [10,25,50];
                scope.totalSize = 221;
                scope.displayItemNum = 10;
                scope.currentPage = 1;
                scope.currentGroup = 0;
                scope.maxNum = parseInt(scope.totalSize / scope.displayItemNum) + 1;
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
                    return (scope.currentPage-1) * scope.displayItemNum + 1;
                }
                scope.itemNumberEnd = function() {
                    return (scope.currentPage-1) * scope.displayItemNum + 10;
                }
                scope.paged = function(pageNum) {
                    scope.currentPage = pageNum;
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
                    scope.currentPage = 1;
                    scope.currentGroup = 0;
                    console.log('Next page num is ' + scope.currentGroup);
                }
                scope.last= function() {
                    scope.currentPage = scope.maxNum;
                    scope.currentGroup = scope.maxGroup;
                }
                scope.nextGroup = function() {
                    scope.currentGroup++;
                    console.log('Next page num is ' + scope.currentGroup);
                }
                scope.previousGroup = function() {
                    scope.currentGroup--;
                    console.log('previous page num is ' + scope.currentGroup + " , maxGroup is" + scope.maxGroup);
                }
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
                '   <span>当前 {{itemNumberStart()}} - {{itemNumberEnd()}} 条，总共 {{totalSize}} 条</span>' +
                '    <div class="pull-right paged-display-list">' +
                '   <span>每页显示</span>' +
                '        <select ng-model="displayItemNum"><option ng-repeat="di in displayList" value ="{{di}}">{{di}}</option></select>' +
                '    </div>' +
                '</div>'
        };
    });