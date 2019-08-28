import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileItem from './ProfileItem';
import { getProfiles } from '../../actions/profile';
import SearchBar from './SearchBar';

const Profiles = ({ getProfiles, profile: { profiles, loading, filter } }) => {
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  function satisfyFilter(property, profile) {
    if (filter[property] && property === 'name') {
      return profile.user[property].toUpperCase().includes(filter[property].toUpperCase());
    } else if (filter[property] && property === 'skills') {
      return profile.skills.filter(e => e.toUpperCase() === filter[property].toUpperCase()).length;
    } else if (filter[property]) {
      return profile[property] === undefined
        ? false
        : profile[property].toUpperCase().includes(filter[property].toUpperCase());
    } else return true;
  }

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Developers</h1>
          <div className="search-bar-container">
            <p className="lead">
              <i className="fab fa-connectdevelop" /> Browse and connect with developers
            </p>
            <SearchBar />
          </div>
          <div className="profiles">
            {profiles.length > 0 && !filter ? (
              profiles.map(profile => <ProfileItem key={profile._id} profile={profile} />)
            ) : profiles.length > 0 && filter ? (
              profiles.map(
                profile =>
                  satisfyFilter('name', profile) &&
                  satisfyFilter('skills', profile) &&
                  satisfyFilter('location', profile) &&
                  satisfyFilter('company', profile) && (
                    <ProfileItem key={profile._id} profile={profile} />
                  ),
              )
            ) : (
              <h4>No profiles found...</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  profile: state.profile,
});

export default connect(
  mapStateToProps,
  { getProfiles },
)(Profiles);
