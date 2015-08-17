angular.module('ng-bootstrap-expand-grid', ['ng-grid-utils'])
    .directive('expandGrid', ['$timeout', '$window', '$templateCache', 'gridService', function ($timeout, $window, $templateCache, gridService) {
        var TEMPLATE_FIXED_HEIGHT = 'template/EXPANDGrid/EXPANDGridFixedHeight.html';

        var GRID_EXPAND_PART_HEAD =
            "       <thead>\n" +
            "           <tr>\n" +
            "               <th ng-if='options.enableRowSelection' class='grid-checkbox-cell'>" +
            "                   <input type='checkbox' ng-click='selectAll(isSelectAll)' ng-model='isSelectAll' ng-checked='selectAllFlag'>" +
            "               </th>" +
            "               <th ng-repeat='col in columns' style={{col.headStyle}} >" +
            "                   <div ng-if='col.headTemplate' compile='col.headTemplate' cell-template-scope='col.headTemplateScope'></div>" +
            "                   <div ng-if='!col.headTemplate' >{{col.headTemplate || col.displayName || col.field}}</div>" +
            "               </th>\n" +
            "           </tr>\n" +
            "       </thead>\n";

        var GRID_EXPAND_PART_BODY =
            "       <tbody ng-repeat='row in rows'>\n" +
            "           <tr ng-dblclick='row.expand=!row.expand;expandClick(row)'>\n" +
            "               <td ng-if='options.enableRowSelection' class='grid-checkbox-cell'><input type='checkbox' ng-model='row.item.selection' ng-click='selectRow(row)' ng-disabled='row.item.readonly'></td>" +
            "               <td ng-repeat='col in columns' style={{col.cellStyle}} style='word-break:break-all;'>\n" +
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
            "       </tbody>\n";

        var GRID_EXPAND_STRUCTURE_FIXED_HEIGHT =
            "<div class='table-responsive table-bordered ep-grid'>" +
            "   <table class='table table-head table-bordered table-hover' style='table-layout:fixed;margin-bottom:0px; width:auto;'>" +
            GRID_EXPAND_PART_HEAD +
            "   </table>\n" +
            "   <div style='overflow-y:auto;'>\n" +
            "   <table class='table table-body table-bordered table-hover' style='table-layout:fixed;margin-bottom:0px;'>" +
            GRID_EXPAND_PART_HEAD +
            GRID_EXPAND_PART_BODY +
            "   </table>" +
            "</div>"

        $templateCache.put(TEMPLATE_FIXED_HEIGHT, GRID_EXPAND_STRUCTURE_FIXED_HEIGHT);
        return {
            restrict: 'E',
            replace: true,
            priority: 10,
            scope: {
                options: '=',
                onSelect: '=',
                onExpand: '='
            },
            link: function (scope, element, attrs) {
                scope.appScope = scope.$parent;
                scope.columns = scope.options.columnDefs;
                scope.maxColumnNum = scope.columns.length - 1;
                /*scope.data = scope.options.data;*/
                scope.selectAllFlag = false;
                /*scope.$watch('options.data', function(data) {*/
                scope.initData = function () {
                    var rows = [];
                    /*scope.rows = scope.options.data;*/
                    var data = scope.options.data;
                    _.forEach(data, function (d, key) {
                        var row = {item: d, expand: false, expandTemplate: scope.options.expandableRowTemplate};
                        rows.push(row);
                    });
                    scope.rows = rows;
                    scope.columnNumber = scope.options.columnDefs.length + 1; //FIXME it remove the hidden column and selection function.
                    /*console.log(JSON.stringify(scope.rows, null, '\t'));*/
                };
                scope.initData();

                scope.selectAll = function (isSelectAll) {
                    /*console.log(isSelectAll);*/
                    _.forEach(scope.rows, function (row) {
                        if (row.item.readonly) {
                            row.item.selection = false;
                        } else {
                            row.item.selection = isSelectAll;
                        }
                    });
                    scope.selectAllFlag = isSelectAll;
                };
                scope.selectRow = function (row) {
                    /*console.log('select a row.');*/
                    if (scope.onSelect) {
                        scope.onSelect(row);
                    }
                    //checkbox select all and un-select control.
                    var uncheckedRow = _.find(scope.options.data, function (row) {
                        return row.selection == false || row.selection == null;
                    });
                    scope.selectAllFlag = (uncheckedRow == null);
                }
                scope.expandClick = function (clickedRow) {
                    if (scope.options.enableSingleExpand) {
                        _.forEach(scope.rows, function (row) {
                            if (row != clickedRow) {
                                row.expand = false;
                                /*row.item.readonly = true;*/
                            }
                        });
                    }
                    scope.onExpand(clickedRow);

                    scope.calcGridSize();
                }
                scope.getSelectedRows = function () {
                    var selectedRows = [];
                    _.forEach(scope.rows, function (row) {
                        if (row.item.selection) {
                            selectedRows.push(row);
                        }
                    });
                    return selectedRows;
                }
                scope.getUrlTemplate = function () {
                    return scope.options.expandableRowTemplate;
                };

                if (scope.options.onRegisterApi) {
                    scope.options.onRegisterApi({
                        refresh: function () {
                            scope.initData();

                            scope.calcGridSize();
                        },
                        calcGridSize: function (gridHeight) {
                            //gridHeight为空，则用window高度计算
                            scope.calcGridSize(gridHeight);
                        },
                        addNewItem: function (data) {
                            /*scope.initData();
                             var newRow = _.filter(scope.rows, {'item' : data});
                             newRow.expand= true;
                             scope.expandClick(newRow[0]);
                             scope.initData();*/
                            var newRow = {item: data, expand: true, expandTemplate: scope.options.expandableRowTemplate};
                            scope.rows.push(newRow);
                            scope.expandClick(newRow);
                        },
                        getSelectedRows: function () {
                            return scope.getSelectedRows();
                        },
                        deleteSelectedRows: function () {
                            var selectedRows = scope.getSelectedRows();
                            _.remove(scope.rows, function (data) {
                                var checkResult = _.includes(selectedRows, data);
                                if (checkResult) {
                                    _.remove(scope.options.data, data.item);
                                }
                                return checkResult;
                            });
                        },
                        calcGridSize: function (gridHeight) {
                            //windowHeight为空，则用window高度计算
                            scope.calcGridSize(gridHeight);
                        }
                    });
                }
                scope.calcGridSize = function (gridHeight) {
                    $timeout(function () {
                        var gridHolderElement = element.parent().children('div');
                        if (gridHeight) {
                            scope.options.fixedHeight = gridHeight;
                            gridService.calcGridSize(gridHolderElement, gridHeight);
                        } else {
                            gridService.calcGridSize(gridHolderElement, scope.options.fixedHeight);
                        }
                    }, 0);
                };

                scope.getTemplate = function () {
                    return TEMPLATE_FIXED_HEIGHT;
                }

                //FixedGrid,需要计算GridSize，并监听resize事件
                scope.calcGridSize();

                $(window).resize(function (e) {
                    if (e.target != window) {
                        //避免jQueryUI dialog的resize
                        return;
                    }

                    if (!scope.calcGridSize) {
                        return;
                    }

                    if (scope.options.fixedHeight) {
                        scope.calcGridSize(scope.options.fixedHeight);
                    } else {
                        scope.calcGridSize();
                    }
                });

            },
            template: "<div ng-include='getTemplate()'></div>"
        }
    }]);