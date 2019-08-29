import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileItem from './ProfileItem';
import { getProfiles, handleFilter } from '../../actions/profile';
import SearchBar from './SearchBar';

const Profiles = ({ getProfiles, profile: { profiles, loading, filter }, handleFilter }) => {
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  const satisfyFilter = (property, profile) => {
    if (filter[property] && property === 'name') {
      return profile.user[property].toUpperCase().includes(filter[property].toUpperCase());
    } else if (filter[property] && property === 'skills') {
      return profile.skills.filter(e => e.toUpperCase() === filter[property].toUpperCase()).length;
    } else if (filter[property]) {
      return profile[property] === undefined
        ? false
        : property === 'status'
        ? profile[property].toUpperCase() === filter[property].toUpperCase()
        : profile[property].toUpperCase().includes(filter[property].toUpperCase());
    } else return true;
  };

  const filteredProfiles = profiles => {
    const filtered = profiles.map(
      profile =>
        satisfyFilter('name', profile) &&
        satisfyFilter('skills', profile) &&
        satisfyFilter('location', profile) &&
        satisfyFilter('company', profile) &&
        satisfyFilter('status', profile) && <ProfileItem key={profile._id} profile={profile} />,
    );
    return filtered.filter(e => typeof e === 'object').length ? (
      filtered
    ) : (
      <h4>No profiles found...</h4>
    );
  };

  const removeFilterCriteria = criteria => {
    if (criteria) {
      let newFilter = filter;
      delete newFilter[criteria];
      Object.keys(newFilter).length ? handleFilter(newFilter) : handleFilter(null);
    } else {
      handleFilter(null);
    }
  };

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
          {filter && (
            <ul className="filter-criteria-list">
              {Object.keys(filter).map(elem => (
                <li key={elem}>
                  {elem}: <b> {filter[elem]}</b>
                  <i
                    className="fa fa-times"
                    aria-hidden="true"
                    onClick={e => {
                      e.preventDefault();
                      removeFilterCriteria(elem);
                    }}
                  ></i>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={e => {
                    e.preventDefault();
                    removeFilterCriteria(null);
                  }}
                >
                  Reset All
                </button>
              </li>
            </ul>
          )}
          <div className="profiles">
            {profiles.length > 0 && !filter ? (
              profiles.map(profile => <ProfileItem key={profile._id} profile={profile} />)
            ) : profiles.length > 0 && filter ? (
              filteredProfiles(profiles)
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
  { getProfiles, handleFilter },
)(Profiles);
