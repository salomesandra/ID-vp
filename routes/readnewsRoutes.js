const express = require('express');
const loginCheck = require('../src/checkLogin');

const router = express.Router();

//kontrollin sisselogimist
router.use(loginCheck.isLogin);

const {
	uudistePortaal} = require('../controllers/readnewsControllers');

router.route('/').get(uudistePortaal);

module.exports = router;