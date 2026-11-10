const mysql = require('mysql2/promise');

//@desc page for viewing the private photo gallery
//@route GET /privaatGalerii
//@access private

const privaatGaleriiVaade = async (req, res) => {
	let conn; 
	try {
		const userId = req.session.userId;
		conn = await mysql.createConnection({
			host: process.env.DB_HOST, 
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		const sqlReq = 'SELECT id, filename, alttext FROM galleryphotos WHERE privacy = 1 ORDER BY id DESC';
        const [galeriifotod] = await conn.execute(sqlReq);

		res.render('privaatgalerii', { photoData: galeriifotod });
	}
	catch (err) {
		console.log('Viga galerii laadimisel: ' + err);
        res.render('privaatgalerii', { photoData: [] });
	}
	finally {
		if(conn){
		await conn.end();
		}
	}
};

module.exports = {
	privaatGaleriiVaade
};