import React, { Fragment, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { login } from '../../actions/auth'
import { resendEmail } from '../../actions/auth'

const Login = ({ login, active, resendEmail }) => {
  // add to state toggle button
  const [displayEmailInput, toggleEmailInput] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    email2: '',
    password: '',
  })

  const { email, email2, password } = formData

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async e => {
    e.preventDefault()
    login(email, password)
  }
  const resendEmailSubmit = e => {
    e.preventDefault()
    resendEmail(email2)
  }
  if (active) {
    return <Redirect to="/dashboard" />
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user" /> Sign Into Your Account
      </p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={e => onChange(e)}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
      <p className="my-1">
        <Link to="/register">Forgot your password?</Link>
      </p>
      <p className="my-1">Didn't receive Confirmation Code? </p>

      <div className="my-2">
        <button
          onClick={() => toggleEmailInput(!displayEmailInput)}
          type="button"
          className="btn btn-primary"
        >
          Resend confirmation mail
        </button>
        {displayEmailInput ? (
          <form className="form" onSubmit={e => resendEmailSubmit(e)}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email Address"
                name="email2"
                value={email2}
                onChange={e => onChange(e)}
                required
              />

              <input
                type="submit"
                onSubmit={e => resendEmailSubmit(e)}
                className="btn btn-primary my-1"
                value="Resend"
              />
            </div>
          </form>
        ) : null}
      </div>
    </Fragment>
  )
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  active: PropTypes.bool,
  resendEmail: PropTypes.func,
}

const mapStateToProps = state => ({
  active: state.auth.active,
})

export default connect(
  mapStateToProps,
  { login, resendEmail },
)(Login)
