const router = require('express').Router();
const { User, BlogPost } = require('../models');

router.get('/', async (req, res) => {
  try {
      const dbBlogs = await BlogPost.findAll(
      // {
      //   include: [{ model: User, attributes: ['username'] }]
      // }
      );
      const user = await req.session.username;
      console.log(`user: ${user} -home.js:8`);
      const posts = dbBlogs.map((post) =>
          post.get({ plain: true })
      );
      res.render('homepage', {
          posts, user, showDeleteButton: false, loggedIn: req.session.loggedIn,
      });
  
  } catch (err) {
      res.status(500).json(err);
  }
});

router.get('/new', async (req, res) => {
  try {
    if (req.session.loggedIn) {
      res.render('new-post')
    } else {
      res.redirect('login')
    }
  } catch (err) {
    res.status(500).json(err)
  };
});

router.get('/signup', async (req, res) => {
  try {

      res.render('signup')

  } catch (err) {
    res.status(500).json(err)
  };
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
