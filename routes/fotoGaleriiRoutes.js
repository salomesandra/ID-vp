const express = require('express');
const loginCheck = require('../src/checkLogin');

const router = express.Router();

//kontrollin sisselogimist
router.use(loginCheck.isLogin);

const {
	fotoGaleriiVaade,
	fotoGaleriiHome
	} = require('../controllers/fotoGaleriiControllers');

router.route('/').get(fotoGaleriiHome);

//router.route('/my').get(myGallery);

router.route('/:page').get(fotoGaleriiVaade);

module.exports = router;