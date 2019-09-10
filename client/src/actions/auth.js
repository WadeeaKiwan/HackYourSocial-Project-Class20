import axios from 'axios';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
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
  LOGIN_SOCIAL_MEDIA_SUCCESS,
  LOGIN_SOCIAL_MEDIA_FAIL,
} from './types';
import setAuthToken from '../utils/setAuthToken';

// Register with social network
export const registerWithSocialMedia = ({ name, email, avatar }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ name, email, avatar });
  try {
    const res = await axios.post(`/api/auth/registerWithSocialMedia`, body, config);
    dispatch({
      type: LOGIN_SOCIAL_MEDIA_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: LOGIN_SOCIAL_MEDIA_FAIL,
    });
  }
};

// Load User
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User
export const register = ({ name, email, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post('/api/users', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    dispatch(setAlert(res.data.msg, 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Login User
export const login = (email, password) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth', body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout / Clear Profile
export const logout = () => dispatch => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};

// Verifying user account
export const verifyAccount = confirmationToken => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ confirmationToken });

  try {
    const res = await axios.post(`/api/users/verify/${confirmationToken}`, body, config);

    dispatch({
      type: ACCOUNT_VERIFIED,
      payload: res.data.msg,
    });
  } catch (err) {
    console.error(err);

    dispatch({
      type: ACCOUNT_NOT_VERIFIED,
      payload: err.response.data.msg,
    });
  }
};

//Resend email confirmation
export const resendEmail = email => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ email });

  try {
    const res = await axios.put(`/api/users/verify/resend`, body, config);

    dispatch({
      type: RESEND_CONFIRMATION,
      payload: res.data,
    });

    dispatch(setAlert(res.data.msg, 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: RESEND_CONFIRMATION_FAIL,
    });
  }
};

//Send forgot password email
export const forgotPassword = email => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ email });

  try {
    const res = await axios.post(`/api/users/forgotpassword`, body, config);

    dispatch({
      type: SEND_PASSWORD_LINK_SUCCESS,
      payload: res.data,
    });
    dispatch(setAlert(res.data.msg, 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: SEND_PASSWORD_LINK_FAIL,
      payload: err.response.data.msg,
    });
  }
};

// Reset Password
export const resetPassword = (password, forgotPassToken) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ password });

  try {
    const res = await axios.put(`/api/users/resetpassword/${forgotPassToken}`, body, config);

    dispatch({
      type: RESET_PASSWORD_SUCCESS,
      payload: res.data.msg,
    });

    dispatch(setAlert(res.data.msg, 'success'));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: RESET_PASSWORD_FAIL,
      payload: err.response.data.msg,
    });

    if (err.response.data.msg) {
      dispatch(setAlert(err.response.data.msg, 'danger'));
    }
  }
};

// Check Password Reset Token
export const checkPassToken = forgotPassToken => async dispatch => {
  try {
    const res = await axios.get(`/api/users/checkpasstoken/${forgotPassToken}`);

    dispatch({
      type: CHECK_PASS_TOKEN_SUCCESS,
      payload: res.data.msg,
    });
  } catch (err) {
    console.error(err);

    dispatch({
      type: CHECK_PASS_TOKEN_FAIL,
      payload: err.response.data.msg,
    });
  }
};

// Change Password
export const changePassword = ({ password, newPassword }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ password, newPassword });

  try {
    const res = await axios.put('/api/users/changepassword', body, config);

    dispatch({
      type: CHANGE_PASSWORD,
      payload: res.data,
    });

    dispatch(setAlert(res.data.msg, 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: CHANGE_PASSWORD_FAIL,
    });
  }
};
