"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("./TypeUtil");
var AssertionTesting;
(function (AssertionTesting) {
    var ResultStatusValue;
    (function (ResultStatusValue) {
        ResultStatusValue[ResultStatusValue["notEvaluated"] = -1] = "notEvaluated";
        ResultStatusValue[ResultStatusValue["inconclusive"] = 0] = "inconclusive";
        ResultStatusValue[ResultStatusValue["pass"] = 1] = "pass";
        ResultStatusValue[ResultStatusValue["fail"] = 2] = "fail";
        ResultStatusValue[ResultStatusValue["error"] = 3] = "error";
    })(ResultStatusValue = AssertionTesting.ResultStatusValue || (AssertionTesting.ResultStatusValue = {}));
    var NotEvaluated_Value = ResultStatusValue.notEvaluated;
    var NotEvaluated_Type = "notEvaluated";
    var NotEvaluated_Title = "Not Evaluated";
    var ResultStatus = (function () {
        function ResultStatus(value, message) {
            this._statusValue = NotEvaluated_Value;
            this._rawValue = NotEvaluated_Value;
            this._message = NotEvaluated_Title;
            this._type = NotEvaluated_Type;
            if (!util.TypeUtil.nil(value))
                this.rawValue = value;
            var m = util.TypeUtil.asString(message, "");
            if (m.trim().length > 0)
                this.message = m;
        }
        Object.defineProperty(ResultStatus.prototype, "statusValue", {
            get: function () { return this._statusValue; },
            set: function (value) { this.rawValue = ResultStatus.asStatusValue(value); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ResultStatus.prototype, "rawValue", {
            get: function () { return this._rawValue; },
            set: function (value) {
                var oldValue = this._statusValue;
                this._rawValue = util.TypeUtil.asNumber(value, NotEvaluated_Value);
                this._statusValue = ResultStatus.asStatusValue(this._rawValue);
                if (this._statusValue == oldValue)
                    return;
                this._type = ResultStatus.getType(this._statusValue);
                var m = ResultStatus.getTitle(oldValue);
                if (this._message.trim().toLowerCase() == m)
                    this._message = m;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ResultStatus.prototype, "message", {
            get: function () { return this._message; },
            set: function (value) {
                this._message = util.TypeUtil.asString(value, "");
                if (this._message.trim().length == 0)
                    this._message = ResultStatus.getTitle(this._statusValue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ResultStatus.prototype, "type", {
            get: function () { return this._type; },
            enumerable: true,
            configurable: true
        });
        ResultStatus.asStatusValue = function (value) {
            var v = util.TypeUtil.asNumber(value, NotEvaluated_Value);
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
        };
        ResultStatus.getType = function (value) {
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
        };
        ResultStatus.getTitle = function (value) {
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
        };
        return ResultStatus;
    }());
    AssertionTesting.ResultStatus = ResultStatus;
    var TestResult = (function () {
        function TestResult(value, error, status, testIndex, dataIndex) {
            this._testId = "";
            this._testIndex = null;
            this._dataIndex = null;
            this._description = "";
            this._error = null;
            if (util.TypeUtil.nil(status)) {
                if (util.TypeUtil.nil(error))
                    this._status = new ResultStatus((util.TypeUtil.nil(value)) ? ResultStatusValue.notEvaluated : ResultStatusValue.pass);
                else
                    this._status = new ResultStatus((error.isWarning) ? ResultStatusValue.inconclusive : ResultStatusValue.error, error.message);
            }
            else if (util.TypeUtil.nil(error))
                this._status = new ResultStatus(status);
            else
                this._status = new ResultStatus(status, error.message);
            if (!util.TypeUtil.nil(value)) {
                if (util.TypeUtil.derivesFrom(value, TestDefinition)) {
                }
                else
                    this._description = util.TypeUtil.asString(value, "");
            }
            if (!util.TypeUtil.nil(error))
                this._error = error;
        }
        Object.defineProperty(TestResult.prototype, "status", {
            get: function () { return this._status; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TestResult.prototype, "testId", {
            get: function () { return this._testId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TestResult.prototype, "testIndex", {
            get: function () { return this._testIndex; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TestResult.prototype, "dataIndex", {
            get: function () { return this._dataIndex; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TestResult.prototype, "description", {
            get: function () { return this._description; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TestResult.prototype, "error", {
            get: function () { return this._error; },
            enumerable: true,
            configurable: true
        });
        return TestResult;
    }());
    AssertionTesting.TestResult = TestResult;
    var TestDefinition = (function () {
        function TestDefinition(testId, testMethod, iteration) {
            this._description = "";
            this._lastResult = new ResultStatus();
            this._testId = util.TypeUtil.asString(testId, "");
            if (util.TypeUtil.nil(testMethod))
                throw new Error("Test method must be defined.");
            if (util.TypeUtil.isFunction(testMethod))
                this._testMethod = testMethod;
            else {
                this._testMethod = testMethod.callback;
                this._description = util.TypeUtil.asString(testMethod.description, "");
            }
            if (util.TypeUtil.nil(iteration))
                this._iterations = [{ args: [] }];
            else if (Array.isArray(iteration))
                this._iterations = iteration;
            else
                this._iterations = [iteration];
        }
        Object.defineProperty(TestDefinition.prototype, "testId", {
            get: function () { return this._testId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TestDefinition.prototype, "description", {
            get: function () { return this._description; },
            set: function (value) { this._description = util.TypeUtil.asString(value, ""); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TestDefinition.prototype, "iterations", {
            get: function () { return this._iterations; },
            set: function (value) { this._iterations = (util.TypeUtil.nil(value)) ? [] : ((Array.isArray(value)) ? value : [value]); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TestDefinition.prototype, "lastResult", {
            get: function () { return this._lastResult; },
            enumerable: true,
            configurable: true
        });
        TestDefinition.prototype.invoke = function (testIndex, thisObj) {
            if (util.TypeUtil.nil(thisObj))
                thisObj = {
                    test: {
                        id: this._testId,
                        lastResult: this._lastResult,
                        index: testIndex
                    },
                    description: this._description,
                    iteration: {}
                };
            else if (util.TypeUtil.isNonArrayObject(thisObj)) {
                if (!util.TypeUtil.isNonArrayObject(thisObj.test)) {
                    thisObj.test = {
                        id: this._testId,
                        lastResult: this._lastResult,
                        index: testIndex,
                        data: thisObj.test
                    };
                }
                if (!util.TypeUtil.isNonArrayObject(thisObj.iteration))
                    thisObj.iteration = { data: thisObj.iteration };
            }
            else
                thisObj = {
                    test: {
                        id: this._testId,
                        lastResult: this._lastResult,
                        index: testIndex
                    },
                    description: this._description,
                    iteration: {},
                    data: thisObj
                };
            var iterations = this._iterations;
            if (iterations.length == 0)
                iterations.push({ args: [] });
            for (var iterationIndex = 0; iterationIndex < iterations.length; iterationIndex++) {
                var iterationSettings = iterations[iterationIndex];
                if (util.TypeUtil.nil(iterationSettings))
                    iterationSettings = { args: [] };
                else if (!util.TypeUtil.isNonArrayObject(iterationSettings)) {
                    if (Array.isArray(iterationSettings))
                        iterationSettings = { args: iterationSettings };
                    else
                        iterationSettings = { args: [], metaData: { data: iterationSettings } };
                }
                else if (util.TypeUtil.nil(iterationSettings.args))
                    iterationSettings.args = [];
                else if (!Array.isArray(iterationSettings.args)) {
                    if (util.TypeUtil.isNonArrayObject(iterationSettings.metaData))
                        iterationSettings.metaData.data = iterationSettings.args;
                    else
                        iterationSettings.metaData = { data: iterationSettings.args };
                    iterationSettings.args = [];
                }
                if (util.TypeUtil.isNonArrayObject(thisObj.test)) {
                    thisObj.test.id = this._testId;
                    thisObj.test.lastResult = this._lastResult;
                    thisObj.test.index = testIndex;
                }
                else
                    thisObj.test = {
                        id: this._testId,
                        lastResult: this._lastResult,
                        index: testIndex
                    };
                thisObj.description = this._description;
                if (!util.TypeUtil.isNonArrayObject(thisObj.iteration))
                    thisObj.iteration = {
                        index: iterationIndex,
                        description: iterationSettings.description,
                        metaData: iterationSettings.metaData
                    };
                else {
                    thisObj.iteration.index = iterationIndex;
                    thisObj.description = iterationSettings.description;
                    thisObj.metaData = iterationSettings.metaData;
                }
                var result = void 0;
                try {
                    var output = this._testMethod.apply(thisObj, iterationSettings.args);
                    result = thisObj.result;
                    if (util.TypeUtil.nil(result))
                        result = { status: ResultStatusValue.pass };
                    else if (util.TypeUtil.isString(result))
                        result = { message: result, status: ResultStatusValue.pass };
                    else if (util.TypeUtil.isNumber(result))
                        result = { status: result };
                    else if (util.TypeUtil.derivesFrom(result, util.TypeUtil.ErrorInfo))
                        result = { status: (result.isWarning) ? ResultStatusValue.inconclusive : ResultStatusValue.error, error: result };
                    else if (util.TypeUtil.derivesFrom(result, Error))
                        result = { status: ResultStatusValue.error, error: new util.TypeUtil.ErrorInfo(result) };
                    else if (!util.TypeUtil.isNonArrayObject(result))
                        result = { status: ResultStatusValue.pass, message: util.TypeUtil.asString(result, null) };
                    else if (util.TypeUtil.nil(result.status))
                        result.status = ResultStatusValue.pass;
                }
                catch (err) {
                    result = { status: ResultStatusValue.error, error: err };
                }
                if (util.TypeUtil.derivesFrom(result.error, Error))
                    result.error = new util.TypeUtil.ErrorInfo(result.error);
                else if (!util.TypeUtil.nil(result.error) && !util.TypeUtil.derivesFrom(result.error, util.TypeUtil.ErrorInfo))
                    result.error = new util.TypeUtil.ErrorInfo(result.error);
                if (util.TypeUtil.nil(result.message) || (result.message = util.TypeUtil.asString(result.message, "")).trim().length == 0) {
                    if (!util.TypeUtil.nil(result.error) && !util.TypeUtil.nil(result.error.message) && (result.error.message = util.TypeUtil.asString(result.error.message, "").trim()).length > 0)
                        result.message = result.error.message;
                    else
                        result.message = "";
                }
                if (result.message.trim().length == 0)
                    result.message = ResultStatus.getTitle(result.status);
                this._lastResult = new ResultStatus(result.status, result.message);
                if (this._lastResult.statusValue != ResultStatusValue.pass)
                    break;
            }
            return this._lastResult.statusValue;
        };
        return TestDefinition;
    }());
    AssertionTesting.TestDefinition = TestDefinition;
})(AssertionTesting || (AssertionTesting = {}));
//# sourceMappingURL=AssertionTesting.js.map