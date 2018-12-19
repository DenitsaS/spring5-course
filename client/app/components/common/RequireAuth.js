// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import PropTypes from 'prop-types';

// import { withRouter } from "react-router";

// export default function (ComposedComponent) {

//     class Authentication extends Component {

//         getDesiredRoute() {
//             return this.props.location.pathname;
//         }

//         redirect(url) {
//             this.props.router.push(url)
//         }

//         componentWillMount() {
//             if (!this.props.authenticated) {
//                 this.redirect(`/login?redirect=${this.getDesiredRoute()}`);

//                 console.log("User not authenticated");
//                 let token = window.sessionStorage.getItem('token');
//                 if (token) {
//                     console.log("There is a token. Checking it...");
//                     this.props.validateToken(token, this.getDesiredRoute());

//                 } else {
//                     console.log("Not Permitted! Redirecting to login.");
//                     this.props.router.push(`/login?redirect=${this.getDesiredRoute()}`);
//                 }
//             }
//         }

//         componentWillUpdate(nextProps) {
//             if (!nextProps.authenticated) {
//                 this.redirect(`/login?redirect=${this.getDesiredRoute()}`);
//             }
//         }

//         render() {
//             return <ComposedComponent {...this.props} />
//         }

//         static contextTypes = {
//             router: PropTypes.object
//         };
//     }

//     const mapStateToProps = (state, ownProps) => {
//         return {
//             authenticated: sessionStorage.getItem("isLogged")
//         }
//     };

//     const mapDispatchToProps = (dispatch, ownProps) => {
//         return {
//         }
//     };

//     return withRouter(connect(mapStateToProps, mapDispatchToProps)(Authentication));
// }