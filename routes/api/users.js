const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator/check')
const { sendEmail } = require('../../middleware/mailer')

const User = require('../../models/User')

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
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
      let user = await User.findOne({ email })

      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] })
      }

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      })

      user = new User({
        name,
        email,
        avatar,
        password,
      })

      const salt = await bcrypt.genSalt(10)

      user.password = await bcrypt.hash(password, salt)

      await user.save()

      const payload = {
        user: {
          id: user.id,
        },
      }

      // jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
      //   if (err) throw err;
      //   res.json({ token });
      // });

      const token = await jwt.sign(payload, config.get('jwtSecret'), { expiresIn: '12h' })

      // Check if not token
      if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' })
      }

      // Email body
      const html = `
            Hi ${name},
            <br/><br/>
            Thanks for your registration!
            <br/><br/>
            Please verify your account by clicking the following link:
            <a href="http://localhost:3000/verify/${token}">http://localhost:3000/verify</a>
            <br/><br/>
            Thanks, Hack Your Social Team
            `

      // Send the email
      await sendEmail(
        '"HackYourSocial Activation 👻" <activate@hackyoursocial.com>',
        email,
        'Please verify your account',
        html,
      )
      res.json(user)
      // res.json({ msg: 'You are registered! Please, visit your email to confirm your account' })
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  },
)

// @route    POST api/users/verify/:token
// @desc     Email Confirmation
// @access   Private
router.post('/verify/:token', async (req, res) => {
  const { token } = req.params

  try {
    const verifyToken = await jwt.verify(token, config.get('jwtSecret'))

    let user = await User.findById({ _id: verifyToken.user.id }).select('-password')

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'User not found' }] })
    }

    user.active = true
    await user.save()

    // Email body
    const html = `
            Hi ${user.name},
            <br/><br/>
            Your account has been confirmed!
            <br/><br/>
            Thanks, Hack Your Social Team
            `

    // Send the email
    await sendEmail(
      '"HackYourSocial Activation 👻" <activate@hackyoursocial.com>',
      user.email,
      'Account confirmed!',
      html,
    )

    res.json({ token })
    // res.json({ msg: 'Your account is verified!' })
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' })
    }
    res.status(500).send('Server error')
  }
})

module.exports = router
