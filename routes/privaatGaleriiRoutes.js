const express = require('express');
const loginCheck = require('../src/checkLogin');

const router = express.Router();

//kontrollin sisselogimist
router.use(loginCheck.isLogin);

const {
	privaatGaleriiVaade} = require('../controllers/privaatGaleriiControllers');

router.route('/').get(privaatGaleriiVaade);

module.exports = router;