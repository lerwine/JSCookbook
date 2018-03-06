import { execFileSync } from 'child_process';
import { fail } from 'assert';

//import { DEFAULT_ECDH_CURVE } from 'tls';

var PATH = require('path');
var FS   = require('fs');
var OS   = require('os');
var UTIL = require("util");

path = PATH.join(__dirname, "..", "Dist", "JSUnitTesting.js");
console.log("Loading " + path);
importScripts([path]);
function TestResults() {
    var resultArr = [];
    var failCount = 0;
    function asArray(obj) {
        if (typeof(obj) == "undefined")
            return [];
        if (obj !== null && Array.isArray(obj))
            return obj;
        return [obj];
    }
    this.clear = function() {
        resultArr = [];
        failCount = 0;
    };
    this._invoke = function(name, func, args) {
        var result = {
            isDefined: function(value) { return (typeof(value) != "undefined"); },
            isNil: function(value) { return (typeof(value) == "undefined" || value == null); },
            isType: function(expectedType, actualValue) {
                var t = typeof(actualValue);
                return (t == expectedType);
            },
            allAreEqual: function(expected, actual) {
                var e = typeof(expected);
                var a = typeof(actual);
                if (e != a)
                    return false;
                if (e == "undefined")
                    return true;
                if (e != "object")
                    return expected == actual;
                if (expected === null)
                    return (actual === null);
                if (expected === null)
                    return false;
                if (Array.isArray(expected)) {
                    if (Array.isArray(actual)) {
                        if (e.length != a.length)
                            return false;
                        for (var i; i < a.length; i++) {
                            if (a[i] !== e[i])
                                return false;
                        }
                    }
                    return false;
                } else if (Array.isArray(actual))
                    return false;
                return expected == actual;
            }
        };
        var a = asArray(args);
        try { result.output = func.call(result, a); }
        catch (err) { result.error = err; }
        result.args = a;
        result.name = name;
        return result;
    };
    this._add = function(result) {
        if (typeof(result.success) == "undefined")
            result.success = result.isNil(result.error);
        if (typeof(result.message) == "undefined") {
            if (result.success)
                result.message = "Passed!";
            else {
                var s = (result.isNil(result.error)) ? "" : (((result.isNil(result.error.message)) ? result.error :
                    result.error.message) + "").trim();
                result.message = (s.length == 0) ? "Failed" : s;
            }
        }
        if (!result.success)
            failCount++;
        resultArr.push(result);
    };
    this.isType = function(name, type, func, args) {
        var result = this._invoke(name, func, args);
        if (result.isNil(result.error)) {
            var t = typeof(result.output);
            result.success = result.isType(type, result.output);
            if (!result.success)
                result.message = "Expected type: " + type + "; Actual type: " + typeof(result.output);
        }
        this._add(result);
        return result.success;
    };
    this.isFunction = function(name, func, args) { return this.isType(name, "function", func, args); };
    this.isObject = function(name, func, args) { return this.isType(name, "object", func, args); };
    this.areEqual = function(name, expected, func, args) {
        var result = this._invoke(name, func, args);
        if (result.isNil(result.error)) {
            result.success = result.allAreEqual(expected, result.output);
            if (!result.success)
                result.message = "Expected: " + JSON.stringify(expected) + "; Actual: " + JSON.stringify(result.output);
        }
        this._add(result);
        return result.success;
    };
    this.getSuccessCount = function() { return resultArr.length - failCount; };
    this.getFailCount = function() { return failCount; };
    this.getTotalCount = function() { return resultArr.length; };
    this.succeeded = function(index) {
        if (index >= 0 && index < resultArr.length)
            return resultArr[index].success;
    };
    this.getMessage = function(index) {
        if (index >= 0 && index < resultArr.length)
            return resultArr[index].message;
    };
    this.getName = function(index) {
        if (index >= 0 && index < resultArr.length)
            return resultArr[index].name;
    };
    this.getOutput = function(index) {
        if (index >= 0 && index < resultArr.length)
            return resultArr[index].output;
    };
    this.getArgs = function(index) {
        if (index >= 0 && index < resultArr.length)
            return resultArr[index].args;
    };
    this.getError = function(index) {
        if (index >= 0 && index < resultArr.length)
            return resultArr[index].error;
    };
}
var testResults = new TestResults();
if (testResults.isObject("JsUnitTesting", function() { return JsUnitTesting; })) {
    if (testResults.isObject("JsUnitTesting.Utility", function() { return JsUnitTesting.Utility; })) {
        if (testResults.isFunction("JsUnitTesting.Utility.isNil", function() { return JsUnitTesting.Utility.isNil; })) {
            testResults.areEqual("JsUnitTesting.Utility.isNil(undefined)", true, function() { return JsUnitTesting.Utility.isNil(undefined); });
            testResults.areEqual("JsUnitTesting.Utility.isNil(null)", true, function() { return JsUnitTesting.Utility.isNil(null); });
            testResults.areEqual("JsUnitTesting.Utility.isNil(\"\")", false, function() { return JsUnitTesting.Utility.isNil(""); });
            testResults.areEqual("JsUnitTesting.Utility.isNil([])", false, function() { return JsUnitTesting.Utility.isNil([]); });
            testResults.areEqual("JsUnitTesting.Utility.isNil(0)", false, function() { return JsUnitTesting.Utility.isNil(0); });
            testResults.areEqual("JsUnitTesting.Utility.isNil({})", false, function() { return JsUnitTesting.Utility.isNil({}); });
            testResults.areEqual("JsUnitTesting.Utility.isNil(Number.NaN)", false, function() { return JsUnitTesting.Utility.isNil(Number.NaN); });
        }
        if (testResults.isFunction("JsUnitTesting.Utility.toArray", function() { return JsUnitTesting.Utility.toArray; })) {
            testResults.areEqual("JsUnitTesting.Utility.toArray()", [], function() { return JsUnitTesting.Utility.toArray(); });
            testResults.areEqual("JsUnitTesting.Utility.toArray([])", [], function() { return JsUnitTesting.Utility.toArray([]); });
            testResults.areEqual("JsUnitTesting.Utility.toArray([1])", [1], function() { return JsUnitTesting.Utility.toArray([1]); });
            testResults.areEqual("JsUnitTesting.Utility.toArray([3, \"4\"])", [3, "4"], function() { return JsUnitTesting.Utility.toArray([3, "4"]); });
            testResults.areEqual("JsUnitTesting.Utility.toArray(\"\")", [""], function() { return JsUnitTesting.Utility.toArray(""); });
            testResults.areEqual("JsUnitTesting.Utility.toArray(0)", [0], function() { return JsUnitTesting.Utility.toArray(0); });
        }
        if (testResults.isFunction("JsUnitTesting.Utility.mapArray", function() { return JsUnitTesting.Utility.mapArray; })) {
            
        }
        if (testResults.isFunction("JsUnitTesting.Utility.filterArray", function() { return JsUnitTesting.Utility.filterArray; })) {
            
        }
        if (testResults.isFunction("JsUnitTesting.Utility.reduceArray", function() { return JsUnitTesting.Utility.reduceArray; })) {
            
        }
        if (testResults.isFunction("JsUnitTesting.Utility.convertToString", function() { return JsUnitTesting.Utility.convertToString; })) {
            
        }
        if (testResults.isFunction("JsUnitTesting.Utility.convertToNumber", function() { return JsUnitTesting.Utility.convertToNumber; })) {
            
        }
        if (testResults.isFunction("JsUnitTesting.Utility.getFunctionName", function() { return JsUnitTesting.Utility.convertToString; })) {
            
        }
    }
    if (testResults.isFunction("JsUnitTesting.TypeSpec", function() { return JsUnitTesting.TypeSpec; })) {
        if (testResults.isFunction("JsUnitTesting.TypeSpec.getTypeName", function() { return JsUnitTesting.TypeSpec.getTypeName; })) {
            
        }
        if (testResults.isFunction("JsUnitTesting.TypeSpec.is", function() { return JsUnitTesting.TypeSpec.is; })) {
            
        }
    }
    if (testResults.isFunction("JsUnitTesting.TestResult", function() { return JsUnitTesting.TestResult; })) {

    }
    if (testResults.isFunction("JsUnitTesting.UnitTest", function() { return JsUnitTesting.UnitTest; })) {

    }
    if (testResults.isFunction("JsUnitTesting.TestCollection", function() { return JsUnitTesting.TestCollection; })) {


    }
    if (testResults.isFunction("JsUnitTesting.TestResult", function() { return JsUnitTesting.TestResult; })) {

    }
    if (testResults.isFunction("JsUnitTesting.AssertionError", function() { return JsUnitTesting.AssertionError; })) {

    }
    if (testResults.isFunction("JsUnitTesting.Assert", function() { return JsUnitTesting.Assert; })) {
        if (testResults.isFunction("JsUnitTesting.Assert.fail", function() { return JsUnitTesting.Assert.fail; })) {

        }
        if (testResults.isFunction("JsUnitTesting.Assert.isNil", function() { return JsUnitTesting.Assert.isNil; })) {

        }
        if (testResults.isFunction("JsUnitTesting.Assert.notNil", function() { return JsUnitTesting.Assert.notNil; })) {

        }
        if (testResults.isFunction("JsUnitTesting.Assert.is", function() { return JsUnitTesting.Assert.is; })) {

        }
        if (testResults.isFunction("JsUnitTesting.Assert.isNot", function() { return JsUnitTesting.Assert.isNot; })) {

        }
        if (testResults.isFunction("JsUnitTesting.Assert.areEqual", function() { return JsUnitTesting.Assert.areEqual; })) {

        }
        if (testResults.isFunction("JsUnitTesting.Assert.areNotEqual", function() { return JsUnitTesting.Assert.areNotEqual; })) {

        }
        if (testResults.isFunction("JsUnitTesting.Assert.areLike", function() { return JsUnitTesting.Assert.areLike; })) {

        }
        if (testResults.isFunction("JsUnitTesting.Assert.areNotLike", function() { return JsUnitTesting.Assert.areNotLike; })) {

        }
        if (testResults.isFunction("JsUnitTesting.Assert.isLessThan", function() { return JsUnitTesting.Assert.isLessThan; })) {

        }
        if (testResults.isFunction("JsUnitTesting.Assert.notLessThan", function() { return JsUnitTesting.Assert.notLessThan; })) {

        }
        if (testResults.isFunction("JsUnitTesting.Assert.isGreaterThan", function() { return JsUnitTesting.Assert.isGreaterThan; })) {

        }
        if (testResults.isFunction("JsUnitTesting.Assert.notGreaterThan", function() { return JsUnitTesting.Assert.notGreaterThan; })) {
            
        }
        if (testResults.isFunction("JsUnitTesting.Assert.isTrue", function() { return JsUnitTesting.Assert.isTrue; })) {

        }
        if (testResults.isFunction("JsUnitTesting.Assert.isFalse", function() { return JsUnitTesting.Assert.isFalse; })) {
            
        }
    }
}

var total = testResults.getTotalCount();
for (var i = 0; i < total; i++) {
    if (testResults.succeeded(i))
        console.log(testResults.getName(i) + " Succeeded");
    else {
        var m = testResults.getName(i) + " Failed - " + testResults.getMessage();
        var e = testResults.getError(i);
        if (typeof(e) != "undefined" && e !== null)
            m += (OS.EOL + "\t" + JSON.stringify(e));
        console.error(m);
    }
}
if (testResults.getFailCount() == 0)
    console.log("All " + total + " tests passed.");
else if (testResults.getSuccessCount() == 0)
    console.error("All " + total + " tests failed.");
else
    console.warn(testResults.getSuccessCount() + " test(s) passed, " + testResults.getFailCount() + " failed.");