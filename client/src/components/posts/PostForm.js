import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addPost, addPostWithImage } from '../../actions/post';

const PostForm = ({ addPost, addPostWithImage }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState('');
  const [DisplayUploadForm, setDisplayUploadForm] = useState(false);

  const upload = e => {
    setFile(e.target.files[0]); 
  };

  const clearUpload = () => {
    setDisplayUploadForm(false);
    setFile('');
  };

  const showUploadForm = () => {
    setDisplayUploadForm(!DisplayUploadForm);
  };

  const onSubmit = async e => {
    try {
      e.preventDefault();
      let formData = new FormData();
      formData.append('file', file);
      if (file !== '') {
        addPostWithImage(formData, text);
        setFile('');
        setText('');
      } else {
        addPost({ text });
        setText('');
      }
    } catch (error) {
      console.log('error edit post');
    }
  };

  return (
    <div className="post-form">
      <div className="bg-primary p">
        <h3>Say Something...</h3>
      </div>
      <form className="form my-1" method="POST">
        <textarea
          name="text"
          cols="30"
          rows="5"
          placeholder="Create a post"
          value={text}
          onChange={e => setText(e.target.value)}
        
        />
        {DisplayUploadForm && (
          <input
            type="file"
            onChange={upload}
            name="file"
            className="btn btn-white my-1"
          />
        )}
      </form>
      <button onClick={showUploadForm} className="btn btn-white my-1">
        Upload Photo
      </button>
      {file !== '' && (
        <button onClick={clearUpload} className="btn btn-danger my-1">
          Cancel Upload
        </button>
      )}
      <button onClick={onSubmit} className="btn btn-dark my-4">
        Submit
      </button>
    </div>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
  addPostWithImage: PropTypes.func.isRequired,
};

export default connect(
  null,
  { addPost, addPostWithImage },
)(PostForm);
