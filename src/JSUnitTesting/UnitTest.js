JsUnitTesting.UnitTest = (function(Utility, ResultStatus) {
	/**
	 * This gets executed to perform a unit test.
	 * @callback evaluatorCallback
	 * @param {...*} arguments Arguments passed to the test evaluation, which were passed to the unit test constructor.
	 * @throws {Error} If the evaluator performs its own assertions, then an error can be thrown.
	 * @return {*} Return value to be passed to assertionCallback.
	 * @this {TestContext}	This is an object which contains information about the current test. 
	 * @description	When this is executed, 
	 */

	 /**
	 * This asserts a result value from a unit test.
	 *
	 * @callback assertionCallback
	 * @param {*} evaluationResult The value returned from the unit test.
	 * @throws {Error} If the result value does not indicate a success, then an error should be thrown.
	 * @returns {ResultStatus}
	 */

	/**
	 * @classDescription	A single unit test to be performed
	 * @param {evaluatorCallback} evaluator -	Function to be executed which performs the test.
	 * @param {string=} name -	User-friendly name of unit test.
	 * @param {Array=[]} args -	Arguments to pass to evaluatorCallback.
	 * @param {string=} description -	Description of unit test.
	 * @param {number=} id Unique identifier for test.
	 * @param {assertionCallback=} assertion Asserts the result value from the unit test.
	 * @description	When evaluator is called, args will be passed to the evaluator with a JsUnitTesting.TestContext object as "this", which describes the test being executed.
	 * @constructor
	 */
	function UnitTest(evaluator, args, name, description, id, assertion) {
		if (typeof(evaluator) !== "function") {
			if (typeof(evaluator) === "undefined")
				throw "testFunc must be defined";
			if (evaluator === null)
				throw "testFunc cannot be null";
			throw "evaluator must be a function";
		}
		this.evaluator = evaluator;
		if (typeof(assertion) !== "function") {
			if (!Utility.isNil(assertion))
				throw "assertion must be a function if it is defined";
			this.assertion = UnitTest.defaulAssertionTest;
		} else
		this.assertion = assertion;
		id = Utility.convertToNumber(id);
		if (!Utility.isNil(id) && !isNaN(id))
			this.id = id;
		name = Utility.convertToString(name, "").trim();
		if (name.length == 0) {
			name = Utility.getFunctionName(evaluator);
			if (typeof(name) != "string" || (name = name.trim()).length == 0)
				name = (typeof(this.id) !== "undefined") ? this.id.toString() : "";
		}
		this.name = name;
		this.description = Utility.convertToString(description, "");
	}

	UnitTest.defaulAssertionTest = function(testResult) {
		if (testResult === true)
			return ResultStatus.Pass;
		
		return (testResult === false) ? ResultStatus.Fail : ((typeof(testResult) == "number" &&!isNaN(testResult)) ? testResult : ResultStatus.Inconclusive);
	};

 	return UnitTest;
})(JsUnitTesting.Utility, JsUnitTesting.ResultStatus);
