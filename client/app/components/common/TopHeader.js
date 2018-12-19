import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { smoothlyMenu } from '../layouts/Helpers';
import { connect } from "react-redux";
import { Link, Location } from 'react-router';
import { withRouter } from 'react-router';

import Spinner from './Spinner';

class TopHeader extends React.Component {
    constructor() {
        super()
        this.state = {
            spinner: { message: null, progressInfo: null }
        }
    }

    componentWillReceiveProps(nextProps) {
        let { addFlag, deleteFlag, titleUpdateFlag } = this.props, { spinner } = { ...this.state };
        if (addFlag != nextProps.addFlag) {
            let nextSpinner = nextProps.spinners.values().next().value;
            if (!spinner.message) {
                this.setState({ spinner: nextSpinner })
            }
        }

        if (deleteFlag != nextProps.deleteFlag) {
            if (!nextProps.spinners.has(spinner.message)) {
                let nextSpinner = nextProps.spinners.values().next().value;
                if (nextSpinner) {
                    this.setState({ spinner: nextSpinner })
                } else {
                    spinner.message = null;
                    spinner.progressInfo = null;
                    this.setState({ spinner });
                }
            }
        }
    }

    toggleNavigation(e) {
        e.preventDefault();
        $("body").toggleClass("mini-navbar");
        smoothlyMenu();
    }

    getDesiredRoute() {
        return this.props.location.pathname;
    }

    render() {
        let { title } = this.props, { spinner } = this.state;
        return (
            <div style={{ minWidth: 900 }} className="row border-bottom">
                <nav className="navbar white-bg" role="navigation" style={{ marginBottom: 0 }}>
                    <div className="navbar-header">
                        <a id="hide-nav-btn" className="navbar-minimalize minimalize-styl-2 btn btn-primary " onClick={this.toggleNavigation} href="#"><i className="fa fa-bars"></i> </a>
                    </div>
                    {spinner.message ?
                        <div style={{ display: "grid", marginTop: 3 }}>
                            <Spinner message={spinner.message} progressInfo={spinner.progressInfo} />
                        </div> :
                        <div>
                            <h3 className="text-center" id="top_header_title">{title}</h3>
                        </div>
                    }
                </nav>
            </div>
        )
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        title: state.topHeader.title,
        spinners: state.topHeader.spinners,

        addFlag: state.topHeader.addFlag,
        deleteFlag: state.topHeader.deleteFlag,
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TopHeader))