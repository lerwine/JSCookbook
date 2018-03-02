var Army_UnitTest = Class.create();
Army_UnitTest.prototype = Object.extendsObject(AbstractAjaxProcessor, {
	initialize: function(expected, evaluator, args, id, title, assertion) {
		var source, method;
		if (arguments.length == 1 && arguments[0] != null && typeof(arguments[0]) === "object") {
			evaluator = expected.evaluator;
			id = expected.id;
			source = expected.source;
			method = expected.method;
			args = expected.args;
			if (typeof(args) === "undefined")
				args = expected.data;
			title = expected.title;
			assertion = expected.assertion;
			expected = expected.expected;
		}
		if (typeof(evaluator) !== "function") {
			if (typeof(evaluator) == "undefined") {
				if (typeof(source) == "undefined") {
					if (typeof(method) == "undefined")
						throw "Evaluator function or source and method must be defined.";
					throw "Evaluator source must be defined if method is defined and evaluator function is not defined.";
				}
				if (typeof(method) == "undefined")
					throw "Evaluator method must be defined if source is defined and evaluator function is not defined.";
				if (source === null)
					throw "Source object cannot be null if evaluator function is not defined.";
				if (typeof(method) !== "string")
					throw "Method must be a string which names the method (function) to invoke on the source object.";
				if (method.length == 0)
					throw "Method cannot be empty.";
				var f = source[method];
				if (typeof(f) !== "function")
					throw "Source object does not contain a function named \"" + method + "\".";
			} else {
				if (evaluator == null)
					throw "Evaluator cannot be null.";
				throw "Evaluator must be a function.";
			}
		}
		if (typeof(assertion) != "function") {
			if (typeof(assertion) != "undefined") {
				if (assertion !== null)
					throw "Assertion cannot be null.";
				throw "Assertion must be a function if it is defined.";
			}
			assertion = function(expected, actual) { return this.areEqual(expected, actual); }
		}
		this._evaluator = evaluator;
		this._assertion = assertion;
		this._expected = expected;
		if (typeof(args) === "undefined")
			this._args = [];
		else if (args === null)
			this._args = [null];
		else
			this._args = (new ArrayUtil()).ensureArray(args);
		this._title = Army_UnitTest.ensureString(title);
		if (typeof(id) === "undefined" || id === null) {
			if (this._title.length > 0)
				this._id = this._title + " created on " + Date.now();
			else {
				this._id = "Test created on " + Date.now();
				this._title = this._id;
			}
		} else {
			this._id = id;
			if (this._title.length == 0)
				this._title = Army_UnitTest.ensureString(this._id);
		}
		this._source = source;
		this._method = method;
	},
	
	getExpected: function() { return this._expected; },
	getArgs: function() { return this._args; },
	getTitle: function() { return this._title; },
	getId: function() { return this._id; },
	getSource: function() { return this._source; },
	getMethod: function() { return this._method; },
	duplicateWithArgs: function(expected, args) {
		return new Army_UnitTest(expected, this._evaluator, args, this._id, this._title, this._assertion);
	},
	evaluate: function(resultId) {
		var assertion = this._assertion;
		if (typeof(assertion) != "undefined")
			assertion = function(expected, actual) { return this.areEqual(expected, actual); }
		var evaluator = this._evaluator;
		if (typeof(evaluator) != "undefined")
			evaluator = function() { return this._source.apply(this._source, Army_ArrayUtil.__toArgArray(arguments)); }
		return new Army_UnitTest.TestResult(this, evaluator, assertion, resultId);
	},
	type: 'Army_UnitTest'
});
Army_UnitTest.isNil = function(value) { return (typeof(value) === "undefined" || value === null); };
Army_UnitTest.isFunction = function(value) { return (typeof(value) === "function"); };
Army_UnitTest.isNilOrFunction = function(value) {
	var t = typeof(value);
	return (t == "function" || t == "undefined" || value === null);
};
Army_UnitTest.ensureString = function(value) {
	var t = typeof(value)
	if (t === "undefined" || value === null)
		return "";
	if (t == "string")
		return value;
	if (t != "object")
		return value.toString();
	return JSON.stringify(value);
};
Army_UnitTest.getTypeName = function(obj, functionAsProto) {
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
}
Army_UnitTest.TestResult = Class.create();
Army_UnitTest.TestResult.prototype = Object.extendsObject(AbstractAjaxProcessor, {
	initialize: function(unitTest, evaluator, assertion, id) {
		if (Army_UnitTest.getTypeName(unitTest) !== Army_UnitTest.prototype.type)
			throw "Argument must be a " + Army_UnitTest.prototype.type + " object.";
		var t = typeof(evaluator);
		if (t === "undefined")
			throw "Evaluator must be a defined.";
		if (t !== "function")
			throw "Evaluator must be a function.";
		t = typeof(assertion);
		if (t === "undefined")
			throw "Assertion must be a defined.";
		if (t !== "function")
			throw "Assertion must be a function.";
		this.expectedValue = unitTest.getExpected();
		this.expectedType = Army_UnitTest.getTypeName(this.expectedValue);
		this.testId = unitTest.getId();
		this.resultId = Army_UnitTest.ensureString(id);
		if (this.resultId.length == 0)
			this.resultId = testId;
		this.title = unitTest.getTitle();
		this.source = unitTest.getSource();
		this.method = unitTest.getMethod();
		var contextObj = {
			expected = this.expected,
			testId = this.testId,
			resultId = this.resultId,
			title = this.title,
			source = this.source,
			method = this.method,
			isNil: Army_UnitTest.isNil,
			isFunction: Army_UnitTest.isFunction,
			isNilOrFunction: Army_UnitTest.isNilOrFunction,
			ensureString: Army_UnitTest.ensureString,
			getTypeName: Army_UnitTest.getTypeName,
		};
		this.started = Date.now();
		try {
			this.actualValue = evaluator.call(contextObj, unitTest.getArgs());
			this.completed = Date.now();
			this.evaluationCompleted = true;
			this.assertionOutput = assertion.call(contextObj, this._expected, this._actual);
			this.success = (this._assertionOutput == true);
		} catch (e) {
			if (typeof(this.completed) === "undefined")
				this.completed = Date.now();
			this.error = e;
			if (typeof(this._evaluationCompleted) === "undefined")
				this.evaluationCompleted = false;
			this.success = false;
		}
		if (typeof(contextObj.message) === "undefined" || contextObj.message === null) {
			if (typeof(this.error) === "undefined")
				this.message = (this.success) ? "Succeeded" : "Failed";
			else
				this.message = Army_UnitTest.ensureString(this.error);
		} else
			this.message = Army_UnitTest.ensureString(contextObj.message);
		this.actualType = Army_UnitTest.getTypeName(this.actualValue);
	},
	type: 'Army_UnitTest.TestResult'
});
Army_UnitTest.evaluate = function(unitTestArr) {
	var testArr = (new Army_ArrayUtil(unitTestArr)).filter(function(v) { return (Army_UnitTest.getTypeName(v) === Army_UnitTest.prototype.type && typeof(v.evaluator) === "function"); }
	var results = [];
	if (testArr.length == 0)
		testArr.push(new Army_UnitTest("Array", function() { }, [], "Warning", "Empty Test Warning", function() {
			this.message = "No tests were found.";
			return false;
		}));
	return testArr.map(function(test, index, arr) {
		var id = test.getId();
		var getDup = function(s, idx) {
			return arr.reduce(function(p, c, i) {
				if (i.getId() == this.id && i < this.index)
					return p + 1;
				return p;
			}, 0, { id: s, index: idx });
		}
		if (getDup(id, index) > 0) {
			var n = 1;
			var s = id;
			do {
				id = s + "_" + n;
				n++;
			} while (getDup(id, index) > 0);
		}
		return test.evaluate(id);
	});
}

