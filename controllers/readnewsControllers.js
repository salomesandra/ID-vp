const mysql = require('mysql2/promise');

//@desc page for viewing the news articles
//@route GET /readnews
//@access private

const uudistePortaal = async (req, res) => {
	let conn; 
	try {
		const userId = req.session.userId;
		conn = await mysql.createConnection({
			host: process.env.DB_HOST, 
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		const sqlReq = 'SELECT news_title, news_text, created, newsphotos_id, newsphotos_alttext FROM news WHERE expire >= ? AND deleted IS NULL ORDER By id DESC';
        const [uudised] = await conn.execute(sqlReq, [userId]);

		res.render('readnews', { photoData: uudised });
	}
	catch (err) {
		console.log('Viga uudiste laadimisel: ' + err);
        res.render('readnews', { photoData: [] });
	}
	finally {
		if(conn){
		await conn.end();
		}
	}
};

module.exports = {
	uudistePortaal
};