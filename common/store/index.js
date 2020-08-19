import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import user from './reducers/user'
import { MakeStore, createWrapper } from 'next-redux-wrapper'

const makeStore = context => createStore(user, applyMiddleware(thunk))

export const wrapper = createWrapper(makeStore)