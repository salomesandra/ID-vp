const express = require('express');
const loginCheck = require('../src/checkLogin');

const router = express.Router();

//kontrollin sisselogimist
router.use(loginCheck.isLogin);

const {
	fotoGaleriiVaade} = require('../controllers/fotoGaleriiControllers');

router.route('/').get(fotoGaleriiVaade);

module.exports = router;