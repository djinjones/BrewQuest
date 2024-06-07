const router = require('express').Router();

const userRoutes = require('./user-routes');
const blogRoutes = require('./blogs');
const comment = require('./comments')

console.log(userRoutes, blogRoutes);

router.use('/users', userRoutes);
router.use('/blogs', blogRoutes);
router.use('/comments', comment);

module.exports = router;
