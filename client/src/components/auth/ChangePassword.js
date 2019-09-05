import React, { Fragment, useState } from 'react';
import { setAlert } from '../../actions/alert';
import { changePassword } from '../../actions/auth';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const ChangePassword = ({ changePassword, setAlert }) => {
	const [formData, setFormData] = useState({
		password: '',
		newPassword: '',
		repeatNewPassword: '',
	});

	const { password, newPassword, repeatNewPassword } = formData;
	const onSubmit = async e => {
		e.preventDefault();

		if (newPassword !== repeatNewPassword) {
			setAlert('Passwords do not match', 'danger');
		} else if (password === newPassword) {
			setAlert('You cannot use your current password. Please, use a new one');
		} else {
			changePassword({ password, newPassword });
			setAlert('your password has been changed', 'primary');
		}
	};
	const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
	return (
		<Fragment>
			<form className="form" onSubmit={e => onSubmit(e)}>
				<div className="form-group">
					<label>Current password</label>
					<input
						type="password"
						placeholder="Password"
						name="password"
						value={password}
						onChange={e => onChange(e)}
					/>
				</div>
				<div className="form-group">
					<label>New password</label>
					<input
						type="password"
						placeholder="Password"
						name="newPassword"
						value={newPassword}
						onChange={e => onChange(e)}
					/>
				</div>

				<div className="form-group">
					<label>Confirm new password</label>
					<input
						type="password"
						placeholder="password"
						name="repeatNewPassword"
						value={repeatNewPassword}
						onChange={e => onChange(e)}
					/>
				</div>

				<input
					type="submit"
					className="btn btn-primary"
					value="Change Password"
					onSubmit={e => onSubmit(e)}
				/>
			</form>
		</Fragment>
	);
};

ChangePassword.propTypes = {
	setAlert: PropTypes.func.isRequired,
	changePassword: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
	auth: state.auth,
});

export default connect(
	mapStateToProps,
	{ changePassword, setAlert },
)(ChangePassword);
