const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator/check');
const { sendEmail } = require('../../middleware/mailer');

const User = require('../../models/User');

const herokuURL = 'https://hackyoursocial.herokuapp.com';

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      const confirmationToken = await jwt.sign(payload, process.env.CONFIRMATION_SECRET, {
        expiresIn: '1h',
      });

      // Check if not token
      if (!confirmationToken) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
      }

      // Email body
      const html = `
          <style>
            .container {
              margin: auto;
              overflow: hidden;
              padding: 0 2rem;
              font-family: 'Georgia', sans-serif;
              font-size: 1rem;
              line-height: 1.6;
            }
            .large {
              font-size: 2rem;
              line-height: 1.2;
              margin-bottom: 1rem;
              color: blue;
            }
            .p {
              padding: 0.5rem;
            }
            .my-1 {
              margin: 1rem 0;
            }
            .lead {
              font-size: 1.5rem;
              margin-bottom: 1rem;
            }
          </style>
          <body class="container">
            <h1>
              Hi ${name},
            </h1>
            <p class="p large">
              Thanks for your registration!
            </p>
            <p class="p lead">Please verify your account by clicking: 
              <a href="${herokuURL}/verify/${confirmationToken}">
                Here
              </a>
            </p>
            <p class="p lead">
              Thanks, Hack Your Social Team
            </p>
          </body>
          `;

      // Send the email
      await sendEmail(
        '"HackYourSocial Activation 👻" <activate@hackyoursocial.com>',
        email,
        'Please verify your account',
        html,
      );

      res
        .status(200)
        .json({ msg: 'You are registered! Please, visit your email to confirm your account' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },
);

// @route    POST api/users/verify/:confirmationToken
// @desc     Email Confirmation
// @access   Public
router.post('/verify/:confirmationToken', async (req, res) => {
  const { confirmationToken } = req.params;

  try {
    const decoded = await jwt.verify(confirmationToken, process.env.CONFIRMATION_SECRET);

    let user = await User.findById({ _id: decoded.user.id }).select('-password');

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Activation link has expired!' }] });
    }

    user.active = true;
    await user.save();

    // Email body
    const html = `
        <style>
          .container {
            margin: auto;
            overflow: hidden;
            padding: 0 2rem;
            font-family: 'Georgia', sans-serif;
            font-size: 1rem;
            line-height: 1.6;
          }
          .large {
            font-size: 2rem;
            line-height: 1.2;
            margin-bottom: 1rem;
            color: blue;
          }
          .p {
            padding: 0.5rem;
          }
          .my-1 {
            margin: 1rem 0;
          }
          .lead {
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }
        </style>
        <body class="container">
          <h1>
            Hi ${user.name},
          </h1>
          <p class="p large">
            Your account has been confirmed!
          </p>
          <p class="p lead">
            Thanks, Hack Your Social Team
          </p>
        </body>
        `;

    // Send the email
    await sendEmail(
      '"HackYourSocial Activation 👻" <activate@hackyoursocial.com>',
      user.email,
      'Account confirmed!',
      html,
    );

    res.status(200).json({ msg: 'Your account has been confirmed!' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(404).json({ msg: 'Activation link has expired!' });
    }
    res.status(500).send('Server error');
  }
});

// @route    PUT api/users/verify/resend
// @desc     Resend Email Confirmation
// @access   Public
router.put(
  '/verify/resend',
  [check('email', 'Please include a valid email').isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'User not found' }] });
      }

      if (user.active) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Your account has been already confirmed!' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      const confirmationToken = await jwt.sign(payload, process.env.CONFIRMATION_SECRET, {
        expiresIn: '1h',
      });

      // Check if not token
      if (!confirmationToken) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
      }

      // Email body
      const html = `
          <style>
            .container {
              margin: auto;
              overflow: hidden;
              padding: 0 2rem;
              font-family: 'Georgia', sans-serif;
              font-size: 1rem;
              line-height: 1.6;
            }
            .large {
              font-size: 2rem;
              line-height: 1.2;
              margin-bottom: 1rem;
              color: blue;
            }
            .p {
              padding: 0.5rem;
            }
            .my-1 {
              margin: 1rem 0;
            }
            .lead {
              font-size: 1.5rem;
              margin-bottom: 1rem;
            }
          </style>
          <body class="container">
            <h1>
              Hi ${user.name},
            </h1>
            <p class="p lead">Please verify your account by clicking: 
              <a href="${herokuURL}/verify/${confirmationToken}">
                Here
              </a>
            </p>
            <p class="p lead">
              Thanks, Hack Your Social Team
            </p>
          </body>
          `;

      // Send the email
      await sendEmail(
        '"HackYourSocial Activation 👻" <activate@hackyoursocial.com>',
        email,
        'Please verify your account',
        html,
      );

      res
        .status(200)
        .json({ msg: 'A new confirmation link has been sent. Please, check your email' });
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'User not found' });
      }
      res.status(500).send('Server error');
    }
  },
);

// @route    POST api/users/forgotpassword
// @desc     Forgotten password email
// @access   Public
router.post(
  '/forgotpassword',
  [check('email', 'Please include a valid email').isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'User not found' }] });
      }

      if (!user.active) {
        return res.status(400).json({ errors: [{ msg: 'Please verify your account first!' }] });
      }

      if (user.socialMediaAccount) {
        return res.status(400).json({
          errors: [{ msg: 'This is a social media account, you cannot reset the password!' }],
        });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      const forgotPassToken = await jwt.sign(payload, process.env.PASSWORD_SECRET, {
        expiresIn: '1h',
      });

      // Check if not token
      if (!forgotPassToken) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
      }

      // Email body
      const html = `
          <style>
            .container {
              margin: auto;
              overflow: hidden;
              padding: 0 2rem;
              font-family: 'Georgia', sans-serif;
              font-size: 1rem;
              line-height: 1.6;
            }
            .large {
              font-size: 2rem;
              line-height: 1.2;
              margin-bottom: 1rem;
              color: blue;
            }
            .p {
              padding: 0.5rem;
            }
            .my-1 {
              margin: 1rem 0;
            }
            .lead {
              font-size: 1.5rem;
              margin-bottom: 1rem;
            }
          </style>
          <body class="container">
            <h1>
              Hi ${user.name},
            </h1>
            <p class="p large">Forgot your password?</p>
            <p class="p lead">To reset your password you can click: 
              <a href="${herokuURL}/resetpassword/${forgotPassToken}">
                Here
              </a>
            </p>
            <p class="p lead">
              Thanks, Hack Your Social Team
            </p>
          </body>
          `;

      // Send the email
      await sendEmail(
        '"HackYourSocial Password Reset👻" <resetpassword@hackyoursocial.com>',
        email,
        'Reset your forgotten password',
        html,
      );

      res.status(200).json({ msg: 'Reset password link has been sent. Please, check your email' });
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'User not found' });
      }
      res.status(500).send('Server error');
    }
  },
);

// @route    PUT api/users/resetpassword/:forgotpasstoken
// @desc     Reset password
// @access   Public
router.put(
  '/resetpassword/:forgotPassToken',
  [check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { forgotPassToken } = req.params;
    const { password } = req.body;

    try {
      const decoded = await jwt.verify(forgotPassToken, process.env.PASSWORD_SECRET);

      let user = await User.findById({ _id: decoded.user.id }).select('-password');

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Reset password link has expired!' }] });
      }

      if (!user.active) {
        return res.status(400).json({ errors: [{ msg: 'Please verify your account first!' }] });
      }

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // Email body
      const html = `
          <style>
            .container {
              margin: auto;
              overflow: hidden;
              padding: 0 2rem;
              font-family: 'Georgia', sans-serif;
              font-size: 1rem;
              line-height: 1.6;
            }
            .large {
              font-size: 2rem;
              line-height: 1.2;
              margin-bottom: 1rem;
              color: blue;
            }
            .p {
              padding: 0.5rem;
            }
            .my-1 {
              margin: 1rem 0;
            }
            .lead {
              font-size: 1.5rem;
              margin-bottom: 1rem;
            }
          </style>
          <body class="container">
            <h1>
              Hi ${user.name},
            </h1>
            <p class="p large">Your password has been reset successfully!</p>
            <p class="p lead">
              You can now use your new password to Sign In 
            </p>
            <p class="p lead">
              Thanks, Hack Your Social Team
            </p>
          </body>
          `;

      // Send the email
      await sendEmail(
        '"HackYourSocial Password Reset👻" <resetpassword@hackyoursocial.com>',
        user.email,
        'Password Reset Complete',
        html,
      );

      res.status(200).json({ msg: 'Your password has been reset successfully' });
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'User not found' });
      }
      if (err.name === 'TokenExpiredError') {
        return res.status(404).json({ msg: 'Reset password link has expired!' });
      }
      res.status(500).send('Server error');
    }
  },
);

// @route    GET api/users/checkpasstoken/:forgotPassToken
// @desc     Check Token Validity
// @access   Public
router.get('/checkpasstoken/:forgotPassToken', async (req, res) => {
  const { forgotPassToken } = req.params;

  try {
    const decoded = await jwt.verify(forgotPassToken, process.env.PASSWORD_SECRET);

    let user = await User.findById({ _id: decoded.user.id }).select('-password');

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Reset password link has expired!' }] });
    }

    res.status(200).json({ msg: 'Reset password link is still valid!' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(404).json({ msg: 'Reset password link has expired!' });
    }
    res.status(500).send('Server error');
  }
});

// @route    PUT api/users/changepassword
// @desc     Change Password
// @access   Private
router.put(
  '/changepassword',
  [
    auth,
    [
      check('password', 'Please enter your current password')
        .not()
        .isEmpty(),
      check('newPassword', 'Please enter a new password with 6 or more characters').isLength({
        min: 6,
      }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { password, newPassword } = req.body;

    try {
      let user = await User.findById(req.user.id);

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'User not found!' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Your current password is not correct. Please, try again!' }] });
      }

      const isMatchNew = await bcrypt.compare(newPassword, user.password);

      if (isMatchNew) {
        return res.status(400).json({
          errors: [{ msg: 'You cannot use your current password. Please, use a new one' }],
        });
      }

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      // Email body
      const html = `
          <style>
            .container {
              margin: auto;
              overflow: hidden;
              padding: 0 2rem;
              font-family: 'Georgia', sans-serif;
              font-size: 1rem;
              line-height: 1.6;
            }
            .large {
              font-size: 2rem;
              line-height: 1.2;
              margin-bottom: 1rem;
              color: blue;
            }
            .p {
              padding: 0.5rem;
            }
            .my-1 {
              margin: 1rem 0;
            }
            .lead {
              font-size: 1.5rem;
              margin-bottom: 1rem;
            }
          </style>
          <body class="container">
            <h1>
              Hi ${user.name},
            </h1>
            <p class="p large">Your password has been changed successfully!</p>
            <p class="p lead">
              Thanks, Hack Your Social Team
            </p>
          </body>
          `;

      // Send the email
      await sendEmail(
        '"HackYourSocial Password Change👻" <resetpassword@hackyoursocial.com>',
        user.email,
        'Password Change Complete',
        html,
      );

      res.status(200).json({ msg: 'Your password has been changed successfully' });
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'User not found' });
      }
      res.status(500).send('Server error');
    }
  },
);

module.exports = router;
