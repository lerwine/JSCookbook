var JsUnitTesting = JsUnitTesting || {};
JsUnitTesting.Utility = (function(Utility) {
	Utility = Utility || {
		isNil: function(obj) { return (typeof(obj) === "undefined" || obj === null); },

		asArray: function(obj) {
			var t = typeof(obj);
			if (t == "undefined" || obj === null)
				return new Array();
			if (t == "object") {
				if (Array.isArray(obj))
					return obj;
				if (typeof(obj.toArray) == "function") {
					var a = obj.toArray();
					if (typeof(a) === "object" && a !== null && Array.isArray(a))
						return a;
				}
			}
			return [obj];
		},
	
		asString: function(obj, defaultValue) {
			var t = typeof(obj);
			if (t == "undefined" || obj === null)
				return defaultValue;
			if (t == "string")
				return obj;
			if (t != "object")
				return obj.toString();
			return JSON.stringify(obj);
		},
	
		asNumber: function(obj, defaultValue) {
			var t = typeof(obj);
			
			if (t == "number")
				return obj;
			
			if (t == "boolean")
				return (obj) ? 1 : 0;
				
			if (t !== "undefined" || obj !== null) {
				obj = Utility.asString(obj, "");

				if (obj.length > 0) {
					try {
						var f = parseFloat(obj);
						var i = parseInt(obj);
						if (isNaN(i))
							obj = f;
						else if (isNaN() || i == f)
							obj = i;
						else
							obj = f;
					} catch (e) { obj = Number.NaN; }
				} else
					obj = Number.NaN;
				if (!isNaN(obj))
					return obj;
			}
		
			t = typeof(defaultValue);
			if (t == "undefined" || defaultValue === null || t == "number")
				return defaultValue;
			return Utility.asNumber(defaultValue);
		},
	
		asBoolean: function(obj, defaultValue) {
			var t = typeof(obj);
			
			if (t == "boolean")
				return obj;
			
			if (t == "number")
				return (!isNan(obj) && obj !== 0)
				
			if (t !== "undefined" || obj !== null) {
				obj = Utility.asString(obj, "");
				var re = /\s*((y(es)?|t(rue)?|-?0*(\.0*)?[1-9])|(no?|f(alse)?|-?(0+(\.0*)?|\.0*)(\D|$)))/i;
				var m = re.test(obj);
				if (m !== null)
					return (typeof(m[1]) !== "undefined" && m[1] !== null);
			}
		
			t = typeof(defaultValue);
			if (t == "undefined" || defaultValue === null || t == "boolean")
				return defaultValue;
			return Utility.asBoolean(defaultValue);
		},
	
		getTypeName: function(obj, functionAsProto) {
			var t = typeof(obj)
			
			if (obj === null)
				return null;
			
			var proto;
			if (t === "object")
				proto = Object.getPrototypeOf(obj);
			else if (t === "function" && functionAsProto)
				proto = obj;
			else
				return t;
			
			for (var p = proto; typeof(p) != "undefined" && p != null; p = p.__proto__) {
				if (typeof(p.type) === "string" && p.type.length > 0)
					return p.type;
				if (typeof(p.constructor) === "function" && typeof(p.constructor.name) === "string" && p.constructor.name.length > 0)
					return p.constructor.name;
			}
			
			var re = /^\[((object\s+)?([^\]]+)?)\]/;
			var name = t;
			var m = null;
			try {
				name = Object.toString.call(obj);
				m = re.exec(name)
			} catch (e) { }
			if (m !== null) {
				if (typeof(m[3]) !== "undefined") {
					if (m[3] !== "Object")
						return m[3];
					name = m[3];
				} else if (typeof(m[2]) !== "undefined")
					name = m[2];
				else if (typeof(m[1]) !== "undefined")
					name = m[1];
			}
			for (var p = proto; typeof(p) != "undefined" && p != null; p = p.__proto__) {
				m = null;
				try { m = re.exec(Object.toString.call(p)); } catch (e) { }
				if (m != null && typeof(m[3] !== "undefined"))
					return m[3];
			}
			
			return name;		
		},

		// Equivalent to Array.map, provided for compatibility with older browsers
		mapArray: function(arrayObj, callback, thisArg) {
			var result = new Array();
			arrayObj = Utility.asArray(arrayObj);
			for (var i = 0; i < arrayObj.length; i++) {
				if (thisArg !== undefined)
					result.push(callback.call(thisArg, arrayObj[i], i, arrayObj));
				else
					result.push(callback(arrayObj[i], i, arrayObj));
			}
			
			return result;
		},

		// Equivalent to Array.filter, provided for compatibility with older browsers
		filterArray = function(arrayObj, callback, thisArg) {
			var result = new Array();
			
			for (var i = 0; i < arrayObj.length; i++) {
				if ((thisArg === undefined) ? callback(arrayObj[i]) : callback.call(thisArg, arrayObj[i]))
					result.push(arrayObj[i]);
			}
			
			return result;
		},

		// Equivalent to Array.reduce, provided for compatibility with older browsers
		reduceArray = function(arrayObj, callback, initialValue) {
			var previousValue = initialValue;
			for (var i = 0; i < arrayObj.length; i++)
				previousValue = callback(previousValue, arrayObj[i] /* currentValue */, i /* index */, arrayObj /* array */);
			
			return previousValue;
		}
	};
	return Utility;
})(JsUnitTesting.Utility);
