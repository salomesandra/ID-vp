const fs = require('fs').promises;
const textRef = "Public/txt/visits.txt";

function showText(rawText){
	let visits = rawText.split(";");
	return visits[visits.length - 2];
}

async function readTextFile(){
	try {
		const data = await fs.readFile(textRef);
		return showText(data.toString());
	} catch(err) {
		console.log("Viga: ", err)
	}
}

module.exports = {visits: readTextFile};
