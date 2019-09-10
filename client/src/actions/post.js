import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
  UPDATE_POST,
  SET_EDIT_POST,
  UPDATE_COMMENT,
  SET_EDIT_COMMENT,
  UPLOAD_IMAGE,
  UPLOAD_IMAGE_ERROR,
} from './types';

// Add post With Image
export const addPostWithImage = (formData, text) => async dispatch => {
  let res;
  try {
    if (formData) {
      res = await axios.post('/api/posts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      res = await axios.post('/api/posts/upload', null, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }

    if (text) {
      await axios.put(
        `/api/posts/${res.data._id}`,
        { text },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      res.data.text = text;
    }

    dispatch({
      type: UPLOAD_IMAGE,
      payload: res.data,
    });

    dispatch(setAlert('File Uploaded', 'success'));
  } catch (err) {
    if (err.response.status === 500) {
      dispatch(setAlert('Something went wrong with the server', 'danger'));
    } else {
      dispatch({
        type: UPLOAD_IMAGE_ERROR,
      });
      dispatch(setAlert('err.response.data.msg', 'danger'));
    }
  }
};

// Get posts
export const getPosts = () => async dispatch => {
  try {
    const res = await axios.get('/api/posts');

    dispatch({
      type: GET_POSTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add like
export const addOrRemoveLike = id => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/like/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete post
export const deletePost = id => async dispatch => {
  try {
    await axios.delete(`/api/posts/${id}`);

    dispatch({
      type: DELETE_POST,
      payload: id,
    });

    dispatch(setAlert('Post Removed', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add post
export const addPost = formData => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.post('/api/posts', formData, config);

    dispatch({
      type: ADD_POST,
      payload: res.data,
    });

    dispatch(setAlert('Post Created', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get post
export const getPost = id => async dispatch => {
  try {
    const res = await axios.get(`/api/posts/${id}`);

    dispatch({
      type: GET_POST,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add comment
export const addComment = (postId, formData) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.post(`/api/posts/comment/${postId}`, formData, config);

    dispatch({
      type: ADD_COMMENT,
      payload: res.data,
    });

    dispatch(setAlert('Comment Added', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete comment
export const deleteComment = (postId, commentId) => async dispatch => {
  try {
    await axios.delete(`/api/posts/comment/${postId}/${commentId}`);

    dispatch({
      type: REMOVE_COMMENT,
      payload: commentId,
    });

    dispatch(setAlert('Comment Removed', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

// Update Post
export const updatePost = (id, formData, { newText }) => async dispatch => {
  let res;
  try {
    if (newText || newText === '') {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      res = await axios.post(`api/posts/update/${id}`, { newText }, config);
    }
    if (formData) {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      res = await axios.post(`api/posts/update/${id}`, formData, config);
    }
    dispatch({
      type: UPDATE_POST,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

export const deletePhoto = id => async dispatch => {
  let res;
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    res = await axios.delete(`api/posts/delete/photo/${id}`, null, config);

    dispatch({
      type: UPDATE_POST,
      payload: res.data,
    });
    dispatch(setAlert('Post Updated', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// showEditComponent

export const setEditPost = id => dispatch => {
  dispatch({
    type: SET_EDIT_POST,
    payload: id,
  });
};

// Update Comment
export const updateComment = (postId, commentId, newText) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post(
      `/api/posts/comment/update/${postId}/${commentId}`,
      newText,
      config,
    );

    dispatch({
      type: UPDATE_COMMENT,
      payload: res.data,
    });
    dispatch(setAlert('Comment Updated', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// show Edit Comment

export const setEditComment = id => dispatch => {
  dispatch({
    type: SET_EDIT_COMMENT,
    payload: id,
  });
};
