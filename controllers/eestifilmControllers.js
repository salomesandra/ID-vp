const mysql = require('mysql2/promise');

//@desc home page for Estonian Film section
//@route GET /eestifilm
//@access public

//app.get('/eestifilm', (req, res)=>{
const eestifilm = (req, res) => {
	res.render('eestifilm');
};

//@desc home page for people involved in the Estonian Film industry
//@route GET /eestifilm/inimesed
//@access public

//app.get('/eestifilm/inimesed', async(req, res)=>{
const inimesed = async(req, res) => {
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
};

//@desc home page for adding people involved in the Estonian Film industry
//@route GET /eestifilm/inimesed_lisa
//@access public

//app.get('/eestifilm/inimesed_lisa', (req, res)=>{
const inimesedAdd = async(req, res) => {
	res.render('eestifilminimesed_lisa', {
		firstName: '',
		lastName: '',
		born: '',
		deceased: '',
		notice: 'Ootan sisestust!'
	});
};

//@desc home page for adding people involved in the Estonian Film industry
//@route POST /eestifilm/inimesed_lisa
//@access public

//app.post('/eestifilm/inimesed_lisa', async(req, res)=>{
const inimesedAddPost = async(req, res) => {
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

};


//@desc home page for adding Estonian films
//@route GET /eestifilm/movie_lisa
//@access public

//app.get('/eestifilm/movie_lisa', (req, res)=>{
const movieAdd = async(req, res) => {
	res.render('movie_lisa', {notice: 'Ootan sisestust!'});
};

//@desc home page for adding Estonian films
//@route POST /eestifilm/movie_lisa
//@access public

//app.post('/eestifilm/movie_lisa', async(req, res)=>{
const movieAddPost = async(req, res) => {
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
};

//@desc home page for adding professions related to the Estonian film industry
//@route GET /eestifilm/amet_lisa
//@access public

//app.get('/eestifilm/amet_lisa', (req, res)=>{
const ametAdd = async(req, res) => {
	res.render('amet_lisa', {notice: 'Ootan sisestust!'});
};

//@desc home page for adding professions related to the Estonian film industry
//@route POST /eestifilm/amet_lisa
//@access public

//app.post('/eestifilm/amet_lisa', async(req, res)=>{
const ametAddPost = async(req, res) => {
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
};

//@desc home page for adding connections
//@route GET /eestifilm/seosed
//@access public

const seosedAdd = async(req, res) => {
	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST, 
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		//defineerime SQL päringu
		let sqlReqPerson = 'SELECT * FROM person';
		let sqlReqMovie = 'SELECT * FROM movie';
		let sqlReqProfession = 'SELECT * FROM profession';

		const [sqlResPerson] = await conn.execute(sqlReqPerson);
		const [sqlResMovie] = await conn.execute(sqlReqMovie);
		const [sqlResProfession] = await conn.execute(sqlReqProfession);
		
		res.render('seosed', {
			personList: sqlResPerson,
			movieList: sqlResMovie,
			professionList: sqlResProfession,
			notice: ""
		});
	}
	catch (err) {
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		res.render('eestifilminimesed', {personlist: []});
	}
	finally {
		if(conn){}
		await conn.end();
	}
};

const seosedAddPost = async(req, res) => {
	let conn;
	try {
		console.log(req.body)

		const inimesedID = parseInt(req.body.inimesed);
		const movieID = parseInt(req.body.movie);
		const professionID = parseInt(req.body.profession);
		const characterName = req.body.characterName;

		conn = await mysql.createConnection({
			host: process.env.DB_HOST, 
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		let sqlReqPersonInMovie = 'INSERT INTO person_in_movie (character_name, person_id, movie_id, profession_id) VALUES (?,?,?,?)';

		await conn.execute(sqlReqPersonInMovie, [
			characterName,
			inimesedID,
			movieID,
			professionID
		]);

		//defineerime SQL päringu
		let sqlReqPerson = 'SELECT * FROM person';
		let sqlReqMovie = 'SELECT * FROM movie';
		let sqlReqProfession = 'SELECT * FROM profession';

		const [sqlResPerson] = await conn.execute(sqlReqPerson);
		const [sqlResMovie] = await conn.execute(sqlReqMovie);
		const [sqlResProfession] = await conn.execute(sqlReqProfession);

		res.render('seosed', {personList: sqlResPerson, movieList: sqlResMovie, professionList: sqlResProfession, notice: "Seos loodud!"});
	}
	catch (err) {
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		res.render('eestifilminimesed', {personlist: [], notice: "Error"});
	}
	finally {
		if(conn){}
		await conn.end();
	}
};

//@desc home page for seeing connections related to the Estonian Film industry
//@route GET /eestifilm/seosteinfo
//@access public

//app.get('/eestifilm/seosteinfo', async(req, res)=>{
const seosteInfo = async(req, res) => {
	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST, 
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		//defineerime SQL päringu
		let sqlReqPersonInMovie = 'SELECT * FROM person_in_movie';
		let sqlReqMovie = 'SELECT * FROM movie';
		let sqlReqPerson = 'SELECT * FROM person';
		let sqlReqProfession = 'SELECT * FROM profession';
		const [ sqlResPersonInMovie ] = await conn.execute(sqlReqPersonInMovie);
		const [ sqlResMovie ] = await conn.execute(sqlReqMovie);
		const [ sqlResPerson ] = await conn.execute(sqlReqPerson);
		const [ sqlResProfession ] = await conn.execute(sqlReqProfession);
	
		res.render('seostefail', {
			personInMovieList: sqlResPersonInMovie,
			movie: sqlResMovie,
			person: sqlResPerson,
			profession: sqlResProfession
		});
	}
	catch (err) {
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		res.render('seostefail', {
			personInMovieList: []
		});
	}
	finally {
		if(conn){}
		await conn.end();
	}
};


module.exports = {
	eestifilm,
	inimesed,
	inimesedAdd,
	inimesedAddPost,
	movieAdd,
	movieAddPost,
	ametAdd,
	ametAddPost,
	seosedAdd,
	seosedAddPost,
	seosteInfo
};