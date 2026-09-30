const dateFormatted = function(month=1){
	const timeNow = new Date();
	const dateNow = timeNow.getDate();
	const monthNow = timeNow.getMonth();
	const yearNow = timeNow.getFullYear();
	let monthNames = ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
	let monthNamesFolk = ["näärikuu", "küünlakuu", "paastukuu", "jürikuu", "lehekuu", "jaanikuu", "heinakuu", "lõikuskuu", "mihklikuu", "viinakuu", "talvekuu", "jõulukuu"];

	if(month == 0){
	return dateNow + ". " + monthNamesFolk[monthNow] + " " + yearNow;
	}
	else { 
		return dateNow + ". " + monthNames[monthNow] + " " + yearNow;
	}
}

const timeFormattedET = function(){
	const timeNow = new Date();
	let hourNow = timeNow.getHours();
	let minuteNow = timeNow.getMinutes();
	let secondNow = timeNow.getSeconds();
	if (hourNow < 10){
		hourNow = "0" + hourNow;
	}

	if (minuteNow < 10){
		minuteNow = "0" + minuteNow;
	}
	
	if (secondNow < 10){
		secondNow = "0" + secondNow;
	}

	return hourNow + ":" + minuteNow + ":" + secondNow;
}

const dayOfTheWeek = function(){
	const timeNow = new Date();
	const dayNow = timeNow.getDay();
	const dayNames = ["pühapäev", "esmaspäev", "teisipäev", "kolmapäev", "neljapäev", "reede", "laupäev"];
	return dayNames[dayNow];

}

function dayPart(){
	let hourNow = new Date().getHours();

		if (hourNow < 8){
			partOfDay = "öö";
		}
		if (hourNow >= 8 && hourNow < 11){
			partOfDay = "hommik";
		}
		if (hourNow >= 11 && hourNow < 14){
			partOfDay = "lõuna";
		}
		if (hourNow >= 14 && hourNow < 17){
			partOfDay = "pärastlõuna";
		}
		if (hourNow >= 17 && hourNow < 23){
			partOfDay = "õhtu";
		}
		if (hourNow >= 23){
			partOfDay = "öö";
		}
		return partOfDay;
	}

//ekspordin kõik vajalikud funktsioonid koos mugavamate nimedega
module.exports = {time: timeFormattedET, date: dateFormatted, day: dayOfTheWeek, daypart: dayPart};