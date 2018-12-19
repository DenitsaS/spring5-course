import axios from 'axios';

import { actions } from '../reducers/blogReducer';
import { enableSpinner, disableSpinner } from '../actions/topHeaderActions';


export const createBlog = (dto) => {
    const msg = "Blog Is Being Created.";
    return (dispatch, getState) => {
        dispatch({ type: actions.CREATE_BLOG_RECORD_PENDING });
        dispatch(enableSpinner(msg));
        axios.post(`${API_BASE_URL}blog/add`, dto)
            .then(response => {
                dispatch(
                    {
                        type: actions.CREATE_BLOG_RECORD_DISPATCH_SUCCESS,
                        payload: response.data
                    }
                );
                dispatch(disableSpinner(msg));
                toastr.success("Blog Deleted Successfully.")
            }).catch((e) => {
                dispatch(
                    {
                        type: actions.CREATE_BLOG_RECORD_DISPATCH_ERROR,
                    }
                );
                dispatch(disableSpinner(msg));
                showError(e);
            })
    }
}

export const deteteBlog = (id) => {
    const msg = "Blog Is Being Deleted.";
    return (dispatch, getState) => {
        dispatch({ type: actions.DELETE_BLOG_RECORD_PENDING });
        dispatch(enableSpinner(msg));
        axios.delete(`${API_BASE_URL}blog/${id}`)
            .then(response => {
                dispatch(
                    {
                        type: actions.DELETE_BLOG_RECORD_DISPATCH_SUCCESS,
                        payload: response.data
                    }
                );
                dispatch(disableSpinner(msg));
                toastr.success("Blog Deleted Successfully.")
            }).catch((e) => {
                dispatch(
                    {
                        type: actions.DELETE_BLOG_RECORD_DISPATCH_ERROR,
                    }
                );
                dispatch(disableSpinner(msg));
                showError(e);
            })
    }
}
const showError = data => {
    let { response, status } = data;
    try {
        toastr.error(response);
    } catch (ex) {
        console.error(ex);
    }
}