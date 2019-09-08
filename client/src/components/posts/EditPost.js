import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { updatePost, setEditPost } from '../../actions/post';

const EditPost = ({ setEditPost, updatePost, post: { _id, text, name, avatar, user } }) => {
  const [newText, setText] = useState(text);
  const node = useRef();

  // close the edit window when you click outside of the edit window
  useEffect(() => {
    const handleClick = e => {
      if (node.current.contains(e.target)) {
        return;
      }
      // outside click
      setEditPost(null);
    };
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [setEditPost]);

  return (
    <div className={'post bg-white p-1  edit-post-position'}>
      <div>
        <Link to={`/profile/${user}`}>
          <img className="round-img" src={avatar} alt="" />
          <h4>{name}</h4>
        </Link>
      </div>

      <div ref={node} className="">
        <div className="p">
          <h3>Edit Your Post...</h3>
        </div>
        <form
          className="form"
          onSubmit={e => {
            e.preventDefault();
            updatePost(_id, { newText });
            setText('');
            setEditPost(null);
          }}
        >
          <textarea
            name="text"
            cols="30"
            rows="5"
            placeholder="Edit your post"
            value={newText}
            onChange={e => setText(e.target.value)}
            required
          />
          <input type="submit" className="btn btn-success my-1" value="Save" />
          <input
            type="button"
            className="btn btn-dark my-1  cancel-button"
            value="Cancel"
            onClick={() => setEditPost(null)}
          />
        </form>
      </div>
    </div>
  );
};

EditPost.propTypes = {
  post: PropTypes.object.isRequired,
  updatePost: PropTypes.func.isRequired,
  setEditPost: PropTypes.func.isRequired,
};

export default connect(
  null,
  { updatePost, setEditPost },
)(EditPost);
