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