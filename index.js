const express = require('express');
const dateTimeET = require('./src/dateTimeET');
const vanasonad = require('./src/vanasonad');
const bodyparser = require('body-parser');

//moodul andmebaasiga suhtlemiseks (koos async ehk ootamise osaga)
const mysql = require('mysql2/promise');
const { read } = require('fs');
//moodul .env keskkonnamuutujate lugemiseks
require('dotenv').config();

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
//Eesti filmi marsruudid 
const eestiFilmRouter = require('./routes/eestifilmRoutes');
app.use('/eestifilm', eestiFilmRouter);

const visiitRouter = require('./routes/visiitRoutes');
app.use('/visiit', visiitRouter);

app.listen(5214);