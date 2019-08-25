import React, { Fragment, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { login } from '../../actions/auth'

const Login = ({ login, active }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async e => {
    e.preventDefault()
    login(email, password)
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
      <p className="my-1">
        Didn't receive Confirmation Code? <Link to="/register">Resend</Link>
      </p>
    </Fragment>
  )
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  active: PropTypes.bool,
}

const mapStateToProps = state => ({
  active: state.auth.active,
})

export default connect(
  mapStateToProps,
  { login },
)(Login)
