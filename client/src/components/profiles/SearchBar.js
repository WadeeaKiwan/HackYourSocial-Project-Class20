import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { handleFilter } from '../../actions/profile';

const SearchBar = ({ handleFilter }) => {
  const [onChangeCriteria, setOnChangeCriteria] = useState(null);

  const [filterWindow, openFilterWindow] = useState(false);

  return (
    <div>
      <form
        className="search-bar"
        onSubmit={e => {
          e.preventDefault();
          handleFilter(onChangeCriteria);
        }}
      >
        <input
          type="text"
          placeholder="Search by profile name"
          onChange={e => setOnChangeCriteria({ name: e.target.value })}
        />
        <span
          onClick={e => {
            e.preventDefault();
            handleFilter(onChangeCriteria);
          }}
        >
          <i className="fas fa-search my-1" />
        </span>
        <i className="fas fa-filter my-1" onClick={e => openFilterWindow(!filterWindow)} />
      </form>
      {filterWindow && (
        <form className="filter-search form">
          <table>
            <tbody>
              <tr>
                <th>Name:</th>
                <td>
                  <input
                    type="text"
                    placeholder="Enter a name.."
                    onChange={e =>
                      setOnChangeCriteria({ ...onChangeCriteria, name: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>Location:</th>
                <td>
                  <input
                    type="text"
                    placeholder="Enter a location.."
                    onChange={e =>
                      setOnChangeCriteria({ ...onChangeCriteria, location: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>Company:</th>
                <td>
                  <input
                    type="text"
                    placeholder="Enter a company.."
                    onChange={e =>
                      setOnChangeCriteria({ ...onChangeCriteria, company: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>Skills:</th>
                <td>
                  <input
                    type="text"
                    placeholder="Enter a skill.."
                    onChange={e =>
                      setOnChangeCriteria({ ...onChangeCriteria, skills: e.target.value })
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <button
            className="apply-button"
            onClick={e => {
              e.preventDefault();
              handleFilter(onChangeCriteria);
              openFilterWindow(false);
            }}
          >
            Apply
          </button>
          <button
            type="Button"
            className="btn btn-dark my-1  cancel-button"
            onClick={e => {
              e.preventDefault();
              setOnChangeCriteria(null);
              openFilterWindow(false);
            }}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  handleFilter: PropTypes.func.isRequired,
};

export default connect(
  null,
  { handleFilter },
)(SearchBar);
