const express = require('express');
const dateTimeET = require('./src/dateTimeET');
const vanasonad = require('./src/vanasonad');
const visits = require('./src/lastvisits');
const fs = require('fs').promises;
const bodyparser = require('body-parser');

//moodul andmebaasiga suhtlemiseks (koos async ehk ootamise osaga)
const mysql = require('mysql2/promise');
const { read } = require('fs');
//moodul .env keskkonnamuutujate lugemiseks
require('dotenv').config();

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

app.get('/eestifilm', (req, res)=>{
	res.render('eestifilm');
});

app.get('/eestifilm/inimesed', async(req, res)=>{
	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST, 
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		//defineerime SQL päringu
		let sqlReq = 'SELECT * FROM person';
		const [sqlRes] = await conn.execute(sqlReq);
		//console.log(sqlRes);
		res.render('eestifilminimesed', {personList: sqlRes});
	}
	catch (err) {
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		res.render('eestifilminimesed', {personlist: []});
	}
	finally {
		if(conn){}
		await conn.end();
	}
});

app.get('/eestifilm/inimesed_lisa', (req, res)=>{
	res.render('eestifilminimesed_lisa', {
		firstName: '',
		lastName: '',
		born: '',
		deceased: '',
		notice: 'Ootan sisestust!'
	});
});

app.post('/eestifilm/inimesed_lisa', async(req, res)=>{
	console.log(req.body);
	//kontrollime andmeid
	//sisestatud sünnikuupäev (tekst) teisendada kuupäevaks
	const bornDate = new Date(req.body.bornInput);
	const timeNow = new Date();

	let errors = [];
	if(!req.body.bornInput || isNaN(bornDate.getTime()) || bornDate > timeNow){
		errors.push("Sünnikuupäev pole korrektne!");
	}

	if (!req.body.firstNameInput){
		errors.push("Eesnimi pole korrektne!");
	}

	if (!req.body.lastNameInput){
		errors.push("Perekonnanimi pole korrektne!");
	}

	let deceasedDate = new Date(req.body.deceasedInput);

	if(
		req.body.deceasedInput != '' &&
		(
			!isNaN(deceasedDate.getTime()) ||
			deceasedDate > timeNow ||
			deceasedDate < bornDate
		)
	){
		errors.push("Surmakuupäev ei ole korrektne!");
	}

	if (errors.length != 0) {
		return res.render('eestifilminimesed_lisa', {
			firstName: req.body.firstNameInput,
			lastName: req.body.lastNameInput,
			born: req.body.bornInput,
			deceased: req.body.deceasedInput,
			notice: errors.join("\n"),
		});	
	}
	let conn;
	try {
	conn = await mysql.createConnection({
			host: process.env.DB_HOST, 
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		let sqlReq = 'INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)';
		if (req.body.deceasedInput != "" && deceasedDate) {
			await conn.execute(sqlReq, [
				req.body.firstNameInput, 
				req.body.lastNameInput,
				req.body.bornInput,
				req.body.deceasedInput 
			]);
		} else {
			await conn.execute(sqlReq, [
				req.body.firstNameInput, 
				req.body.lastNameInput,
				req.body.bornInput,
				null 
			]);
		}
		res.render('eestifilminimesed_lisa', {notice: req.body.firstNameInput + ' ' + req.body.lastNameInput + ' ' + 'on andmebaasi lisatud!'});
	}
	catch (err) {
	console.log('Viga andmebaasiga suhtlemisel: ' + err);
	res.render('eestifilminimesed_lisa', {notice: 'Tekkis viga, midagi ei salvestatud!'});
	}

	finally {
		if(conn){
			await conn.end();
		}
	}

});



app.get('/eestifilm/movie_lisa', (req, res)=>{
	res.render('movie_lisa', {notice: 'Ootan sisestust!'});
});

app.post('/eestifilm/movie_lisa', async(req, res)=>{
	let durationMinutesInput = (parseInt(req.body.durationHourInput) * 60) + parseInt(req.body.durationMinutesInput);
	let conn;
	try {
	conn = await mysql.createConnection({
			host: process.env.DB_HOST, 
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		let sqlReq = 'INSERT INTO movie (title, release_year, duration_minutes, description) VALUES (?,?,?,?)';
		await conn.execute(sqlReq, [
			req.body.titleInput, 
			req.body.releaseYearInput,
			durationMinutesInput,
			req.body.descriptionInput
		]);
		res.render('movie_lisa', {notice: req.body.titleInput + ' on andmebaasi lisatud!'});
	}
	catch (err) {
	console.log('Viga andmebaasiga suhtlemisel: ' + err);
	res.render('movie_lisa', {notice: 'Tekkis viga, midagi ei salvestatud!'});
	}

	finally {
		if(conn){
			await conn.end();
		}
	}
});

app.get('/eestifilm/amet_lisa', (req, res)=>{
	res.render('amet_lisa', {notice: 'Ootan sisestust!'});
});

app.post('/eestifilm/amet_lisa', async(req, res)=>{
	let conn;
	try {
	conn = await mysql.createConnection({
			host: process.env.DB_HOST, 
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		let sqlReq = 'INSERT INTO profession (title, description) VALUES (?,?)';
		await conn.execute(sqlReq, [
			req.body.professionInput,
			req.body.descriptionInput
		]);
		res.render('amet_lisa', {notice: req.body.professionInput + ' on andmebaasi lisatud!'});
	}
	catch (err) {
	console.log('Viga andmebaasiga suhtlemisel: ' + err);
	res.render('amet_lisa', {notice: 'Tekkis viga, midagi ei salvestatud!'});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
});

app.listen(5214);