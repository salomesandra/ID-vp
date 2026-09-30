const fs = require('fs').promises;
const textRef = "Public/txt/vanasonad.txt";

function showText(rawText){
	let folkWisdom = rawText.split(";");
	return folkWisdom[Math.round(Math.random () * (folkWisdom.length - 1))];
}

async function readTextFile(){
	try {
		const data = await fs.readFile(textRef);
		return showText(data.toString());
	} catch(err) {
		console.log("Viga: ", err)
	}
}

module.exports = {vanasonad: readTextFile};
