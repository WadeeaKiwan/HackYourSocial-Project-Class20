import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { setAlert } from '../../actions/alert';
import { changePassword } from '../../actions/auth';
import zxcvbn from 'zxcvbn';

const ChangePassword = ({ changePassword, setAlert }) => {
  const [formData, setFormData] = useState({
    password: '',
    newPassword: '',
    newPassword2: '',
    evaluation: '',
  });

  const { password, newPassword, newPassword2, evaluation } = formData;

  const onChange = e => {
    const evaluation = zxcvbn(newPassword);
    setFormData({ ...formData, [e.target.name]: e.target.value, evaluation });
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (newPassword !== newPassword2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      await changePassword({ password, newPassword });
      setFormData({ ...formData, password: '', newPassword: '', newPassword2: '' });
    }
  };

  return (
    <Fragment>
      <h1 className='large text-primary'>Change Password</h1>
      <p className='lead'>
        <i className='fas fa-lock' /> Here you can change your current password
      </p>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Current Password'
            name='password'
            value={password}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='New Password'
            name='newPassword'
            value={newPassword}
            onChange={e => onChange(e)}
          />
        </div>
        {newPassword && (
          <Fragment>
            <progress value={evaluation.score / 4} />
            <br />
            <span>
              {evaluation.score === 2
                ? 'Medium '
                : evaluation.score === 3
                ? 'Good '
                : evaluation.score === 4
                ? 'Strong '
                : 'Weak '}
              New Password {evaluation && `... ${evaluation.feedback.warning}`}
            </span>
          </Fragment>
        )}
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm New Password'
            name='newPassword2'
            value={newPassword2}
            onChange={e => onChange(e)}
          />
        </div>
        <input
          type='submit'
          className='btn btn-primary'
          value='Confirm'
          onSubmit={e => onSubmit(e)}
        />
        <Link to='/dashboard' className='btn btn-light'>
          Back To Dashboard
        </Link>
      </form>
    </Fragment>
  );
};

ChangePassword.propTypes = {
  setAlert: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired,
};

export default connect(
  null,
  { changePassword, setAlert },
)(ChangePassword);
