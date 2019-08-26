import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import Spinner from '../layout/Spinner';
import firebase from 'firebase';

const LogOutSocial = ({ logout }) => {
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      firebase.auth().signOut();
      logout();
      setSuccess(true);
    });
  }, []);

  return <Fragment>{!success && <Spinner />}</Fragment>;
};

LogOutSocial.propTypes = {
  login: PropTypes.func.isRequired,
};

export default connect(
  null,
  { logout },
)(LogOutSocial);
