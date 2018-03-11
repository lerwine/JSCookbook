var validationResults = [];

function ValidationResult(message, status, file, line, column, method) {
    function isNil(v) { return typeof(v) == "undefined" || v === null; }

    this.message = ValidationResult.asString(message, true);
    this.status = ValidationResult.asStatus(status, true);
    this.file = ValidationResult.asString(file, true);
    this.line = ValidationResult.asInteger(line);
    this.column = ValidationResult.asInteger(column);
    this.method = ValidationResult.asString(method, true);
    this.toString = function() {
        this.message = ValidationResult.asString(this.message, true);
        this.status = ValidationResult.asStatus(this.status, true);
        this.file = ValidationResult.asString(this.file, true);
        this.line = ValidationResult.asInteger(this.line);
        this.column = ValidationResult.asInteger(this.column);
        this.method = ValidationResult.asString(this.method, true);
        var line = this.status + " at ";
        if (!ValidationResult.isNil(this.method) && this.method.length > 0)
            line += this.method.replace("\\", "\\\\").replace(/\s/g, "\\ ").replace("(", "\\(") + " ";
        line += "(";
        if (ValidationResult.isNil(this.file) || this.file.length == 0) {
            if (ValidationResult.isNil(this.line)) {
                if (ValidationResult.isNil(this.column))
                    line += "<anonymous>";
                else
                    line += ":0:" + this.column;
            } else {
                line += ":" + this.line;
                if (!ValidationResult.isNil(this.column))
                    line += ":" + this.column;
            }
        } else {
            line += this.file.replace("\\", "\\\\").replace(":", "\\:").replace(")", "\\)");
            if (ValidationResult.isNil(this.line)) {
                if (!ValidationResult.isNil(this.column))
                    line += ":0:" + this.column;
            } else {
                line += ":" + this.line;
                if (!ValidationResult.isNil(this.column))
                    line += ":" + this.column;
            }
        }
        if (ValidationResult.isNil(this.message))
            return line + ")";
        return line + "): " + this.message;
    };
    // status at method (file:line:column): message
}
ValidationResult.logPattern = /^(SKIP|INCONCLUSIVE|DEBUG|INFO|PASS|WARN|FAIL|ERROR)\s+at(?:\s+([^()]+))?\s*\(([^:()]*)(?::(\d+)(?::(\d+))?)?\)(?::\s*(.+))?/;
ValidationResult.jsStackPattern = /^\s*at(?:\s+([^()]+))?\s*\(([^:()]*)(?::(\d+)(?::(\d+))?)?\)(?::\s*(.+))?/;
ValidationResult.logMatch_status = 1;
ValidationResult.logMatch_method = 2;
ValidationResult.logMatch_file = 3;
ValidationResult.logMatch_line = 4;
ValidationResult.logMatch_column = 5;
ValidationResult.logMatch_message = 6;
ValidationResult.isNil = function(v) { return typeof(v) == "undefined" || v === null; };
ValidationResult.asString = function(v, trim) {
    if (!ValidationResult.isNil(v)) {
        if (typeof(v) != "string") {
            if (Array.isArray(v))
                v = v.map(function(a) {
                    if (ValidationResult.isNil(a))
                        return null;
                    return (typeof(a) == "string") ? a : ((Array.isArray(a)) ? a.join(" ") : a+"");
                }).filter(function(s) { return s !== null; }).join(" ");
            else
                v = v + "";
        }
        v = v.replace(/\r\n?|\n/g, " ");
        return (trim) ? v.trim() : v;
    }
};
ValidationResult.asStatus = function(v, d) {
    v = ValidationResult.asString(v, true);
    if (!ValidationResult.isNil(v)) {
        v = v.toUpperCase();
        if (v == "SKIP" || v == "INCONCLUSIVE" || v == "DEBUG" || v == "INFO" || v == "PASS" || v == "WARN" || v == "FAIL" || v == "ERROR")
            return v;
    }
    if (ValidationResult.isNil(d))
        return "INFO";
    return ValidationResult.asStatus(d);
};
ValidationResult.asInteger = function(v) {
    if (!ValidationResult.isNil(v)) {
        if (typeof(v) != "number") {
            if (typeof(v) == string)
                v = parseInt(v);
            else if (typeof(v.valueOf) == "function") {
                var n = Number.NaN;
                try { n = v.valueOf(); } catch (e) { }
                if (isNaN(n))
                    v = parseint(ValidationResult.asString(v));
                else
                    v = n;
            } else
                v = parseint(ValidationResult.asString(v));
        }
        if (!isNaN(v) && Number.isFinite(v)) {
            if (Number.isInteger(v))
                return v;
            return Math.round(v);
        }
    }
};
function addSkipResult(message, method, file, line, column) {
    validationResults.push(new ValidationResult(message, "SKIP", file, line, column, method));
}
function addInconclusiveResult(message, method, file, line, column) {
    validationResults.push(new ValidationResult(message, "INCONCLUSIVE", file, line, column, method));
}
function addDebugResult(message, method, file, line, column) {
    validationResults.push(new ValidationResult(message, "DEBUG", file, line, column, method));
}
function addInfoResult(message, method, file, line, column) {
    validationResults.push(new ValidationResult(message, "INFO", file, line, column, method));
}
function addPassResult(message, method, file, line, column) {
    validationResults.push(new ValidationResult(message, "PASS", file, line, column, method));
}
function addWarningResult(message, method, file, line, column) {
    validationResults.push(new ValidationResult(message, "WARN", file, line, column, method));
}
function addFailResult(message, method, file, line, column) {
    validationResults.push(new ValidationResult(message, "FAIL", file, line, column, method));
}
function addErrorResults(error, message, isWarning) {
    status = ValidationResult.asStatus(status, (isWarning) ? "WARN" : "ERROR");
    message = ValidationResult.asString(message);
    var em = (ValidationResult.isNil(error)) ? "" : ValidationResult.asString(error.message);
    if (ValidationResult.isNil(message) || message.length == 0)
        message = em;
    else if (!ValidationResult.isNil(em) && em.length > 0 && message != em)
        message = message + " (" + em + ")";
    if (ValidationResult.isNil(error.stack)) {
        validationResults.push(new ValidationResult(message, status));
        return;
    }
    var emitMessage = true;
    error.stack.split(/\r\n?|\n/g).forEach(function(s) {
        var m = ValidationResult.logPattern.exec(s.trim());
        if (ValidationResult.isNil(m)) {
            s = s.trim();
            if (emitMessage && !ValidationResult.isNil(message) && message != s)
                message += " (" + s + ")";
            else
                message = s;
            emitMessage = message.length > 0;
        }
        else {
            emitMessage = false;
            validationResults.push(new ValidationResult(message, status, m[2], m[3], m[4], m[1]));
            message = null;
        }
    });
    if (emitMessage)
        validationResults.push(new ValidationResult(message, status));
}
function getTypeOfExt(obj) {
    var t = typeof(obj);
    if (t != "object")
        return t;
    return (obj === null) ? "null" : ((Array.isArray(obj)) ? "Array" : t);
}

(function() {
    var s = getTypeOfExt(JsUnitTesting);
    if (s != "object") {
        addFailResult("JsUnitTesting namespace type mismatch = Expected: object, actual: " + s);
        return;
    }
    s = getTypeOfExt(JsUnitTesting.Utility);
    if (s != "object") {
        addFailResult("JsUnitTesting.Utility namespace type mismatch = Expected: object, actual: " + s);
        return;
    }
    var dataIndex, expected, actual, testData, methodName, i;
    s = getTypeOfExt(JsUnitTesting.Utility.isNil);
    if (s != "function")
        addFailResult("JsUnitTesting.Utility.isNil funciton type mismatch = Expected: object, actual: " + s);
    else {
        testData = [
            { expected: true, name: "Undefined value" },
            { value: null, expected: true, name: "Null value" },
            { value: "", expected: false, name: "Empty string" },
            { value: [], expected: false, name: "Empty array" },
            { value: [null], expected: false, name: "Array with single null element" },
            { value: { }, expected: false, name: "Empty object" },
            { value: false, expected: false, name: "False value" },
            { value: 0, expected: false, name: "Zero value" },
            { value: Number.NaN, expected: false, name: "NaN value" }
        ];
        methodName = "JsUnitTesting.Utility.isNil";
        for (dataIndex = 0; dataIndex < testData.length; dataIndex++) {
            try {
                actual = JsUnitTesting.Utility.isNil(testData[dataIndex].value);
                s = getTypeOfExt(actual);
                if (s != "boolean")
                    addFailResult("Result from " + testData[dataIndex].name + " type mismatch - Expected: boolean; actual: " + s, methodName);
                else if (actual != testData[dataIndex].expected)
                    addFailResult("Result from " + testData[dataIndex].name + " Expected: " + testData[dataIndex].expected + "; actual: " + actual, methodName);
                else
                    addPassResult("Test with " + testData[dataIndex].name + " passed.", methodName);
            } catch (e) {
                addErrorResults(e, "Error testing " + methodName + " with " + testData[dataIndex].name);
            }
        }
    }
    
    s = getTypeOfExt(JsUnitTesting.Utility.toArray);
    if (s != "function")
        addFailResult("JsUnitTesting.Utility.toArray funciton type mismatch = Expected: object, actual: " + s);
    else {
        testData = [
            { expected: [], name: "Undefined value" },
            { value: null, expected: [null], name: "Null value" },
            { value: "", expected: [""], name: "Empty string" },
            { value: [], expected: [], name: "Empty array" },
            { value: [null], expected: [null], name: "Array with single null element" },
            { value: false, expected: [false], name: "False value" },
            { value: 0, expected: [0], name: "Zero value" }
        ];
        methodName = "JsUnitTesting.Utility.toArray";
        for (dataIndex = 0; dataIndex < testData.length; dataIndex++) {
            try {
                actual = JsUnitTesting.Utility.toArray(testData[dataIndex].value);
                s = getTypeOfExt(actual);
                if (s != "Array")
                    addFailResult("Result from " + testData[dataIndex].name + " type mismatch - Expected: Array; actual: " + s, methodName);
                else if (actual.length != testData[dataIndex].expected.length)
                    addFailResult("Result from " + testData[dataIndex].name + " length mismatch Expected: " + testData[dataIndex].expected.length + "; actual: " + actual.length, methodName);
                else {
                    for (var i = 0; i < actual.length; i++) {
                        s = getTypeOfExt(actual[i]);
                        expected = getTypeOfExt(testData[dataIndex].expected[i]);
                        if (s != expected) {
                            addFailResult("Result from " + testData[dataIndex].name + ", index " + i + " type mismatch - Expected: " + expected + "; actual: " + s, methodName);
                            break;
                        }
                        if (s != "undefined" && s != "null" && actual[i] != testData[dataIndex].expected[i]) {
                            addFailResult("Result from " + testData[dataIndex].name + ", index " + i + " value mismatch - Expected: " + testData[dataIndex].expected[i] + "; actual: " + actual[i], methodName);
                            break;
                        }
                    }
                    if (i == actual.length)
                        addPassResult("Test with " + testData[dataIndex].name + " passed.", methodName);
                }
            } catch (e) {
                addErrorResults(e, "Error testing " + methodName + " with " + testData[dataIndex].name);
            }
        }
    }
})();