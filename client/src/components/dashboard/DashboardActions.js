import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const DashboardActions = ({
  auth: {
    socialMediaAccount,
    user: { _id },
  },
}) => {
  return (
    <div className='dash-buttons'>
      <Link to={`/profile/${_id}`} className='btn btn-light'>
        <i className='fas fa-user-circle text-primary' /> My Profile
      </Link>
      <Link to='/edit-profile' className='btn btn-light'>
        <i className='fas fa-edit text-primary' /> Edit Profile
      </Link>
      {!socialMediaAccount && (
        <Link to='/changepassword' className='btn btn-light'>
          <i className='fas fa-lock text-primary' /> Change Password
        </Link>
      )}
      <Link to='/add-experience' className='btn btn-light'>
        <i className='fab fa-black-tie text-primary' /> Add Experience
      </Link>
      <Link to='/add-education' className='btn btn-light'>
        <i className='fas fa-graduation-cap text-primary' /> Add Education
      </Link>
    </div>
  );
};

DashboardActions.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  {},
)(DashboardActions);
