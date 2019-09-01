import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { registerWithSocialMedia } from '../../actions/auth';

const SubmitLogIn = ({ name, email, avatar, registerWithSocialMedia }) => {
  useEffect(() => {
    registerWithSocialMedia({ name, email, avatar });
  }, []);
  return (
    <Fragment>
      <Spinner />
    </Fragment>
  );
};

SubmitLogIn.propTypes = {
  registerWithSocialMedia: PropTypes.func.isRequired,
};

export default connect(
  null,
  { registerWithSocialMedia },
)(SubmitLogIn);
