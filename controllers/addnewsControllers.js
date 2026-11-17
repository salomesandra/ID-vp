const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const sharp = require('sharp');
const validator = require('validator');

//@desc page for uploading news
//@route GET /addNewsUpload
//@access private

const addNewsUpload = (req, res) => {
	res.render('addnews_upload');
};

//@desc page for uploading news
//@route POST /addNewsUpload
//@access private

const addNewsPost = async (req, res) => {
	let conn;
	const title = validator.escape(req.body.titleInput);
	const content = validator.escape(req.body.contentInput);
	const expire = req.body.expireInput;

//kontrollime, kas kõik oluline on olemas:
	if(!title || !content || !expire){
		notice = 'Andmeid on puudu või miski pole korrektne!';
		return res.render('addnews_upload', {notice: notice});
	}

// //kas expiry date on korrektne
// 	if(!validator.isDate(expire) || validator.isBefore(expire)){
// 		notice = 'Valitud aegumiskuupäev pole korrektne!';
// 		return res.render('addnews_upload', {notice: notice});
// 	}

	try {
		//genereerida oma failinime
		const fileName = 'news_' + Date.now() + '.jpg';
		await fs.rename(req.file.path, req.file.destination + fileName);

		//pildi väiksemaks muutmine ja watermarki lisamine
		await sharp(req.file.destination + fileName)
		.resize(400, 300)
		.composite([{input: './Public/Pic/vp_logo_small.png', gravity: 'southeast'}])
		.jpeg({quality: 90})
		.toFile(process.env.NEWS_UPLOAD_RESIZED_PATH + fileName);

		let sqlReqNews = 'INSERT INTO news (news_title, news_text, expire_date, user_id, newsphotos_id, newsphotos_alttext) VALUES (?,?,?,?,?,?)';

		let sqlReqNewsPhotos = 'INSERT INTO newsphotos (filename, origname, alttext, privacy, userid) VALUES (?,?,?,?,?)';
		
		const userId = req.session.userId;
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});

		const [photoResult] = await conn.execute(sqlReqNewsPhotos, [
			fileName,
			req.file.originalname,
			req.body.altInput,
			req.body.privacyInput,
			userId]);

		const [newsResult] = await conn.execute(sqlReqNews, [
			title, 
			content, 
			expire, 
			userId,
			photoResult.insertId,
			req.body.altInput
		]);
		
		console.log('Salvestati: ' + title);
		res.render('addnews_upload');
	}
	catch (err) {
		console.log('Viga: ' + err);
		res.render('addnews_upload');
	}
	finally {
		if(conn){
		await conn.end();
		}
	}
};


module.exports = {
	addNewsUpload,
	addNewsPost
};