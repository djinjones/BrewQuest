const router = require('express').Router();
const { User, BlogPost } = require('../models');

router.get('/', async (req, res) => {
    try {
        const user = await req.session.username;
        console.log(`user: ${user} -dashboard.js:7`)
        const dbBlogs = await BlogPost.findAll();
       
        const posts = dbBlogs.map((post) =>
            post.get({ plain: true })
        );
         console.log(posts)
        res.render('dashboard', { 
            posts, user, showDeleteButton: true, loggedIn: req.session.loggedIn, } );
       
    } catch (err) {
        res.status(500).json(err);
        console.log('error loading dashboard', err)
    }
});

module.exports = router;