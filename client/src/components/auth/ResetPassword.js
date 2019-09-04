import React, { Fragment, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { resetPassword, resendEmail } from '../../actions/auth'
import { setAlert } from '../../actions/alert'

const ResetPassword = ({
  resetPassword,
  match,
  auth: {
    loading,
    verification: { msg, verify },
  },
}) => {
  const [formData, setFormData] = useState({
    password: '',
    password2: '',
  })

  const { password, password2 } = formData

  const forgotPassToken = match.params.forgotPassToken

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async e => {
    e.preventDefault()
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger')
    } else {
      console.log('forgotPassToken is ' + forgotPassToken)
      resetPassword(password, forgotPassToken)
    }
  }

  return (
    <Fragment>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={e => onChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Confirm New Password" />
      </form>
    </Fragment>
  )
}

ResetPassword.propTypes = {
  setAlert: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
})

export default connect(
  mapStateToProps,
  { resetPassword },
)(withRouter(ResetPassword))
