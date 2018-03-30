var AssertionTesting = AssertionTesting || {};

(function() {
    var newLineString = "\n";
    var whitespaceRegex = /^\s*$/g;
    var trimEndRegex = /^(\s*\S+(\s+\S+)*)/;
    var lineSplitRegex = /\r\n?|\n/g;
    var boolRegex = /^(?:(t(?:rue)?|y(?:es)?|[+-]?(?:0*[1-9]\d*(?:\.\d+)?|0+\.0*[1-9]\d*)|\+)|(f(?:alse)?|no?|[+-]?0+(?:\.0+)?|-))$/i;
    function defined(value) { return typeof(value) !== "undefined"; }
    function isString(value) { return typeof(value) === "string"; }
    function isFunction(value) { return typeof(value) === "function"; }
    function isBoolean(value) { return typeof(value) === "boolean"; }
    function isNumber(value) { return typeof(value) === "number" && !isNaN(value); }
    function nil(value) { return !defined(value) || value === null; }
    function isNilOrEmptyString(s) { return !isString(value) || value.length == 0; }
    function isNilOrWhitespace(s) { return !isString(value) || whitespaceRegex.test(value); }
    function asString(value, defaultValue, ignoreWhitespace) {
        if (!defined(value)) {
            if (nil(defaultValue))
                return defaultValue;
            return asString(defaultValue);
        }
        if (value === null) {
            if (nil(defaultValue))
                return value;
            return asString(defaultValue);
        }
        if (!isString(value))
            value = (Array.isArray(value)) ? value.join(newLine) : (function() {
                try {
                    var s = value.toString();
                    if (isString(s))
                        return s;
                } catch (e) { }
                return value + "";
            })();
        if ((ignoreWhitespace) ? whitespaceRegex.test(value) : value.length == 0) {
            var d = asString(defaultValue);
            if (isString(d))
                return d;
        }
        return value;
    }
    function asNumber(value, defaultValue) {
        if (!defined(value)) {
            if (nil(defaultValue))
                return defaultValue;
            return asNumber(defaultValue);
        }
        if (value === null) {
            if (nil(defaultValue))
                return value;
            return asNumber(defaultValue);
        }
        if (typeof(value) !== "number") {
            if (isFunction(value.valueOf)) {
                try {
                    var n = value.valueOf();
                    if (isNumber(n))
                        return n;
                    if (!nil(n))
                        value = n;
                } catch (e) { }
            }
            if (isBoolean(value))
                return (value) ? 1 : 0;
            value = asString(value, "").trim();
            value = (value.length == 0) ? NaN : parseFloat(value);
        }
        
        if (isNaN(value) && !nil(defaultValue))
            return asNumber(defaultValue);
        return value;
    }
    function asInteger(value, defaultValue) {
        value = asNumber(value, defaultValue);
        if (isNaN(value) || Number.isInteger(value))
            return value;
        return Math.round(value);
    }
    function asBoolean(value, defaultValue) {
        if (typeof(value) !== "boolean")
            return value;
    
        if (!defined(value)) {
            if (nil(defaultValue))
                return defaultValue;
            return asBoolean(defaultValue);
        }
        if (value === null) {
            if (nil(defaultValue))
                return value;
            return asBoolean(defaultValue);
        }
        if (typeof(value) === "number")
            return !isNaN(value) && value != 0;
        if (isFunction(value.valueOf)) {
            try {
                var n = value.valueOf();
                if (isNumber(n))
                    return n != 0;
                if (isBoolean(value))
                    return value;
                if (!nil(n))
                    value = n;
            } catch (e) { }
        }
        var mg = boolRegex.exec(asString(value, "").trim());
        if (nil(mg))
            return asBoolean(defaultValue);
        return nil(mg[2]);
    }
    function getClassName(value) {
        if (!nil(value)) {
            var p = (isFunction(value)) ? value : Object.getPrototypeOf(value);
            var b = Object.getPrototypeOf(p);
            while (!nil(b)) {
                var n;
                if (!nil(p.constructor)) {
                    n = asString(p.constructor.name, "");
                    if (n.length > 0) {
                        if (n == "Object" && nil(Object.getPrototypeOf(p)))
                            break;
                        return n;
                    }
                }
                n = asString(p.name, "");
                if (n.length > 0)
                    return n;
                p = b;
                b = Object.getPrototypeOf(p);
            }
        }
        return typeof(value);
    }
    function derivesFrom(value, classFunc) {
        if (!defined(classFunc))
            return !defined(value);
        if (!defined(value))
            return false;
        if (classFunc === null)
            return value === null && typeof(value) == typeof(classFunc);
        if (value === null)
            return false;
        if (!isFunction(classFunc)) {
            classFunc = Object.getPrototypeOf(classFunc);
            if (nil(classFunc))
                return false;
            classFunc = classFunc.constructor;
            if (nil(classFunc))
                return false;
        }
        if (value instanceof classFunc)
            return true;
        var p = (isFunction(value.constructor)) ? value : Object.getPrototypeOf(value);
        while (!nil(p)) {
            if (isFunction(p.constructor) && p.constructor == classFunc)
                return true;
        }
        return false;
    }
    function typeOfX(value) {
        var t = typeof(value);
        if (t == "object") {
            if (value === null)
                return "null";
        } else if (t != "function") {
            if (t == "number" && isNaN(value))
                return "NaN";
            return t;
        }
    
        var n = getClassName(value);
        if (n == t)
            return t;
        return t + " " + n;
    }
    function stringifyX(obj) {
        if (!defined(obj))
            return "undefined";
        if (obj === null)
            return "null";
        if (typeof(obj) == "number")
            return (isNaN(obj)) ? "NaN" : JSON.stringify(obj, undefined, "\t");
        if (typeof(obj.toJSON) == "function" || typeof(obj) == "boolean" || typeof(obj) == "string")
            return JSON.stringify(obj, undefined, "\t");
        if (typeof(obj) != "object")
            return obj.toString();
        if (Array.isArray(obj)) {
            if (obj.length == 0)
                return "[]";
            return "[\n" + obj.map(function(e) {
                if (!defined(e))
                    return "undefined";
                if (e === null)
                    return "null";
                if (typeof(e) == "number")
                    return (isNaN(e)) ? "NaN" : JSON.stringify(e, undefined, "\t");
                if (typeof(e.toJSON) == "function" || typeof(e) == "boolean" || typeof(e) == "string" ||
                        typeof(e) == "object")
                    return JSON.stringify(e, undefined, "\t");
                return e.toString();
            }).map(function(s) {
                s.split(/\r\n?|\n/).map(function(l) { return "\t" + l; }).join("\n");
            }).join(",\n") + "\n]";
        }
        var lines = [];
        for (var n in obj) {
            var v = obj[n];
            if (!defined(v))
                lines.push(JSON.stringify(n) + ": undefined");
            else if (v === null)
                lines.push(n + ((typeof(v) == "number") ? ": NaN" : ": null"));
            else if (typeof(v) == "number")
                lines.push(JSON.stringify(n) + ": " + ((isNaN(v)) ? "NaN" : JSON.stringify(v, undefined, "\t")));
            else if (typeof(v.toJSON) == "function" || typeof(v) == "boolean" || typeof(v) == "string" ||
                    typeof(ovbj) == "object")
                lines.push(JSON.stringify(n) + ": " + JSON.stringify(v, undefined, "\t"));
            else
                lines.push(JSON.stringify(n) + ": " + v.toString());
        }
        if (lines.length == 0)
            return "{}";
        return "{\n" + lines.map(function(s) {
            s.split(/\r\n?|\n/).map(function(l) { return "\t" + l; }).join("\n");
        }).join(",\n") + "\n}";
    }
    var ucFirstRegex = /^([^a-zA-Z\d]*[a-z])(.+)?$/g;
    function ucFirst(value) {
        if (!nil(value)) {
            var mg = ucFirstRegex.exec(asString(value, ""));
            if (!nil(mg)) {
                if (nil(mg[2]))
                    return mg[1].toUpperCase();
                return mg[1].toUpperCase() + mg[2];
            }
        }
        return value;
    }

    var util = {
        defined: defined,
        isString: isString,
        isFunction: isFunction,
        isBoolean: isBoolean,
        isNumber: isNumber,
        nil: nil,
        isNilOrEmptyString: isNilOrEmptyString,
        isNilOrWhitespace: isNilOrWhitespace,
        asString: asString,
        asNumber: asNumber,
        asInteger: asInteger,
        asBoolean: asBoolean,
        getClassName: getClassName,
        derivesFrom: derivesFrom
    };
    AssertionTesting.util = util;
    if (isFunction(Object.defineProperty)) {
        for (var n in AssertionTesting)
            Object.defineProperty(util, n, { enumerable: false, configurable: false, writable: false });
        Object.defineProperty(util, "name", { value: 'util', enumerable: true, configurable: false, writable: false });
        Object.defineProperty(AssertionTesting, "util", { enumerable: true, configurable: false, writable: false });
    } else
        util.name = "name";

    function ResultStatus(value, message) {
        if (isFunction(Object.defineProperties)) {
            var statusValue = asNumber(value, ResultStatus.allTypeValuePairs[0].value);
            var type = ResultStatus.getType(statusValue);
            var messageText = asString(message, "");
            if (messageText.trim().length == 0)
                messageText = ResultStatus.getTitle(statusValue);
            Object.defineProperties(this, {
                value: {
                    enumerable: true, configurable: false,
                    get: function() { return statusValue; },
                    set: function(value) {
                        var prevValue = statusValue;
                        statusValue = asNumber(value, ResultStatus.allTypeValuePairs[0].value);
                        // console.log("value: %d => %s", prevValue, JSON.stringify(statusValue));
                        if (prevValue == statusValue)
                            return;
                        type = ResultStatus.getType(statusValue);
                        // console.log("type: %d => %s", statusValue, JSON.stringify(type));
                        if (messageText == ResultStatus.getTitle(prevValue))
                            messageText = ResultStatus.getTitle(statusValue);
                        // console.log("message: %d => %s", statusValue, JSON.stringify(messageText));
                    }
                },
                type: {
                    enumerable: true, configurable: false,
                    get: function() { return type; }
                },
                message: {
                    enumerable: true, configurable: false,
                    get: function() { return messageText; },
                    set: function(message) {
                        messageText = asString(message, "");
                        if (messageText.trim().length == 0)
                            messageText = ResultStatus.getTitle(statusValue);
                    }
                }
            });
        } else {
            this.value = asNumber(value, ResultStatus.allTypeValuePairs[0].value);
            this.type = ResultStatus.getType(this.value);
            this.message = asString(message, "");
            if (this.message.trim().length == 0)
                this.message = this.message.getTitle(this.value);
        }
    }
    if (isFunction(Object.defineProperties)) {
        ResultStatus.prototype.valueOf = function() { return this.value; };
        ResultStatus.prototype.toString = function() { return "(" + this.value + ") " + this.message; };
    } else {
        ResultStatus.prototype.valueOf = function() {
            if (!isNumber(this.value))
                this.value = asNumber(this.value, ResultStatus.allTypeValuePairs[0].value);
            return this.value;
        };
        ResultStatus.prototype.toString = function() {
            if (!isString(this.message))
                this.message = asString(this.message, "");
            value = this.valueOf();
            if (this.message.trim().length == 0)
                this.message = ResultStatus.getTitle(value);
            return "(" + value + ") " + this.message;
        };
    }
    ResultStatus.notEvaluated = -1;
    ResultStatus.inconclusive = 0;
    ResultStatus.pass = 1;
    ResultStatus.fail = 2;
    ResultStatus.error = 3;
    ResultStatus.allTypeValuePairs = ["notEvaluated", "inconclusive", "pass", "fail", "error"]
        .map(function(n) { return { type: n, value: ResultStatus[n] }; })
        .filter(function(a) { return isNumber(a.value) && a.type != "length"; })
        .sort(function(a, b) { return a.value - b.value; });
    ResultStatus.getType = function(value) {
        // console.log("ResultStatus.getType = function(%s)", JSON.stringify(value));
        value = asNumber(value, null);
        // console.log("%s = asNumber(value, null)", JSON.stringify(value));
        var prev = ResultStatus.allTypeValuePairs[0];
        if (!isNumber(value) || value <= prev.value) {
            // console.log("(!isNumber(%s) || %s <= prev.value) == true", JSON.stringify(value), JSON.stringify(value));
            // console.log("return %s", JSON.stringify(prev.type));
            return prev.type;
        }
        for (var i = 1; i < ResultStatus.allTypeValuePairs.length; i++) {
            if (ResultStatus.allTypeValuePairs[i].value == value) {
                // console.log("ResultStatus.allTypeValuePairs[i].value == %s == true", JSON.stringify(value));
                // console.log("return %s", ResultStatus.allTypeValuePairs[i].type);
                return ResultStatus.allTypeValuePairs[i].type;
            }
            if (ResultStatus.allTypeValuePairs[i].value > value) {
                // console.log("ResultStatus.allTypeValuePairs[i].value > %s == true", JSON.stringify(value));
                break;
            }
            prev = ResultStatus.allTypeValuePairs[i];
            // console.log("prev = %s", JSON.stringify(prev));
        }
        // console.log("return %s", JSON.stringify(prev.type));
        return prev.type;
    };
    ResultStatus.getTitle = function(value) {
        switch (ResultStatus.getType(value)) {
            case "inconclusive":
                return "Inconclusive";
            case "pass":
                return "Passed";
            case "fail":
                return "Failed";
            case "error":
                return "Unexpected Error";
        }
        return "Not Evaluated";
    };
    ResultStatus.asResultStatus = function(value) {
        if (derivesFrom(value, ResultStatus))
            return value;
        return new ResultStatus(value);
    };
    if (isFunction(Object.defineProperty)) {
        ResultStatus.allTypeValuePairs.forEach(function(tvp) {
            Object.defineProperty(ResultStatus, tvp.type, { enumerable: true, configurable: false, writable: false });
        });
        Object.defineProperty(ResultStatus, "allTypeValuePairs", { enumerable: false, configurable: false, writable: false });
        Object.defineProperty(ResultStatus, "getType", { enumerable: false, configurable: false, writable: false });
        Object.defineProperty(ResultStatus, "getTitle", { enumerable: false, configurable: false, writable: false });
        Object.defineProperty(ResultStatus, "asResultStatus", { enumerable: false, configurable: false, writable: false });
    }
    ResultStatus.isResultStatus = function(e) { return !nil(e) && e instanceof ResultStatus; };
    AssertionTesting.ResultStatus = ResultStatus;
/*
    function TestResultBase(message) {
        this.message = asString(message, "");
    }
    TestResultBase.prototype.normalize = function() {
        this.message = asString(this.message, "");
    };
    TestResultBase.prototype.toJSON = function(name) {
        this.normalize();
        var jo = { message: this.message };
        for (var pn in this) {
            if (nil(this[pn]))
                jo[pn] = null;
            else if (derivesFrom(this[pn], RegExp))
                jo[pn] = this[pn].toString();
            else if (!isFunction(this[pn])) {  
                if (isFunction(this[pn].toJSON) || !derivesFrom(this[pn], Error))
                    jo[pn] = this[pn];
                else {
                    var e = { };
                    for (var n in this[pn]) {
                        if (!nil(this[pn][n]) && !isFunction(this[pn][n])) 
                            e[n] = this[pn][n];
                    }
                    if (nil(e.name) || (isString(e.name) && e.name.length == 0))
                        e.name = getClassName(e);
                    jo[pn] = e;
                }
            }
        }
        jo.message = this.message;
        return jo; // passed to stringify
    };
    function ErrorResults(error) {
        if (typeof(error) !== "object" || error === null || Array.isArray(error)) {
            TestResultBase.call(this, error);
            if (nil(error)) {
                this.isWarning = false;
                this.errorName = typeof(error);
                this.number = null;
                this.fileName = null;
                this.lineNumber = null;
                this.columnNumber = null;
                this.stack = null;
                return;
            }
        } else
            TestResultBase.call(this, asString(error.message, error.description));
        this.errorName = asString(error.name, "");
        if (this.errorName.trim().length == 0)
            this.errorName = asString(error.errorName, this.errorName);
        if (isBoolean(error.isWarning))
            this.isWarning = error.isWarning;
        else {
            var w = this.errorName.trim();
            this.isWarning = w.length > 3 && w.substr(0, 4).toLowerCase() == "warn";
        }
        this.number = asNumber(error.number, null);
        this.fileName = asString(error.fileName, null);
        this.lineNumber = asNumber(error.lineNumber, null);
        this.columnNumber = asNumber(error.columnNumber, null);
        this.stack = asString(error.stack, null);
        if (nil(error.innerError))
            this.innerError = null;
        else if (derivesFrom(error.innerError, ErrorResults))
            this.innerError = error.innerError;
        else
            this.innerError = new ErrorResults(error.innerError);
    }
    ErrorResults.prototype = TestResultBase.prototype;
    ErrorResults.prototype.constructor = ErrorResults;
    ErrorResults.prototype.normalize = function() {
        TestResultBase.prototype.normalize.call(this);
        this.isWarning = asBoolean(this.isWarning, false);
        this.errorName = asString(this.errorName, "");
        this.number = asNumber(this.number, null);
        this.fileName = asString(this.fileName, null);
        this.lineNumber = asNumber(this.lineNumber, null);
        this.columnNumber = asNumber(this.columnNumber, null);
        this.stack = asString(this.stack, null);
        this.innerError = (nil(this.innerError)) ? null : ((ErrorResults.isErrorResults(this.innerError)) ? this.innerError :
            new ErrorResults(this.innerError));
    };
    ErrorResults.prototype.toJSON = function(name) {
        var jo = TestResultBase.prototype.toJSON.call(this, name);
        jo.isWarning = this.isWarning;
        jo.errorName = this.errorName;
        jo.number = this.number;
        jo.fileName = this.fileName;
        jo.lineNumber = this.lineNumber;
        jo.columnNumber = this.columnNumber;
        jo.stack = this.stack;
        jo.innerError = this.innerError;
        return jo; // passed to stringify
    };
    ErrorResults.isErrorResults = function(e) { return !nil(e) && e instanceof ErrorResults; };
    AssertionTesting.ErrorResults = ErrorResults;

    function AssertionError(message, data, index, testId, description, resultStatus) {
        Error.call(this, message);
        this.data = data;
        this.index = asNumber(index, null);
        this.testId = asString(testId, null);
        this.description = asString(description, null);
        if (nil(resultStatus))
            this.resultStatus = ResultStatus.fail;
        else if (derivesFrom(resultStatus, ResultStatus))
            this.resultStatus = resultStatus;
        else
            this.resultStatus = new ResultStatus(resultStatus);
    }
    AssertionError.prototype = Error.prototype;
    AssertionError.prototype.constructor = AssertionError;

    function TestInfo(runFunc, id, data, enumerateData) {
        if (!isFunction(runFunc))
            throw new TypeError("runFunc must be a function");
        this.id = asString(id, "");
        this.data = data;
        this.enumerateData = asBoolean(enumerateData);
        this.lastResultStatus = new ResultStatus();
        this.lastResultMessage = this.lastResultStatus.toString();
        this.lastResult = null;
    }
    TestInfo.run = function(tests, thisObj) {
        if (nil(tests))
            return tests;
        if (!Array.isArray(tests))
            tests = [tests];
        
        if (nil(thisObj))
            thisObj = {
                util: util,
                assert: {
                    fail: function(description) {
                        throw new AssertionError(description, dataInfo.current, dataInfo.index, testInfo.id);
                    },
                    inconclusive: function(description) {
                        throw new AssertionError(description, dataInfo.current, dataInfo.index, testInfo.id, null, ResultStatus.inconclusive);
                    },
                    areEqual: function(expected, actual, description) {
                        if (defined(expected)) {
                            if (defined(actual) && expected === actual)
                                return;
                        } else if (!defined(actual))
                            return;
                        throw new AssertionError("Failed areEqual assertion - Expected: " + util.inspectify(expected) +
                            "; Actual: " + util.inspectify(actual), dataInfo.current, dataInfo.index, testInfo.id, description);
                    },
                    notEqual: function(notExpected, actual, description) {
                        if (defined(expected)) {
                            if (!defined(actual) || expected !== actual)
                                return;
                        } else if (defined(actual))
                            return;
                        throw new AssertionError("Failed notEqual assertion - Not expected: " + util.inspectify(actual), dataInfo.current, dataInfo.index, testInfo.id, description);
                    },
                    areLike: function(expected, actual, description) {
                        if (nil(expected)) {
                            if (nil(actual))
                                return;
                        } else if (!nil(actual) && expected == actual)
                            return;
                        throw new AssertionError("Failed areLike assertion - Expected: " + util.inspectify(expected) +
                            "; Actual: " + util.inspectify(actual), dataInfo.current, dataInfo.index, testInfo.id, description);
                    },
                    notLike: function(notExpected, actual, description) {
                        if (nil(expected)) {
                            if (!nil(actual))
                                return;
                        } else if (nil(actual) || expected !== actual)
                            return;
                        throw new AssertionError("Failed notLike assertion - Not expected: " + util.inspectify(expected) +
                            "; Actual: " + util.inspectify(actual), dataInfo.current, dataInfo.index, testInfo.id, description);
                    },
                    isDefined: function(actual, description) {
                        if (!defined(actual))
                            throw new AssertionError("Failed isDefined assertion - Defined vzlue expected", dataInfo.current, dataInfo.index, testInfo.id, description);
                    },
                    notDefined: function(actual, description) {
                        if (!defined(actual))
                            throw new AssertionError("Failed notDefined assertion - Undefined value expected; Actual: " + util.inspectify(actual), dataInfo.current, dataInfo.index, testInfo.id, description);
                    },
                    isNil: function(actual, description) {
                        if (!nil(actual))
                            throw new AssertionError("Failed isNil assertion - Null or Undefined value expected; Actual: " + util.inspectify(actual), dataInfo.current, dataInfo.index, testInfo.id, description);
                    },
                    notNil: function(actual, description) {
                        if (nil(actual))
                            throw new AssertionError("Failed notNil assertion - Null or Undefined value not expected; Actual: " + util.inspectify(actual), dataInfo.current, dataInfo.index, testInfo.id, description);
                    },
                    isNull: function(actual, description, objectOnly) {
                        if (!defined(actual) || actual !== null || (objectOnly && typeof(actual) == "number"))
                            throw new AssertionError("Failed isNull assertion - Null value expected; Actual: " + util.inspectify(actual), dataInfo.current, dataInfo.index, testInfo.id, description);
                    },
                    notNull: function(actual, description, objectOnly) {
                        if (!defined(actual) || (actual === null && (!objectOnly || typeof(actual) != "number")))
                            throw new AssertionError("Failed notNull assertion - Null value not expected; Actual: " + util.inspectify(actual), dataInfo.current, dataInfo.index, testInfo.id, description);
                    },
                    isTypeOf: function(expected, actual, description) {
                        
                    },
                    notTypeOf: function(notExpected, actual, description) {
                        
                    },
                    isInstanceOf: function(expected, actual, description) {
                        
                    },
                    notInstanceOf: function(notExpected, actual, description) {
                        
                    },
                    derivesFrom: function(expected, actual, description) {
                        
                    },
                    doesNotDeriveFrom: function(notExpected, actual, description) {
                        
                    },
                    isLessThan: function(maxExcl, actual, description) {
                        
                    },
                    notLessThan: function(minIncl, actual, description) {
                        
                    },
                    isGreaterThan: function(minExcl, actual, description) {
                        
                    },
                    notGreaterThan: function(maxIncl, actual, description) {
                        
                    },
                    inRange: function(min, max, description, minExcl, maxExcl) {
                        
                    },
                    outsideRange: function(lower, upper, description,xlowerIncl, upperIncl) {
                        
                    },
                    isTrue: function(actual, description, like) {
                        
                    },
                    isFalse: function(actual, description, like) {
                        
                    }
                }
            };
        return tests.map(function(ti, testIndex) {
            if (!derivesFrom(testInfo, TestInfo)) {
                if (typeof(testInfo) == "object") {

                }
            }
                return new TestResults(ucFirst(typeOfX(testInfo)) + " element at index " + testIndex +
                    " does not derive from AssertionTesting.TestInfo", ResultStatus.notRun, null, null, null, testInfo);
            var testInfo = new TestInfo(function() { }, "id", []);
            try {
                if (testInfo.enumerateData) {
    
                }
            } catch (ue) {

            }
            var iterationData = (testInfo.enumerateData && !nil(testInfo.data) && Array.isArray(testInfo.data)) ? testInfo.data :
                [testInfo.data];
            for (var dataIndex = 0; dataIndex < iterationData.length; dataIndex++) {

            }
        });
        this.evaluateNext = function() {
            nextIndex = dataInfo.index;
            try {
                var result;
                if (dataInfo.index === null) {
                    nextIndex = 1;
                    if (dataInfo.data.length == 0)
                        result = runFunc.call(thisObj);
                    else if (dataInfo.data.length == 1)
                        result = runFunc.call(thisObj, dataInfo.data[0]);
                    else {
                        dataInfo.index = 0;
                        result = runFunc.call(thisObj, dataInfo.data[0]);
                    }
                } else {
                    result = runFunc.call(thisObj, dataInfo.data[nextIndex]);
                    nextIndex++;
                }
            } finally {
                dataInfo.index = nextIndex;
                nextIndex = dataInfo.index + 1;
            }
            return (dataInfo.index < dataInfo.data.length);
        };
    }
    function TestResults(message, resultStatus, testInfo, dataIndex, error, output) {
        resultStatus = ResultStatus.asResultStatus(resultStatus);
        var m = asString(message, "").trim();
        if (m.length == 0) {
            if (!nil(error)) {
                m = asString(error.message, error.description).trim();
                if (m.length == 0)
                    m = asString(error, "").toString();
            }
            if (m.length == 0)
                m = asString(resultStatus.name, resultStatus.toString())
        }
        TestResultBase.call(this, m);
        this.resultStatus = resultStatus;
        this.description = null;
        this.testId = null;
        this.dataIndex = null;
        this.data = null;
        if (!nil(testInfo)) {
            this.testId = asString(testInfo.testId, null);
            this.dataIndex = asInteger(testInfo.dataIndex, null);
            if (defined(testInfo.data)) {
                var data = (typeof(data) == "object" && data !== null && Array.isArray(data)) ? testInfo.data : [testInfo.data];
                if (data.length > 0) {
                    if (this.dataIndex === null || this.dataIndex < 0)
                        this.data = (data.length == 1) ? data[0] : data;
                    else if (this.dataIndex < data.length) 
                        this.data = data[this.dataIndex];
                }
            }
        }
        if (!nil(error) && !nil(error.description)) {
            var d = asString(error.description, "").trim();
            if (d.length > 0 && d != this.message)
                this.description = d;
        }
        this.error = (nil(this.error)) ? null : ((ErrorResults.isErrorResults(this.error)) ? this.error :
            new ErrorResults(this.error));
        this.output = (isFunction(output)) ? output.toString() : ((defined(output)) ? ((typeof(output) == "number") ?
            ((isNaN(output)) ? "NaN" : output.toString()) : ((output === null) ? "null" : JSON.stringify(output, undefined, "\t"))) : "undefined ");
    }
    TestResults.prototype = TestResultBase.prototype;
    TestResults.prototype.constructor = TestResults;
    TestResults.prototype.normalize = function() {
        TestResultBase.prototype.normalize.call(this);
        this.resultStatus = ResultStatus.asResultStatus(this.resultStatus);
        this.description = asString(jo.description, null);
        this.testId = asString(jo.description, null);
        this.dataIndex = asInteger(jo.description, null);
        if (!defined(this.data))
            this.data = null;
        this.error = (nil(this.error)) ? null : ((ErrorResults.isErrorResults(this.error)) ? this.error :
            new ErrorResults(this.error));
    };
    TestResults.prototype.toJSON = function(name) {
        var jo = TestResultBase.prototype.toJSON.call(this, name);
        jo.resultStatus = this.resultStatus;
        jo.description = this.description;
        jo.testId = this.testId;
        jo.dataIndex = this.dataIndex;
        jo.data = this.data;
        return jo;
    };
    ErrorResults.isTestResults = function(e) { return !nil(e) && e instanceof TestResults; };
    AssertionTesting.ErrorResults = ErrorResults;
*/
var s = ResultStatus.getType(ResultStatus.notEvaluated);
if (s !== "notEvaluated")
    console.error("Expected ResultStatus.getType(ResultStatus.notEvaluated): \"notEvaluated\"; Actual: %s", JSON.stringify(s));
s = ResultStatus.getType(ResultStatus.inconclusive);
if (s !== "inconclusive")
    console.error("Expected ResultStatus.getType(ResultStatus.inconclusive): \"inconclusive\"; Actual: %s", JSON.stringify(s));
s = ResultStatus.getType(ResultStatus.pass);
if (s !== "pass")
    console.error("Expected ResultStatus.getType(ResultStatus.pass): \"pass\"; Actual: %s", JSON.stringify(s));
s = ResultStatus.getType(ResultStatus.fail);
if (s !== "fail")
    console.error("Expected ResultStatus.getType(ResultStatus.fail): \"fail\"; Actual: %s", JSON.stringify(s));
s = ResultStatus.getType(ResultStatus.error);
if (s !== "error")
    console.error("Expected ResultStatus.getType(ResultStatus.error): \"error\"; Actual: %s", JSON.stringify(s));
if (ResultStatus.fail !== 2)
    console.error("Expected ResultStatus.fail: 2; Actual: %s", JSON.stringify(ResultStatus.fail));

var rs = new ResultStatus(ResultStatus.pass);
if (rs.value !== 1)
    console.error("Expected value: -1; Actual: %s", JSON.stringify(rs.value));
if (rs.type !== "pass")
    console.error("Expected type: \"pass\"; Actual: %s", JSON.stringify(rs.type));
if (rs.message !== "Passed")
    console.error("Expected message: \"Passed\"; Actual: %s", JSON.stringify(rs.message));

rs.value = ResultStatus.fail;
if (rs.value !== 2)
    console.error("Change failed - expected value: 2; Actual: %s", JSON.stringify(rs.value));
if (rs.type !== "fail")
    console.error("Change failed - expected type: \"fail\"; Actual: %s", JSON.stringify(rs.type));
if (rs.message !== "Failed")
    console.error("Change failed - expected message: \"Failed\"; Actual: %s", JSON.stringify(rs.message));
var arr = ResultStatus.allTypeValuePairs.map(function(tvp, i) { return { expected: i - 1, actual: tvp }; })
    .filter(function(a) { return a.actual.value !== a.expected; });
if (arr.length > 0) {

}
ResultStatus.allTypeValuePairs.filter(function(tvp, i) { return ResultStatus[tvp.type] !== (i - 1); });
})();