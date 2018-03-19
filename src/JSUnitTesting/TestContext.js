function TestContext(unitTest, testCollection, index, stateInfo) {
    this.getTestName = function() { return unitTest.name; };
    this.getTestDescription = function() { return unitTest.description; };
    this.getTestId = function() { return unitTest.id; };
    this.stateInfo = stateInfo;
    this.state = ResultStatus.Inconclusive;
    this.assert = new Assert();
    try {
        this.result = evaluator.apply(this, unitTest.args);
        var state = assertion.call(this, this.result);
        if (typeof(state) === "number" && !isNaN(state))
            this.state = state;
        var m = Utility.convertToString(ar, "").trim();
    } catch (e) {
        this.state = ResultStatus.Error;
        this.error = e;
    }
    this.result = new TestResult(unitTest, this.state, this.message, this.detail, this.stateInfo);
}