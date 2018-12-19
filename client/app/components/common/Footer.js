import React from 'react';
import { connect } from 'react-redux';

class Footer extends React.Component {

    render() {
        return (
            <div style={{ minWidth: 800 }} className="footer">
                <div className="pull-right">
                    <strong>Denitza Sabeva FMI &copy;</strong>
                </div>
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
        fetchVersion: () => {
            dispatch(fetchVersion())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer)