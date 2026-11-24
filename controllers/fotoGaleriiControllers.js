const mysql = require('mysql2/promise');

//@desc page for the photo gallery opening page
//@route GET /fotoGalerii
//@access public to all users, private to non users

const fotoGaleriiHome = (req, res) => {
	res.redirect('/fotogalerii/1');
};

//@desc page for viewing the photo gallery
//@route GET /fotoGalerii/:page
//@access public to all users, private to non users

const fotoGaleriiVaade = async (req, res) => {
	let conn;
	let page = parseInt(req.params.page); //võtan lk väärtuse täisarvuna (int) parameetrist page
	const limit = 5; //SQLis limit-i taga esimene küsimärk
	let skip = 0; //SQLis limit-i taga teine küsimärk
	
	//kas lk väärtus on üldse arv ega ta liiga väike ole:
	if(page < 1 || isNaN(page)){
		page = 1;
	}
	
	try {
		const privacy = 2;
		conn = await mysql.createConnection({
			host: process.env.DB_HOST, 
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		//uurin, palju galeriisse sobivaid pilte on:
		let sqlReq = 'SELECT count (id) AS photos FROM galleryphotos WHERE privacy >= ? AND deleted IS NULL';
		const [countResult] = await conn.execute(sqlReq, [privacy]);
		const photoCount = countResult[0].photos;
		
		//kas lk nr on liiga suur?:
		if((page - 1) + limit >= photoCount){ //ma arvan, et peaks olema *, mitte +
			page = Math.max(1, Math.ceil(photoCount / limit)); //Math.ceil -> ümardab ülesse
		}
		
		//fikseerime, palju pilte tuleb vahele jätta:
		skip = (page - 1) * limit;
		
		sqlReq = 'SELECT id, filename, alttext FROM galleryphotos WHERE privacy >= ? AND deleted IS NULL LIMIT ?,?';
		
        const [galeriifotod] = await conn.execute(sqlReq, [privacy, limit, skip]);
		let photoData = [];
		for (let i = 0; i < galeriifotod.length; i ++){
			let altText = "Galeriipilt";
			if(galeriifotod[i].alttext != ""){
				altText = galeriifotod[i].alttext;
			}
			photoData.push({id: galeriifotod[i].id, src: galeriifotod[i].filename, alt: altText});
		}
		
		//nav lingid:
		let galeriiLingid;
		//tagasiliikumise link:
		if(page === 1){
			galleryLinks = 'Eelmine leht &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp; ';
		} else {
			galleryLinks = `<a href="/fotogalerii/${page - 1}">Eelmine leht</a> &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp; `
		}
		//järgmisele lehele liikumise link:
		if(page * limit >= photoCount){
			galleryLinks += 'Järgmine leht';
		} else {
			galleryLinks += `<a href="/fotogalerii/${page + 1}">Järgmine leht</a>`;
		}
		
		res.render('fotogalerii', { photoData: galeriifotod, imagehref: process.env.GALLERY_THUMBNAIL });
	}
	catch (err) {
		console.log('Viga galerii laadimisel: ' + err);
		galleryLinks = 'Eelmine leht &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp; Järgmine leht';
        res.render('fotogalerii', { photoData: [], imagehref: process.env.GALLERY_THUMBNAIL, links: galleryLinks});
	}
	finally {
		if(conn){
		await conn.end();
		}
	}
};

module.exports = {
	fotoGaleriiHome,
	fotoGaleriiVaade
};