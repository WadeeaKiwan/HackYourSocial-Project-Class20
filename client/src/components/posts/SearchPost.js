import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './SearchBar.css';

const SearchPost = ({ setIsMyPost, searchPost, setCheckbox, isMyPost, searchText }) => {
  const [text, setText] = useState('');

  return (
    <div className="search-bar posts-search">
      <form
        className="search-area"
        onSubmit={e => {
          e.preventDefault();
          searchPost(text);
        }}
      >
        <input
          type="text"
          className="searchInput"
          placeholder="Search.."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <span
          onClick={e => {
            e.preventDefault();
            searchPost(text);
          }}
        >
          <i className="fas fa-search my-1" />
        </span>
      </form>
      <div className="switcher-container">
        <label>Search In</label>
        <span className="switcher switcher-1">
          <input
            onChange={() => {
              setCheckbox();
              setText('');
            }}
            type="checkbox"
            id="switcher-1"
          />
          <label htmlFor="switcher-1"></label>
        </span>
      </div>
      <button
        className="my-posts-button"
        onClick={e => {
          e.preventDefault();
          setIsMyPost();
          setText('');
        }}
      >
        {!isMyPost && !searchText ? 'My Posts' : 'All Posts'}
      </button>
    </div>
  );
};

SearchPost.prototype = {
  setIsMyPost: PropTypes.func.isRequired,
  searchPost: PropTypes.func.isRequired,
  setCheckbox: PropTypes.func.isRequired,
  isMyPost: PropTypes.bool.isRequired,
};

export default connect(null)(SearchPost);
