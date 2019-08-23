import React, { Fragment, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register, verifyAccount } from '../../actions/auth';

const AccountVerified = ({ verifyAccount, match }) => {
  useEffect(() => {
    verifyAccount(match.params.token);
  }, [match.params.token, verifyAccount]);

  return (
    <Fragment>
      <h1 className="large text-primary">Verifying your account</h1>
      <p className="lead">
        Your account has been verified.
        <Link to="/dashboard">dashboard</Link>.
      </p>

      <p className="my-1">Your are now an official member of hack your social network </p>
    </Fragment>
  );
};

AccountVerified.propTypes = {
  verifyAccount: PropTypes.func.isRequired,
};

export default connect(
  null,
  { register, verifyAccount },
)(withRouter(AccountVerified));
