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
  SEND_PASSWORD_LINK_SUCCESS,
  SEND_PASSWORD_LINK_FAIL,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  CHECK_PASS_TOKEN_SUCCESS,
  CHECK_PASS_TOKEN_FAIL,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_FAIL,
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  active: false,
  verification: { msg: null, verify: null },
  passwordChange: false,
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        active: true,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case REGISTER_SUCCESS:
    case RESEND_CONFIRMATION:
    case SEND_PASSWORD_LINK_SUCCESS:
    case RESET_PASSWORD_SUCCESS:
    case RESET_PASSWORD_FAIL:
      return {
        ...state,
        payload,
        isAuthenticated: false,
        loading: false,
        active: false,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
        active: true,
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
    case ACCOUNT_DELETED:
    case RESEND_CONFIRMATION_FAIL:
    case SEND_PASSWORD_LINK_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        active: false,
      };
    case ACCOUNT_VERIFIED:
    case CHECK_PASS_TOKEN_SUCCESS:
      return {
        ...state,
        verification: { msg: payload, verify: true },
        isAuthenticated: false,
        loading: false,
        active: true,
      };
    case ACCOUNT_NOT_VERIFIED:
    case CHECK_PASS_TOKEN_FAIL:
      return {
        ...state,
        verification: { msg: payload, verify: false },
        isAuthenticated: false,
        loading: false,
        active: false,
      };
    case CHANGE_PASSWORD:
      return {
        ...state,
        payload,
        isAuthenticated: true,
        loading: false,
        active: true,
      };
    case CHANGE_PASSWORD_FAIL:
      return {
        ...state,
        isAuthenticated: true,
        active: true,
        loading: false,
      };
    default:
      return state;
  }
}
