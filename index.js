const express = require('express');
const dateTimeET = require('./src/dateTimeET');
const vanasonad = require('./src/vanasonad');
const fs = require('fs').promises;
const bodyparser = require('body-parser');

const regtextRef = "Public/txt/visits.txt";

//käivitan funktsiooni express() ja annan nimeks app
const app = express();

//määrame renderusmootori: EJS
app.set('view engine', 'ejs');

//määrame avalikuna kasutatava kataloogi
app.use(express.static('public'));

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

app.get('/regvisit', (req, res)=>{
	res.render('regvisit');
});

app.post('/regvisit', async(req, res)=>{
	try {
		await fs.open(regtextRef, 'a');
		await fs.appendFile(regtextRef, req.body.inputName + ';');
		res.render('regvisit');
	}
	catch (err) {
		console.log(err);
		res.render('regvisit');
	}
	
});

app.listen(5214);