import React from 'react';
import { connect } from 'react-redux';

import BlogsGrid from '../components/BlogsGrid'

class Blogs extends React.Component {

    render() {
        return (
            <div style={{ paddingTop: 5 }}>
                <BlogsGrid />
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {

    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {

        // setTitle: (title) => {
        //     dispatch(setTitle(title))
        // }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Blogs)