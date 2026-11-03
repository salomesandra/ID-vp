const express = require('express');
const multer = require('multer');
const router = express.Router();

//seadistame multer vahevara (middleware) failide üleslaadimiseks
//määran üleslaadimise kataloogi
const upload = multer({dest: process.env.UPLOAD_ORIGINAL_PATH});

const {
	galleryPhotoUpload,
	galleryPhotoPost
	} = require('../controllers/galleryPhotoUploadControllers');

router.route('/').get(galleryPhotoUpload);

//post osa suunatakse läbi vahevara - upload
router.route('/').post(upload.single('photoInput'), galleryPhotoPost);


module.exports = router;