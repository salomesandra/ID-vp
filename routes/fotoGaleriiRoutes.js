const express = require('express');
const router = express.Router();

const {
	fotoGaleriiVaade} = require('../controllers/fotoGaleriiControllers');

router.route('/').get(fotoGaleriiVaade);

module.exports = router;