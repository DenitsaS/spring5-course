import { createStore, applyMiddleware } from 'redux';
import baseReducer from './reducers/baseReducer';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';


// this middleware will log on the console the previous state, the action, and the next state every time an action is being dispatched
import { createLogger } from 'redux-logger';

const middleware = process.env.NODE_ENV === 'production' ? // in prod mode we don't need the redux-logger
    applyMiddleware(promiseMiddleware(), thunkMiddleware) :
    applyMiddleware(createLogger(), promiseMiddleware(), thunkMiddleware);

const store = createStore(baseReducer, middleware);

export default store;