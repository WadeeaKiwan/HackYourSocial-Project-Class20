import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login, resendEmail, forgotPassword } from '../../actions/auth';

const Login = ({ login, auth: { active, isAuthenticated }, resendEmail, forgotPassword }) => {
  // add to state toggle button
  const [displayResend, toggleResend] = useState(false);
  const [displaySendPassword, toggleSendPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    emailResend: '',
    emailPassword: '',
  });

  const { email, emailResend, emailPassword, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    login(email, password);
  };

  const resendEmailSubmit = e => {
    e.preventDefault();
    resendEmail(emailResend);
    setFormData({ ...formData, emailResend: '' });
  };

  const forgotPasswordSubmit = e => {
    e.preventDefault();
    forgotPassword(emailPassword);
    setFormData({ ...formData, emailPassword: '' });
  };

  if (active && isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user' />
        Sign In into your account
      </p>

      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={e => onChange(e)}
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Login' />
      </form>

      <p className='my-1'>
        Don't have an account? <Link to='/register'>Sign Up</Link>
      </p>
      <p className='my-1'>
        <a href='#!' onClick={() => toggleSendPassword(true)}>
          Forgot your password?
        </a>
      </p>

      {displaySendPassword && (
        <form className='form my-1' onSubmit={e => forgotPasswordSubmit(e)}>
          <input
            type='email'
            placeholder='Email Address'
            name='emailPassword'
            value={emailPassword}
            onChange={e => onChange(e)}
          />
          <input type='submit' className='btn btn-primary my-1' value='Send' />
          <button onClick={() => toggleSendPassword(false)} className='btn btn-light my-1'>
            Cancel
          </button>
        </form>
      )}

      <p className='my-1'>
        Didn't receive a confirmation link?{' '}
        {!displayResend && (
          <a href='#!' onClick={() => toggleResend(!displayResend)}>
            Resend
          </a>
        )}
      </p>

      {displayResend && (
        <form className='form my-1' onSubmit={e => resendEmailSubmit(e)}>
          <input
            type='email'
            placeholder='Email Address'
            name='emailResend'
            value={emailResend}
            onChange={e => onChange(e)}
          />
          <input type='submit' className='btn btn-primary my-1' value='Resend' />
          <button onClick={() => toggleResend(false)} className='btn btn-light my-1'>
            Cancel
          </button>
        </form>
      )}
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  resendEmail: PropTypes.func.isRequired,
  forgotPassword: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  { login, resendEmail, forgotPassword },
)(Login);
