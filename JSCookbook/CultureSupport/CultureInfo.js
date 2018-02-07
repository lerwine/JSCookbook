/**
 * @classDescription	Represents formatting information for a particular culture
 * @param {NumberFormatInfo} numberFormatInfoObj	Formatting configuration for general number values
 * @param {NumberFormatInfo} currencyFormatInfoObj	Formatting configuration for currency values
 * @param {NumberFormatInfo} percentFormatInfoObj	Formatting configuration for percentage values
 * @param {String} userLanguageStr	User language specification, which should be in the format of /\w{2}-\w{2}/
 * @param {String} englishNameStr	English name for culture configuration
 * @constructor
 */
function CultureInfo(numberFormatInfoObj, currencyFormatInfoObj, percentFormatInfoObj, userLanguageStr, englishNameStr) {
	var bClosestMatch = undefined;
	var fGetClosestMatch = function() {
		if (bClosestMatch === undefined)
			bClosestMatch = CultureInfo.__getClosestMatch__(numberFormatInfoObj, currencyFormatInfoObj, percentFormatInfoObj, userLanguageStr);
		
		return bClosestMatch;
	};
	
	this.setNumberFormatInfo((numberFormatInfoObj === undefined || numberFormatInfoObj === null) ? fGetClosestMatch().getNumberFormatInfo() : numberFormatInfoObj);
	this.setCurrencyFormatInfo((currencyFormatInfoObj === undefined || currencyFormatInfoObj === null) ? fGetClosestMatch().getCurrencyFormatInfo() : currencyFormatInfoObj);
	this.setPercentFormatInfo((percentFormatInfoObj === undefined || percentFormatInfoObj === null) ? fGetClosestMatch().getPercentFormatInfo() : percentFormatInfoObj);
	this.setUserLanguage((userLanguageStr === undefined || userLanguageStr === null) ? fGetClosestMatch().getUserLanguage() : userLanguageStr);
	this.setEnglishName(englishNameStr);
}
CultureInfo.prototype = new CultureInfo();
CultureInfo.prototype.constructor = CultureInfo;

CultureInfo.__knownCultures__ = new Array(
	// The first entry is used to obtain default values. It must not contain any undefined or null parameters, and the user language must be in the correct format (/\w{2,}-\w{2}/)
	new CultureInfo(NumberFormatInfo(".", ",", "", false), NumberFormatInfo(".", ",", "$", false), NumberFormatInfo(".", ",", "%", false), "en-US", "English (United States)"),
	new CultureInfo(NumberFormatInfo(".", ",", "", false), NumberFormatInfo(".", ",", "£", false), NumberFormatInfo(".", ",", "%", false), "en-GB", "English (United Kingdom)"),
	new CultureInfo(NumberFormatInfo(",", ".", "", true), NumberFormatInfo(",", ".", "€", true), NumberFormatInfo(",", ".", "%", true), "de-DE", "German (Germany)"),
	new CultureInfo(NumberFormatInfo(",", " ", "", false), NumberFormatInfo(",", ".", "kr", false), NumberFormatInfo(",", " ", "%", false), "sv-SE", "Swedish (Sweden)"),
	new CultureInfo(NumberFormatInfo(",", ".", "", false), NumberFormatInfo(",", ".", "YTL", false), NumberFormatInfo(",", ".", "%", false), "tr-TR", "Turkish (Turkey)"),
	new CultureInfo(NumberFormatInfo(".", ",", "", false), NumberFormatInfo(".", ",", "$", false), NumberFormatInfo(".", ",", "%", false), "mi-NZ", "Maori (New Zealand)"),
	new CultureInfo(NumberFormatInfo(",", " ", "", false), NumberFormatInfo(",", " ", "kr", false), NumberFormatInfo(",", " ", "%", false), "nb-NO", "Norwegian, Bokmål (Norway)"),
	new CultureInfo(NumberFormatInfo(".", ",", "", false), NumberFormatInfo(".", ",", "PhP", false), NumberFormatInfo(".", ",", "%", false), "fil-PH", "Filipino (Philippines)"),
	new CultureInfo(NumberFormatInfo(",", " ", "", false), NumberFormatInfo(",", " ", "zł", false), NumberFormatInfo(",", " ", "%", false), "pl-PL", "Polish (Poland)"),
	new CultureInfo(NumberFormatInfo(",", " ", "", false), NumberFormatInfo(",", " ", "р.", false), NumberFormatInfo(",", " ", "%", false), "ru-RU", "Russian (Russia)"),
	new CultureInfo(NumberFormatInfo(",", ".", "", false), NumberFormatInfo(",", ".", "kr.", false), NumberFormatInfo(",", ".", "%", false), "is-IS", "Icelandic (Iceland)"),
	new CultureInfo(NumberFormatInfo(".", ",", "", false), NumberFormatInfo(".", ",", "₪", false), NumberFormatInfo(".", ",", "%", false), "he-IL", "Hebrew (Israel)"),
	new CultureInfo(NumberFormatInfo(".", ",", "", false), NumberFormatInfo(".", ",", "¥", false), NumberFormatInfo(".", ",", "%", false), "ja-JP", "Japanese (Japan)"),
	new CultureInfo(NumberFormatInfo(",", " ", "", false), NumberFormatInfo(",", " ", "€", false), NumberFormatInfo(",", " ", "%", false), "fr-FR", "French (France)"),
	new CultureInfo(NumberFormatInfo(",", ".", "", false), NumberFormatInfo(",", ".", "€", false), NumberFormatInfo(",", ".", "%", false), "es-ES", "Spanish (Spain)"),
	new CultureInfo(NumberFormatInfo(".", ",", "", false), NumberFormatInfo(".", ",", "$", false), NumberFormatInfo(".", ",", "%", false), "es-MX", "Spanish (Mexico)"),
	new CultureInfo(NumberFormatInfo(",", ".", "", false), NumberFormatInfo(",", ".", "€", false), NumberFormatInfo(",", ".", "%", false), "de-AT", "German (Austria)"),
	new CultureInfo(NumberFormatInfo(",", ".", "", true), NumberFormatInfo(",", ".", "€", true), NumberFormatInfo(",", ".", "%", true), "pt-PT", "Portuguese (Portugal)"),
	new CultureInfo(NumberFormatInfo(".", ",", "", false), NumberFormatInfo(".", ",", "$", false), NumberFormatInfo(".", ",", "%", false), "en-AU", "English (Australia)"),
	new CultureInfo(NumberFormatInfo(",", ".", "", false), NumberFormatInfo(",", ".", "€", false), NumberFormatInfo(",", ".", "%", false), "fr-BE", "French (Belgium)"),
	new CultureInfo(NumberFormatInfo(",", ".", "", false), NumberFormatInfo(",", ".", "R$", false), NumberFormatInfo(",", ".", "%", false), "pt-BR", "Portuguese (Brazil)"),
	new CultureInfo(NumberFormatInfo(",", " ", "", true), NumberFormatInfo(",", " ", "$", true), NumberFormatInfo(",", " ", "%", true), "fr-CA", "French (Canada)"),
	new CultureInfo(NumberFormatInfo(",", " ", "", false), NumberFormatInfo(",", " ", "Kč", false), NumberFormatInfo(",", " ", "%", false), "cs-CZ", "Czech (Czech Republic)"),
	new CultureInfo(NumberFormatInfo(",", ".", "", false), NumberFormatInfo(",", ".", "kr", false), NumberFormatInfo(",", ".", "%", false), "da-DK", "Danish (Denmark)"),
	new CultureInfo(NumberFormatInfo(",", " ", "", true), NumberFormatInfo(",", " ", "€", true), NumberFormatInfo(",", " ", "%", true), "fi-FI", "Finnish (Finland)"),
	new CultureInfo(NumberFormatInfo(",", ".", "", true), NumberFormatInfo(",", ".", "€", true), NumberFormatInfo(",", ".", "%", true), "el-GR", "Greek (Greece)"),
	new CultureInfo(NumberFormatInfo(".", ",", "", false), NumberFormatInfo(".", ",", "रु", false), NumberFormatInfo(".", ",", "%", false), "hi-IN", "Hindi (India)"),
	new CultureInfo(NumberFormatInfo(".", ",", "", false), NumberFormatInfo(".", ",", "€", false), NumberFormatInfo(".", ",", "%", false), "ga-IE", "Irish (Ireland)"),
	new CultureInfo(NumberFormatInfo(",", ".", "", false), NumberFormatInfo(",", ".", "€", false), NumberFormatInfo(",", ".", "%", false), "it-IT", "Italian (Italy)"),
	new CultureInfo(NumberFormatInfo(",", ".", "", false), NumberFormatInfo(",", ".", "€", false), NumberFormatInfo(",", ".", "%", false), "nl-NL", "Dutch (Netherlands)")
);
CultureInfo.__defaultValue__ = undefined;
CultureInfo.addKnownCulture = function(cultureInfoObj) {
	if (cultureInfoObj === undefined || cultureInfoObj === null || typeof(cultureInfoObj) != 'object' || !(cultureInfoObj instanceof CultureInfo))
		throw "Only objects of type 'CultureInfo' are supported.";
	
	CultureInfo.__knownCultures__.push(cultureInfoObj);
};
CultureInfo.__getClosestMatch__ = function(numberFormatInfoObj, currencyFormatInfoObj, percentFormatInfoObj, userLanguageStr, decimalSeparatorStr) {
	if (numberFormatInfoObj !== undefined && numberFormatInfoObj !== null && (typeof(numberFormatInfoObj) != 'object' && !(numberFormatInfoObj instanceof NumberFormatInfo)))
		throw "If numberFormatInfoObj is defined, it must be NumberFormatInfo object";
	if (currencyFormatInfoObj !== undefined && currencyFormatInfoObj !== null && (typeof(currencyFormatInfoObj) != 'object' && !(currencyFormatInfoObj instanceof NumberFormatInfo)))
		throw "If currencyFormatInfoObj is defined, it must be NumberFormatInfo object";
	if (percentFormatInfoObj !== undefined && percentFormatInfoObj !== null && (typeof(percentFormatInfoObj) != 'object' && !(percentFormatInfoObj instanceof NumberFormatInfo)))
		throw "If percentFormatInfoObj is defined, it must be NumberFormatInfo object";
	
	var ratedItems = CultureInfo.__knownCultures__.map(function(item) {
		var rating = 0;
		if (this.numberFormatInfoObj !== undefined && this.numberFormatInfoObj !== null)
			rating += item.getNumberFormatInfo().getSimilarityRating(this.numberFormatInfoObj);
		if (this.currencyFormatInfoObj !== undefined && this.currencyFormatInfoObj !== null)
			rating += item.getCurrencyFormatInfo().getSimilarityRating(this.currencyFormatInfoObj);
		if (this.percentFormatInfoObj !== undefined && this.percentFormatInfoObj !== null)
			rating += item.getPercentFormatInfo().getSimilarityRating(this.percentFormatInfoObj);
		if (this.languageCode !== undefined && this.languageCode !== null && this.languageCode.toLowerCase() == CultureInfo.getLanguageCode(item.getUserLanguage()).toLowerCase(), '')
			rating += 3;
		if (this.countryCode !== undefined && this.countryCode !== null && this.countryCode.toLowerCase() == CultureInfo.getCountryCode(item.getUserLanguage()).toLowerCase(), '')
			rating += 7;
		if (this.decimalSeparator !== undefined && this.decimalSeparator !== null) {
			if (this.decimalSeparator == item.getNumberFormatInfo().getDecimalSeparator())
				rating += 0.5;
			if (this.decimalSeparator == item.getCurrencyFormatInfo().getDecimalSeparator())
				rating += 0.25;
			if (this.decimalSeparator == item.getPercentFormatInfo().getDecimalSeparator())
				rating += 0.25;
		}
		
		return { Rating: rating, Item: item };
	}, {
		numberFormatInfoObj: numberFormatInfoObj,
		currencyFormatInfoObj: currencyFormatInfoObj,
		percentFormatInfoObj: percentFormatInfoObj,
		languageCode: CultureInfo.getLanguageCode(userLanguageStr, null),
		countryCode: CultureInfo.getCountryCode(userLanguageStr, null),
		decimalSeparator: (decimalSeparatorStr === undefined || decimalSeparatorStr === null) ? undefined : ((typeof(decimalSeparatorStr) === 'string') ? decimalSeparatorStr : String(decimalSeparatorStr))
	});];
		
	var sortFn = function(a, b) {
		if (a.Rating < b.Rating)
			return -1;
		return (a.Rating > b.Rating) ? 1 : 0;
	};
	ratedItems.sort(sortFn);
	
	return ratedItems[0];
};
/**
 * Get closest matching known CultureInfo object
 * @param {NumberFormatInfo} numberFormatInfoObj	General number value configuration to match
 * @param {NumberFormatInfo} currencyFormatInfoObj	Currency value configuration to match
 * @param {NumberFormatInfo} percentFormatInfoObj	Percentage value configuration to match
 * @param {String} userLanguageStr	User language specification to match
 * @param {String} decimalSeparatorStr	Decimal separator string to match
 * @return {CultureInfo}	Closest matching known CultureInfo object
 */
 CultureInfo.getClosestMatchFull = function(numberFormatInfoObj, currencyFormatInfoObj, percentFormatInfoObj, userLanguageStr, decimalSeparatorStr) {
	var obj = CultureInfo.__getClosestMatch__(numberFormatInfoObj, currencyFormatInfoObj, percentFormatInfoObj, userLanguageStr, decimalSeparatorStr);
	return new CultureInfo(obj.getNumberFormatInfo(), obj.getCurrencyFormatInfo(), obj.getPercentFormatInfo(), obj.getUserLanguage());
};
/**
 * Get closest matching known CultureInfo object
 * @param {String} userLanguageStr	User language specification to match
 * @param {String} decimalSeparatorStr	Decimal separator string to match
 * @return {CultureInfo}	Closest matching known CultureInfo object
 */
CultureInfo.getClosestMatch = function(userLanguageStr, decimalSeparatorStr) {
	return CultureInfo.getClosestMatchFull(undefined, undefined, undefined, undefined, undefined, userLanguageStr, decimalSeparatorStr);
};
CultureInfo.getLanguageCode = function(userLanguage, defaultValue) {
	var s = (userLanguage === undefined || userLanguage === null) ? ((navigator && navigator.userLanguage) ? ((typeof(navigator.userLanguage) == 'string') ? navigator.userLanguage : 
		String(navigator.userLanguage)) : "") : ((typeof(userLanguage) == 'string') ? userLanguage : String(userLanguage));
	
	if (s.trim().length == 0 || s.substr(0, 1) == '-') {
		if (defaultValue !== undefined)
			return defaultValue;
		s = CultureInfo.__knownCultures__[0].getUserLanguage();
	}
	
	var i = s.indexOf("-");
	
	return (i < 0) ? s : s.substr(0, i);
};
CultureInfo.getCountryCode = function(userLanguage, defaultValue) {
	var s = (userLanguage === undefined || userLanguage === null) ? ((navigator && navigator.userLanguage) ? ((typeof(navigator.userLanguage) == 'string') ? navigator.userLanguage : 
		String(navigator.userLanguage)) : "") : ((typeof(userLanguage) == 'string') ? userLanguage : String(userLanguage));
	
	var i;
	if (s.trim().length == 0 || s.substr(0, s.length - 1) == '-' || (i = s.indexOf("-")) < 0) {
		if (defaultValue !== undefined)
			return defaultValue;
		s = CultureInfo.__knownCultures__[0].getUserLanguage();
		i = s.indexOf("-");
	}
		
	return s.substr(i + 1);
};
CultureInfo.getValidatedUserLanguage(userLanguage, defaultLanguageCode, defaultCountryCode) {
	var vDefaultLanguageCode = (defaultLanguageCode === undefined || defaultLanguageCode === null) ? "" : ((typeof(defaultLanguageCode) === 'string') ? defaultLanguageCode : String(defaultLanguageCode));
	if (vDefaultLanguageCode.length == 0)
		vDefaultLanguageCode = CultureInfo.getLanguageCode(CultureInfo.__knownCultures__[0].getUserLanguage());
	var vDefaultCountryCode = (defaultCountryCode === undefined || defaultCountryCode === null) ? "" : ((typeof(defaultCountryCode) === 'string') ? defaultCountryCode : String(defaultCountryCode));
	if (vDefaultCountryCode.length == 0)
		vDefaultCountryCode = CultureInfo.getCountryCode(CultureInfo.__knownCultures__[0].getUserLanguage());
		
	var vUserLanguage = (userLanguage === undefined || userLanguage === null) ? "" : ((typeof(userLanguage) === 'string') ? userLanguage : String(userLanguage));
	vUserLanguage.length == 0)
		return vDefaultLanguageCode + "-" + vDefaultCountryCode;
	
	return CultureInfo.getLanguageCode(vUserLanguage, vDefaultLanguageCode) + CultureInfo.getCountryCode(vUserLanguage, vDefaultCountryCode);
};
CultureInfo.__getDefaultCulture__ = function() {
	if (CultureInfo.__defaultValue__ === undefined) {
		var decimalSeparatorStr = (1.1).toLocaleString().substr(1, 1);
		var userLanguage = CultureInfo.getValidatedUserLanguage();
		CultureInfo.__defaultValue__ = CultureInfo.getClosestMatch(userLanguage, decimalSeparatorStr);
		CultureInfo.__defaultValue__.setUserLanguage(userLanguage);
			
		try {
			CultureInfo.__defaultValue__.getNumberFormatInfo().setDecimalSeparator(decimalSeparatorStr);
		} catch (e) { }
	}
	
	return CultureInfo.__defaultValue__;
};
CultureInfo.getDefaultCulture = function() {
	var obj = CultureInfo.__getDefaultCulture__();
	return new CultureInfo(obj.getNumberFormatInfo(), obj.getCurrencyFormatInfo(), obj.getPercentFormatInfo(), obj.getUserLanguage());
};
CultureInfo.prototype.getNumberFormatInfo = function() {
	return this.__numberFormatInfo__;
};
CultureInfo.prototype.getCurrencyFormatInfo = function() {
	return this.__currencyFormatInfo__;
};
CultureInfo.prototype.getPercentFormatInfo = function() {
	return this.__percentFormatInfo__;
};
CultureInfo.prototype.getUserLanguage = function() {
	return this.__userLanguage__;
};
CultureInfo.prototype.getEnglishName = function() {
	return this.__englishName__;
};
CultureInfo.prototype.setNumberFormatInfo = function(objNumberFormatInfo) {
	if (objNumberFormatInfo === null || objNumberFormatInfo === undefined)
		this.__numberFormatInfo__ = CultureInfo.getClosestMatch(undefined, this.getCurrencyFormatInfo(), this.getPercentFormatInfo(), this.getUserLanguage()).getNumberFormatInfo();
	else {
		if (typeof(objNumberFormatInfo) != 'object' || !(objNumberFormatInfo instanceof NumberFormatInfo))
			throw 'Only NumberFormatInfo types are supported by this method';
			
		this.__numberFormatInfo__ = objNumberFormatInfo;
	}
};
CultureInfo.prototype.setCurrencyFormatInfo = function(objNumberFormatInfo) {
	if (objNumberFormatInfo === null || objNumberFormatInfo === undefined)
		this.__currencyFormatInfo__ = CultureInfo.getClosestMatch(this.getNumberFormatInfo(), undefined, this.getPercentFormatInfo(), this.getUserLanguage()).getCurrencyFormatInfo();
	else {
		if (typeof(objNumberFormatInfo) != 'object' || !(objNumberFormatInfo instanceof NumberFormatInfo))
			throw 'Only NumberFormatInfo types are supported by this method';
			
		this.__currencyFormatInfo__ = objNumberFormatInfo;
	}
};
CultureInfo.prototype.setPercentFormatInfo = function(objNumberFormatInfo) {
	if (objNumberFormatInfo === null || objNumberFormatInfo === undefined)
		this.__percentFormatInfo__ = CultureInfo.getClosestMatch(this.getNumberFormatInfo(), this.getCurrencyFormatInfo(), undefined, this.getUserLanguage()).getPercentFormatInfo();
	else {
		if (typeof(objNumberFormatInfo) != 'object' || !(objNumberFormatInfo instanceof NumberFormatInfo))
			throw 'Only NumberFormatInfo types are supported by this method';
			
		this.__percentFormatInfo__ = objNumberFormatInfo;
	}
};
CultureInfo.prototype.setUserLanguage = function(sValue) {
	if (sValue === null || sValue === undefined)
		this.__userLanguage__ = CultureInfo.getClosestMatch(this.getNumberFormatInfo(), this.getCurrencyFormatInfo(), this.getPercentFormatInfo()).getUserLanguage();
	else
		this.__userLanguage__ = (typeof(sValue) == 'string') ? sValue :  String(sValue);
};
CultureInfo.prototype.setEnglishName = function(sValue) {
	if (sValue === null || sValue === undefined)
		this.__englishName__ = "(undefined)";
	else
		this.__englishName__ = (typeof(sValue) == 'string') ? sValue :  String(sValue);
};