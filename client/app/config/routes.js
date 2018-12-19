import React from 'react'
import { Route, Router, browserHistory } from 'react-router';

import Main from '../components/layouts/Main';
import Blogs from '../views/Blogs';


export default (
    <Router history={browserHistory}>
        <Route component={Main} >
            <Route path="/" component={Blogs} />
            <Route path="/blogs" component={Blogs} />
        </Route>
    </Router>
);