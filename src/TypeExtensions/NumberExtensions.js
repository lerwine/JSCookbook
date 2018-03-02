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
Number.prototype.formatString.__defaultformatSpecifier__ = 'n,';