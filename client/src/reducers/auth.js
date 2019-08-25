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
} from '../actions/types'

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  active: false,
  email: '',
}

export default function(state = initialState, action) {
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
      return {
        ...state,
        // isAuthenticated: true,
        loading: false,
        user: payload,
      }
    case LOGIN_SUCCESS:
      // case ACCOUNT_VERIFIED:
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
        ...payload,
        isAuthenticated: true,
        loading: false,
        active: true,
      }
    default:
      return state
  }
}
