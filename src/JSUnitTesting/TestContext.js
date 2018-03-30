function TestContext(unitTest, testCollection, index, stateInfo) {
    this.getTestName = function() { return unitTest.name; };
    this.getTestDescription = function() { return unitTest.description; };
    this.getTestId = function() { return unitTest.id; };
    this.stateInfo = stateInfo;
    this.state = ResultStatus.Inconclusive;
    this.assert = new Assert();
    try {
        this.result = unitTest.evaluator.apply(this, unitTest.args);
        var state = unitTest.assertion.call(this, this.result);
        if (typeof(state) === "number" && !isNaN(state))
            this.state = state;
    } catch (e) {
        this.state = ResultStatus.Error;
        if (typeof(this.detail) == "undefined")
            this.detail = { };
        else
            this.detail = { detail: this.detail };
        if (typeof(e.message) != null)
            this.detail.error = e.message;
        else
            this.detail.error = e;
        if (typeof(e.stack) != null)
            this.detail.stackTrace = e.stack;
    }
    this.result = new TestResult(unitTest, this.state, this.message, this.detail, this.stateInfo);
}