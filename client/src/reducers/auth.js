import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  ACCOUNT_DELETED,
  ACCOUNT_VERIFIED,
  ACCOUNT_NOT_VERIFIED,
  RESEND_CONFIRMATION,
  RESEND_CONFIRMATION_FAIL,
} from '../actions/types'

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  active: false,
  verification: { msg: null, verify: null },
}

export default function (state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        active: true,
        isAuthenticated: true,
        loading: false,
        user: payload,
      }
    case REGISTER_SUCCESS:
    case RESEND_CONFIRMATION:
      return {
        ...state,
        payload,
        isAuthenticated: false,
        loading: false,
        active: false,
      }
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token)
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
        active: true,
      }
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
    case ACCOUNT_DELETED:
    case RESEND_CONFIRMATION_FAIL:
      localStorage.removeItem('token')
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        active: false,
      }
    case ACCOUNT_VERIFIED:
      return {
        ...state,
        verification: { msg: payload, verify: true },
        isAuthenticated: false,
        loading: false,
        active: true,
      }
    case ACCOUNT_NOT_VERIFIED:
      return {
        ...state,
        verification: { msg: payload, verify: false },
        isAuthenticated: false,
        loading: false,
        active: false,
      }
    default:
      return state
  }
}
