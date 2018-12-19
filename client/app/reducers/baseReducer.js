
import { combineReducers } from 'redux'

import blogReducer from './blogReducer'
import topHeader from './topHeader'

export default combineReducers({
    blogReducer, topHeader
});
