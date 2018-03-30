JsUnitTesting.TestResult = (function(Utility, UnitTest, ResultStatus) {
    /**
     * Create a test result object.
     * @param {JSUnitTesting.UnitTest=ResultStatus.Inconclusive} unitTest Defines the test which was be conducted.
	 * @param {ResultStatus=} status result status of test.
	 * @param {string=} message Result summary message.
     * @param {*=} detail Detailed result information.
     * @param {*=} stateInfo Arbitrary state information which is carried through the test.
     */
	function TestResult(unitTest, status, message, detail, stateInfo) {
        this.unitTest = unitTest;
        this.stateInfo = stateInfo;
        if (Utility.isNil(status) && Utility.isNil(message) && Utility.isNil(detail) && !Utility.isNil(unitTest)) {
            try {
                var returnValue = unitTest.evaluator.apply(this, Utility.toArray(args));
                var success = unitTest.assertion.call(this, returnValue);
                if (typeof(success) == "boolean")
                    status = (success) ? ResultStatus.Pass : ResultStatus.Fail;
                else if (typeof(success) == "number") {
                    if (isNaN(success) || success < ResultStatus.Inconclusive || success > ResultStatus.Error)
                        status = ResultStatus.Inconclusive;
                    else
                        status = success;
                } else if (Utility.isNil(success))
                    status = this.status;
                else {
                    message = Utility.convertToString(success, "").trim();
                    if (message == 0)
                        message = this.message;
                }
                detail = this.detail;
            } catch (err) {
                message = Utility.convertToString(this.message, "").trim();
                detail = (typeof(this.detail) == "undefined") ? { } : { detail: this.detail };
                if (typeof(err) == "object") {
                    if (typeof(err.message) != "undefined") {
                        if (message.length == 0)
                            message = err.message;
                        else if (message != err.message)
                            detail.message = err.message;
                    }
                    if (!Utility.isNil(err.stack))
                        detail.stackTrace = Utility.convertToString(err.stack);
                } else if (typeof(err) == "string") {
                    if (message.length == 0)
                        message = err;
                    else if (message != err)
                        detail.error = err;
                }
                else
                    detail.error = Utility.stringifyDeep(err);
            }
        }
        this.status = Utility.asNumber(status, ResultStatus.Inconclusive);
        if (this.status < ResultStatus.Inconclusive)
            this.status = ResultStatus.Inconclusive;
        else if (this.status > ResultStatus.Error)
            this.status = ResultStatus.Error;
        this.message = Utility.convertToString(message, "");
        if (Utility.isNil(detail))
            this.detail = undefined;
        else if (typeof(detail) == "string ")
            this.detail = detail;
        else
            this.detail = Utility.stringifyDeep(detail);
        if (this.message.length > 0)
            return;
        switch (this.status) {
            case ResultStatus.Inconclusive:
                this.message = "Results are inconclusive.";
                break;
            case ResultStatus.NotEvaluated:
                this.message = "Test was not evaluated.";
                break;
            case ResultStatus.Debug:
                this.message = "Test Debug Output.";
                break;
            case ResultStatus.Info:
                this.message = "Test Information.";
                break;
            case ResultStatus.Pass:
                this.message = "Passed.";
                break;
            case ResultStatus.Warning:
                this.message = "Passed with warning.";
                break;
            case ResultStatus.Fail:
                this.message = "Test failed.";
                break;
            case ResultStatus.Error:
                this.message = "An unexpected error has occurred.";
                break;
        }
	}
	return TestResult;
})(JsUnitTesting.Utility, JsUnitTesting.UnitTest, JsUnitTesting.ResultStatus);