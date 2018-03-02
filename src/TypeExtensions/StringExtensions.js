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