/**
 * Namespace for unit testing
 * @namespace
 */
var JsUnitTesting = JsUnitTesting || {};

/**
 * Contains utility functions used by other unit testing classes.
 * @namespace
 */
JsUnitTesting.Utility = (function(Utility) {
	Utility = Utility || {};

	/**
	 * Determines if a value is undefined or null.
	 * @param {*} value - Value to test.
	 * @returns {boolean} true if value is undefined or null; otherwise, false.
	 */
	Utility.isNil = function(value) { return (typeof(value) === "undefined" || value === null); };
	
	/**
	 * Ensures that a valcvcue is an array.
	 * @param {*} value - Value to be converted to an array.
	 * @returns {Array} - if value is undefined, an empty array is returned. If value was alread an array, then the value is simply returned. Otherwise, an array with a single element containing the value is returned.
	 */
	Utility.toArray = function(value) {
		if (typeof(value) === "undefined")
			return [];
		if (value !== null && (value instanceof Array))
			return value;
		return [value];
	};

	/**
	 * Callback function for array element mapping.
	 * @callback arrayMapCallback
	 * @param {*} currentValue - The array element for the current iteration.
	 * @param {number} index - The index of the current iteration.
	 * @param {Array} array - The array being iterated.
	 * @returns {*} Value to add to the result array.
	 */
	/**
	 * This method is provided in order to provide consistency with platforms that may not implement Array.map,
	 * or may implement it differently. Maps the value of each element of an array, returning the mapped values as an array.
	 * @param {Array} array - Array of values to be mapped.
	 * @param {arrayMapCallback} callback - Function which maps each element of the array.
	 * @param {*=} thisArg - The object which will be the "this" object when the callback function is called.
	 * @returns {Array} The array of values, mapped from the source array.
	 */
	Utility.mapArray = function(array, callback, thisArg) {
		var result = [];
		array = Utility.toArray();
		var invokeCb;
		if (!Utility.isNil(callback)) {
			if (typeof(callback) !== "function")
				throw "callback must be a callback if it is defined";
			invokeCb = function(i) { return callback.call(thisArg, array[i], i, array); };
		} else
			invokeCb = function(i) { return callback(array[i], i, array); };
		if (array.length == 0)
			return result;
		for (var i = 0; i < array.length; i++)
			result.push(invokeCb(i));
		return result;
	};

	/**
	 * Callback predicate function for array filtering.
	 * @callback arrayFilterPredicateCallback
	 * @param {*} currentValue - The array element for the current iteration.
	 * @param {number} index - The index of the current iteration.
	 * @param {Array} array - The array being iterated.
	 * @returns {boolean} True if the current element should be added to the result array; otherwise, false.
	 */
	/**
	 * This method is provided in order to provide consistency with platforms that may not implement Array.filter, 
	 * or may implement it differently. Filters the values of an array, returning the confirmed values as an array.
	 * @param {Array} array - Array of values to be mapped.
	 * @param {arrayMapCallback} callback - function which is called for each element, to determine if it will be in the result array.
	 * @param {*=} thisArg - The object which will be the "this" object when the callback function is called.
	 * @returns {Array} The array of filtered values mapped from the source array.
	 */
	Utility.filterArray = function(array, callback, thisArg) {
		var result = [];
		array = Utility.toArray();
		var invokeCb;
		if (!Utility.isNil(callback)) {
			if (typeof(callback) !== "function")
				throw "callback must be a callback if it is defined";
			invokeCb = function(i) { return callback.call(thisArg, array[i], i, array); };
		} else
			invokeCb = function(i) { return callback(array[i], i, array); };
		if (array.length == 0)
			return result;
		for (var i = 0; i < array.length; i++) {
			if (invokeCb(i))
				result.push(array[i]);
		}
		return result;
	};

	/**
	 * Callback accumulator function for array iteration.
	 * @callback arrayReduceCallback
	 * @param {*} accumulate - The accumulated value which was returned from the callback function in the previous iteration.
	 * @param {*} currentValue - The array element for the current iteration.
	 * @param {number} index - The index of the current iteration.
	 * @param {Array} array - The array being iterated.
	 * @returns {*} Result of current element combined with the accumulate.
	 */
	/**
	 * This method is as an alternative to Array.reduce, mainly for the capability of having a "this" object
	 * for tne callback function. Combines each element in an array with the accumulated value of the previous
	 * iteration (left to right), reducing it to a single value.
	 * @param {Array} array - Array of values to be mapped.
	 * @param {arrayMapCallback} callback - function which is called for each element, to determine if it will be in the result array.
	 * @param {*=} initialValue - The value to use as the initial seed for the accumulated value. If this is not provided, then the value of the last element will be used.
	 * @param {*=} thisArg - The object which will be the "this" object when the callback function is called.
	 * @returns {*} The accumulated value of the array elements.
	 */
	Utility.reduceArray = function(array, callback, initialValue, thisArg) {
		array = Utility.toArray();
		var invokeCb;
		if (!Utility.isNil(callback)) {
			if (typeof(callback) !== "function")
				throw "callback must be a callback if it is defined";
			invokeCb = function(i, p) { return callback.call(thisArg, p, array[i], i, array); };
		} else
			invokeCb = function(i, p) { return callback(p, array[i], i, array); };
		var result = initialValue;
		if (array.length == 0)
			return result;
		if (typeof(result) === null)
		result = array[array.length - 1];
		for (var i = 0; i < array.length; i++)
			result = invokeCb(result, i);
		return result;
	};

	/**
	 * Ensures a value is a string, converting it, if necessary.
	 * @param {*} value - The value to convert to a string.
	 * @param {string=} defaultValue - The default value to return if the value is undefined or null.
	 * @returns {string} - The value converted to a string.
	 */
	Utility.convertToString = function(value, defaultValue) {
		if (Utility.isNil(value)) {
			if (typeof(defaultValue) === "undefined")
				return value;
			return (defaultValue === null) ? defaultValue : Utility.convertToString(defaultValue);
		}
		
		switch (typeof(value)) {
			case 'string':
				return value;
			case 'number':
			case 'boolean':
				return value.toString();
		}
		
		return JSON.stringify(value);
	};

	/**
	 * Ensures that a value is a number, converting it, if necessary.
	 * @param {*} value - The value to convert to a number.
	 * @param {number=} defaultValue - The default value to return if the value could not be converted to a number.
	 * @returns {number} The value converted to a number, or Number.NaN if it could not be converted and the default value was not provided.
	 */
	Utility.convertToNumber = function(value, defaultValue) {
		if (Utility.isNil(value)) {
			if (typeof(defaultValue) === "undefined")
				return value;
			return (defaultValue === null) ? defaultValue : Utility.convertToNumber(defaultValue);
		}
		switch (typeof(value)) {
			case "number":
				if (!isNaN(value))
					return value;
				break;
			case "boolean":
				return (value) ? 1 : 0;
			default:
				if (value instanceof Date)
					return value.valueOf();
				
				var s = Utility.convertToString(value, "").trim();
				if (s.length > 0) {
					try {
						var i = parseInt(s);
						try {
							var f = parseFloat(s);
							if (isNaN(i))
								value = f;
							else if (isNaN(f) || !Number.isFinite(f))
								value = i;
							else if (!Number.isFinite(i))
								value = f;
							else
								value = (i == f) ? i : f;
						} catch (e) { value = i; }
					} catch (e) { value = Number.NaN; }
				} else
					value = Number.NaN;
				if (!isNaN(value))
					return value;
				break;
		}
		
		if (typeof(defaultValue) === "undefined")
			return value;
	
		if (defaultValue === null)
			return defaultValue;
	
		return Utility.convertToNumber(defaultValue);
	};
	
	/**
	 * Searches the function and any prototypes for a name.
	 * @param {function} func - A function from which to extract the name.
	 * @returns {string} The function name or undefined if a name could not be found.
	 */
	Utility.getFunctionName = function(func) {
		if (typeof(func) !== 'undefined' && func !== null) {
			if (typeof(func) === "function" && typeof(func.name) === "string" && func.name.length > 0)
				return func.name;
			if (typeof(func.constructor) === "function" && typeof(func.constructor.name) === "string" && func.constructor.name.length > 0)
				return func.constructor.name;
			var proto;
			if (typeof(func.prototype) !== "undefined" && func.prototype !== null && typeof(func.prototype.constructor) === "function")
				proto = func.prototype;
			else {
				var p = Object.getPrototypeOf(func);
				if (typeof(p) !== "undefined" && p !== null && typeof(p.constructor) === "function")
					proto = p;
			}
			if (typeof(proto) !== "undefined" && proto !== null && typeof(proto.constructor.name) === "string" && proto.constructor.name.length > 0)
				return proto.constructor.name;
	
			var re = /^function\s+([^(]+)/i;
			var r = re.exec(func.toString());
			if (r != null)
				return r[1];
		}
	
		return "";
	};
	return Utility;
})(JsUnitTesting.Utility);