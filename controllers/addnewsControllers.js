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
	try {
		// //genereerida oma failinime
		// const fileName = 'news_' + Date.now() + '.jpg';
		// await fs.rename(req.file.path, req.file.destination + fileName);

		// //pildi väiksemaks muutmine ja watermarki lisamine
		// await sharp(req.file.destination + fileName)
		// .resize(400, 300)
		// .composite([{input: './Public/Pic/vp_logo_small.png', gravity: 'southeast'}])
		// .jpeg({quality: 90})
		// .toFile(process.env.NEWS_UPLOAD_RESIZED_PATH + fileName);

		let sqlReq = 'INSERT INTO news (id, news_title, news_text, created, expire_date) VALUES (?,?,?,?,?,)'; //, newsphotos_id, newsphotos_alttext, userid
		//const userId = req.session.userId;
		conn = await mysql.createConnection({
			host: process.env.DB_HOST, 
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		const [result] = await conn.execute(sqlReq, [title, content, expire]);
		console.log('Salvestati foto kirje id: ' + result);
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