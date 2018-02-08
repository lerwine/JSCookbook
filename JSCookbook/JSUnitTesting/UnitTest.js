var JsUnitTesting = JsUnitTesting || {};
JsUnitTesting.UnitTest = (function(Utility, TestResult) {
	/**
	 * This gets executed to perform a unit test.
	 *
	 * @callback evaluatorCallback
	 * @param {...*} arguments -	Arguments passed to the test evaluation, which were pass to the unit test constructor.
	 * @throws {Error} If the evaluator performs its own assertions, then an error can be thrown.
	 * @return {*} Return value to be passed to assertionCallback.
	 * @this {TestContext}	This is an object which contains information about the current test. 
	 * @description	When this is executed, 
	 */
	/**
	 * This asserts a result value from a unit test.
	 *
	 * @callback assertionCallback
	 * @param {*} evaluationResult -	The value returned from the unit test.
	 * @throws {Error} If the result value does not indicate a success, then an error should be thrown.
	 */
	/**
	 * @classDescription	A single unit test to be performed
	 * @param {evaluatorCallback} evaluator -	Function to be executed which performs the test.
	 * @param {string=} name -	User-friendly name of unit test.
	 * @param {Array=[]} args -	Arguments to pass to evaluatorCallback.
	 * @param {string=} description -	Description of unit test.
	 * @param {assertionCallback=} assertion -	Asserts the result value from the unit test.
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
		if (typeof(assertion) !== "function" && assertion !== null)
			throw "assertion must be a function if it is defined";
		id = JsUnitTesting.Utility.convertToNumber(id);
		if (typeof(id) !== "undefined" && id != null && !isNaN(id))
			this.id = id;
		name = JsUnitTesting.Utility.convertToString(name, "");
		if (name.trim().length > 0)
			this.name = name;
		else {
			name = JsUnitTesting.Utility.getFunctionName(evaluator);
			if (typeof(this.id) !== "undefined")
				name = (name.length == 0) ? this.id.toString() : (name + " [" + this.id + "]");
		}
		this.name = name;
		this.description = JsUnitTesting.Utility.convertToString(description, "");

		this.toString = function() { return this.toJSON(); };
		
		this.toJSON = function() {
			JSON.stringify({ args: this.args, name: this.name, description: this.description, id: this.id });
		};
		
		this.valueOf = function() { return (typeof(this.id) === "undefined") ? Number.NaN : this.id; };

		this.exec = function(testCollection, testId, stateInfo) {
			return new TestResult(evaluator, assertion, this, testCollection, testId, stateInfo);
		};
	}
 	return UnitTest;
})(JsUnitTesting.Utility, JsUnitTesting.TestResult);
