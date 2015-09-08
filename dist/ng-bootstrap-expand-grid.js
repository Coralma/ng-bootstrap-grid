angular.module('ng-bootstrap-expand-grid', ['ng-bootstrap-compile'])
    .directive('expandGrid', [function() {
        return {
            restrict: 'E',
            replace: true,
            priority : 10,
            scope: {
                options: '=',
                onSelect: '=',
                onExpand: '='
            },
            link : function (scope, element, attrs) {
                scope.appScope = scope.$parent;
                scope.columns = scope.options.columnDefs;
                scope.maxColumnNum = scope.columns.length - 1;
                /*scope.data = scope.options.data;*/
                scope.selectAllFlag = false;
                if(angular.isUndefined(scope.options.enableExpand)) {
                    scope.options.enableExpand = true;
                }
                scope.initData = function() {
                    var rows = [];
                    /*scope.rows = scope.options.data;*/
                    var data = scope.options.data;
                    _.forEach(data, function(d, key) {
                        var row = {item : d, expand: false, expandTemplate: scope.options.expandableRowTemplate};
                        rows.push(row);
                    });
                    scope.rows = rows;
                    scope.columnNumber = scope.options.columnDefs.length + 1; //FIXME it remove the hidden column and selection function.
                    /*console.log(JSON.stringify(scope.rows, null, '\t'));*/
                };
                scope.initData();

                scope.selectAll = function(isSelectAll) {
                    console.log(isSelectAll);
                    _.forEach(scope.rows, function(row) {
                        row.item.selection = isSelectAll;
                    });
                    scope.selectAllFlag = isSelectAll;
                };
                scope.selectRow = function(row) {
                    console.log('select a row.');
                    if (scope.onSelect) {
                        scope.onSelect(row);
                    }
                    //checkbox select all and un-select control.
                    var uncheckedRow=_.find(scope.options.data,function(row){
                        return row.selection==false || row.selection==null;
                    });
                    scope.selectAllFlag = (uncheckedRow==null);
                }
                scope.expandClick = function(clickedRow) {
                    if(scope.options.enableExpand) {
                        if(scope.options.enableSingleExpand) {
                            _.forEach(scope.rows, function(row) {
                                if(row != clickedRow) {
                                    row.expand = false;
                                    /*row.item.readonly = true;*/
                                }
                            });
                        }
                        if(scope.onExpand) {
                            scope.onExpand(clickedRow);
                        }
                    }
                }
                scope.getSelectedRows = function() {
                    var selectedRows = [];
                    _.forEach(scope.rows, function(row) {
                        if(row.item.selection) {
                            selectedRows.push(row);
                        }
                    });
                    return selectedRows;
                }
                scope.getUrlTemplate = function () {
                    return scope.options.expandableRowTemplate;
                };

                if(scope.options.onRegisterApi) {
                    scope.options.onRegisterApi({
                        refresh :  function() {
                            scope.initData();
                        },
                        addNewItem :  function(data) {
                            /*scope.initData();
                             var newRow = _.filter(scope.rows, {'item' : data});
                             newRow.expand= true;
                             scope.expandClick(newRow[0]);
                             scope.initData();*/
                            var newRow = {item : data, expand: true, expandTemplate: scope.options.expandableRowTemplate};
                            scope.rows.push(newRow);
                            scope.expandClick(newRow);
                        },
                        getSelectedRows : function() {
                            return scope.getSelectedRows();
                        },
                        deleteSelectedRows : function() {
                            var selectedRows = scope.getSelectedRows();
                            _.remove(scope.rows, function(data) {
                                var checkResult = _.includes(selectedRows, data);
                                if(checkResult) {
                                    _.remove(scope.options.data, data.item);
                                }
                                return checkResult;
                            });
                        }
                    });
                }
            },
            template:
            "<div class='table-responsive'>\n" +
            "   <table class='table table-bordered table-hover expand-table-striped ep-grid' style='table-layout:fixed;'>\n" +
            "       <thead>\n" +
            "           <tr>\n" +
            "               <th ng-if='options.enableRowSelection' class='grid-checkbox-cell'>" +
            "                   <input type='checkbox' ng-click='selectAll(isSelectAll)' ng-model='isSelectAll' ng-checked='selectAllFlag'>" +
            "               </th>" +
            "               <th ng-repeat='col in columns' style={{col.cellStyle}} >" +
            "                   <div ng-if='col.headTemplate' compile='col.headTemplate' cell-template-scope='col.headTemplateScope'></div>" +
            "                   <div ng-if='!col.headTemplate' >{{col.headTemplate || col.displayName || col.field}}</div>" +
            "               </th>\n" +
            "           </tr>\n" +
            "       </thead>\n" +
            "       <tbody>\n" +
            "           <tr ng-repeat-start='row in rows' ng-dblclick='row.expand=!row.expand;expandClick(row)'>\n" +
            "               <td ng-if='options.enableRowSelection' class='grid-checkbox-cell'><input type='checkbox' ng-model='row.item.selection' ng-click='selectRow(row)' ng-disabled='row.item.readonly'></td>" +
            "               <td ng-repeat='col in columns' style='word-break:break-all;'>\n" +
            "                   <div ng-if='col.cellTemplate' compile='col.cellTemplate' cell-template-scope='col.cellTemplateScope'></div>\n" +
            "                   <div ng-if='!col.cellTemplate' style='display:inline;float:left;'>{{ row.item[col.field] }}</div>\n" +
            "                   <div ng-if='options.enableExpand && $index == maxColumnNum' class='pull-right' style='display:inline;float:left;'><i class='glyphicon' ng-click='row.expand=!row.expand;expandClick(row)' ng-class='{\"glyphicon-chevron-down\": row.expand, \"glyphicon-chevron-right\": !row.expand}' style='cursor:pointer;'></i></div>" +
            "               </td>\n" +
            "           </tr>\n" +
            "           <tr ng-repeat-end ng-show='row.expand' ng-if='options.enableExpand' class='expand-form-tr'>" +
            "               <td colspan='{{columnNumber}}'>" +
            "                   <div ng-include=\"row.expandTemplate\"></div>" +
            "               </td>\n" +
            "           </tr>\n" +
            "       </tbody>\n" +
            "   </table>\n" +
            "</div>\n"
        }
    }]);