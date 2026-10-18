const express = require('express');
const router = express.Router();

const {
	eestifilm,
	inimesed,
	inimesedAdd,
	inimesedAddPost,
	movieAdd,
	movieAddPost,
	ametAdd,
	ametAddPost,
	seosedAdd,
	seosedAddPost,
	seosteInfo
	} = require('../controllers/eestifilmControllers');

router.route('/').get(eestifilm);
router.route('/inimesed').get(inimesed);
router.route('/inimesed_lisa').get(inimesedAdd);
router.route('/inimesed_lisa').post(inimesedAddPost);
router.route('/movie_lisa').get(movieAdd);
router.route('/movie_lisa').post(movieAddPost);
router.route('/amet_lisa').get(ametAdd);
router.route('/amet_lisa').post(ametAddPost);
router.route('/seosed').get(seosedAdd);
router.route('/seosed').post(seosedAddPost);
router.route('/seosteInfo').get(seosteInfo);

module.exports = router;