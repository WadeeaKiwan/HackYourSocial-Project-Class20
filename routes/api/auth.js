const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator/check');
const generator = require('generate-password');

const User = require('../../models/User');

// @route    POST api/auth/registerWithSocialMedia
// @desc     Login SocialMedia
// @access   Public
router.post(
  '/registerWithSocialMedia',

  async (request, response) => {
    const { name, email, avatar } = request.body;

    // generate password
    let password = generator.generate({
      length: 10,
      numbers: true,
      uppercase: true,
      symbols: true,
    });

    try {
      // check if the user exists
      let user = await User.findOne({ email });

      if (!user) {
        // create instance
        user = new User({
          name,
          email,
          avatar,
          password,
          socialMediaAccount: true,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // set User SocialMedia to active
        user.active = true;
        await user.save();
      }

      // check if the user is already registered as a normal account
      if (!user.socialMediaAccount) {
        return response.status(404).json({ error: true });
      }

      // keep up to date with social accounts
      user.name = name;
      user.avatar = avatar;
      user.password = password;
      await user.save();

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
        if (err) throw error;
        response.status(200).send({ token });
      });
    } catch (error) {
      console.log(error);
      response.status(404).json({ error });
    }
  },
);

// @route    GET api/auth
// @desc     Test route
// @access   Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required')
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      if (!user.active) {
        return res.status(400).json({ errors: [{ msg: 'Please, verify your account!' }] });
      }

      if (user.socialMediaAccount) {
        return res.status(400).json({
          errors: [
            { msg: 'This is a social media account! You cannot login with it as normal account' },
          ],
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },
);

module.exports = router;
