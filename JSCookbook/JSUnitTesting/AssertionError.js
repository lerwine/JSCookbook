JsUnitTesting.AssertionError = (function(Utility, UnitTest, TypeSpec) {
	/**
	 * @classDescription	Represents an error with an optional inner error
	 * @param {number=} number -	An error number.
	 * @param {string=} message -	Text describing error.
	 * @param {JsUnitTesting.UnitTest=} unitTest -	Test during which error occurred.
	 * @param {JsUnitTesting.TestCollection=} testCollection -	Test collection being iterated when error occurred.
	 * @param {*=} innerError -	Inner error
	 * @param {JsUnitTesting.TypeSpec=} expected -	Specifies value that was expected.
	 * @param {JsUnitTesting.TypeSpec=} actual -	Specifies actual value that was returned.
	 * @param {string=} condition -	Specifies the test condition that failed.
	 * @constructor
	 */
	function AssertionError(number, message, unitTest, testCollection, innerError, expected, actual, condition) {
		message = Utility.convertToString(message);
		number = Utility.convertToNumber(number, null);
		if (number !== null && Number.isFinite(number)) {
			this.errorNumber = number;
			if (message.length == 0)
				message = "Error " + number;
			else
				message = "Error " + number + ": " + message;
		} else if (message.length == 0)
			message = "Unexpected Error";

		Error.prototype.constructor.call(this, message);
		
		if (!Utility.isNil(innerError))
			this.innerError = innerError;
		else
			this.innerError = "";

		if (!Utility.isNil(unitTest)) {
			if (!Utility.isNil(unitTest.id))
				this.unitTestId = unitTest.id;
			else
				this.unitTestId = "";
			if (!Utility.isNil(unitTest.name))
				this.unitTestName = unitTest.name;
			else
				this.unitTestName = "";
		} else {
			this.unitTestId = "";
			this.unitTestName = "";
		}
		if (!Utility.isNil(testCollection)) {
			if (!Utility.isNil(testCollection.id))
				this.testCollectionId = testCollection.id;
			else
				this.testCollectionId = "";
			if (!Utility.isNil(testCollection.name))
				this.testCollectionName = testCollection.name;
			else
				this.testCollectionName = "";
		} else {
			this.testCollectionId = "";
			this.testCollectionName = "";
		}
		condition = Utility.convertToString(condition, "");
		this.condition = (condition.length == 0) ? "equal to" : condition;
		if (!Utility.isNil(expected))
			this.expected = (expected instanceof TypeSpec) ? expected : new TypeSpec(expected);
		else
			this.expected = {};
		if (Utility.isNil(actual))
			this.actual = {};
		else
			this.actual = (actual instanceof TypeSpec) ? actual : new TypeSpec(actual);
	}
	AssertionError.prototype = Error.prototype;
	AssertionError.prototype.constructor = AssertionError;
	return AssertionError;
})(JsUnitTesting.Utility, JsUnitTesting.UnitTest, JsUnitTesting.TypeSpec);
	