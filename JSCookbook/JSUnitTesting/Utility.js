var JsUnitTesting = JsUnitTesting || {};

JsUnitTesting.Utility = (function(Utility) {
	Utility = Utility || {};

	Utility.isNil = function(value) { return (typeof(value) === "undefined" || value === null); };
	
	Utility.toArray = function(value) {
		if (typeof(value) === "undefined")
			return [];
		if (value !== null && (value instanceof Array))
			return value;
		return [value];
	};

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
})(JsUnitTesting.Utility);