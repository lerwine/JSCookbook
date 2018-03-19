JsUnitTesting.TestResult = (function(Utility, UnitTest, ResultStatus) {
    /**
     * Create a test result object.
     * @param {JSUnitTesting.UnitTest=ResultStatus.Inconclusive} unitTest Defines the test which was be conducted.
	 * @param {ResultStatus} status result status of test.
	 * @param {string=} message Result summary message.
     * @param {*=} detail Detailed result information.
     * @param {*} stateInfo Arbitrary state information which is carried through the test.
     */
	function TestResult(unitTest, status, message, detail, stateInfo) {
        this.status = Utility.asNumber(status, ResultStatus.Inconclusive);
        if (this.status < ResultStatus.Inconclusive)
            this.status = ResultStatus.Inconclusive;
        else if (this.status > ResultStatus.Error)
            this.status = ResultStatus.Error;
        this.message = Utility.asString(message, "");
        if (Utility.isNil(detail))
            this.detail = undefined;
        else if (typeof(detail) == "string ")
            this.detail = detail;
        else
            this.detail = Utility.stringifyDeep(detail);
        this.stateInfo = stateInfo;
        this.unitTest = unitTest;
	}
	return TestResult;
})(JsUnitTesting.Utility, JsUnitTesting.UnitTest, JsUnitTesting.ResultStatus);