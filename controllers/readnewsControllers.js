const mysql = require('mysql2/promise');

//@desc page for viewing the news articles
//@route GET /readnews
//@access private

const uudistePortaal = async (req, res) => {
	let conn; 
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST, 
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		const sqlReq = `
		SELECT 
			news.news_title, 
			news.news_text, 
			news.created, 
			newsphotos.filename, 
			newsphotos.alttext,
			users.firstname,
			users.lastname
		FROM news 
		LEFT JOIN newsphotos ON news.newsphotos_id = newsphotos.id 
		LEFT JOIN users ON news.user_id = users.id
		WHERE news.expire_date >= ? AND news.deleted IS NULL
		ORDER BY news.id DESC
		`;
		const today = new Date().toISOString().split('T')[0];

        const [uudised] = await conn.execute(sqlReq, [today]);

		res.render('readnews', { newsData: uudised });
	}
	catch (err) {
		console.log('Viga uudiste laadimisel: ' + err);
        res.render('readnews', { newsData: [] });
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