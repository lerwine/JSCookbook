import { TypeUtil as typeUtil } from './TypeUtil';
export var AssertionTesting;
(function (AssertionTesting) {
    let ResultStatusValue;
    (function (ResultStatusValue) {
        ResultStatusValue[ResultStatusValue["notEvaluated"] = -1] = "notEvaluated";
        ResultStatusValue[ResultStatusValue["inconclusive"] = 0] = "inconclusive";
        ResultStatusValue[ResultStatusValue["pass"] = 1] = "pass";
        ResultStatusValue[ResultStatusValue["fail"] = 2] = "fail";
        ResultStatusValue[ResultStatusValue["error"] = 3] = "error";
    })(ResultStatusValue = AssertionTesting.ResultStatusValue || (AssertionTesting.ResultStatusValue = {}));
    const NotEvaluated_Value = ResultStatusValue.notEvaluated;
    const NotEvaluated_Type = "notEvaluated";
    const NotEvaluated_Title = "Not Evaluated";
    function isIResultStatus(value) {
        return typeUtil.isNonArrayObject(value) && typeUtil.isNumber(value.statusValue) && typeUtil.isString(value.message);
    }
    AssertionTesting.isIResultStatus = isIResultStatus;
    class AssertionError extends Error {
        constructor(message, isInconclusive) {
            super(message);
            this._isInconclusive = false;
            if (typeUtil.isBoolean(isInconclusive))
                this._isInconclusive = isInconclusive;
        }
        get isInconclusive() { return this._isInconclusive; }
    }
    AssertionTesting.AssertionError = AssertionError;
    function inconclusive(message) { throw new AssertionError(message, true); }
    AssertionTesting.inconclusive = inconclusive;
    function fail(message) { throw new AssertionError(message); }
    AssertionTesting.fail = fail;
    function areEqual(expected, actual, message) {
        if (expected === actual)
            return;
        if (typeUtil.isNilOrWhitespace(message))
            fail("Expected: " + typeUtil.serializeToString(expected) + "; Actual: " + typeUtil.serializeToString(actual));
        fail("Expected: " + typeUtil.serializeToString(expected) + "; Actual: " + typeUtil.serializeToString(actual) + " (" + message + ")");
    }
    AssertionTesting.areEqual = areEqual;
    function areAlike(expected, actual, message) {
        if (expected == actual)
            return;
        if (typeUtil.isNilOrWhitespace(message))
            fail("Expected: " + typeUtil.serializeToString(expected) + "; Actual: " + typeUtil.serializeToString(actual));
        fail("Expected: " + typeUtil.serializeToString(expected) + "; Actual: " + typeUtil.serializeToString(actual) + " (" + message + ")");
    }
    AssertionTesting.areAlike = areAlike;
    function areNotEqual(expected, actual, message) {
        if (expected !== actual)
            return;
        if (typeUtil.isNilOrWhitespace(message))
            fail("Not Expected: " + typeUtil.serializeToString(expected) + "; Actual: " + typeUtil.serializeToString(actual));
        fail("Not Expected: " + typeUtil.serializeToString(expected) + "; Actual: " + typeUtil.serializeToString(actual) + " (" + message + ")");
    }
    AssertionTesting.areNotEqual = areNotEqual;
    function areNotAlike(expected, actual, message) {
        if (expected != actual)
            return;
        if (typeUtil.isNilOrWhitespace(message))
            fail("Not Expected: " + typeUtil.serializeToString(expected) + "; Actual: " + typeUtil.serializeToString(actual));
        fail("Not Expected: " + typeUtil.serializeToString(expected) + "; Actual: " + typeUtil.serializeToString(actual) + " (" + message + ")");
    }
    AssertionTesting.areNotAlike = areNotAlike;
    class ResultStatus {
        constructor(value, message) {
            this._statusValue = NotEvaluated_Value;
            this._rawValue = NotEvaluated_Value;
            this._message = NotEvaluated_Title;
            this._type = NotEvaluated_Type;
            if (!typeUtil.nil(value))
                this.rawValue = value;
            let m = typeUtil.asString(message, "");
            if (m.trim().length > 0)
                this.message = m;
        }
        get statusValue() { return this._statusValue; }
        set statusValue(value) { this.rawValue = ResultStatus.asStatusValue(value); }
        get rawValue() { return this._rawValue; }
        set rawValue(value) {
            var oldValue = this._statusValue;
            this._rawValue = typeUtil.asNumber(value, NotEvaluated_Value);
            this._statusValue = ResultStatus.asStatusValue(this._rawValue);
            if (this._statusValue == oldValue)
                return;
            this._type = ResultStatus.getType(this._statusValue);
            let m = ResultStatus.getTitle(oldValue);
            if (this._message.trim().toLowerCase() == m)
                this._message = m;
        }
        get message() { return this._message; }
        set message(value) {
            this._message = typeUtil.asString(value, "");
            if (this._message.trim().length == 0)
                this._message = ResultStatus.getTitle(this._statusValue);
        }
        get type() { return this._type; }
        static asStatusValue(value) {
            let v = typeUtil.asNumber(value, NotEvaluated_Value);
            switch (v) {
                case ResultStatusValue.inconclusive:
                case ResultStatusValue.pass:
                case ResultStatusValue.fail:
                case ResultStatusValue.error:
                    return v;
            }
            if (v > ResultStatusValue.error)
                return ResultStatusValue.error;
            return ResultStatusValue.notEvaluated;
        }
        static getType(value) {
            switch (ResultStatus.asStatusValue(value)) {
                case ResultStatusValue.inconclusive:
                    return "inconclusive";
                case ResultStatusValue.pass:
                    return "pass";
                case ResultStatusValue.fail:
                    return "fail";
                case ResultStatusValue.error:
                    return "error";
            }
            return NotEvaluated_Type;
        }
        static getTitle(value) {
            switch (ResultStatus.asStatusValue(value)) {
                case ResultStatusValue.inconclusive:
                    return "Inconclusive";
                case ResultStatusValue.pass:
                    return "Passed";
                case ResultStatusValue.fail:
                    return "Failed";
                case ResultStatusValue.error:
                    return "Unexpected Error";
            }
            return NotEvaluated_Title;
        }
    }
    AssertionTesting.ResultStatus = ResultStatus;
    class TestResult {
        constructor(value, error, status, testIndex, dataIndex) {
            this._testId = "";
            this._testIndex = null;
            this._dataIndex = null;
            this._description = "";
            this._error = null;
            if (typeUtil.nil(status)) {
                if (typeUtil.nil(error))
                    this._status = new ResultStatus((typeUtil.nil(value)) ? ResultStatusValue.notEvaluated : ResultStatusValue.pass);
                else
                    this._status = new ResultStatus((error.isWarning) ? ResultStatusValue.inconclusive : ResultStatusValue.error, error.message);
            }
            else if (!typeUtil.isNumber(status))
                this._status = status;
            else if (typeUtil.nil(error))
                this._status = new ResultStatus(status);
            else
                this._status = new ResultStatus(status, error.message);
            if (!typeUtil.nil(value)) {
                if (typeUtil.derivesFrom(value, TestDefinition)) {
                }
                else
                    this._description = typeUtil.asString(value, "");
            }
            if (!typeUtil.nil(error))
                this._error = error;
        }
        get status() { return this._status; }
        get testId() { return this._testId; }
        get testIndex() { return this._testIndex; }
        get dataIndex() { return this._dataIndex; }
        get description() { return this._description; }
        get error() { return this._error; }
    }
    AssertionTesting.TestResult = TestResult;
    class TestDefinition {
        constructor(testId, testMethod, iteration) {
            this._description = "";
            this._lastResult = new ResultStatus();
            this._testId = typeUtil.asString(testId, "");
            if (typeUtil.nil(testMethod))
                throw new Error("Test method must be defined.");
            if (typeUtil.isFunction(testMethod))
                this._testMethod = testMethod;
            else {
                this._testMethod = testMethod.callback;
                this._description = typeUtil.asString(testMethod.description, "");
            }
            if (typeUtil.nil(iteration))
                this._iterations = [{ args: [] }];
            else if (Array.isArray(iteration))
                this._iterations = iteration;
            else
                this._iterations = [iteration];
        }
        get testId() { return this._testId; }
        get description() { return this._description; }
        set description(value) { this._description = typeUtil.asString(value, ""); }
        get iterations() { return this._iterations; }
        set iterations(value) { this._iterations = (typeUtil.nil(value)) ? [] : ((Array.isArray(value)) ? value : [value]); }
        get lastResult() { return this._lastResult; }
        invoke(testIndex, thisObj) {
            if (typeUtil.nil(thisObj))
                thisObj = {};
            else if (!typeUtil.isNonArrayObject(thisObj))
                thisObj = { thisObj: thisObj };
            let iterations = this._iterations;
            if (iterations.length == 0)
                iterations.push({ args: [] });
            for (var iterationIndex = 0; iterationIndex < iterations.length; iterationIndex++) {
                let iterationSettings = iterations[iterationIndex];
                if (typeUtil.nil(iterationSettings))
                    iterationSettings = { args: [] };
                else if (!typeUtil.isNonArrayObject(iterationSettings)) {
                    if (Array.isArray(iterationSettings))
                        iterationSettings = { args: iterationSettings };
                    else
                        iterationSettings = { args: [], metaData: { data: iterationSettings } };
                }
                else if (typeUtil.nil(iterationSettings.args))
                    iterationSettings.args = [];
                else if (!Array.isArray(iterationSettings.args)) {
                    if (typeUtil.isNonArrayObject(iterationSettings.metaData))
                        iterationSettings.metaData.data = iterationSettings.args;
                    else
                        iterationSettings.metaData = { data: iterationSettings.args };
                    iterationSettings.args = [];
                }
                let result;
                try {
                    var invocationInfo = {
                        test: {
                            id: this._testId,
                            index: testIndex,
                            lastResult: this._lastResult
                        },
                        iteration: {
                            index: iterationIndex,
                            description: iterationSettings.description,
                            metaData: iterationSettings.metaData
                        }
                    };
                    var output = this._testMethod.call(thisObj, iterationSettings.args, invocationInfo);
                    if (typeUtil.nil(invocationInfo.result))
                        result = new TestResult(this, undefined, ResultStatusValue.pass, testIndex, iterationIndex);
                    else if (typeUtil.isString(invocationInfo.result))
                        result = new TestResult(this, undefined, new ResultStatus(ResultStatusValue.pass, invocationInfo.result), testIndex, iterationIndex);
                    else if (typeUtil.isNumber(invocationInfo.result))
                        result = new TestResult(this, undefined, invocationInfo.result, testIndex, iterationIndex);
                    else if (typeUtil.derivesFrom(invocationInfo.result, typeUtil.ErrorInfo))
                        result = new TestResult(this, invocationInfo.result, (invocationInfo.result.isWarning) ? ResultStatusValue.inconclusive : ResultStatusValue.error, testIndex, iterationIndex);
                    else if (typeUtil.derivesFrom(result, Error))
                        result = new TestResult(this, new typeUtil.ErrorInfo(invocationInfo.result), ResultStatusValue.error, testIndex, iterationIndex);
                    else
                        result = new TestResult(this, undefined, new ResultStatus(ResultStatusValue.pass, typeUtil.asString(result, null)), testIndex, iterationIndex);
                }
                catch (err) {
                    result = new TestResult(this, new typeUtil.ErrorInfo(err), ResultStatusValue.error, testIndex, iterationIndex);
                }
                this._lastResult = result.status;
                if (this._lastResult.statusValue != ResultStatusValue.pass)
                    break;
            }
            return this._lastResult.statusValue;
        }
    }
    AssertionTesting.TestDefinition = TestDefinition;
})(AssertionTesting || (AssertionTesting = {}));
//# sourceMappingURL=AssertionTesting.js.map