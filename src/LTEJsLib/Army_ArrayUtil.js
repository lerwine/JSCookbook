var Army_ArrayUtil = Class.create();
var proto = Object.extendsObject(AbstractAjaxProcessor, {
	initialize: function() { this._array = Army_ArrayUtil.flatten(Army_ArrayUtil.__toArgArray(arguments)); },
	toArray: function() {
		var r = [];
		for (var i = 0; i < this._array.length; i++)
			r.push(this._array[i]);
		return r;
	},
	getElement: function(index) { return this._array[index]; },
	getArray: function() { return this._array; },
	setElement: function(index, value) { this._array[index] = value; },
	removeAt: function(index, value) {
		var arr = this.splice(index, 1);
		if (arr.length > 0)
			return arr[0];
	},
	append: function() { this._array = Army_ArrayUtil.concat(this._array, Army_ArrayUtil.__toArgArray(arguments)); },
	clear: function() { this._array = []; },
	pop: function() { return this._array.pop(); },
	push: function() {
		var items = Army_ArrayUtil.__toArgArray(arguments);
		for (var i = 0; i < items.length; i++)
			this._array.push(items[i]);
	},
	shift: function() { return this._array.shift(); },
	unshift: function() {
		var items = Army_ArrayUtil.__toArgArray(arguments);
		for (var i = 0; i < items.length; i++)
			this._array.unshift(items[i]);
	},
	join: function() { return new Army_ArrayUtil(Array.prototype.join.apply(this._array, Army_ArrayUtil.__toArgArray(arguments))); },
	reverse: function() { this._array.reverse(); return this; },
	slice: function() { return new Army_ArrayUtil(Array.prototype.slice.apply(this._array, Army_ArrayUtil.__toArgArray(arguments))); },
	sort: function(sortFunction) {
		var t = typeof(sortFunction);
		if (t === "function")
			this._array = this._array.sort(sortFunction);
		else if (t === "undefined" || sortFunction == null)
			this._array = this._array.sort();
		else
			throw t + " is not a function.";
		return this;
	},
	splice: function() { return new Army_ArrayUtil(Array.prototype.slice.apply(this._array, Army_ArrayUtil.__toArgArray(arguments))); },
	every: function(callbackfn, thisObj) {
		var t = typeof(callbackfn);
		if (t !== "function")
			throw t + " is not a function.";
		if (typeof(thisObj) !== "undefined") {
			for (var i = 0; i < this._array.length; i++) {
				if (!callbackfn.call(thisObj, this._array[i], i, this))
					return false;
			}
		} else {
			for (var i = 0; i < this._array.length; i++) {
				if (callbackfn(this._array[i], i, this))
					return false;
			}
		}
		return true;
	},
	filter: function(callbackfn, thisObj) {
		var arr = [];
		var t = typeof(callbackfn);
		if (t !== "function")
			throw t + " is not a function.";
		if (typeof(thisObj) !== "undefined") {
			for (var i = 0; i < this._array.length; i++) {
				if (callbackfn.call(thisObj, this._array[i], i, this))
					arr.push(this._array[i]);
			}
		} else {
			for (var i = 0; i < this._array.length; i++) {
				if (callbackfn(this._array[i], i, this))
					arr.push(this._array[i]);
			}
		}
		new Army_ArrayUtil(arr);
	},
	map: function(callbackfn, thisObj) {
		var arr = [];
		var t = typeof(callbackfn);
		if (t !== "function")
			throw t + " is not a function.";
		if (typeof(thisObj) !== "undefined") {
			for (var i = 0; i < this._array.length; i++)
				arr.push(callbackfn.call(thisObj, this._array[i], i, this));
		} else {
			for (var i = 0; i < this._array.length; i++) 
				arr.push(callbackfn(thisObj, this._array[i], i, this));
		}
		new Army_ArrayUtil(arr);
	},
	reduce: function(callbackfn, initialValue, thisObj) {
		var t = typeof(callbackfn);
		if (t !== "function")
			throw t + " is not a function.";
		if (this._array.length == 0)
			return initialValue;
		if (typeof(thisObj) !== "undefined") {
			if (this._array.length == 1)
				return callbackfn.call(thisObj, initialValue, this._array[0], 0, this);
			if (arguments.length < 2)
				initialValue = this._array[this._array.length - 1];
			for (var i = 0; i < this._array.length; i++)
				initialValue = callbackfn.call(thisObj, initialValue, this._array[i], i, this);
		} else {
			if (this._array.length == 1)
				return callbackfn(initialValue, this._array[0], 0, this);
			if (arguments.length < 2)
				initialValue = this._array[this._array.length - 1];
			for (var i = 0; i < this._array.length; i++)
				initialValue = callbackfn(initialValue, this._array[i], i, this);
		}
		return initialValue;
	},
	reduceRight: function(callbackfn, initialValue, thisObj) {
		var t = typeof(callbackfn);
		if (t !== "function")
			throw t + " is not a function.";
		if (this._array.length == 0)
			return initialValue;
		if (typeof(thisObj) !== "undefined") {
			if (this._array.length == 1)
				return callbackfn.call(thisObj, initialValue ,this._array[0], 0, this);
			if (arguments.length < 2)
				initialValue = this._array[this._array.length - 1];
			for (var i = this._array.length - 1; i >= 0; i++)
				initialValue = callbackfn.call(thisObj, initialValue, this._array[i], i, this);
		} else {
			if (this._array.length == 1)
				return callbackfn(initialValue, this._array[0], 0, this);
			if (arguments.length < 2)
				initialValue = this._array[this._array.length - 1];
			for (var i = this._array.length - 1; i >= 0; i++)
				initialValue = callbackfn(initialValue, this._array[i], i, this);
		}
		return initialValue;
	},
	contains: function(element) { return Army_ArrayUtil._arrayUtil.contains(this._array, element); },
	indexOf: function(item, startIndex) { return Army_ArrayUtil._arrayUtil.indexOf(this._array, item, startIndex); },
	concat: function(children) { return new Army_ArrayUtil(Army_ArrayUtil.concat(this._array, children)); },
	diff: function(){ return new Army_ArrayUtil(Army_ArrayUtil.diff.apply(Army_ArrayUtil._arrayUtil, Army_ArrayUtil.__toArgArray(arguments))); },
	intersect: function() { return new Army_ArrayUtil(Army_ArrayUtil.intersect.apply(Army_ArrayUtil._arrayUtil, Army_ArrayUtil.__toArgArray(arguments))); },
	union: function() { return new Army_ArrayUtil(Army_ArrayUtil.union.apply(Army_ArrayUtil._arrayUtil, Army_ArrayUtil.__toArgArray(arguments))); },
	unique: function() { return new Army_ArrayUtil(Army_ArrayUtil._arrayUtil.unique(this._array)); },
	toString: function() { return this._array.toString(); },
	toJSON: function() { return JSON.stringify(this._array); }
});
if (typeof(Object.defineProperty) === "function") {
	proto.type = 'Army_ArrayUtil';
	Army_ArrayUtil.prototype = proto;
	Object.defineProperty(Army_ArrayUtil.prototype, "length", {
		get: function() { return this._array.length; }
	});
} else {
	var callLengthChange = function(thisObj, name, args) {
		var r = this[name].call(thisObj, Army_ArrayUtil.__toArgArray(args));
		thisObj.length = thisObj._array.length;
		return r;
	};
	proto.type = 'Army_ArrayUtilBase';
	Army_ArrayUtil.prototype = Object.extendsObject(proto, {
		initialize: function() { callLengthChange(this, "initialize", arguments); },
		setElement: function(index, value) { callLengthChange(this, "setElement", arguments); },
		removeAt: function(index, value) { return callLengthChange(this, "removeAt", arguments); },
		append: function() { callLengthChange(this, "append", arguments); },
		clear: function() { callLengthChange(this, "clear", arguments); },
		pop: function() { return callLengthChange(this, "pop", arguments); },
		push: function() { callLengthChange(this, "push", arguments); },
		shift: function() { return callLengthChange(this, "shift", arguments); },
		unshift: function() { callLengthChange(this, "unshift", arguments); },
		slice: function() { return callLengthChange(this, "slice", arguments); },
		sort: function(sortFunction) { return callLengthChange(this, "sort", arguments); },
		splice: function() { return callLengthChange(this, "splice", arguments); },
		every: function(callbackfn, thisObj) { return callLengthChange(this, "every", arguments); },
		filter: function(callbackfn, thisObj) { return callLengthChange(this, "filter", arguments); },
		type: 'Army_ArrayUtil'
	});
}
Army_ArrayUtil._arrayUtil = new ArrayUtil();
Army_ArrayUtil.IsArrayUtil = function(obj) {
	return (obj != null && typeof(obj) === "object" && Object.getPrototypeOf(obj).type === Army_ArrayUtil.prototype.type && typeof(obj.toArray) === "function" &&
		obj._array !== null && Array.IsArray(obj._array));
};
Army_ArrayUtil.ensureArray = function(obj) {
	var array = [];
	
	if (obj == null || typeof obj == "undefined") 
		return array;
	
	if (Array.isArray(obj))
		return obj;
	if (Army_ArrayUtil.IsArrayUtil(obj)) {
		var a = obj.toArray();
		if (typeof(a) === "object" && a !== null && Array.isArray(a))
			return a;
	}
	array.push(obj);
	return array;
};
Army_ArrayUtil.__toArgArray = function(args) {
	var arr = [];
	if (args.length == 0)
		return arr;
	for (var i = 0; i < args.length; i++) {
		if (typeof(args[i]) === "undefined" || args[i] === null)
			arr.push(args[i]);
		else {
			if (Army_ArrayUtil.IsArrayUtil(args[i])) {
				var a = args[i].toArray();
				if (typeof(a) === "object" && a !== null && Array.isArray(a))
					arr.push(a);
				else
					arr.push(args[i]);
			} else
				arr.push(args[i]);
		}
	}
	return arr;
};
Army_ArrayUtil.flatten = function() {
	var arr = [];
	if (arguments.length == 0 || (arguments.length == 1 && typeof(arguments[0]) === "undefined"))
		return arr;
	for (var i = 0; i < arguments.length; i++) {
		if (typeof(arguments[i]) === "undefined" || arguments[i] === null)
			arr.push(arguments[i]);
		else {
			var a = Army_ArrayUtil.ensureArray(arguments[i]);
			for (var n = 0; n < a.length; n++)
				arr.push(a[n]);
		}
	}
	return arr;
};
Army_ArrayUtil.contains = function(array, element) { return Army_ArrayUtil._arrayUtil.contains(Army_ArrayUtil.ensureArray(array), element); };
Army_ArrayUtil.indexOf = function(array, item, startIndex) { return Army_ArrayUtil._arrayUtil.indexOf(Army_ArrayUtil.ensureArray(array), item, startIndex); };
Army_ArrayUtil.concat = function(parent, children) {
	var a = [];
	children = Army_ArrayUtil.ensureArray(children);
	for (var i = 0; i < children.length; i++) {
		if (Army_ArrayUtil.IsArrayUtil(children[i])) {
			var c = children[i].toArray();
			if (c !== null && typeof(c) === "object" && Array.isArray(c))
				a.push(c);
			else
				a.push(children[i]);
		}
		else
			a.push(children[i]);
	}
	var r = Army_ArrayUtil._arrayUtil.concat(Army_ArrayUtil.ensureArray(parent), a);
	return r;
};
Army_ArrayUtil.convertArray = function(a) { return Army_ArrayUtil._arrayUtil.convertArray(Army_ArrayUtil.ensureArray(a)); };
/**
 * Find the difference between two or more arrays
 * diff(a,b,c)
 * will return an array of items from a that were not found in either b or c
 * Duplicate items are removed from the result
 * @param two or more arrays
 * @return Array
 */
Army_ArrayUtil.diff = function() {
	var a = [];
	for (var i = 0; i < arguments.length; i++)
		a.push(Army_ArrayUtil.ensureArray(arguments[i]));
	return Army_ArrayUtil._arrayUtil.diff(a);
};
/**
 * Find the intersect between two or more arrays
 * intersect(a,b,c)
 * will return an array of items from a that were also found in both b or c
 * Duplicate items are removed from the result
 * @param two or more arrays
 * @return Array
 */
Army_ArrayUtil.intersect = function() {
	var a = [];
	for (var i = 0; i < arguments.length; i++)
		a.push(Army_ArrayUtil.ensureArray(arguments[i]));
	return Army_ArrayUtil._arrayUtil.intersect(a);
};
/**
 * Merge two or more arrays together
 * union(a,b,c)
 * will return an array of items with items from all arrays, duplicate items are removed from the result
 * @param two or more arrays
 * @return Array
 */
Army_ArrayUtil.union = function() {
	var a = [];
	for (var i = 0; i < arguments.length; i++)
		a.push(Army_ArrayUtil.ensureArray(arguments[i]));
	return Army_ArrayUtil._arrayUtil.union(a);
};
/**
 * Removes duplicate items from an array
 * @param Array a1
 * @return Array
 */
Army_ArrayUtil.unique = function(a1) { return Army_ArrayUtil._arrayUtil.unique(Army_ArrayUtil.ensureArray(a1)); };