const router = require('express').Router();
const { Comment } = require('../../models');


// Create a new comment
router.get('/', async (req, res) => {
  try {
    const postId = req.query.postId;
    const comments = await Comment.findAll({
      where: {
        postId: postId,
      },
    });
    res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const user = req.session.username;
    console.log(`user: ${user} -comments.js: 9`)

    const newComment = await Comment.create({
      content: req.body.content,
      postId: req.body.postId,
      username: user,
      // Add other fields like userId if needed
    });

    const allComments = await Comment.findAll({
      where: {
        postId: req.body.postId,
      },
    });
    res.status(200).json(allComments);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;