import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

class Navigation extends Component {

    componentDidMount() {
        const { menu } = this.refs;
        $(menu).metisMenu();
    }

    getDesiredRoute() {
        return this.props.location.pathname;
    }

    activeRoute(routeName) {
        return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
    }

    secondLevelActive(routeName) {
        return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
    }

    render() {
        return (
            <nav className="navbar-default navbar-static-side" role="navigation">
                <ul className="nav metismenu" id="side-menu" ref="menu">
                    <li className="nav-header">
                        <div className="logo-element">
                            IN+
                        </div>
                    </li>

                    <li id="blogs" s className={this.activeRoute("blogs")}>
                        <Link to="/blogs"><i className="fa fa-th" /> <span className="nav-label">Blogs</span></Link>
                    </li>
                </ul>
            </nav>

        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        location: ownProps.location,
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {

    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navigation))