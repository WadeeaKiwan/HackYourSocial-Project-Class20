import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { registerWithSocialMedia } from '../../actions/auth';

const SubmitLogIn = ({ name, email, avatar, registerWithSocialMedia }) => {
  useEffect(() => {
    registerWithSocialMedia({ name, email, avatar });
  }, [avatar, email, name, registerWithSocialMedia]);
  return <Fragment></Fragment>;
};

SubmitLogIn.propTypes = {
  registerWithSocialMedia: PropTypes.func.isRequired,
};

export default connect(
  null,
  { registerWithSocialMedia },
)(SubmitLogIn);
