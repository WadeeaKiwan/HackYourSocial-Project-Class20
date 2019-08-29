import React, { Fragment, useEffect, useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { verifyAccount, resendEmail } from '../../actions/auth'

const AccountVerified = ({ verifyAccount, resendEmail, match, auth: { verification: { msg, verify } } }) => {
  useEffect(() => {
    verifyAccount(match.params.token)
  }, [match.params.token, verifyAccount])

  const [displayResend, toggleResend] = useState(false)

  const [emailResend, setEmailResend] = useState('')

  const onChange = e => setEmailResend([e.target.name] = e.target.value)

  const resendEmailSubmit = e => {
    e.preventDefault()
    resendEmail(emailResend)
    setEmailResend('')
  }

  return (
    <Fragment>
      {verify &&
        <Fragment>
          <h1 className="large text-primary">{msg}</h1>
          <Link to="/login" className="btn btn-primary">
            Sign in
          </Link>
          <p className="my-1">Your are now an official member of hack your social network </p>
        </Fragment>
      }
      {!verify &&
        <Fragment>
          <h1 className="large alert-danger">{msg}</h1>
          {!displayResend && <button onClick={() => toggleResend(!displayResend)} className="btn btn-primary">Resend Confirmation Link</button>}
          {displayResend && (
            <form
              className='form my-1'
              onSubmit={e => resendEmailSubmit(e)}
            >
              <input
                type="email"
                placeholder="Email Address"
                name="emailResend"
                value={emailResend}
                onChange={e => onChange(e)}
                required
              />
              <input
                type="submit"
                className="btn btn-primary my-1"
                value="Resend"
              />
              <button onClick={() => toggleResend(false)} className='btn btn-light my-1'>
                Cancel
              </button>
            </form>
          )}
        </Fragment>
      }
    </Fragment>
  )
}

AccountVerified.propTypes = {
  verifyAccount: PropTypes.func.isRequired,
  resendEmail: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
})

export default connect(
  mapStateToProps,
  { verifyAccount, resendEmail },
)(withRouter(AccountVerified))
