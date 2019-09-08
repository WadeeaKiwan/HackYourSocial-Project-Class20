import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PostItem from './PostItem';
import PostForm from './PostForm';
import { getPosts } from '../../actions/post';
import SearchPost from './SearchPost';
import EditPost from './EditPost';

const Posts = ({ getPosts, post: { posts, loading, editedPost }, auth: { user } }) => {
  const [isMyPost, setIsMyPost] = useState(false);
  const [searchText, setSearchText] = useState(null);
  const [checked, setChecked] = useState(false);

  // const Posts = ({ getPosts, post: { posts, loading, editedPost } }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const filteredPosts = posts => {
    const filteredPost = posts.map(post => {
      const isSatisfy = checked
        ? post.name.toUpperCase().includes(searchText.toUpperCase())
        : post.text.toUpperCase().includes(searchText.toUpperCase());
      return isSatisfy && <PostItem key={post._id} post={post} />;
    });

    return filteredPost.filter(e => typeof e === 'object').length ? (
      filteredPost
    ) : (
        <h4>No post found...</h4>
      );
  };

  return loading ? (
    <Spinner />
  ) : (
      <Fragment>
        <h1 className="large text-primary">Posts</h1>
        <p className="lead">
          <i className="fas fa-user" /> Welcome to the community
      </p>
        <PostForm />
        <SearchPost
          setIsMyPost={() => {
            setSearchText(null);
            setIsMyPost(!isMyPost);
          }}
          searchPost={text => {
            setSearchText(text);
            setIsMyPost(true);
          }}
          setCheckbox={() => {
            setSearchText(null);
            setIsMyPost(false);
            setChecked(!checked);
          }}
          isMyPost={isMyPost}
          searchText={searchText}
        />

        <div className="posts">
          {posts &&
            posts.map(post =>
              editedPost === post._id ? (
                <EditPost post={post} key={post._id} />
              ) : (
                  isMyPost && !searchText
                    ? posts.map(post => user._id === post.user && <PostItem key={post._id} post={post} />)
                    : searchText
                      ? filteredPosts(posts)
                      : posts.map(post => <PostItem key={post._id} post={post} />)
                ),
            )}
        </div>
      </Fragment>
    );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  post: state.post,
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  { getPosts },
)(Posts);
