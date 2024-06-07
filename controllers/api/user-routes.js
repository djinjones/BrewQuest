const router = require('express').Router();
const { User } = require('../../models');


router.post('/', async (req, res) => {
  try {
    const dbUserData = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.username = req.body.username;

      res.status(200).json(dbUserData);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


router.post('/login', async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      where: {
        email: req.body.email,
      },
      
    });
    console.log(dbUserData);
    const username = dbUserData.username;
    if (!dbUserData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password.' });
      return;
    }

    const validPassword = await dbUserData.checkPassword(req.body.password);
    // check to see if the password is correct
    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password.' });
      return;
    }

    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.username = username;
      console.log('user: ' + req.session.username);

      res
        .status(200)
        .json({ user: dbUserData, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// we use a post request for the logout because typically post requests are used for actions that result in a change in the server
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
