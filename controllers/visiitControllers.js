const mysql = require('mysql2/promise');
const visits = require('../src/lastvisits');
const regtextRef = "Public/txt/visits.txt";
const fs = require('fs').promises;
const dateTimeET = require('../src/dateTimeET');

//@desc home page for registering visits
//@route GET /visiit
//@access public

const visiitAdd = async(req, res) => {
	const data = await visits.visits();
	res.render('visiit', { splitVisit: data.split(",") });
};

//@desc home page for registering visits
//@route POST /visiit
//@access public

const visiitAddPost = async(req, res) => {
	try {
		const visitsFile = await fs.open(regtextRef, 'a');
		const timeNow = dateTimeET.time();
		const dateNow = dateTimeET.date(1);
		await visitsFile.appendFile(dateNow + ',');
		await visitsFile.appendFile(timeNow + ',');
		await visitsFile.appendFile(req.body.inputName + ',');
		await visitsFile.appendFile(req.body.inputDate + ',');
		await visitsFile.appendFile(req.body.inputTime + ';\n');
		await visitsFile.close();

		const data = await visits.visits();
		res.render('visiit', { splitVisit: data.split(",") });
	}
	catch (err) {
		console.log(err);
		res.render('visiit', { splitVisit: [] });
	}
};

module.exports = {
	visiitAdd,
	visiitAddPost
};