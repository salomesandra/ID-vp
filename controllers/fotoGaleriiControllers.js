const mysql = require('mysql2/promise');

//@desc page for viewing the photo gallery
//@route GET /fotoGalerii
//@access public

const fotoGaleriiVaade = async (req, res) => {
	let conn; 
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST, 
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		const sqlReq = 'SELECT id, filename, alttext FROM galleryphotos WHERE privacy >= 2 ORDER BY id DESC';
        const [galeriifotod] = await conn.execute(sqlReq);

		res.render('fotogalerii', { photoData: galeriifotod });
	}
	catch (err) {
		console.log('Viga galerii laadimisel: ' + err);
        res.render('fotogalerii', { photoData: [] });
	}
	finally {
		if(conn){
		await conn.end();
		}
	}
};

module.exports = {
	fotoGaleriiVaade
};