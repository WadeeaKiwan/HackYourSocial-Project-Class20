import React, { Fragment, useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Spinner from '../layout/Spinner'
import { forgotPassword, resetPassword, checkPassToken } from '../../actions/auth'
import { setAlert } from '../../actions/alert'

const ResetPassword = ({
  forgotPassword,
  resetPassword,
  checkPassToken,
  setAlert,
  match,
  auth: {
    loading,
    verification: { msg, verify },
  },
}) => {
  useEffect(() => {
    checkPassToken(match.params.forgotPassToken)
  }, [checkPassToken, match.params.forgotPassToken])

  const [displayResend, toggleResend] = useState(false)

  const [formData, setFormData] = useState({
    password: '',
    password2: '',
    emailForgotPassword: '',
  })

  const { password, password2, emailForgotPassword } = formData

  const forgotPassToken = match.params.forgotPassToken

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  const onForgotPasswordSubmit = e => {
    e.preventDefault()
    forgotPassword(emailForgotPassword)
    setFormData({ ...formData, emailForgotPassword: '' })
  }

  const onResetPasswordSubmit = async e => {
    e.preventDefault()
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger')
    } else {
      await resetPassword(password, forgotPassToken)
      setFormData({ ...formData, password: '', password2: '' })
    }
  }

  return loading || msg === null ? (
    <Spinner />
  ) : verify ? (
    <Fragment>
      <h1 className='large text-primary'>Reset Password</h1>
      <p className='lead'>
        <span class="fa-passwd-reset fa-stack">
          <i class="fa fa-undo fa-stack-2x"></i>
          <i class="fa fa-lock fa-stack-1x"></i>
        </span> Here you can reset your password
      </p>
      <form className="form" onSubmit={e => onResetPasswordSubmit(e)}>
        <div className="form-group">
          <input
            type="password"
            placeholder="New Password"
            name="password"
            value={password}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm New Password"
            name="password2"
            value={password2}
            onChange={e => onChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Confirm New Password" />
        <Link to='/login' className='btn btn-light my-1'>
          Back To Login
        </Link>
      </form>
    </Fragment>
  ) : (
        <Fragment>
          <h1 className='large text-danger'>{msg}</h1>

          <button onClick={() => toggleResend(true)} className='btn btn-primary'>
            Resend Forgot Password Link
          </button>

          {displayResend && (
            <form className='form my-1' onSubmit={e => onForgotPasswordSubmit(e)}>
              <input
                type='email'
                placeholder='Email Address'
                name='emailForgetPassword'
                value={emailForgotPassword}
                onChange={e => onChange(e)}
                required
              />
              <input type='submit' className='btn btn-primary my-1' value='Resend' />
              <button onClick={() => toggleResend(false)} className='btn btn-light my-1'>
                Cancel
              </button>
            </form>
          )}
        </Fragment>
      )
}

ResetPassword.propTypes = {
  setAlert: PropTypes.func.isRequired,
  forgotPassword: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
  checkPassToken: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
})

export default connect(
  mapStateToProps,
  { forgotPassword, resetPassword, checkPassToken, setAlert },
)(withRouter(ResetPassword))
