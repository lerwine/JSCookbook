JsUnitTesting.Assert = (function(Utility, AssertionError, TypeSpec) {
	function Assert(unitTest, testCollection) {
		if (Utility.isNil(unitTest))
			throw "JsUnitTesting.UnitTest object must be provided...";
		if (!(unitTest instanceof JsUnitTesting.UnitTest))
			throw "The unit test object must be an instance of JsUnitTesting.UnitTest";
		if (!Utility.isNil(testCollection)) {
			if (!(testCollection instanceof JsUnitTesting.TestCollection))
				throw "If test collection is provided, it must be an instance of JsUnitTesting.TestCollection";
		}
		this.fail = function(message, number, innerError) {
			throw new AssertionError(number, message, this.unitTest, this.testCollection, innerError, undefined, undefined, "fail");
		};
		this.isNil = function(value, message, number) {
			if (!Utility.isNil(value))
				throw new AssertionError(number, message, this.unitTest, this.testCollection, innerError, new TypeSpec(),
					new TypeSpec(value), "is nil");
		};
		this.notNil = function(value, message, number) {
			if (Utility.isNil(value))
				throw new AssertionError(number, message, this.unitTest, this.testCollection, innerError, new TypeSpec(),
					new TypeSpec(value), "not nil");
		};
		this.is = function(expected, actual, message, number) {
			if (!TypeSpec.is(actual, expected))
				throw new AssertionError(number, message, this.unitTest, this.testCollection, innerError, new TypeSpec(expected),
					new TypeSpec(actual));
		};
		this.isNot = function(expected, actual, message, number) {
			if (TypeSpec.is(actual, expected))
				throw new AssertionError(number, message, this.unitTest, this.testCollection, innerError, new TypeSpec(expected),
					new TypeSpec(actual), "is not");
		};
		this.areEqual = function(expected, actual, message, number) {
			var t = typeof(expected);
			if (t !== typeof(actual) || (t !== "undefined" && expected !== null && expected !== actual))
				throw new AssertionError(number, message, this.unitTest, this.testCollection, innerError, new TypeSpec(expected),
					new TypeSpec(actual), "strictly equal to");
		};
		this.areNotEqual = function(expected, actual, message, number) {
			var t = typeof(expected);
			if (t === typeof(actual) && (t === "undefined" || expected === null || expected === actual))
				throw new AssertionError(number, message, this.unitTest, this.testCollection, innerError, new TypeSpec(expected),
					new TypeSpec(actual), "not strictly equal to");
		};
		this.areLike = function(expected, actual, message, number) {
			if (Utility.isNil(expected)) {
				if (Utility.isNil(actual))
					return;
			} else if (!Utility.isNil(actual) && expected == actual)
				return;
			throw new AssertionError(number, message, this.unitTest, this.testCollection, innerError, new TypeSpec(expected),
				new TypeSpec(actual));
		};
		this.areNotLike = function(expected, actual, message, number) {
			if (Utility.isNil(expected)) {
				if (!Utility.isNil(actual))
					return;
			} else if (Utility.isNil(actual) || expected != actual)
				return;
			throw new AssertionError(number, message, this.unitTest, this.testCollection, innerError, new TypeSpec(expected),
				new TypeSpec(actual), "not equal to");
		};
		this.isLessThan = function(expected, actual, message, number) {
			if (!Utility.isNil(expected) && (Utility.isNil(actual) || actual < expected))
				return;
			throw new AssertionError(number, message, this.unitTest, this.testCollection, innerError, new TypeSpec(expected),
				new TypeSpec(actual), "is less than");
		};
		this.notLessThan = function(expected, actual, message, number) {
			if (Utility.isNil(expected) || (!Utility.isNil(actual) && actual >= expected))
				return;
			throw new AssertionError(number, message, this.unitTest, this.testCollection, innerError, new TypeSpec(expected),
				new TypeSpec(actual), "is not less than");
		};
		this.isGreaterThan = function(expected, actual, message, number) {
			if (!Utility.isNil(actual) && (Utility.isNil(expected) || actual > expected))
				return;
			throw new AssertionError(number, message, this.unitTest, this.testCollection, innerError, new TypeSpec(expected),
				new TypeSpec(actual), "is greater than");
		};
		this.notGreaterThan = function(expected, actual, message, number) {
			if (Utility.isNil(actual) || (!Utility.isNil(expected) && actual <= expected))
				return;
			throw new AssertionError(number, message, this.unitTest, this.testCollection, innerError, new TypeSpec(expected),
				new TypeSpec(actual), "is not greater than");
		};
		this.isTrue = function(actual, message, number) { return this.areLike(true, actual, message, number); };
		this.isFalse = function(actual, message, number) { return this.areLike(false, actual, message, number); };
	}
	return Assert;
})(JsUnitTesting.Utility, JsUnitTesting.AssertionError, JsUnitTesting.TypeSpec);