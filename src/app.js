var PreValidationStatus = {
    notStarted: 0,
    running: 1,
    success: 2,
    fail: 3,
    incomplete: 4,
    error: 5
};
function stringifyShallow(value) {
    if (typeof(value) == "undefined")
        return "undefined";
    if (value === null)
        return "null";
    return JSON.stringify(value);
}
function isNil(value) { return typeof(value) == "undefined" || value === null; }
function asString(value, defaultValue) {
    if (typeof(value) == "function")
        try { value = value(); } catch (err) { }
    
    if (typeof(value) == "string")
        return value;
    if (isNil(value)) {
        if (isNil(defaultValue))
            return defaultValue;
        return asString(defaultValue);
    }
    if (Array.isArray(value)) {
        if (value.length == 0) {
            if (isNil(defaultValue))
                return defaultValue;
            return asString(defaultValue);
        }
        if (value.length > 1) {
            return value.map(function(v) {
                if (typeof(v) == "string")
                    return v;
                if (isNil(v))
                    return "";
                if (Array.isArray(v))
                    return v.join("\t");
                try {
                    var s = v.toString();
                    if (typeof(s) == "string")
                        return s;
                } catch (e) { /* okay to ignore */ }
                return v + "";
            }).join("\n");
        }
        value = value[0];
        if (typeof(value) == "string")
            return value;
        if (isNil(value)) {
            if (isNil(defaultValue))
                return defaultValue;
            return asString(defaultValue);
        }
    }
    try {
        var s = value.toString();
        if (typeof(s) == "string")
            return s;
    } catch (e) { /* okay to ignore */ }
    return value + "";
}
function asValidatedString(value, defaultValue) {
    var s = asString(value, "").trim();
    if (s.length == 0)
        return asValidatedString(defaultValue, "");
    return s;
}
var trimEndRe = /^(\s*\S+(\s+\S+)*)/;
var lineSplitRe = /\r\n?|\n/g;
function trimEnd(v) {
    var s = asString(v, "");
    var m = trimEndRe.exec(s);
    if (isNil(m))
        return "";
    return m[1];
}
function stringifyDeep(value, maxDepth) {
    if (typeof(maxDepth) != "number" || isNaN(maxDepth) || !Number.isFinite(maxDepth))
        maxDepth = 4;
    if (typeof(value) == "undefined")
        return "undefined";
    if (typeof(value) != "object")
        return stringifyShallow(value);
    if (value === null)
        return "null";
    var lines = [];
    var foundKey = false;
    var n;
    if (maxDepth > 0) {
        for (n in value) {
            if (typeof(n) != "number")
                foundKey = true;
            try { lines.push({ k: n, v: stringifyDeep(value[n], maxDepth - 1) }); } catch (e) { }
        }
    } else {
        for (n in value) {
            if (typeof(n) != "number")
                foundKey = true;
            try { lines.push({ k: n, v: stringifyShallow(value[n]) }); } catch (e) { }
        }
    }
    if (foundKey)
        return "{\n\t" + lines.map(function(kvp) { return stringifyShallow(kvp.k) + ": " + kvp.v; }).join("\n")
            .split(lineSplitRe).join(",\n\t") + "\n}";
    if (lines.length > 0)
        return "[\n\t" + lines.map(function(kvp) { return kvp.v; }) + "\n]";
    return (Array.isArray(value)) ? "[ ]" : "{ }";
}
function getTypeEx(obj) {
    var t = typeof(obj);
    if (t == "function") {
        if (typeof(obj.name) == "string" && obj.name.length > 0)
            return "function " + obj.name;
        return t;
    }
    if (t != "object")
        return (t == "number" && isNaN(obj)) ? "NaN" : t;
    if (obj === null)
        return "null";
    var n = null;
    var p = Object.getPrototypeOf(obj);
    if (isNil(p))
        return t;
    do {
        if (typeof(p.constructor) == "function" && typeof(p.constructor.name) == "string" && p.constructor.name.length > 0) {
            if (p.constructor.name == "Object" && Object.getPrototypeOf(p) === null)
                return t;
                return "object " + p.constructor.name;
            }
        p = Object.getPrototypeOf(p);
    } while (!isNill(p));
    for (p = Object.getPrototypeOf(obj); !isNill(p); p = Object.getPrototypeOf(p)) {
        if (typeof(p) == "function" && typeof(p.name) == "string" && p.name.length > 0)
            return "object " + p.name;
    }
    for (p = Object.getPrototypeOf(obj); !isNill(p); p = Object.getPrototypeOf(p)) {
        if (typeof(p.name) == "string" && p.name.length > 0)
            return "object " + p.name;
    }
    return t;
}
function PreValidationResult(status, name, message, stackTrace, detail) {
    this.status = status;
    switch (status) {
        case "error":
        case "fail":
            this.cssClass = ["form-row", "alert", "alert-danger"];
            break;
        case "pass":
            this.cssClass = ["form-row", "alert", "alert-success"];
            break;
        default:
            this.cssClass = ["form-row", "alert", "alert-warning"];
            break;
    }
    this.isVisible = true;
    this.name = asString(name);
    this.message = asString(message);
    this.detail = (isNil(detail)) ? "" : ((typeof(detail) == "object")) ? stringifyDeep(detail) : asString(detail, "");
    var s = asString(stackTrace, "").trim();
    if (s.length == 0)
        this.stackTrace = "";
    else
        this.stackTrace = s.split(lineSplitRe).map(function(s) { return s.trim(); }).join("\n");
    this.detailContainerIsVisible = false;
    this.showDetail = (this.detail.trim().length > 0);
    this.showStackTrace = (this.stackTrace.trim().length > 0);
}
PreValidationResult.newSuccess = function(name, message) {
    return new PreValidationResult("pass", name, asValidatedString(message, "Test Passed"));
};
PreValidationResult.newFail = function(name, message, detail) {
    return new PreValidationResult("fail", name, asValidatedString(message, "Test Failed"), null, detail);
};
PreValidationResult.newInconclusive = function(name, message, detail) {
    return new PreValidationResult("?", name, asValidatedString(message, "Test result is inconclusive"), null, detail);
};
PreValidationResult.newError = function(name, error, detail) {
    if (typeof(error) == "string" && typeof(detail) == "undefined")
        return new PreValidationResult("fail", name, error);
    var errorName = asValidatedString(error.name, "");
    var stackTrace = error.stack;
    var message = asValidatedString(error.message, function() {
        if (errorName.trim().length > 0)
            return errorName;
        var s = error.toString();
        if (s == Object.prototype.toString.call(error) || (s = s.trim()).length == 0)
            return "Error";
        return s;
    });
    if (errorName.trim().length > 0 && message != errorName)
        message = "[" + errorName + "] " + message;
    if (typeof(detail) !== "undefined")
        detail = { detail: detail, error: error };
    else
        detail = { error: error };
    return new PreValidationResult("fail", name, message, (typeof(stackTrace) == "string") ? stackTrace : "", detail);
};
PreValidationResult.newSkipped = function(name, message, detail) {
    return new PreValidationResult("skip", name, asValidatedString(message, "Test Skipped"), null, detail);
};
var testMethods = {
    getPropertyNames: function(obj) {
        var names = [];
        for (var n in obj)
            names.push(n);
        return names;
    },
    equals: function(actual, expected) {
        if (typeof(expected) == "undefined")
            return typeof(actual) == "undefined";
        if (typeof(actual) == "undefined")
            return false;
        if (typeof(expected) == "number") {
            if (isNaN(expected))
                return isNaN(actual);
            return !isNaN(actual) && expected === actual;
        }
        if (typeof(expected) != "object")
            return expected === actual;
        if (expected === null)
            return actual === null;
        if (actual === null)
            return false;
        if (Array.isArray(expected)) {
            if (!Array.isArray(actual))
                return false;
            if (expected.length != actual.length)
                return false;
            for (var i = 0; i < expected; i++) {
                if (getTypeEx(expected[i]) != getTypeEx(actual[i]) || stringifyShallow(expected[i]) != stringifyShallow(actual[i]))
                    return false;
            }
            return true;
        }
        if (Array.isArray(expected) || getTypeEx(expected) != getTypeEx(actual) || stringifyShallow(expected) != stringifyShallow(actual))
            return false;
        var eNames = testMethods.getPropertyNames(expected);
        var aNames = testMethods.getPropertyNames(actual);
        if (eNames.length != aNames.length)
            return false;
        return eNames.filter(function(n) { return aNames.filter(function(s) { return n === s; }).length > 0; }).length == eNames.length &&
            aNames.filter(function(n) { return eNames.filter(function(s) { return n === s; }).length > 0; }).length == aNames.length;
    }
};
var nanValue = parseInt("NaN");
var testDefinitions = [
    {
        name: "Utility namespace validation", expected: "object", test: testMethods.equals,
            method: function() { return typeof(JsUnitTesting.Utility); }, dependsUpon: []
    }, {
        name: "JsUnitTesting.Utility.isNil", expected: "function", test: testMethods.equals,
            method: function() { return typeof(JsUnitTesting.Utility.isNil); }, dependsUpon: ["Utility namespace validation"]
    }, {
        name: "JsUnitTesting.Utility.isNil()", expected: true, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.isNil(); }, dependsUpon: ["JsUnitTesting.Utility.isNil"]
    }, {
        name: "JsUnitTesting.Utility.isNil(undefined)", expected: true, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.isNil(undefined); }, dependsUpon: ["JsUnitTesting.Utility.isNil"]
    }, {
        name: "JsUnitTesting.Utility.isNil(null)", expected: true, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.isNil(null); }, dependsUpon: ["JsUnitTesting.Utility.isNil"]
    }, {
        name: "JsUnitTesting.Utility.isNil([])", expected: false, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.isNil([]); }, dependsUpon: ["JsUnitTesting.Utility.isNil"]
    }, {
        name: "JsUnitTesting.Utility.isNil({})", expected: false, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.isNil({}); }, dependsUpon: ["JsUnitTesting.Utility.isNil"]
    }, {
        name: "JsUnitTesting.Utility.isNil([null])", expected: false, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.isNil([null]); }, dependsUpon: ["JsUnitTesting.Utility.isNil"]
    }, {
        name: "JsUnitTesting.Utility.isNil(nanValue)", expected: false, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.isNil(nanValue); }, dependsUpon: ["JsUnitTesting.Utility.isNil"]
    }, {
        name: "JsUnitTesting.Utility.isNil(false)", expected: false, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.isNil(false); }, dependsUpon: ["JsUnitTesting.Utility.isNil"]
    }, {
        name: "JsUnitTesting.Utility.isNil(0)", expected: false, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.isNil(0); }, dependsUpon: ["JsUnitTesting.Utility.isNil"]
    }, {
        name: "JsUnitTesting.Utility.isNil(\"\")", expected: false, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.isNil(""); }, dependsUpon: ["JsUnitTesting.Utility.isNil"]
    }, {
        name: "JsUnitTesting.Utility.toArray", expected: "function", test: testMethods.equals,
        method: function() { return typeof(JsUnitTesting.Utility.toArray); }, dependsUpon: ["Utility namespace validation"]
    }, {
        name: "JsUnitTesting.Utility.toArray()", expected: [], test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.toArray(); }, dependsUpon: ["JsUnitTesting.Utility.toArray"]
    }, {
        name: "JsUnitTesting.Utility.toArray(undefined)", expected: [], test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.toArray(undefined); }, dependsUpon: ["JsUnitTesting.Utility.toArray"]
    }, {
        name: "JsUnitTesting.Utility.toArray(null)", expected: [null], test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.toArray(null); }, dependsUpon: ["JsUnitTesting.Utility.toArray"]
    }, {
        name: "JsUnitTesting.Utility.toArray([])", expected: [], test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.toArray([]); }, dependsUpon: ["JsUnitTesting.Utility.toArray"]
    }, {
        name: "JsUnitTesting.Utility.toArray({})", expected: [{}], test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.toArray({}); }, dependsUpon: ["JsUnitTesting.Utility.toArray"]
    }, {
        name: "JsUnitTesting.Utility.toArray([null])", expected: [null], test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.toArray([null]); }, dependsUpon: ["JsUnitTesting.Utility.toArray"]
    }, {
        name: "JsUnitTesting.Utility.toArray(false)", expected: [false], test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.toArray(false); }, dependsUpon: ["JsUnitTesting.Utility.toArray"]
    }, {
        name: "JsUnitTesting.Utility.toArray(nanValue)", expected: [nanValue], test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.toArray(nanValue); }, dependsUpon: ["JsUnitTesting.Utility.toArray"]
    }, {
        name: "JsUnitTesting.Utility.toArray(0)", expected: [0], test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.toArray(0); }, dependsUpon: ["JsUnitTesting.Utility.toArray"]
    }, {
        name: "JsUnitTesting.Utility.toArray(\"\")", expected: [""], test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.toArray(""); }, dependsUpon: ["JsUnitTesting.Utility.toArray"]
    }, {
        name: "JsUnitTesting.Utility.toArray(\"Test\")", expected: ["Test"], test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.toArray("Test"); }, dependsUpon: ["JsUnitTesting.Utility.toArray"]
    }, {
        name: "JsUnitTesting.Utility.toArray([[]])", expected: [[]], test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.toArray([[]]); }, dependsUpon: ["JsUnitTesting.Utility.toArray"]
    }, {
        name: "JsUnitTesting.Utility.toArray([[],null)", expected: [[],null], test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.toArray([[],null]); }, dependsUpon: ["JsUnitTesting.Utility.toArray"]
    }, {
        name: "JsUnitTesting.Utility.toArray([[2],\"test\")", expected: [[2], "test"], test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.toArray([[2],"test"]); }, dependsUpon: ["JsUnitTesting.Utility.toArray"]
    }, {
        name: "JsUnitTesting.Utility.convertToNumber", expected: "function", test: testMethods.equals,
        method: function() { return typeof(JsUnitTesting.Utility.convertToNumber); }, dependsUpon: ["Utility namespace validation"]
    }, {
        name: "JsUnitTesting.Utility.convertToNumber()", expected: undefined, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.convertToNumber(); }, dependsUpon: ["JsUnitTesting.Utility.convertToNumber"]
    }, {
        name: "JsUnitTesting.Utility.convertToNumber(0)", expected: 0, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.convertToNumber(0); }, dependsUpon: ["JsUnitTesting.Utility.convertToNumber"]
    }, {
        name: "JsUnitTesting.Utility.convertToNumber(1000)", expected: 1000, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.convertToNumber(1000); }, dependsUpon: ["JsUnitTesting.Utility.convertToNumber"]
    }, {
        name: "JsUnitTesting.Utility.convertToNumber(\"1000\")", expected: 1000, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.convertToNumber("1000"); }, dependsUpon: ["JsUnitTesting.Utility.convertToNumber"]
    }, {
        name: "JsUnitTesting.Utility.convertToNumber(\"00001000\")", expected: 1000, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.convertToNumber("00001000"); }, dependsUpon: ["JsUnitTesting.Utility.convertToNumber"]
    }, {
        name: "JsUnitTesting.Utility.convertToNumber(undefined)", expected: undefined, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.convertToNumber(undefined); }, dependsUpon: ["JsUnitTesting.Utility.convertToNumber"]
    }, {
        name: "JsUnitTesting.Utility.convertToNumber(null)", expected: null, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.convertToNumber(null); }, dependsUpon: ["JsUnitTesting.Utility.convertToNumber"]
    }, {
        name: "JsUnitTesting.Utility.convertToNumber([])", expected: nanValue, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.convertToNumber([]); }, dependsUpon: ["JsUnitTesting.Utility.convertToNumber"]
    }, {
        name: "JsUnitTesting.Utility.convertToNumber({})", expected: nanValue, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.convertToNumber({}); }, dependsUpon: ["JsUnitTesting.Utility.convertToNumber"]
    }, {
        name: "JsUnitTesting.Utility.convertToNumber([null])", expected: null, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.convertToNumber([null]); }, dependsUpon: ["JsUnitTesting.Utility.convertToNumber"]
    }, {
        name: "JsUnitTesting.Utility.convertToNumber(false)", expected: 0, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.convertToNumber(false); }, dependsUpon: ["JsUnitTesting.Utility.convertToNumber"]
    }, {
        name: "JsUnitTesting.Utility.convertToNumber(true)", expected: 1, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.convertToNumber(true); }, dependsUpon: ["JsUnitTesting.Utility.convertToNumber"]
    }, {
        name: "JsUnitTesting.Utility.convertToNumber(nanValue)", expected: nanValue, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.convertToNumber(nanValue); }, dependsUpon: ["JsUnitTesting.Utility.convertToNumber"]
    }, {
        name: "JsUnitTesting.Utility.convertToNumber(0)", expected: 0, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.convertToNumber(0); }, dependsUpon: ["JsUnitTesting.Utility.convertToNumber"]
    }, {
        name: "JsUnitTesting.Utility.convertToNumber(\"\")", expected: nanValue, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.convertToNumber(""); }, dependsUpon: ["JsUnitTesting.Utility.convertToNumber"]
    }, {
        name: "JsUnitTesting.Utility.convertToNumber(\"Test\")", expected: nanValue,
        test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.convertToNumber("Test"); }, dependsUpon: ["JsUnitTesting.Utility.convertToNumber"]
    }, {
        name: "JsUnitTesting.Utility.convertToNumber([[]])", expected: nanValue, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.convertToNumber([[]]); }, dependsUpon: ["JsUnitTesting.Utility.convertToNumber"]
    }, {
        name: "JsUnitTesting.Utility.convertToNumber([[],null)", expected: nanValue, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.convertToNumber([[],null]); }, dependsUpon: ["JsUnitTesting.Utility.convertToNumber"]
    }, {
        name: "JsUnitTesting.Utility.convertToNumber([[2],\"test\")", expected: nanValue, test: testMethods.equals,
        method: function() { return JsUnitTesting.Utility.convertToNumber([[2],"test"]); }, dependsUpon: ["JsUnitTesting.Utility.convertToNumber"]
    }, {
        name: "JsUnitTesting.UnitTest class validation", expected: "function", test: testMethods.equals,
        method: function() { return typeof(JsUnitTesting.UnitTest); },
        dependsUpon: []
    }, {
        name: "JsUnitTesting.UnitTest constructor test", expected: undefined,
        test: function(r) {
            var expected = "My unit test";
            if (r.name !== expected)
                return "name expected: " + JSON.stringify(expected) + "; Actual: " +
                    JsUnitTesting.Utility.stringifyDeep(r.name);
            expected = 24;
            if (r.id !== expected)
                return "id expected: " + JSON.stringify(expected) + "; Actual: " +
                    JsUnitTesting.Utility.stringifyDeep(r.id);
            expected = "My desc";
            if (r.description !== expected)
                return "description expected: " + JSON.stringify(expected) + "; Actual: " +
                    JsUnitTesting.Utility.stringifyDeep(r.description);
        },
        method: function() {
            return new JsUnitTesting.UnitTest(function(a, b, c) { },
                ["A", 2, false], "My unit test", "My desc", 24, function(r) {
            });
        },
        dependsUpon: ["JsUnitTesting.UnitTest class validation", "JsUnitTesting.Utility.convertToNumber", "JsUnitTesting.Utility.toArray", "JsUnitTesting.Utility.isNil"]
    }, {
        name: "JsUnitTesting.TestCollection class validation", expected: "function", test: testMethods.equals,
        method: function() { return typeof(JsUnitTesting.TestCollection); },
        dependsUpon: []
    }, {
        name: "JsUnitTesting.TestCollection constructor test", expected: undefined,
        test: function(r) {
            var expected = "myTest";
            if (r.name !== expected)
                return "name expected: " + JSON.stringify(expected) + "; Actual: " +
                    JsUnitTesting.Utility.stringifyDeep(r.name);
            expected = 8;
            if (r.id !== expected)
                return "id expected: " + JSON.stringify(expected) + "; Actual: " +
                    JsUnitTesting.Utility.stringifyDeep(r.id);
        },
        method: function() {
            return new JsUnitTesting.TestCollection([], "myTest", 8);
        },
        dependsUpon: ["JsUnitTesting.UnitTest class validation", "JsUnitTesting.Utility.convertToNumber", "JsUnitTesting.Utility.toArray", "JsUnitTesting.Utility.isNil"]
    }, {
        name: "JsUnitTesting.TestCollection constructor test", expected: undefined,
        test: function(r) {
            var expected = "myTest";
            if (r.name !== expected)
                return "name expected: " + JSON.stringify(expected) + "; Actual: " +
                    JsUnitTesting.Utility.stringifyDeep(r.name);
            expected = 8;
            if (r.id !== expected)
                return "id expected: " + JSON.stringify(expected) + "; Actual: " +
                    JsUnitTesting.Utility.stringifyDeep(r.id);
        },
        method: function() {
            return new JsUnitTesting.TestCollection([], "myTest", 8);
        },
        dependsUpon: ["JsUnitTesting.TestCollection constructor test", "JsUnitTesting.Utility.convertToNumber", "JsUnitTesting.Utility.toArray", "JsUnitTesting.Utility.isNil"]
    }
];
function doTest($scope, testArr, parentPath) {
    var resultArr = [];
    testArr.forEach(function(d) { d.skip = false; });
    testArr.forEach(function(d) {
        var passed = false;
        if (d.skip)
            resultArr.push(PreValidationResult.newSkip(d.name, "Skipped because a dependent test failed."));
        else {
            try {
                var actual = d.method();
                var r = d.test(actual, d.expected);
                if (typeof(r) == "boolean") {
                    if (r) {
                        resultArr.push(PreValidationResult.newSuccess(d.name));
                        passed = true;
                    }
                    else
                        resultArr.push(PreValidationResult.newFail(d.name, "Expected: " + stringifyShallow(d.expected) + "; Actual: " + stringifyShallow(actual), {
                            expected: d.expected,
                            actual: actual
                        }));
                } else if (isNil(r)) {
                    resultArr.push(PreValidationResult.newSuccess(d.name));
                    passed = true;
                    if (typeof(d.dependents) == "object" && d.dependents !== null &&
                            Array.isArray(d.dependents) && d.dependents.length > 0)
                        resultArr = resultArr.concat(doTest($scope, d.dependents, d.name));
                } else
                    resultArr.push(PreValidationResult.newFail(d.name, stringifyShallow(r)));
            } catch (e) {
                resultArr.push(PreValidationResult.newError(d.name, e));
            }
        }
        
        if (!passed)
            testArr.forEach(function(a) {
                if (a.dependsUpon.filter(function(s) { return s == d.name; }).length > 0)
                    a.skip = true;
            });
    });
    return resultArr;
}
var jsCookbookModule = angular.module("jscookbook", []);
jsCookbookModule.controller("rootIndexController", function($scope, $q) {
    $scope.preValidationResults = [];
    $scope.preValidationStatus = PreValidationStatus.notStarted;
    $scope.preValidationDisabled = false;
    $scope.hasResults = false;
    $scope.showErrors = true;
    $scope.showWarnings = true;
    $scope.showSuccess = false;
    $scope.errorCountMessage = "";
    $scope.warningCountMessage = "";
    $scope.successCountMessage = "";
    $scope.setItemVisibilities = function() {
        $scope.preValidationResults.forEach(function(r) {
            switch (r.status) {
                case "error":
                case "fail":
                    r.isVisible = $scope.showErrors;
                    break;
                case "pass":
                    r.isVisible = $scope.showSuccess;
                    break;
                default:
                    r.isVisible = $scope.showWarnings;
                    break;
            }
        });
    };
    $scope.toggleShowDetail = function(index) {
        for (var i = 0; i < $scope.preValidationResults.length; i++) {
            if (i == index) {
                $scope.preValidationResults[i].detailContainerIsVisible = !$scope.preValidationResults[i].detailContainerIsVisible;
            } else {
                $scope.preValidationResults[i].detailContainerIsVisible = false;
            }
        }
    };
    $scope.startPrevalidation = function() {
        $scope.preValidationDisabled = true;
        if ($scope.preValidationStatus == PreValidationStatus.running)
            return false;
        $scope.preValidationStatus = PreValidationStatus.running;
        $q(function(resolve, reject) {
            try {
                var expected = "object";
                var actual = getTypeEx(JsUnitTesting);
                if (expected != actual) {
                    reject([PreValidationResult.newFail("Root namespace validation", "Namespace JsUnitTesting does not exist.")]);
                    return;
                }
                resolve(doTest($scope, testDefinitions));
            } catch (err) {
                reject([PreValidationResult.newError("Test Iteration", err, "Unexpected exception.")]);
            }
        }).then(function(results) {
            $scope.preValidationDisabled = false;
            $scope.preValidationResults = results;
            $scope.hasResults = results.length > 0;
            $scope.passCount = results.filter(function(r) { return r.status == "pass"; }).length;
            $scope.failCount = results.filter(function(r) { return r.status == "fail" || r.status == "error"; }).length;
            $scope.warnCount = results.length - $scope.passCount - $scope.failCount;
            if (results.filter(function(r) { return r.status == "pass"; }).length == results.length)
                $scope.preValidationStatus = PreValidationStatus.success;
            if (results.filter(function(r) { return r.status == "skip"; }).length > 0)
                $scope.preValidationStatus = PreValidationStatus.incomplete;
            else
                $scope.preValidationStatus = PreValidationStatus.fail;
            if ($scope.failCount == results.length) {
                $scope.errorCountMessage = "All tests failed";
                $scope.warningCountMessage = "No tests had warnings";
                $scope.successCountMessage = "No tests passed";
            } else if ($scope.passCount == results.length) {
                $scope.errorCountMessage = "No tests failed";
                $scope.warningCountMessage = "No tests had warnings";
                $scope.successCountMessage = "All tests passed";
            } else {
                $scope.errorCountMessage = ($scope.failCount == 1) ? "1 test failed" : $scope.failCount + " tests failed";
                $scope.warningCountMessage = ($scope.warnCount == 1) ? "1 had warnings" : $scope.warnCount + " tests had warnings";
                $scope.successCountMessage = ($scope.passCount == 1) ? "1 test passed" : $scope.passCount + " tests passed";
                }
            $scope.setItemVisibilities();
        }, function(results) {
            $scope.preValidationDisabled = false;
            $scope.preValidationResults = results;
            $scope.hasResults = results.length > 0;
            $scope.preValidationStatus = PreValidationStatus.error;
            $scope.setItemVisibilities();
        });
        return false;
    };
    $scope.$watchGroup(["showErrors", "showWarnings", "showSuccess"], function() {
        $scope.setItemVisibilities();
    });
});
