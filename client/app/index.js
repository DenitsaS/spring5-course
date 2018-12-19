import React from 'react';
import ReactDOM from 'react-dom';
import { Router, hashHistory, withRouter } from 'react-router';
import routes from './config/routes';
import { Provider } from 'react-redux';
import history from './config/history';

import store from './store';

import jQuery from 'jquery';
import jquery from 'jquery';
import metismenu from 'metismenu';
import bootstrap from 'bootstrap';
import moment from 'moment';
import RadioSelectColumn from './../public/modules/slickgrid/js/slick.radioselectcolumn';

import 'toastr/build/toastr.css';

import 'jquery-ui-dist/jquery-ui.min.css'
import 'jquery-ui-dist/jquery-ui.min.js'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.css'
import 'animate.css/animate.min.css'
import 'react-tagsinput/react-tagsinput.css';

import './../public/styles/style.css'
import './../public/styles/app.css';
import './../public/styles/print.css';
import './../public/modules/slickgrid/js/ext.headerfilter.js';
import './../public/modules/slickgrid/js/ext.overlays';
import './../public/styles/slick-grid-custom.css';
import './../public/modules/slickgrid/css/plugins-common.css';
import './../public/modules/slickgrid/css/plugins-gdoc-style.css';
import './../public/modules/slickgrid/css/slick.headerbuttons.css';
import './../public/modules/jquery-liteaccordion/js/liteaccordion.jquery.js';
import './../public/modules/jquery-liteaccordion/css/liteaccordion.css';
import './../public/modules/jquery.center-master/jquery.center.js';
import './../public/modules/jquery-liteaccordion/css/liteaccordion.css';
import './../public/modules/slickgrid/slickgrid-column-group-master/dist/slick.columngroup.css';
import './../public/modules/slickgrid/slickgrid-column-group-master/dist/slick.columngroup.js';

import 'bootstrap-multiselect/dist/js/bootstrap-multiselect.js';
import 'bootstrap-multiselect/dist/css/bootstrap-multiselect.css';

import 'jquery.enhsplitter/js/jquery.enhsplitter.js';
import 'jquery.enhsplitter/css/jquery.enhsplitter.css';

import 'jquery.splitter/css/jquery.splitter.css';
import 'jquery.splitter/js/jquery.splitter.js';

import 'jquery-timepicker/jquery.timepicker.css';
import 'jquery-timepicker/jquery.timepicker.js';

import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/flatpickr.js';

import 'blueimp-file-upload/css/jquery.fileupload.css';
import 'blueimp-file-upload/js/vendor/jquery.ui.widget.js'
import 'blueimp-file-upload/js/jquery.iframe-transport.js'
import 'blueimp-file-upload/js/jquery.fileupload.js'

import 'slickgrid/slick.grid.css';
import 'slickgrid/css/smoothness/jquery-ui-1.11.3.custom.css';
import 'slickgrid/controls/slick.columnpicker.css';

import 'slickgrid/examples/examples.css';

import 'slickgrid/lib/firebugx.js';
import 'slickgrid/lib/jquery-1.11.2.min.js';
import 'slickgrid/lib/jquery.event.drag-2.3.0.js';
import 'slickgrid/lib/jquery.event.drop-2.3.0';

import 'slickgrid/slick.groupitemmetadataprovider';
import 'slickgrid/slick.formatters.js';
import 'slickgrid/slick.dataview.js';
import 'slickgrid/slick.editors.js';
import 'slickgrid/slick.core.js';
import 'slickgrid/slick.grid.js';

import 'slickgrid/plugins/slick.rowselectionmodel.js';
import 'slickgrid/plugins/slick.checkboxselectcolumn.js';
import 'slickgrid/plugins/slick.autotooltips.js';
import 'slickgrid/plugins/slick.cellrangedecorator.js';
import 'slickgrid/plugins/slick.cellrangeselector.js';
import 'slickgrid/plugins/slick.cellcopymanager.js';
import 'slickgrid/plugins/slick.cellselectionmodel.js';
import 'slickgrid/plugins/slick.rowmovemanager';
import 'slickgrid/plugins/slick.headerbuttons.js';
import 'slickgrid/controls/slick.columnpicker.js';
import 'slickgrid/controls/slick.pager.css'
import 'slickgrid/controls/slick.pager.js'

import 'bootstrap-toggle/css/bootstrap-toggle.css';
import 'bootstrap-toggle/js/bootstrap-toggle.js';
import 'jquery-confirm/css/jquery-confirm.css';
import 'jquery-confirm/js/jquery-confirm.js';

import '../public/modules/select2-3.5.3/select2.css'
import '../public/modules/select2-3.5.3/select2.js'
import Axios from "axios";

if (process.env.NODE_ENV !== 'production') {
    console.log("Serving in dev mode.")
}

toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: true,
    progressBar: true,
    positionClass: "toast-top-right",
    preventDuplicates: true,
    onclick: null,
    showDuration: 300,
    hideDuration: 1000,
    timeOut: 5000,
    extendedTimeOut: 1000,
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut"
}

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>{routes}</Router>
    </Provider>,
    document.getElementById('root')
);

Axios.interceptors.request.use((config) => {
    config.headers['X-Requested-With'] = `XMLHttpRequest`;
    return config;
})


Axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response != null && !error.config.url.endsWith("myself")) {
            const { status } = error.response;
            if (status === 401) {
                window.location.reload();
            }
        }
        return Promise.reject(error);
    }
);

window.$ = $;
window.jQuery = jQuery;
