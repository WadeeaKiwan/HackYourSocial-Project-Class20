import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import Spinner from '../layout/Spinner';
import firebase from 'firebase';

const LogOutSocial = ({ logout }) => {
  useEffect(() => {
    firebase.auth().onAuthStateChanged(() => {
      firebase.auth().signOut();
      logout();
    });
  }, []);

  return (
    <Fragment>
      <Spinner />
    </Fragment>
  );
};

LogOutSocial.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default connect(
  null,
  { logout },
)(LogOutSocial);
