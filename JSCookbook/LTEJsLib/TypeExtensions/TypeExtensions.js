/**
 * @classDescription	Represents an error with an optional inner error
 * @param {Number} errNumber	An error number
 * @param {String} descriptionText	Text describing error
 * @param {Object} innerErrorObj	Inner error
 * @constructor
 */
function NestedError(errNumber, descriptionText, innerErrorObj) {
	Error.call(this, (errNumber === undefined) ? NestedError.prototype.number : errNumber, (descriptionText === undefined) ? "Unexpected Error" : descriptionText);
	this.innerError = innerErrorObj;
}
NestedError.prototype = new Error();
NestedError.prototype.constructor = NestedError;

/**
 * @classDescription	Represents a formatting error
 * @param {Number} errNumber	An error number
 * @param {String} descriptionText	Text describing error
 * @param {String} ctxFormatString	Copy of formatted string in which error occurred
 * @param {Number} ctxPosition	Position at which which error occurred
 * @param {Object} innerErrorObj	Inner error
 * @constructor
 */
function FormatError(errNumber, descriptionText, ctxFormatString, ctxPosition, innerError) {
	NestedError.call(this, errNumber, (descriptionText === undefined) ? "Format Error" : descriptionText, innerError);
	this.formatString = ctxFormatString;
	this.position = ctxPosition;
}
FormatError.prototype = new NestedError();
FormatError.prototype.constructor = FormatError;

/**
 * @classDescription	Represents an error finding a property or value based upon a name or index
 * @param {Number} errNumber	An error number
 * @param {String} descriptionText	Text describing error
 * @param {Object} keyOrIndex	Key or index which was not found
 * @param {String} ctxFormatString	Copy of formatted string in which error occurred
 * @param {Number} ctxPosition	Position at which which error occurred
 * @param {Object} innerErrorObj	Inner error
 * @constructor
 */
function KeyNotFoundError(errNumber, descriptionText, keyOrIndex, ctxFormatString, ctxPosition, innerError) {
	FormatError.call(this, errNumber, (descriptionText === undefined) ? "Key or Index Not Found" : descriptionText, ctxFormatString, ctxPosition, innerError)
	this.key = keyOrIndex;
}
KeyNotFoundError.prototype = new FormatError();
KeyNotFoundError.prototype.constructor = KeyNotFoundError;

/**
 * Trim leading and trailing whitespace
 * @return {String}	Returns trimmed string
 */
String.prototype.trim = function() {
	return this.replace(/^\s+/, '').replace(/\s+$/, '');
}

/**
 * Creates a new string utilizing placeholders defined in the source string
 * @param {Object} values	Array or object whose indices or properties correspond to placeholder names
 * @exception {KeyNotFoundError}	Key or property not found
 * @exception {FormatError}	Format was invalid
 * @return {String}	Returns formatted results
 * @remarks	Placeholders are defined by placing text inside curly brackets. To insert literal curly brackets, simply use 2 consecutive curly brackets.
 *			The text inside the curly brackets represents a property or index to obtain from the 'values' parameter.
 * @example	var values = { 1: "First", 2: "Second" };
 *			return "One is {1} and {{Two}} is {{{2}}}".toFormattedString(values); // results in "One is First and {Two} is {Second}"
 */
 String.prototype.toFormattedString = function(values) {
	var formatStr = String(this);
	
	var result = '';
	var re = /^([^{}]*)(\{+|\}+)(.*?)$/;
	var rr = re.exec(formatStr);
	var isInPlaceholder = false;
	var placeHolderKey = '';
	var position = 0;
	while (rr != null) {
		formatStr = rr[3];
		var placeHolderLen = rr[2].length % 2;
		
		if (isInPlaceholder) {
			if (placeHolderLen == 1) {
				if (rr[2].substr(0, 1) == '{')
					throw new FormatError(undefined, "Unexpected opening brace", String(this), position + rr[1].length);
				isInPlaceholder = false;
				placeHolderKey += rr[1];
				if (values === undefined || values === null)
					throw new KeyNotFoundError(undefined, "values were not defined", placeHolderKey, String(this), position + rr[1].length);
				
				var v;
				try {
					v = values[placeHolderKey];
				} catch (err) {
					throw new KeyNotFoundError(undefined, undefined, placeHolderKey, String(this), position + rr[1].length, err)
				}
				if (v === undefined)
					throw new KeyNotFoundError(undefined, undefined, placeHolderKey, String(this), position + rr[1].length);
					
				result += ((v === null) ? "" : String(v)) + rr[2].substr(0, (rr[2].length - placeHolderLen) / 2);
			} else
				placeHolderKey += rr[1] + rr[2].substr(0, (rr[2].length - placeHolderLen) / 2);
		} else {
			result += rr[1] + rr[2].substr(0, (rr[2].length - placeHolderLen) / 2);
			if (placeHolderLen == 1) {
				if (rr[2].substr(0, 1) == '}')
					throw new FormatError(undefined, "Unexpected closing brace", String(this), position + rr[1].length);
				isInPlaceholder = true;
			}
		}
		
		position += r[1].length + r[2].length;
		
		rr = re.exec(formatStr);
	}
	
	if (isInPlaceholder)
		throw new FormatError(undefined, "Closing brace not found", String(this), position);
	
	return result + formatStr;
}

if (Array.prototype.map === undefined) {
	Array.prototype.map = function(callback, thisArg) {
		var result = new Array();
		
		for (var i = 0; i < this.length; i++) {
			if (thisArg !== undefined)
				result.push(callback.call(thisArg, this[i]));
			else
				result.push(callback(this[i]));
		}
		
		return result;
	};
}

if (Array.prototype.filter === undefined) {
	Array.prototype.filter = function(callback, thisArg) {
		var result = new Array();
		
		for (var i = 0; i < this.length; i++) {
			if ((thisArg === undefined) ? callback(this[i]) : callback.call(thisArg, this[i]))
				result.push(this[i]);
		}
		
		return result;
	};
}

if (Array.prototype.reduce === undefined) {
	Array.prototype.reduce = function(callback, initialValue) {
		var result = new Array();
		var previousValue = initialValue;
		for (var i = 0; i < this.length; i++)
			previousValue = callback(previousValue, this[i] /* currentValue */, i /* index */, this /* array */);
		
		return previousValue;
	};
}

if (Array.prototype.reduceRight === undefined) {
	Array.prototype.reduceRight = function(callback, initialValue) {
		var result = new Array();
		var previousValue = initialValue;
		for (var i = this.length - 1; i > -1; i--)
			previousValue = callback(previousValue, this[i] /* currentValue */, i /* index */, this /* array */);
		
		return previousValue;
	};
}

/**
 * @classDescription	Represents number formatting configuration options
 * @param {String} decimalSeparator	Decimal separation character
 * @param {String} groupSeparator	Grouping separation character for grouping by thousands
 * @param {String} symbol	Symbol to include with formatted number (ie. $ or %)
 * @param {Boolean} appendSymbol	Whether to append the symbol to the number (versus prepending it)
 * @constructor
 */
function NumberFormatInfo(decimalSeparator, groupSeparator, symbol, appendSymbol) {
	var bClosestMatch = undefined;
	var fGetClosestMatch = function() {
		if (bClosestMatch === undefined)
			bClosestMatch = NumberFormatInfo.getClosestMatch(decimalSeparator, groupSeparator, symbol, appendSymbol);
		
		return bClosestMatch;
	};
	
	this.setDecimalSeparator((decimalSeparator === undefined || decimalSeparator === null) ? fGetClosestMatch().getDecimalSeparator() : decimalSeparator);
	this.setGroupSeparator((groupSeparator === undefined || groupSeparator === null) ? fGetClosestMatch().getGroupSeparator() : decimalSeparator);
	this.setSymbol((symbol === undefined || symbol === null) ? fGetClosestMatch().getSymbol() : decimalSeparator);
	this.setAppendSymbol((appendSymbol === undefined || appendSymbol === null) ? fGetClosestMatch().getAppendSymbol() : decimalSeparator);
}
NumberFormatInfo.prototype = new NumberFormatInfo();
NumberFormatInfo.prototype.constructor = NumberFormatInfo;

/**
 * Trim leading and trailing whitespace
 * @param {String} decimalSeparator	Decimal separator to match
 * @param {String} groupSeparator	Grouping separation character to match
 * @param {String} symbol	Associated symbol to match (ie. $ or %)
 * @param {Boolean} appendSymbol	Matches whether to append the symbol to the number (versus prepending it)
 * @param {String} sUserLanguage	User language specification to match
 * @remarks	If any of the parameters are set to undefined, then they are ignored.
 * @return {String}	Returns closest matching NumberFormatInfo object from the list of known CultureInfo objects
 */
NumberFormatInfo.getClosestMatch = function(decimalSeparator, groupSeparator, symbol, appendSymbol, sUserLanguage) {
	var userLanguageStr = (sUserLanguage === undefined || sUserLanguage === null) ? undefined : ((typeof(sUserLanguage) == 'string') ? sUserLanguage : String(sUserLanguage));
	var decimalSeparatorStr = (decimalSeparator === undefined || decimalSeparator === null) ? undefined : ((typeof(decimalSeparator) == 'string') ? decimalSeparator : String(decimalSeparator));
	var itemsToSearch;
	var addOtherItems = false;
	if (userLanguageStr !== undefined) {
		var ci = CultureInfo.getClosestMatch(userLanguageStr, decimalSeparator);
		addOtherItems = ((ci.getLanguageCode() + "-" + ci.getCountryCode()).toLowerCase() != userLanguageStr.toLowerCase());
		itemsToSearch = new Array(ci.getNumberFormatInfo(), ci.getCurrencyFormatInfo(), ci.getPercentFormatInfo());
	} else {
		addOtherItems = true;
		itemsToSearch = new Array();
	}
	
	if (addOtherItems) {
		itemsToSearch = itemsToSearch.concat(CultureInfo.__knownCultures__.map(function(item) { return item.getNumberFormatInfo(); }));
		itemsToSearch = itemsToSearch.concat(CultureInfo.__knownCultures__.map(function(item) { return item.getCurrencyFormatInfo(); }));
		itemsToSearch = itemsToSearch.concat(CultureInfo.__knownCultures__.map(function(item) { return item.getPercentFormatInfo(); }));
	}
	
	if (itemsToSearch.length == 1)
		return itemsToSearch[0];
		
	var ratedItems = itemsToSearch.map(function(item) {
		var rating = 0;
		if (decimalSeparator !== undefined && decimalSeparator == item.getDecimalSeparator())
			rating += 3;
		if (groupSeparator !== undefined && groupSeparator == item.getGroupSeparator())
			rating++;
		
		if (symbol !== undefined && symbol == item.getSymbol())
			rating += 6;
		if (appendSymbol !== undefined && appendSymbol == item.getAppendSymbol())
			rating += 2;
			
		return { Rating: rating, Item: item };
	}, {
		decimalSeparator: decimalSeparatorStr,
		groupSeparator: (groupSeparator === undefined || groupSeparator === null) ? undefined : ((typeof(groupSeparator) == 'string') ? groupSeparator : String(groupSeparator)),
		symbol: (symbol === undefined || symbol === null) ? undefined : ((typeof(symbol) == 'string') ? symbol : String(symbol)),
		appendSymbol: (appendSymbol === undefined || appendSymbol === null) ? undefined : ((typeof(appendSymbol) == 'boolean') ? appendSymbol : ((appendSymbol) ? true : false))
	});
		
	var sortFn = function(a, b) {
		if (a.Rating < b.Rating)
			return -1;
		return (a.Rating > b.Rating) ? 1 : 0;
	};
	ratedItems.sort(sortFn);
	
	return ratedItems[0];
};
NumberFormatInfo.prototype.getDecimalSeparator = function() {
	return this.__decimalSeparator__;
};
NumberFormatInfo.prototype.getGroupSeparator = function() {
	return this.__groupSeparator__;
};
NumberFormatInfo.prototype.getSymbol = function() {
	return this.__symbol__;
};
NumberFormatInfo.prototype.getAppendSymbol = function() {
	return this.__appendSymbol__;
};
NumberFormatInfo.prototype.setDecimalSeparator = function(sValue) {
	if (sValue === null || sValue === undefined)
		this.__decimalSeparator__ = NumberFormatInfo.getClosestMatch(undefined, this.getGroupSeparator(), this.getSymbol(), this.getAppendSymbol()).getDecimalSeparator();
	else
		this.__decimalSeparator__ = (typeof(sValue) == 'string') ? sValue : String(sValue);
};
NumberFormatInfo.prototype.setGroupSeparator = function(sValue) {
	if (sValue === null || sValue === undefined)
		this.__groupSeparator__ = NumberFormatInfo.getClosestMatch(this.getDecimalSeparator(), undefined, this.getSymbol(), this.getAppendSymbol()).getGroupSeparator();
	else
		this.__groupSeparator__ = (typeof(sValue) == 'number') ? sValue :  String(sValue);
};
NumberFormatInfo.prototype.setSymbol = function(sValue) {
	if (sValue === null || sValue === undefined)
		this.__symbol__ = NumberFormatInfo.getClosestMatch(this.getDecimalSeparator(), this.getGroupSeparator(), undefined, this.getAppendSymbol()).getSymbol();
	else
		this.__symbol__ = (typeof(sValue) == 'number') ? sValue :  String(sValue);
};
NumberFormatInfo.prototype.setAppendSymbol = function(bValue) {
	if (bValue === null || bValue === undefined)
		this.__appendSymbol__ = NumberFormatInfo.getClosestMatch(this.getDecimalSeparator(), this.getGroupSeparator(), this.getSymbol()).getAppendSymbol();
	else
		this.__appendSymbol__ = (bValue) ? true :  false;
};
/**
 * Returns a floating-point value from 0 to 1 to indicate how similar the object is to another NumberFormatInfo object
 * @param {NumberFormatInfo} numberFormatInfoObj	Object to compare
 * @return {Number}	returns similarity rating value
 */
 NumberFormatInfo.prototype.getSimilarityRating = function(numberFormatInfoObj) {
	if (numberFormatInfoObj === null || numberFormatInfoObj === undefined || typeof(numberFormatInfoObj) != 'object' || !(numberFormatInfoObj instanceof NumberFormatInfo))
		return 0;
	
	var result = 0;
	if (this.getDecimalSeparator() == numberFormatInfoObj.getDecimalSeparator())
		result = 0.4;
	if (this.getGroupSeparator() == numberFormatInfoObj.getGroupSeparator())
		result += 0.2;
	if (this.getSymbol() == numberFormatInfoObj.getSymbol())
			result += 0.2;
	return (this.getAppendSymbol() == numberFormatInfoObj.getAppendSymbol()) ? result + 0.2 : result;
};

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
/**
 * Formats a number as a text string
 * @param {String} formatSpecifier	Specifies how number is to be formatted. Default is "n,".
 * @param {Number} precision	Number of digits after decimal point. A precision less than zero as well as a null or undefined parameter results in no precision restrictions.
 * @param {Number} zeroPadLength	Minimum number of digits, padding with zeroes to the left. A zeroPadLength less than zero as well as a null or undefined parameter results in no padding.
 * @param {String} currencySymbol	Currency symbol to use for currency types. Default is '$'
 * @param {Boolean} currencySymbolAtEnd	Whether to place currency symbol at end. Defaults to false (at beginning of string)
 * @exception {KeyNotFoundError}	Key or property not found
 * @exception {FormatError}	Format was invalid
 * @return {String}	Returns number formatted as a string
 * @example	var v = 1002;
 *			return v.formatString(values); // results in "One is First and {Two} is {Second}"
 * @remarks A format specifier consists of a single letter, followed by an optional comma.
 *			Using the optional comma indicates that the numbers are to be grouped by thousands.
 *			Valid letters are:
 *				'c' or 'C': Currency
 *				'f' or 'F': Floating point (always has at least one digit after the decimal point)
 *				'd' or 'D': Digit (whole numbers only)
 *				'e': Lower-case exponential
 *				'E': Upper-case exponential
 *				'n' or 'N': General number
 *				'p' or 'P': Percent
 *				'x': Lower-case hexidecimal
 *				'X': Upper-case hexidecimal
 *				'o' or 'O': Octal
 */
Number.prototype.formatString = function(formatSpecifier, precision, zeroPadLength, objCultureInfoOrNumberFormatInfo) {
	if (formatSpecifier === undefined || formatSpecifier === null)
		formatSpecifier = "";
	else {
		if (!(typeof formatSpecifier == 'string'))
			formatSpecifier = String(formatSpecifier);
	}
	
	if (formatSpecifier === "")
		formatSpecifier = this.__defaultformatSpecifier__;
	
	var formatLetter = formatSpecifier.substr(0, 1);
	var vCultureInfo = objCultureInfoOrNumberFormatInfo;
	
	var getNumberFormatInfoFunc, defaultPrecision, roundFunc, getValidatedPrecisionFunc, getGroupingSpecFunc, getValidatedZeroPadFunc, numberToStringFunc, finalizeFunc;

	switch (formatLetter) {
		case 'c': // Currency
		case 'c':
			getNumberFormatInfoFunc = function(value) { return value.getCurrencyFormatInfo(); };
			getValidatedPrecisionFunc = function(value) { return (value === null) ? 2 : value; };
			break;
		case 'f': // Floating Point
		case 'F':
			getValidatedPrecisionFunc = function(value) { return (value === null) ? 1 : value; };
			break;
		case 'd': // Decimal
		case 'D':
			getValidatedPrecisionFunc = function(value) { return 0; };
			break;
		case 'e': // Exponential
		case 'E':
			getValidatedPrecisionFunc = function(value) { return null; };
			getValidatedZeroPadFunc = function(value) { return 0; };
			numberToStringFunc = function(value) { return (formatLetter == "e") ? value.toExponential().toLowerCase() : value.toExponential().toUpperCase(); }
			getGroupingSpecFunc = function() { return false; }
			break;
		case 'n': // Number
		case 'N':
			break;
		case 'p': // Percent
		case 'P':
			getNumberFormatInfoFunc = function(value) { return value.getPercentFormatInfo(); };
			break;
		case 'x': // Hexidecimal
		case 'X':
			getValidatedPrecisionFunc = function(value) { return 0; };
			numberToStringFunc = function(value) { return (formatLetter == "x") ? value.toString(16).toLowerCase() : value.toString(16).toUpperCase(); };
			getGroupingSpecFunc = function() { return false; }
			break;
		case 'o': // Octal
		case 'O':
			getValidatedPrecisionFunc = function(value) { return 0; };
			numberToStringFunc = function(value) { return value.toString(8); };
			getGroupingSpecFunc = function() { return false; }
			break;
		default:
			throw new FormatError(0, "Invalid format specifier", formatSpecifier, 0);
	}

	var groupingspec = (formatSpecifier.length == 1) ? "" : formatSpecifier.substr(1, 1);
	if (groupingspec !== "" && groupingspec !== ",")
		throw new FormatError(0, "Invalid format specifier", formatSpecifier, 1);
	if (formatSpecifier.length > 2)
		throw new FormatError(0, "Invalid format specifier", formatSpecifier, 2);
	if (getGroupingSpecFunc !== undefined)
		groupingspec = getGroupingSpecFunc();
	else
		groupingspec = (groupingspec.length > 0);
	if (getNumberFormatInfoFunc === undefined)
		getNumberFormatInfoFunc = function(value) {
			return value.getNumberFormatInfo();
		};
		
	var vNumberFormatInfo = (objCultureInfoOrNumberFormatInfo === undefined || objCultureInfoOrNumberFormatInfo === null) ? getNumberFormatInfoFunc(CultureInfo.getDefaultCulture()) : 
			((objCultureInfoOrNumberFormatInfo instanceof CultureInfo) ? getNumberFormatInfoFunc(objCultureInfoOrNumberFormatInfo) : objCultureInfoOrNumberFormatInfo);
	
	var vPrecision = (precision === undefined || precision === null) ? null : Math.floor((typeof(precision) !== number) ? parseInt(precision) : precision);
	if (getValidatedPrecisionFunc !== undefined)
		vPrecision = getValidatedPrecisionFunc(vPrecision);

	if (numberToStringFunc === undefined)
		numberToStringFunc = function(value) {
			return value.toString();
		};
		
	var nValue;
	if (vPrecision === null)
		nValue = numberToStringFunc(this);
	else if (vPrecision < 1)
		nValue = numberToStringFunc(Math.round(this));
	else
		nValue = numberToStringFunc(Math.round(this, vPrecision));
	
	if (getValidatedZeroPadFunc === null)
		getValidatedZeroPadFunc = function(value) { return (value === undefined || value === null) ? 0 : Math.floor((typeof(value) !== number) ? parseInt(value) : value); };
	
	var i = nValue.indexOf(".");
	var w = (i < 0) ? nValue : nValue.substr(0, i);
	var d = (i < 0) ? "" : nValue.substr(i + 1);
	var vZeroPadLength = getValidatedZeroPadFunc();
	
	if (groupingspec) {
		groupingspec = vNumberFormatInfo.getGroupSeparator();
		if (groupingspec !== undefined && groupingspec !== null && groupingspec.length > 0) {
			for (var i = 3; i < w.length; i += 4) {
				vZeroPadLength++;
				w = w.substr(0, w.length - i) + groupingspec + w.substr(w.length - i);
			}
		}
	}
	for (var i = w.length; i < vZeroPadLength; i++)
		w = "0" + w;
	
	if (vPrecision !== null) {
		for (var i = d.length; i < vPrecision; i++)
			d += "0";
	}
	
	nValue = (d.length == 0) ? w : w + vNumberFormatInfo.getDecimalSeparator() + d;
	
	var x = vNumberFormatInfo.getSymbol();
	if (x === undefined || x === null || x.length == 0)
		return sValue;
	if (vNumberFormatInfo.getAppendSymbol())
		return sValue + x;
	
	return x + sValue;
}
Number.prototype.formatString.__defaultformatSpecifier__ = 'n,'

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
