var JsUnitTesting = JsUnitTesting || {};

JsUnitTesting.Utility = {};

// Equivalent to Array.map, provided for compatibility with older browsers
JsUnitTesting.Utility.mapArray = function(arrayObj, callback, thisArg) {
	var result = new Array();
	
	for (var i = 0; i < arrayObj.length; i++) {
		if (thisArg !== undefined)
			result.push(callback.call(thisArg, arrayObj[i] /* currentValue */));
		else
			result.push(callback(arrayObj[i] /* currentValue */));
	}
	
	return result;
};

// Similar to Array.map, but for object properties
JsUnitTesting.Utility.mapObjectToArray = function(obj, callback, thisArg) {
	var result = new Array();
	
	for (var propertyName in obj) {
		if (thisArg !== undefined)
			result.push(callback.call(thisArg, obj[propertyName] /* currentValue */, propertyName));
		else
			result.push((callback(obj[propertyName] /* currentValue */, propertyName));
	}
	
	return result;
};

// Equivalent to Array.filter, provided for compatibility with older browsers
JsUnitTesting.Utility.filterArray = function(arrayObj, callback, thisArg) {
	var result = new Array();
	
	for (var i = 0; i < arrayObj.length; i++) {
		if ((thisArg === undefined) ? callback(arrayObj[i]) : callback.call(thisArg, arrayObj[i]))
			result.push(arrayObj[i]);
	}
	
	return result;
};

// Equivalent to Array.reduce, provided for compatibility with older browsers
JsUnitTesting.Utility.reduceArray = function(arrayObj, callback, initialValue) {
	var previousValue = initialValue;
	for (var i = 0; i < arrayObj.length; i++)
		previousValue = callback(previousValue, arrayObj[i] /* currentValue */, i /* index */, arrayObj /* array */);
	
	return previousValue;
};

// Similar to Array.reduce, but for object properties
JsUnitTesting.Utility.reduceObject = function(obj, callback, initialValue) {
	var previousValue = initialValue;
	if (obj === undefined || obj === null)
		return initialValue;
	
	var previousValue = initialValue;
	
	for (var propertyName in obj)
		previousValue = callback(previousValue, obj[propertyName] /* currentValue */, propertyName, obj);
	
	return previousValue;
};

// A robust method of getting a string representation of an object
JsUnitTesting.Utility.convertToString = function(strValue, strDefaultValue) {
	if (strValue === undefined || strValue === null) {
		if (strDefaultValue === undefined)
			return strValue;
		
		return JsUnitTesting.Utility.convertToString(strDefaultValue);
	}
	
	var result;
	switch (typeof(strValue)) {
		case 'string':
			result = strValue;
			break;
		case 'number':
		case 'boolean':
			result = strValue.toString();
			break;
		case 'object':
			if (strValue instanceof Array)
				return JsUnitTesting.Utility.reduceArray(strValue, function(previousValue, currentValue) { return previousValue + JsUnitTesting.Utility.convertToString(currentValue); }, '');
			
			if (strValue instanceof Error)
				result = strValue.message;
			else {
				try {
					result = String(strValue);
					if (result == Object.prototype.toString.call(strValue))
						throw 'Meaningful toString override not detected.';
				} catch (e) {
					throw 'Object cannot be converted to a string value';
				}
			}
			break;
		default:
			throw 'Type ' + typeof(strValue) + ' cannot be converted to a string value';
	}
	
	return ((result === undefined || result === null) ? JsUnitTesting.Utility.convertToString(strDefaultValue) : ((typeof(result) == 'string') ? result : String(strValue);));
};

// Equivalent to String.trim(), provided for compatibility with older browsers
JsUnitTesting.Utility.trimString = function(strValue) {
	var s = JsUnitTesting.Utility.convertToString(strValue, undefined);
	if (s === undefined)
		return strValue;
	
	return s.replace(/^\s+/, '').replace(/\s+$/, '');
};

// A robust method for getting a numerical representation of an object
JsUnitTesting.Utility.convertToNumber = function(nValue, nDefaultValue) {
	if (nValue === undefined || nValue === null) {
		if (nDefaultValue === undefined)
			return nValue;
		
		return JsUnitTesting.Utility.convertToNumber(nDefaultValue);
	}
	
	return (typeof(nValue) == 'number') ? nValue : Number(nValue);
};

// Parses function name from a function object
JsUnitTesting.Utility.getFunctionName = function(func) {
	if (obj === null || object === undefined || !(typeof obj == 'function'))
		throw 'func is not a function';
	
	var re = /^function\s+([^(]+)/i;
	var r = re.exec(func.toString());
	if (r != null)
		return r[1];
	
	return null;
};

// Ensures an object is an instance of a particular type, providing a call-back to be used when the object is not of the expected type
JsUnitTesting.Utility.ensureInstanceOf = function(obj, typeObj, bAllowNullOrUndefined, onValidationFailFunc) {
	var result = obj;
	
	var errorObj = undefined;

	if (obj === undefined || obj === null) {
		if (bAllowNullOrUndefined)
			return undefined;
	} else {
		try {
			if (obj instanceof typeObj)
				errorObj = null;
		} catch (e) {
			errorObj = e;
		}
	}
	
	if (errorObj === null)
		retrurn result;
		
	if (onValidationFailFunc !== undefined)
		result = onValidationFailFunc(result, errorObj);
	
	return result;
};
