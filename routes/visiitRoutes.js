const express = require('express');
const router = express.Router();

const {
	visiitAdd,
	visiitAddPost} = require('../controllers/visiitControllers');

router.route('/').get(visiitAdd);
router.route('/').post(visiitAddPost);

module.exports = router;