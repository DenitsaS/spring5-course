import  React from 'react';
import { connect } from 'react-redux';

class Spinner extends React.Component {

    render() {
        let { style } = this.props;
        return (
            <div style={style}>
                <div className="sk-spinner sk-spinner-fading-circle">
                    <div className="sk-circle1 sk-circle"></div>
                    <div className="sk-circle2 sk-circle"></div>
                    <div className="sk-circle3 sk-circle"></div>
                    <div className="sk-circle4 sk-circle"></div>
                    <div className="sk-circle5 sk-circle"></div>
                    <div className="sk-circle6 sk-circle"></div>
                    <div className="sk-circle7 sk-circle"></div>
                    <div className="sk-circle8 sk-circle"></div>
                    <div className="sk-circle9 sk-circle"></div>
                    <div className="sk-circle10 sk-circle"></div>
                    <div className="sk-circle11 sk-circle"></div>
                    <div className="sk-circle12 sk-circle"></div>
                </div>
                {this.props.message || this.props.progressInfo ?
                    <div style={{ marginTop: 0 }} className="text-center m-t-sm" >
                        <label>
                            <span style={{ color: "#1ab394" }}  >{this.props.message != null ? this.props.message : null}</span><br />
                            <span style={{ color: "#1ab394" }}  >{this.props.progressInfo && this.props.progressInfo.done > 0 ? '( ' + this.props.progressInfo.done + ' / ' + this.props.progressInfo.total + ' )' : null}</span>
                        </label>
                    </div>
                    : null}
            </div>
        )
    }
}
const mapStateToProps = (state, ownProps) => ({
    progressInfo: ownProps.progressInfo,
    message: ownProps.message,
    style: ownProps.style
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    onClick: () => dispatch(setVisibilityFilter(ownProps.filter))
})
export default connect(mapStateToProps, mapDispatchToProps)(Spinner)
