import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import Progress from '../common/Progress';
import Navigation from '../common/Navigation';
import Footer from '../common/Footer';
import TopHeader from '../common/TopHeader';
import { correctHeight, detectBody } from './Helpers';
import 'slickgrid/examples/examples.css';

class Main extends React.Component {

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.location) != JSON.stringify(this.props.location)) {
            nextProps.location["prevLocation"] = this.props.location
        }
    }

    render() {
        let gray = "gray-bg " + this.props.location.pathname;
        return (
            <div id="wrapper">
                <div>
                    <Progress />
                    <Navigation location={this.props.location} />

                    <div id="page-wrapper" className={gray}>

                        <TopHeader location={this.props.location} />
                        {this.props.children}

                        <Footer />
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        // Run correctHeight function on load and resize window event
        $(window).bind("load resize", function () {
            correctHeight();
            detectBody();
        });

        // Correct height of wrapper after metisMenu animation.
        $('.metismenu a').click(() => {
            setTimeout(() => {
                correctHeight();
            }, 300)
        });
    }
}

const mapStateToProps = (state, ownProps) => {
    return {

    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    }
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main))