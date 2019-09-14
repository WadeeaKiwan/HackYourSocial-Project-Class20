const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');

const upload = require('../../services/image-upload');
const singleImageUpload = upload.single('file');

const Post = require('../../models/Post');
const User = require('../../models/User');

// @route           POST api/posts/upload
// @description     Upload post photo
// @access          Private
router.post('/upload', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id).select('-password');
    await singleImageUpload(req, res, async err => {
      if (err) {
        console.error(err.message);
      }
      const newPost = new Post({
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
        image: req.file.location,
      });
      const post = await newPost.save();

      res.json(post);
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

// @route           PUT api/posts/id
// @description     Edit post
// @access          Private

router.put('/:id', auth, async (req, res) => {
  // find post from data base
  const post = await Post.findById(req.params.id);
  // check authorized
  if (post.user.toString() !== req.user.id) {
    return res.status(401).json({ msg: 'User not authorized' });
  }
  try {
    // update post
    post.text = req.body.text;
    // save in database
    await post.save();
    // return result to deal with frontEnd
    res.json(post);
  } catch (error) {
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Post not found' });
    }
    res.send(error);
  }
});
// @route    POST api/posts
// @desc     Create a post
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
);

// @route    GET api/posts
// @desc     Get all posts
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({
      date: -1,
    });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        msg: 'Post not found',
      });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: 'Post not found',
      });
    }
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        msg: 'Post not found',
      });
    }

    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: 'User not authorized',
      });
    }

    await post.remove();

    res.json({
      msg: 'Post removed',
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: 'Post not found',
      });
    }
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // Check if the post has already been liked
    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
      const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
      post.likes.splice(removeIndex, 1);
      await post.save();
      return res.json(post.likes);
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/posts/comment/:id
// @desc     Comment on a post
// @access   Private
router.post(
  '/comment/:id',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
);

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Pull out comment
    const comment = post.comments.find(comment => comment.id === req.params.comment_id);

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({
        msg: 'Comment does not exist',
      });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: 'User not authorized',
      });
    }

    // Get remove index
    const removeIndex = post.comments.map(comment => comment.id).indexOf(req.params.comment_id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/posts/update/:id
// @desc    Update a post
// @access  Private
router.post('/update/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: 'User not authorized.',
      });
    }

    if (req.body.newText || req.body.newText === '') {
      post.text = req.body.newText;
      post.edited = true;
      await post.save();
    }
    console.log(req.files);
    if (req.files) {
      await singleImageUpload(req, res, async err => {
        if (err) {
          console.error(err.message);
        }
        post.image = req.file.location;
        await post.save();

        const posts = await Post.find().sort({
          date: -1,
        });
        return res.json(posts);
      });
    }
    const posts = await Post.find().sort({
      date: -1,
    });
    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/posts/delete/photo:id
// @desc    Update "remove" photo from post
// @access  Private
router.delete('/delete/photo/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: 'User not authorized.',
      });
    }
    post.image = '';
    await post.save();
    const posts = await Post.find().sort({
      date: -1,
    });
    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/posts/comment/update:id
// @desc    Update a comment
// @access  Private
router.post(
  '/comment/update/:id/:comment_id',
  [
    auth,
    [
      check('newText', 'Text is required')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const post = await Post.findById(req.params.id);
      const comment = post.comments.find(comment => comment.id === req.params.comment_id);
      // Check if comment exists
      if (!comment) {
        return res.status(404).json({
          msg: 'Comment not found.',
        });
      }
      // Check user
      if (comment.user.toString() !== req.user.id) {
        return res.status(401).json({
          msg: 'User not authorized.',
        });
      }
      comment.text = req.body.newText;
      comment.edited = true;
      await post.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
);
module.exports = router;
