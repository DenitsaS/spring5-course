import { actions } from '../reducers/topHeader';

export const setTitle = (title) => {
    return (dispatch, getState) => {
        dispatch({
            type: actions.SET_TOP_HEADER_TITLE,
            payload: title
        })
    }
}

export const enableSpinner = (message, progressInfo) => {
    return (dispatch, getState) => {
        dispatch({
            type: actions.ENABLE_TOP_HEADER_SPINNER,
            payload: { message, progressInfo }
        })
    }
}

export const disableSpinner = (message) => {
    return (dispatch, getState) => {
        dispatch({
            type: actions.DISABLE_TOP_HEADER_SPINNER,
            payload: message
        })
    }
}
export const disableAllSpinners = () => {
    return (dispatch, getState) => {
        dispatch({ type: actions.DISABLE_ALL_TOP_HEADER_SPINNERS });
    }
}