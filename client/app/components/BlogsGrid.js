import React from 'react';
import { connect } from 'react-redux';
import Hotkeys from 'react-hot-keys';

import { createBlog, deteteBlog } from '../actions/blogActions';

import RemoteModel from './remote-models/blogsData';

var confirm;
var viewPort = {
    leftPx: 0
}
class BlogsGrid extends React.Component {

    componentDidMount() {
        this.gridBuilder()
    }
    componentDidUpdate(nextProps) {
        const { deleteUpdateFlag } = this.props;
        const grid = $("#BlogsGrid").data("gridInstance");
        if (deleteUpdateFlag != nextProps.deleteUpdateFlag) {
            const updatedData = Array.from(grid.getData());
            updatedData.splice(grid.getSelectedRows()[0], 1);
            grid.setData(updatedData);
            grid.setSelectedRows([]);
            grid.render();
        }
    }

    gridBuilder = () => {
        var grid;
        var loadingIndicator;
        var columnFilters = new Object();
        var loader = new Slick.Data.RemoteModel();
        var radioSelector = new Slick.RadioSelectColumn({
            cssClass: "slick-cell-checkboxsel",
            columnId: "instances-grid-checkbox"
        });
        const columns = [
            radioSelector.getColumnDefinition(),
            { id: "autor", name: "Autor", field: "autor", cssClass: "cursor-pointer", width: 50, minWidth: 50, sortable: true, editor: TextEditor },
            { id: "title", name: "Title", field: "title", cssClass: "cursor-pointer", width: 50, minWidth: 50, sortable: true, editor: TextEditor },
            { id: "text", name: "Text", field: "text", cssClass: "cursor-pointer", width: 50, minWidth: 50, sortable: true, editor: TextEditor },
            { id: "tags", name: "Tags", field: "tags", cssClass: "cursor-pointer", width: 50, minWidth: 50, sortable: true, editor: TextEditor },
            { id: "status", name: "Status", field: "status", cssClass: "cursor-pointer", width: 50, minWidth: 50, sortable: true, editor: ToggleSwitchEditor },
            { id: "dateCreated", name: "Created", field: "dateCreated", cssClass: "cursor-pointer", width: 50, minWidth: 50, sortable: true },
            { id: "dateModified", name: "Updated", field: "dateModified", cssClass: "cursor-pointer", width: 50, minWidth: 50, sortable: true },
        ];

        const options = {
            enableCellNavigation: true,
            enableColumnReorder: false,
            forceFitColumns: true,
            multiColumnSort: true,
            editable: true,
            showHeaderRow: true,
            headerRowHeight: 30,
            explicitInitialization: true
        };

        function TextEditor(args) {
            var $input, defaultValue
            this.keyCaptureList = args.column.id == "type" ? [Slick.keyCode.UP, Slick.keyCode.DOWN, Slick.keyCode.ENTER] : null;
            this.init = function () {
                $input = $("<input placeholder='" + args.item[args.column.id] + "' type='search' class='editor-text rounded' />");
                $input.appendTo(args.container);
                $input.focus().select();
                $input.width($input.width());
                $input.keydown(function (e) {
                    if (e.keyCode == $.ui.keyCode.LEFT || e.keyCode == $.ui.keyCode.RIGHT) {
                        e.stopImmediatePropagation();
                    }
                })

                this.focus = function () {
                    $input.focus();
                };
                this.destroy = function () {
                    $(args.container).empty();
                };
                this.isValueChanged = function () {
                    return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
                }
                this.loadValue = function (item) {
                    let val = item[args.column.field];
                    defaultValue = val == null || val == undefined ? "" : val;

                    $input.val(defaultValue);
                    $input[0].defaultValue = defaultValue;
                    $input.select();
                };
                this.serializeValue = function () {
                    return { input: $input.val() }
                };
                this.applyValue = function (item, state) {
                    item[args.column.field] = state.input;
                };
                this.validate = function () {
                    if ($input.val().trim() == "") {
                        return { valid: false, msg: `The ${args.column.name} can not be empty string.` }
                    }
                    return { valid: true, msg: null }
                };
            };
            this.init();
        }

        function ToggleSwitchEditor(args) {
            let $input, defaultValue;
            this.init = function () {
                $input = $("<input id='toggle-one' type='checkbox' data-onstyle='primary' data-offstyle='danger' data-toggle='toggle' data-width='100%' data-height='20'/>");
                $input.appendTo(args.container);
                $input.focus().select();
                $input.keydown(function (e) {
                    if (e.keyCode == $.ui.keyCode.LEFT || e.keyCode == $.ui.keyCode.RIGHT) {
                        e.stopImmediatePropagation();
                    };
                });

                $input.prop('checked', args.item[args.column.field]);

                $input.bootstrapToggle({
                    width: args.position.width,
                    height: args.position.height + "px !important",
                    on: 'true',
                    off: 'false'
                });

                this.focus = function () {
                    $input.focus();
                };
                this.destroy = function () {
                    $(args.container).empty();
                };
                this.isValueChanged = function () {
                    return args.item.input != $input.val()
                };
                this.loadValue = function (item) {
                    defaultValue = item[args.column.field] || "";

                    $input.val(defaultValue);
                    $input[0].defaultValue = defaultValue;
                    $input.select();
                };
                this.serializeValue = function () {
                    return { input: $input.val() }
                };
                this.applyValue = function (item, state) {
                    item[args.column.field] = $input[0].checked;
                };
                this.validate = function () {
                    return { valid: true, msg: null }
                };
            };
            this.init();
        };

        function attachAutoResizeDataGrid(grid, gridId, gridContainerId) {
            let gridDomElm = $('#' + gridId);
            if (!gridDomElm || typeof gridDomElm.offset() === "undefined") {
                return null;
            }

            if ($(document.body).hasClass("mini-navbar")) {
                resizeToFitBrowserWindow(grid, gridId, true);
            } else {
                resizeToFitBrowserWindow(grid, gridId, false);
            }

            $("#hide-nav-btn").click(function () {
                if (!$(document.body).hasClass("mini-navbar")) {
                    resizeToFitBrowserWindow(grid, gridId, true);
                } else {
                    resizeToFitBrowserWindow(grid, gridId, false);
                }
            });

            $(window).on("resize", function () {
                if ($(document.body).hasClass("mini-navbar")) {
                    resizeToFitBrowserWindow(grid, gridId, true);
                } else {
                    resizeToFitBrowserWindow(grid, gridId, false);
                }
            });
        };

        function calculateNewDimensions(printMode, minNavBarEnabled) {
            if (minNavBarEnabled) {
                return {
                    height: window.innerHeight - 165,
                    width: window.innerWidth - 118
                }
            }

            return {
                height: window.innerHeight - 165,
                width: window.innerWidth - 268
            };
        };

        function resizeToFitBrowserWindow(grid, gridId, minNavBarEnabled) {
            let newSizes = calculateNewDimensions(null, minNavBarEnabled);

            $('#' + gridId).height(newSizes.height);
            $('#' + gridId).width(newSizes.width);

            if (new RegExp('MSIE [6-8]').exec(navigator.userAgent) === null && grid) {
                grid.resizeCanvas();
                grid.autosizeColumns();
                grid.render();
            }
        };

        function filterData() {
            loader.setSearch($(this).val());
            var vp = grid.getViewport();
            loader.ensureData(vp.top, vp.bottom);
        }
        function addNewRow() {
            const data = Array.from(grid.getData())
            data.unshift({
                id: -1,
                isNew: true,
                autor: "",
                title: "",
                text: "",
                tags: null,
                status: false
            })
            grid.setData(data)
            grid.render()
        }

        $(() => {
            let atrr = $("#BlogsGrid")[0];
            if (atrr) {
                grid = new Slick.Grid("#BlogsGrid", loader.data, columns, options);
                $("#BlogsGrid").data("gridInstance", grid);
                grid.registerPlugin(radioSelector);

                grid.onSelectedRowsChanged.subscribe(function (evt, args) {
                    let rows = grid.getSelectedRows();
                    if (rows.length > 0 && grid.getData()[rows[0]]) {
                        $("#blogs_delete_btn").prop("disabled", false);
                        $("#isn_manage_data_edit_btn").prop("disabled", false);
                    } else {
                        $("#blogs_delete_btn").prop("disabled", true);
                        $("#isn_manage_data_edit_btn").prop("disabled", true);
                    }
                    ;
                });

                grid.onClick.subscribe((e, args) => {
                    let row = grid.getSelectedRows([0])[0];
                    if (row != args.row) {
                        grid.setSelectedRows([args.row]);
                    }
                });

                grid.onViewportChanged.subscribe(function (e, args) {
                    var vp = grid.getViewport();
                    if (vp.leftPx != viewPort.leftPx) {
                        viewPort.leftPx = vp.leftPx;
                        return;
                    }
                    loader.ensureData(vp.top, vp.bottom);
                });

                grid.onSort.subscribe(function (e, args) {
                    const sortCols = new Object();
                    const headerNode = $("#BlogsGrid .slick-header-columns");

                    $.each(headerNode.children(), function (index, node) {
                        $(node).children("#order").remove();
                    });

                    for (let i in args.sortCols) {
                        const columnObj = args.sortCols[i];
                        const column = columnObj.sortCol;
                        const index = grid.getColumnIndex(column.id)
                        const columnNode = $(headerNode).children()[index];
                        const sortIndex = Number(i) + 1;
                        $("<span id='order' class='slick-grid-header-order'>" + sortIndex + "</span>").insertAfter($(columnNode).children(".slick-column-name"))
                        sortCols[column.id] = columnObj.sortAsc ? "asc" : "desc";
                    }

                    if (!e.shiftKey && !e.ctrlKey) {
                        ensureData();
                    } else {
                        $(document).bind("keyup", keyUp);
                    }

                    function keyUp(event) {
                        if (!event.shiftKey && !event.ctrlKey) {
                            ensureData();
                            $(document).unbind("keyup", keyUp);
                        }
                    }

                    function ensureData() {
                        loader.setSortColumns(sortCols);
                        var vp = grid.getViewport();
                        loader.ensureData(0, vp.bottom);
                    }
                });

                grid.onValidationError.subscribe(function (e, args) {
                    toastr.warning(args.validationResults.msg)
                });

                loader.onDataLoading.subscribe(function () {
                    if (!loadingIndicator) {
                        loadingIndicator = $("<span class='loading-indicator'><label>Buffering...</label></span>")
                            .css("top", "50%")
                            .css("left", "calc(50% - 50px)")
                            .appendTo($("#BlogsGrid"));
                    }
                    loadingIndicator.show();

                });

                loader.onDataLoaded.subscribe(function (e, args) {
                    for (var i = args.from; i <= args.to; i++) {
                        grid.invalidateRow(i);
                    }
                    grid.updateRowCount();
                    grid.render();
                    loadingIndicator.fadeOut();
                    $("#total_items").text("Total: " + args.total);
                });

                grid.onHeaderRowCellRendered.subscribe(function (e, args) {
                    $(args.node).empty();
                    switch (args.column.id) {
                        case "instances-grid-checkbox":
                            break;
                        default:
                            $("<input class='rounded input-filter' type='search'>")
                                .data("columnId", args.column.id)
                                .val(columnFilters[args.column.id])
                                .appendTo(args.node);
                            break;
                    }
                });

                $(grid.getHeaderRow()).delegate(":input", "change keyup", function (e) {
                    let columnId = $(this).data("columnId");
                    if (columnId != null) {
                        if ($.trim($(this).val()) == "" && columnFilters[columnId]) {
                            delete columnFilters[columnId];
                            return;
                        }
                        if ($.trim($(this).val()) != "")
                            columnFilters[columnId] = $.trim($(this).val());
                    }
                    loader.setColumnFilters(columnFilters);

                    if (e.which == 13) {
                        var vp = grid.getViewport();
                        loader.ensureData(vp.top, vp.bottom);
                    }
                });


                $("#blogs_new_btn").unbind();
                $("#blogs_new_btn").click((e) => {
                    addNewRow();
                });

                $("#blogs_save_btn").unbind();
                $("#blogs_save_btn").click((e) => {
                    const item = grid.getData()[grid.getSelectedRows()[0]];
                    if (grid.getEditorLock().isActive()) {
                        grid.getEditorLock().commitCurrentEdit();
                    }
                    if (item.isNew) {
                        this.props.createBlog({
                            title: item.title,
                            autor: item.autor,
                            text: item.text,
                            tags: item.tags,
                            status: item.status
                        })
                    }
                });

                $("#txtSearch").unbind();
                $("#txtSearch").keyup(function (e) {
                    if (e.which == 13) {
                        filterData.call(this);
                    }
                });

                $("#txtSearch").off("change").on("change", function (e) {
                    self.props.searchText($(this).val().toString());
                    loader.setSearch($(this).val());
                })

                $("#isn_manage_data_search_btn").unbind();
                $("#isn_manage_data_search_btn").click((e) => {
                    filterData.call($("#txtSearch"));
                });

                $("#blogs_delete_btn").unbind();
                $("#blogs_delete_btn").click(() => {
                    let rows = grid.getSelectedRows();
                    if (rows.length > 0 && grid.getData()[rows[0]] && !confirm) {
                        confirm = $.confirm({
                            title: 'Confirm?',
                            content: 'You are about to delete one Blog, this procedure is irreversible.',
                            type: 'red',
                            buttons: {
                                ok: {
                                    text: "Yes!",
                                    btnClass: 'btn-danger',
                                    keys: ['enter'],
                                    action: () => {
                                        confirm = null;
                                        let item = grid.getData()[rows];
                                        this.props.deteteBlog(item.id);
                                    }
                                },
                                cancel: function () {
                                    confirm = null;
                                }
                            }
                        });
                    }
                });

                loader.setSearch($("#txtSearch").val());
                grid.onViewportChanged.notify();
                grid.setSelectionModel(new Slick.RowSelectionModel({ selectActiveRow: false }));
                grid.registerPlugin(new Slick.AutoTooltips({ enableForHeaderCells: true }));
                grid.init();
                attachAutoResizeDataGrid(grid, "BlogsGrid", "gridContainera");
            }
        });
    }

    onDeleteHandler = () => {
        $("#blogs_delete_btn").click();
    };

    render() {

        return (
            <div className="isn" style={{ minWidth: 900 }}>
                <Hotkeys
                    keyName="ctrl+delete"
                    onKeyUp={this.onDeleteHandler}
                />
                <div className="isn-header">
                    <div style={{ float: "left", marginTop: 5, paddingLeft: 2, width: "100%", display: "flex" }}>
                        <input placeholder="Global Search" className="rounded" style={{ width: "100%", height: 36, fontSize: 18 }} id={"txtSearch"} type="search" />

                        <div className="control-buttons">
                            <button id="isn_manage_data_search_btn" style={{ marginRight: 2, height: 36 }}
                                className="btn btn-primary">Search
                            </button>
                            <button id="blogs_new_btn" style={{ marginRight: 2, height: 36 }}
                                className="btn btn-success">New
                            </button>
                            <button id="blogs_save_btn" style={{ marginRight: 2, height: 36 }}
                                className="btn btn-primary">Save
                            </button>
                            <button id="blogs_delete_btn" disabled style={{ marginRight: 2, height: 36 }}
                                className="btn btn-danger">Delete
                            </button>
                        </div>
                    </div>
                </div>
                <div className="custum-header" style={{ border: "0px", backgroundColor: "#FFFFFF", minWidth: 900 }} id="BlogsGrid"></div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        deleteUpdateFlag: state.blogReducer.deleteUpdateFlag
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        createBlog: (dto) => {
            dispatch(createBlog(dto))
        },
        deteteBlog: (id) => {
            dispatch(deteteBlog(id))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(BlogsGrid)