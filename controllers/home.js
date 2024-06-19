const router = require('express').Router();
const { User, BlogPost, Brewery } = require('../models');
require('dotenv').config();

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
          user, posts, showDeleteButton: false, loggedIn: req.session.loggedIn,username: req.session.username,
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
      });
  
  } catch (err) {
      res.status(500).json(err);
  }
});

// router.get('/', async (req, res) => {
//   try {
//     const dbBlogs = await BlogPost.findAll({
//       include: [
//         { model: User, attributes: ['username'] },
//         {
//           model: Brewery,
//           attributes: ['name'],
//           where: { id: Sequelize.col('BlogPost.brewery_id') } // Match brewery_id from BlogPost
//         }
//       ]
//     });

//     const user = req.session.username;
//     console.log(`user: ${user} -home.js:8`);

//     const posts = dbBlogs.map(post => ({
//       ...post.get({ plain: true }),
//       breweryName: post.Brewery.name // Access brewery name from included Brewery model
//     }));

//     res.render('homepage', {
//       user,
//       posts,
//       showDeleteButton: false,
//       loggedIn: req.session.loggedIn,
//       apiKey: process.env.GOOGLE_MAPS_API_KEY,
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json(err);
//   }
// });

router.get('/select/:id', async (req, res) => {
  try {
    const user = await req.session.username;

    const currentBrewery = await Brewery.findByPk(req.params.id, {
      include: [{
        model: BlogPost,
        as: 'blogs',
      }],
      })
      const posts = currentBrewery.map((post) =>
        post.get({ plain: true })
      );

      const breweryName = currentBrewery.name

      res.render('homepage', {
        posts,breweryName, user, showDeleteButton: false, loggedIn: req.session.loggedIn, apiKey: process.env.GOOGLE_MAPS_API_KEY,
    
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
