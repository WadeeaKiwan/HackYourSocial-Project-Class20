import React, { Fragment, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { verifyAccount } from '../../actions/auth'

const AccountVerified = ({ verifyAccount, match }) => {
  useEffect(() => {
    verifyAccount(match.params.token)
  }, [match.params.token, verifyAccount])

  return (
    <Fragment>
      <h1 className="large text-primary">Your account has been confirmed!</h1>
      <p className="lead">
        <Link to="/login" className="btn btn-primary">
          Sign in
        </Link>
      </p>

      <p className="my-1">Your are now an official member of hack your social network </p>
    </Fragment>
  )
}

AccountVerified.propTypes = {
  verifyAccount: PropTypes.func.isRequired,
}

export default connect(
  null,
  { verifyAccount },
)(withRouter(AccountVerified))
