import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { updatePost, setEditPost, deletePhoto } from '../../actions/post';
import './edit_post.css';

const EditPost = ({
  setEditPost,
  deletePhoto,
  updatePost,
  post: { _id, text, name, avatar, user, image },
}) => {
  const [newText, setText] = useState(text);
  const [file, setFile] = useState(image);
  const [message, setMessage] = useState('Please, add at least text or photo');
  const [DisplayUploadForm, setDisplayUploadForm] = useState(false);
  const [imageStyle, setImageStyle] = useState({
    display: 'block',
  });
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

  const upload = e => {
    setFile(e.target.files[0]);
  };

  const removePhoto = () => {
    setFile('');
    setImageStyle({
      display: 'none',
    });
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
      if (file && newText) {
        let formData = new FormData();
        formData.append('file', file);
        updatePost(_id, formData, { newText });
        setEditPost(null);
        setFile('');
        setText('');
        setMessage('');
      } else if (!file && !newText) {
        setEditPost(null);
      } else if (!newText) {
        let formData = new FormData();
        formData.append('file', file);
        updatePost(_id, formData, { newText });
        setEditPost(null);
        setFile('');
        setText('');
        setMessage('');
      } else {
        updatePost(_id, null, { newText });
        deletePhoto(_id);
        setText('');
        setEditPost(null);
        setMessage('');
      }
    } catch (error) {
      console.log('Error Edit Post');
    }
  };

  return (
    <div className={'post bg-white p-1  edit-post-position'}>
      <div>
        <Link to={`/profile/${user}`}>
          <img className='round-img' src={avatar} alt='' />
          <h4>{name}</h4>
        </Link>
      </div>
      <div ref={node} className=''>
        <div className='p'>
          <h3>Edit Your Post...</h3>
          {!file && !newText && <div className='alert alert-danger'>{message}</div>}
        </div>
        <div className='p'>
          <div className='imageContainer'>
            <div className='layer2' onClick={removePhoto}>
              Remove
            </div>
            {image && (
              <img className='editedPhoto' style={imageStyle} src={image} alt={'postPhoto'} />
            )}
          </div>
        </div>
        <form method='POST' className='form'>
          <textarea
            name='text'
            cols='30'
            rows='5'
            placeholder='Edit your post'
            value={newText}
            onChange={e => setText(e.target.value)}
          />
          {DisplayUploadForm && (
            <input type='file' onChange={upload} name='file' className='btn btn-white my-1' />
          )}
        </form>
        <button onClick={showUploadForm} className='btn btn-white my-1'>
          Upload Photo
        </button>
        {file !== '' && (
          <button onClick={clearUpload} className='btn btn-danger my-1'>
            Cancel Upload
          </button>
        )}
        <button onClick={() => setEditPost(null)} className='btn btn-dark my-1  cancel-button'>
          Cancel
        </button>
        <button onClick={onSubmit} className='btn btn-success my-1'>
          Save
        </button>
      </div>
    </div>
  );
};

EditPost.propTypes = {
  post: PropTypes.object.isRequired,
  updatePost: PropTypes.func.isRequired,
  setEditPost: PropTypes.func.isRequired,
  deletePhoto: PropTypes.func.isRequired,
};

export default connect(
  null,
  { updatePost, setEditPost, deletePhoto },
)(EditPost);
