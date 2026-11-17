const express = require('express');
const multer = require('multer');
const loginCheck = require('../src/checkLogin');

const router = express.Router();

//kontrollin sisselogimist
router.use(loginCheck.isLogin);


//seadistame multer vahevara (middleware) failide üleslaadimiseks
//määran üleslaadimise kataloogi
//const upload = multer({dest: process.env.NEWS_UPLOAD_ORIGINAL_PATH});

const {
	addNewsUpload,
	addNewsPost
	} = require('../controllers/addnewsControllers');

router.route('/').get(addNewsUpload);
router.route('/').get(addNewsPost);

//post osa suunatakse läbi vahevara - upload
//router.route('/').post(upload.single('photoInput'), galleryPhotoPost);


module.exports = router;