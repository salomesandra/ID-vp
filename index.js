const express = require('express');
const dateTimeET = require('./src/dateTimeET');
const vanasonad = require('./src/vanasonad');
const visits = require('./src/lastvisits');
const fs = require('fs').promises;
const bodyparser = require('body-parser');
const regtextRef = "Public/txt/visits.txt";

//käivitan funktsiooni express() ja annan nimeks app
const app = express();

//määrame renderusmootori: EJS
app.set('view engine', 'ejs');

//määrame avalikuna kasutatava kataloogi
app.use(express.static('Public'));

//määrame vormide sisu parsimise
app.use(bodyparser.urlencoded({extended: false}));

//marsruudid
app.get('/', (req, res)=>{
	const dayNow = dateTimeET.day();
	const dateNow = dateTimeET.date(1);
	const timeNow = dateTimeET.time();
	const dayPart = dateTimeET.daypart();
	//res.send('Express.js veeb läkski käima!');
	res.render('index', {dayNow: dayNow, dateNow: dateNow, timeNow: timeNow, dayPart: dayPart});
});

app.get('/vanasona', async (req, res)=>{
	const data = await vanasonad.vanasonad();
	res.render('vanasona', { vanasonad: data });
});

app.get('/koolitee', async (req, res)=>{
	res.render('koolitee');
});

app.get('/regvisit', (req, res)=>{
	res.render('regvisit');
});

app.get('/lastvisit', async(req, res)=>{
	const data = await visits.visits();
	res.render('lastvisit', { splitVisit: data.split(",") });
});

app.post('/regvisit', async(req, res)=>{
	try {
		const visits = await fs.open(regtextRef, 'a');
		const timeNow = dateTimeET.time();
		const dateNow = dateTimeET.date(1);
		await visits.appendFile(dateNow + ',');
		await visits.appendFile(timeNow + ',');
		await visits.appendFile(req.body.inputName + ',');
		await visits.appendFile(req.body.inputDate + ',');
		await visits.appendFile(req.body.inputTime + ';\n');
		await visits.close();

		res.render('regvisit');
	}
	catch (err) {
		console.log(err);
		res.render('regvisit');
	}
});

app.listen(5214);