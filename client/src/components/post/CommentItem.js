import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { deleteComment, setEditComment } from '../../actions/post';

const CommentItem = ({
  postId,
  comment: { _id, text, name, avatar, user, date },
  auth,
  deleteComment,
  showActions,
  setEditComment,
}) => (
  <div className='post bg-white p-1 my-1'>
    <div>
      <Link to={`/profile/${user}`}>
        <img className='round-img' src={avatar} alt='' />
        <h4> {name} </h4>{' '}
      </Link>{' '}
    </div>{' '}
    <div>
      <p className='my-1'> {text} </p>{' '}
      <p className='post-date'>
        Posted on <Moment format='YYYY/MM/DD'> {date} </Moment>{' '}
      </p>
      <Fragment>
        {' '}
        {!auth.loading && user === auth.user._id && (
          <button onClick={() => setEditComment(_id)} type='button' className='btn btn-light'>
            <i className='fas fa-pencil-alt' />
          </button>
        )}{' '}
        {!auth.loading && user === auth.user._id && (
          <button
            onClick={() => deleteComment(postId, _id)}
            type='button'
            className='btn btn-danger'>
            <i className='fas fa-times' />
          </button>
        )}{' '}
      </Fragment>
    </div>{' '}
  </div>
);

CommentItem.propTypes = {
  postId: PropTypes.string.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
  setEditComment: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  {
    deleteComment,
    setEditComment,
  },
)(CommentItem);
