import { SET_LOG_IN, SET_LOG_OUT, SET_MESSAGE, SET_USER  } from '../actions/actionTypes'

const initialState = {
  user: null,
  logged: false,
  message: null,
  color: null
}

export default function user(state = initialState, action) {
  switch (action.type) {
    case SET_LOG_IN:
      return {
        ...state,
        logged: true
      }
    case SET_LOG_OUT:
      return {
        ...state,
        logged: false,
        user: null
      }
    case SET_MESSAGE:
      return {
        ...state,
        message: action.payload.message,
        color: action.payload.color
      }
    case SET_USER:
      return {
        ...state,
        user: action.payload.user
      }
  
    default:
      return state;
  }
}