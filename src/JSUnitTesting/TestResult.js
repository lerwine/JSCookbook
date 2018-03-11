JsUnitTesting.TestResult = (function(Utility, TypeSpec, ResultStatus) {
    /**
     * Create a test result object.
	 * @param {evaluatorCallback} evaluator -	Function to be executed which performs the test.
	 * @param {assertionCallback=} assertion Asserts the result value from the unit test.
     * @param {JSUnitTesting.UnitTest} unitTest Defines the test to be conducted.
     * @param {JSUnitTesting.TestCollection} testCollection Collection which contains the test to be executed.
     * @param {number} testId Unique ID of test.
     * @param {*} stateInfo Arbitrary state information which is carried through the test.
     */
	function TestResult(evaluator, assertion, unitTest, testCollection, testId, stateInfo) {
        this.status = ResultStatus.NotEvaluated;
        this.error = null;
        this.unitTestId = null;
        this.unitTestName = null;
        this.testCollectionId = null;
        this.testCollectionName = null;
        this.message = thisObj.message;

		var cb = function(evaluator, args) {
			var assert = new Assert(unitTest, testCollection);
			return evaluator.apply(assert, args);
		};
		var thisObj = {
			stateInfo: stateInfo,
			unitTestId: (Utility.isNil(testId)) ? ((Utility.isNil(unitTest.id)) ? null : unitTest.id) : testId,
			unitTestName: unitTest.name,
			testCollectionId: (Utility.isNil(testCollection)) ? null : testCollection.id,
            testCollectionName: (Utility.isNil(testCollection)) ? null : testCollection.name,
            status = ResultStatus.Inconclusive
        };
		try {
            this.result = new TypeSpec(cb.call(this, evaluator, unitTest.args));
            if (typeof(assertion) === "function") {
                var ar = cb.call(this, assertion, [result.value]);
                if (typeof(ar) === "boolean")
                    this.success = ar;
                else {
                    var m = Utility.convertToString(ar, "").trim();
                    if (m.length > 0) {
                        var s = Utility.convertToString(thisObj.message, "").trim();
                        if (s.length > 0)
                            thisObj.message += ("\n\n" + m);
                        else
                            thisObj.message = m;
                    }
                    this.success = true;
                }
            } else {
                if (typeof(thisObj.success) === "undefined") {
                    this.success = (typeof(thisObj.error) === "undefined" || thisObj.error === null);
                    if (!this.success)
                        this.error = thisObj.error;
                } else {
                    if (typeof(thisObj.error) === "undefined" || thisObj.error === null)
                        this.error = thisObj.error;
                    this.success = (thisObj.success && true);
                }
            }
            this.uncaughtExceptionOcurred = false;
        } catch (e) {
            this.uncaughtExceptionOcurred = true;
            if (typeof(this.evaluationFinished) === "undefined") {
                this.evaluationFinished = false;
                this.result = new TypeSpec();
            }
            this.success = false;
            this.error = e;
        }
        if (typeof(thisObj.message) !== "string")
            thisObj.message = Utility.convertToString(thisObj.message, "").trim();
        if (thisObj.message.length == 0) {
            thisObj.message = (this.success) ? "Success" : "Fail";
            if (!Utility.isNil(this.error))
                thisObj.message = Utility.convertToString(this.error, thisObj.message).trim();
        }
        this.unitTestId = (Utility.isNil(testId)) ? ((Utility.isNil(unitTest.id)) ? null : unitTest.id) : testId;
        this.unitTestName = unitTest.name;
        this.testCollectionId = (Utility.isNil(testCollection)) ? null : testCollection.id;
        this.testCollectionName = (Utility.isNil(testCollection)) ? null : testCollection.name;
        this.message = thisObj.message;
	}
	return TestResult;
})(JsUnitTesting.Utility, JsUnitTesting.TypeSpec, JSUnitTesting.ResultStatus);