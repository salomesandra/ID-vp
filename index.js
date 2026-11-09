const express = require('express');
const dateTimeET = require('./src/dateTimeET');
const vanasonad = require('./src/vanasonad');
const bodyparser = require('body-parser');


//moodul andmebaasiga suhtlemiseks (koos async ehk ootamise osaga)
const mysql = require('mysql2/promise');
const {read} = require('fs');
//moodul .env keskkonnamuutujate lugemiseks
require('dotenv').config();

//käivitan funktsiooni express() ja annan nimeks app
const app = express();

//määrame renderusmootori: EJS
app.set('view engine', 'ejs');

//määrame avalikuna kasutatava kataloogi
app.use(express.static('Public'));

//määrame vormide sisu parsimise, kui false, siis ainult tekst
app.use(bodyparser.urlencoded({extended: true}));

//marsruudid
app.get('/', async(req, res)=>{
	const dayNow = dateTimeET.day();
	const dateNow = dateTimeET.date(1);
	const timeNow = dateTimeET.time();
	const dayPart = dateTimeET.daypart();
	let conn;
	try {
		let sqlReq = 'SELECT filename, alttext FROM galleryphotos WHERE id=(SELECT MAX(id) FROM galleryphotos WHERE privacy=3 AND deleted IS NULL)';

		conn = await mysql.createConnection({
			host: process.env.DB_HOST, 
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		const [result] = await conn.execute(sqlReq);
		let img = result[0];
		if (img.alttext == '') {
			img.alttext = 'Uusim avalik foto, lisatud kell ' + timeNow
		}
		//console.log(result);
		res.render('index', {
			dayNow: dayNow,
			dateNow: dateNow,
			timeNow: timeNow,
			dayPart: dayPart,
			image: img
		});
	}
	catch (err) {
		console.log('Viga: ' + err);
		res.render('index', {dayNow: dayNow, dateNow: dateNow, timeNow: timeNow, dayPart: dayPart, img: {} });
	}
	finally {
		if(conn){}
		await conn.end();
	}
	
});


//sisseloginud kasutajate avaleht
app.get('/home', async(req, res) => {
	let conn;
	try {
		let sqlReq = 'SELECT filename, alttext FROM galleryphotos WHERE id=(SELECT MAX(id) FROM galleryphotos WHERE privacy=3 AND deleted IS NULL)';

		conn = await mysql.createConnection({
			host: process.env.DB_HOST, 
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		const [result] = await conn.execute(sqlReq);
		let img = result[0];
		if (img.alttext == '') {
			img.alttext = 'Uusim avalik foto, lisatud kell ' + timeNow
		}
		res.render('home', {image: img});
	} catch (err) {
		console.log('Viga: ' + err);
		res.render('home', {img: {} });
	}
	finally {
		if(conn){}
		await conn.end();
	}
});

//väljalogimine
app.get('/logout', (req, res) => {
	res.redirect('/');
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

//galeriipiltide üleslaadimine
const galleryPhotoUploadRouter = require('./routes/galleryPhotoUploadRoutes');
app.use('/galleryPhotoUpload', galleryPhotoUploadRouter);

const fotoGaleriiRouter = require('./routes/fotoGaleriiRoutes');
app.use('/fotogalerii', fotoGaleriiRouter);


//Kasutajakonto loomine
const signupRouter = require('./routes/signupRoutes');
app.use('/signup', signupRouter);

//Sisselogimine
const signinRouter = require('./routes/signinRoutes');
app.use('/signin', signinRouter);

app.listen(5214);