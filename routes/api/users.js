const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');
const { sendEmail } = require('../../middleware/mailer')

const User = require('../../models/User');

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
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
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
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      user = new User({
        name,
        email,
        avatar,
        password
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route    POST api/users/forgotpassword
// @desc     Forgotten password email
// @access   Public
router.post(
  '/forgotpassword',
  [check('email', 'Please include a valid email').isEmail()],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email } = req.body

    try {
      let user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'User not found' }] })
      }

      if (!user.active) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Please verify your account first!' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      }

      const forgotPassToken = await jwt.sign(payload, config.get('jwtSecret'), { expiresIn: '1h' })

      // Check if not token
      if (!forgotPassToken) {
        return res.status(401).json({ msg: 'No token, authorization denied' })
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
              <a href="http://localhost:3000/resetpassword/${forgotPassToken}">
                Here
              </a>
            </p>
            <p class="p lead">
              Thanks, Hack Your Social Team
            </p>
          </body>
          `

      // Send the email
      await sendEmail(
        '"HackYourSocial Password Reset👻" <resetpassword@hackyoursocial.com>',
        email,
        'Reset your forgotten password',
        html,
      )

      res.status(200).json({ msg: 'Reset password link has been sent. Please, check your email' });
    } catch (err) {
      console.error(err.message)
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'User not found' })
      }
      res.status(500).send('Server error')
    }
  },
)


module.exports = router;
