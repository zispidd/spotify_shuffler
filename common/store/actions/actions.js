import { SET_LOG_IN, SET_LOG_OUT, SET_MESSAGE, SET_USER } from './actionTypes'
import axios from 'axios'

export function sendRegister(data) {
  return async dispatch => {
    const req = await axios({
      method: 'POST',
      url: 'https://poems-lab.ru/api/auth/register',
      data: {
        email: data.email,
        password: data.password
      },
      validateStatus: false
    })
    if(!req.data.success) {
      return dispatch(setMessage({message: 'Неверные данные при регистрации', color: 'danger'}))
    }
    dispatch(setMessage({message: req.data.message, color: 'success'}))
    dispatch(sendLogin({email: data.email, password: data.password}))
  }
}

export function sendLogin(data) {
  return async dispatch => {
    const req = await axios({
      method: 'POST',
      url: 'https://poems-lab.ru/api/auth/login',
      data: {
        email: data.email,
        password: data.password
      },
      validateStatus: false
    })
    if(!req.data.success) {
      return dispatch(setMessage({message: 'Неверные данные при регистрации', color: 'danger'}))
    }
    window.localStorage.setItem('token', req.data.token)
    dispatch(setLogIn())
  }
}

export function getMe(token) {
  return async dispatch => {
    const req = await axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/me',
      headers: {
        authorization: `Bearer ${token}`
      },
      validateStatus: false
    })
    if(!req.data.display_name) return
    dispatch(setUser(req.data))
    dispatch(setLogIn())
  }
}

export function setLogIn() {
  return {
    type: SET_LOG_IN,
    payload: {
      loading: true
    }
  }
}

export function setUser(user) {
  return {
    type: SET_USER,
    payload: {
      user
    }
  }
}

export function setLogOut() {
  window.localStorage.removeItem('token')
  return {
    type: SET_LOG_OUT,
    payload: {
      loading: false,
      user: null
    }
  }
}

export function setMessage(data) {
  return {
    type: SET_MESSAGE,
    payload: {
      message: data.message,
      color: data.color
    }
  }
}