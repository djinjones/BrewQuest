const router = require('express').Router();

const apiRoutes = require('./api');
const home = require('./home.js');
const dashboard = require('./dashboard.js');


router.use('/', home);
router.use('/dashboard', dashboard);
router.use('/api', apiRoutes);

module.exports = router;
