import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import axios from 'axios';
import PropTypes from 'prop-types';

const AccountNotVerified = ({ email, active }) => {
  const onClick = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ email });
    await axios.post('/api/users/verify/:token', body, config);
  };

  if (active) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Verify your email address</h1>
      <p className="lead">
        To finish up setting up your account, we need to make sure this email address is yours.
      </p>

      <button className="btn btn-primary" onClick={onClick}>
        Click here if you have not receive an email.
      </button>
    </Fragment>
  );
};

AccountNotVerified.propTypes = {
  email: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  email: state.auth.email,
  active: state.auth.active,
});

export default connect(mapStateToProps)(AccountNotVerified);
