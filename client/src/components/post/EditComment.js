import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateComment, setEditComment } from '../../actions/post';

const EditComment = ({
  setEditComment,
  updateComment,
  postId,
  comment: { _id, text, name, avatar, user },
}) => {
  const [newText, setText] = useState(text);
  const node = useRef();

  // close the edit window when you click outside of the edit window
  useEffect(() => {
    const handleClick = e => {
      if (node.current.contains(e.target)) {
        return;
      }
      // outside click
      setEditComment(null);
    };
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [setEditComment]);
  return (
    <div className={'post bg-white p-1 edit-post-position'}>
      <div>
        <Link to={`/comment/${user}`}>
          <img className="round-img" src={avatar} alt="" />
          <h4> {name} </h4>
        </Link>
      </div>
      <div ref={node} className="">
        <div className="p">
          <h3> Edit Your Comment </h3>
        </div>
        <form
          className="form"
          onSubmit={e => {
            e.preventDefault();
            updateComment(postId, _id, {
              newText,
            });
            setText('');
            setEditComment(null);
          }}
        >
          <textarea
            name="text"
            cols="30"
            rows="5"
            placeholder="Edit Your Comment"
            value={newText}
            onChange={e => setText(e.target.value)}
            required
          />
          <input type="submit" className="btn btn-success my-1" value="Save" />
          <input
            type="button"
            className="btn btn-dark my-1 cancel-button"
            value="Cancel"
            onClick={() => setEditComment(null)}
          />
        </form>
      </div>
    </div>
  );
};

EditComment.propTypes = {
  comment: PropTypes.object.isRequired,
  updateComment: PropTypes.func.isRequired,
  setEditComment: PropTypes.func.isRequired,
};

export default connect(
  null,
  {
    updateComment,
    setEditComment,
  },
)(EditComment);
