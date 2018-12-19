import axios from 'axios';
const CancelToken = axios.CancelToken;
const urlencode = require('urlencode');
var source;

(function ($) {
    /***
     * A sample AJAX data store implementation.
     * Right now, it's hooked up to load search results from Octopart, but can
     * easily be extended to support any JSONP-compatible backend that accepts paging parameters.
     */
    function RemoteModel() {
        // private
        var PAGESIZE = 150;
        var data = { length: 0 };
        var searchstr = "";
        var h_request = null;
        var req = null; // ajax request
        var totalItems = null;
        var sortCols = Object.create(null);
        var columnFilters = Object.create(null);
        // events
        var onDataLoading = new Slick.Event();
        var onDataLoaded = new Slick.Event();


        function init() {
        }

        function isDataLoaded(from, to) {
            for (var i = from; i <= to; i++) {
                if (data[i] == undefined || data[i] == null) {
                    return false;
                }
            }

            return true;
        }


        function clear() {
            for (var key in data) {
                delete data[key];
            }
            data.length = 0;
        }
        function ensureData(from, to) {
            if (req) {
                source.cancel();
                for (var i = req.fromPage; i <= req.toPage; i++) {
                    data[i * PAGESIZE] = undefined;
                }
            };

            if (from < 0) {
                from = 0;
            }

            if (data.length > 0) {
                to = Math.min(to, data.length - 1);
            };

            var fromPage = Math.floor(from / PAGESIZE);
            var toPage = Math.floor((to || 0) / PAGESIZE);
            while (data[fromPage * PAGESIZE] !== undefined && fromPage < toPage)
                fromPage++;

            while (data[toPage * PAGESIZE] !== undefined && fromPage < toPage)
                toPage--;

            if (fromPage > toPage || ((fromPage == toPage) && data[fromPage * PAGESIZE])) {
                // TODO:  look-ahead
                onDataLoaded.notify({ from: from, to: to, total: totalItems });
                return;
            }
            // "&filter=" + urlencode(JSON.stringify(columnFilters)) + "&sort=" + urlencode(JSON.stringify(sortCols)) + "&q=" + urlencode(searchstr) 
            var url = `${API_BASE_URL}blog/all?page=${fromPage}&size=${PAGESIZE}`

            if (h_request != null) {
                clearTimeout(h_request);
            }

            h_request = setTimeout(function () {
                for (var i = fromPage; i <= toPage; i++)
                    data[i * PAGESIZE] = null; // null indicates a 'requested but not available yet'

                onDataLoading.notify({ from: from, to: to });
                source = CancelToken.source();
                req = axios.get(url, {
                    cancelToken: source.token
                })
                    .then(response => {
                        onSuccess(response.data);
                    }).catch((e) => {
                        if (e instanceof Error && e.response) {
                            showError(e);
                        } else {
                            req = null;
                            return;
                        }
                        onDataLoaded.notify({ from: fromPage * PAGESIZE, to: (fromPage * PAGESIZE) + toPage * PAGESIZE, total: totalItems });
                    });
                req.fromPage = fromPage;
                req.toPage = toPage;
            }, 300);
        }

        function showError(e) {
            toastr.error(e);
        };

        function onSuccess(resp) {
            var from = resp.number * PAGESIZE, to = from + resp.content.length;
            data.length = resp.totalElements;
            var content = resp.content;
            for (let i = 0; i < content.length; i++) {
                data[from + i] = {
                    id: content[i].id,
                    title: content[i].title,
                    autor: content[i].autor,
                    text: content[i].text,
                    tags: content[i].tags,
                    status: content[i].status,
                    dateCreated: moment(content[i].dateCreated).format("YYYY/MM/DD"),
                    dateModified: moment(content[i].dateModified).format("YYYY/MM/DD"),
                    isNew: false
                }
                data[from + i].index = from + i;
            };
            req = null;
            onDataLoaded.notify({ from: from, to: to });
        };

        function reloadData(from, to) {
            for (var i = from; i <= to; i++)
                delete data[i];
            ensureData(from, to);
        }

        function setSearch(str) {
            searchstr = str;
            clear();
        }

        function setColumnFilters(filters) {
            columnFilters = filters;
            clear();
        }

        function setSortColumns(columns) {
            sortCols = columns
            clear();
        }

        init();

        return {
            // properties
            "data": data,

            // methods
            "clear": clear,
            "isDataLoaded": isDataLoaded,
            "ensureData": ensureData,
            "reloadData": reloadData,
            "setSearch": setSearch,
            "setColumnFilters": setColumnFilters,
            "setSortColumns": setSortColumns,

            // events
            "onDataLoading": onDataLoading,
            "onDataLoaded": onDataLoaded
        };
    }

    // Slick.Data.RemoteModel
    $.extend(true, window, { Slick: { Data: { RemoteModel: RemoteModel } } });
})(jQuery);