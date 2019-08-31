import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PostItem from '../posts/PostItem';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import { getPosts } from '../../actions/post';
import EditComment from './EditComment';

const Post = ({ getPosts, post: { post, loading, editedComment }, match }) => {
  useEffect(() => {
    getPosts(match.params.id);
  }, [getPosts, match.params.id]);

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to='/posts' className='btn'>
        Back To Posts{' '}
      </Link>{' '}
      <PostItem post={post} showActions={false} /> <CommentForm postId={post._id} />
      <div className='comments'>
        {' '}
        {post.comments.map(comment =>
          editedComment === comment._id ? (
            <EditComment comment={comment} key={comment._id} postId={post._id} />
          ) : (
            <CommentItem key={comment._id} comment={comment} postId={post._id} />
          ),
        )}{' '}
      </div>{' '}
    </Fragment>
  );
};

Post.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  post: state.post,
});

export default connect(
  mapStateToProps,
  {
    getPosts,
  },
)(Post);
