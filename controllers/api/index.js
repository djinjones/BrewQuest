const router = require('express').Router();

const userRoutes = require('./user-routes');
const blogRoutes = require('./blogs');
const comment = require('./comments');
const brew = require('./brewery')

console.log(userRoutes, blogRoutes);

router.use('/users', userRoutes);
router.use('/blogs', blogRoutes);
router.use('/comments', comment);
router.use('/brewery', brew)

module.exports = router;
