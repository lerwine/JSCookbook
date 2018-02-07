Date.__monthNames__ = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
/**
 * Get name for month
 * @return {String}	Full name of month
 */
Date.prototype.getMonthName = function() {
	return Date.__monthNames__[this.getMonth()];
}
Date.__dayNames__ = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
/**
 * Get name of the day of the week
 * @return {String}	Full name of day of wweek
 */
Date.prototype.getDayName = function() {
	return Date.__dayNames__[this.getDay()];
}
Date.__ordinalValues__ = new Array("th", "st", "nd", "rd");
/**
 * Get ordinal for the date of the month ('st', 'nd', 'rd', or 'th')
 * @return {String}	Ordinal for the date of month
 */
Date.prototype.getDateOrdinal = function() {
	var d = this.getDate();
	if (d > 30)
		d -= 30;
	else if (d > 20)
		d -= 20;
	
	if (d > 3)
		d = 0;
	return Date.__ordinalValues__[d];
}
/**
 * Get hour value for AM/PM based display
 * @return {String}	Hour value for AM/PM based display
 */
Date.prototype.getAmPmBasedHour = function() {
	var h = this.getHours();
	if (h == 0)
		return 12;
	
	if (h < 12)
		return h;
	
	return h - 12;
}
/**
 * Get AM/PM string for the time of day
 * @return {String}	AM/PM string for the time of day
 */
Date.prototype.getAmPmString = function(isUpperCase) {
	var h = this.getHours();
	
	if (h < 12)
	{
		if (isUpperCase)
			return "AM";
		
		return "am";
	}
	
	if (isUpperCase)
		return "PM";
	
	return "pm";
}

/**
 * Returns date and/or time string based upon a format string
 * @return {String}	Formatted date and/or time string
 * @remarks	Specific letters are used to represent certain components of the date or time. Any unrecognized letters are passed through intact.
 *			Recognized letters are as follows:
 *			y, yy, yyy and yyyy = Year: Number of consecutive y's indicate number of year digits to return
 *			M and MM = Month number: 2 consecutive M's indicate a zero-padded month number.
 *			MMM = Abbreviated month name
 *			MMMM = Full month name
 *			d and dd = Day of month
 *			o = Ordinal ('st', 'nd', 'rd', 'th') for day of month
 *			w = Day of week
 *			ww or www = Abbreviated weekday name
 *			wwww = Full weekday name
 *			H and HH = 24-hour value: 2 consecutive H's indicate a zero-padded hour value
 *			h and hh = 12-hour value: 2 consecutive h's indicate a zero-padded hour value
 *			m and mm = Minutes value: 2 consecutive m's indicate a zero-padded minute value
 *			s and ss = Minutes value: 2 consecutive s's indicate a zero-padded minute value
 *			i, ii and iii = Milliseconds value: Number of consecutive i's indicate number of millisecond digits to return
 *			a and aa = am/pm value to return: Number of consecutive a's  represent the number of am or pm characters to return
 *			A and AA = AM/PM value to return: Number of consecutive a's  represent the number of AM or PM characters to return
 */
Date.prototype.formatString = function(formatStr) {
	var re = /^([^\\]*)(\\.)(.*)$/;
	var result = '';
	var remainingString = formatStr;
	var rr = re.exec(remainingString);
	while (rr != null) {
		if (rr[1].length > 0)
			result += this.formatString(rr[1]);
		result += rr[2].substring(1);
		var remainingString = rr[3];
		rr = re.exec(remainingString);
	}
	
	re = /^([^yMdowHhmsiaA]*)(y+|M+|d+|o+|w+|H+|h+|m+|s+|i+|a+|A+)(.*?)$/;
	rr = re.exec(remainingString);
	while (rr != null) {
		if (rr[1].length > 0)
			result += rr[1];
		var textVal;
		var nChars = rr[2].length;
		var fromLeft = true;
		
		switch (rr[2].substring(0, 1)) {
			case 'y':
				textVal = this.getYear();
				fromLeft = false;
				break;
			case 'M':
				if (nChars < 3)
					textVal = this.getMonth();
				else {
					textVal = this.getMonthName();
					if (nChars > 3)
						nChars = 1;
				}
				break;
			case 'd':
				textVal = this.getDate();
				break;
			case 'w':
				if (nChars == 1)
					textVal = this.getDay();
				else {
					textVal = this.getDayName();
					if (nChars < 4)
						nChars = 3;
					else
						nChars = 1;
				}
				break;
			case 'o':
				textVal = this.getDateOrdinal();
				nChars = 1;
				break;
			case 'H':
				textVal = this.getHours();
				break;
			case 'h':
				textVal = this.getAmPmBasedHour();
				break;
			case 'm':
				textVal = this.getMinutes();
				break;
			case 's':
				textVal = this.getSeconds();
				break;
			case 'i':
				textVal = this.getMilliseconds();
				break;
			case 'a':
				textVal = this.getAmPmString(false);
				if (nChars > 2)
					nChars = 2;
				break;
			case 'A':
				textVal = this.getAmPmString(true);
				if (nChars > 2)
					nChars = 2;
				break;
		}
		
		var textVal = textVal.toString();
		
		if (nChars == 1)
			result += textVal;
		else if (textVal.length > nChars) {
			if (fromLeft)
				result += textVal.substring(0, nChars);
			else
				result += textVal.substring(textVal.length - nChars);
		} else {
			for (var i = textVal.length; i < nChars; i++)
				result += '0';
			result += textVal;
		}
		
		remainingString = rr[3];
		rr = re.exec(remainingString);
	}
	
	result = result + remainingString;
	
	return result;
}