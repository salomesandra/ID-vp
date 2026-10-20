const express = require('express');
const multer = require('multer');
const router = express.Router();

//seadistame multer vahevara (middleware) failide üleslaadimiseks
//määran üleslaadimise kataloogi
const upload = multer({dest: './Public/gallery/orig/'});

const {
	galleryPhotoUpload,
	galleryPhotoPost
	} = require('../controllers/galleryPhotoUploadControllers');

router.route('/').get(galleryPhotoUpload);

//post osa suunatakse läbi vahevara - upload
router.route('/').post(upload.single('photoInput'), galleryPhotoPost);


module.exports = router;