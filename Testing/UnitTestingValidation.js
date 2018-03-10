var PATH = require('path');
var FS   = require('fs');
var OS   = require('os');
var UTIL = require("util");
var VM = require("vm");

var sandbox = {
    animal: 'cat',
    count: 2
};
/*
var scripts = process.argv.filter(function(e, i) { return i > 1 && typeof(e) == "string" && e.trim().length > 0; });
if (scripts.length == 0) {
    function getTypeString(o) {
        var t = typeof(o);
        if (t == "object")
            return (o === null) ? "null" : (Array.isArray(o)) ? "Array" : t;
        return t;
    }
    var text = FS.readFileSync(PATH.join(__dirname, "..", ".vscode", "tasks.json")).toString();
    var tasksJson = eval("(function() { return " + text + "; })();");
    var t = getTypeString(tasksJson);
    if (t != "object") {
        console.log("INCONCLUSIVE: at <init> (%s:0:0) Expected object from tasks.json; actual: %s", __filename, t);
        return;
    }
    t = getTypeString(tasksJson.tasks);
    if (t != "Array") {
        console.log("INCONCLUSIVE: at <init> (%s:0:0) Expected tasks array in task configuration; actual: %s", __filename, (t == "object") ? Object.toString.call(tasksJson.tasks) : t);
        return;
    }
    var mt = tasksJson.tasks.filter(function(t) { return t.identifier === "testJSUnitTesting"; });
    if (mt.length != 1) {
        console.log("INCONCLUSIVE: at <init> (%s:0:0) Expected 1 task matching identifier \"testJSUnitTesting\" from tasks.json; actual: %s", __filename, mt.length);
        return;
    }
    t = getTypeString(mt[0].args);
    if (t != "Array") {
        console.log("INCONCLUSIVE: at <init> (%s:0:0) Expected args array in task description; actual: %s", __filename, (t == "object") ? Object.toString.call(mt[0].args) : t);
        return;
    }
    scripts = mt[0].args.filter(function(e, i) { return i > 1 && typeof(e) == "string" && e.trim().length > 0; });
    if (scripts.length == 0) {
        console.log("INCONCLUSIVE: at <init> (%s:0:0) Expected script path arguments", __filename);
        return;
    }
}
var fullPaths = scripts.map(function(s) { return PATH.join(__dirname, s); });
var invalidPaths = fullPaths.filter(function(p) { return !FS.existsSync(p); });
if (invalidPaths.length > 0) {
    invalidPaths.forEach(function(p) { console.log("INCONCLUSIVE: at <init> (%s:0:0) Script not found at %s", __filename, p); });
    return;
}
if (fullPaths.filter(function(p) {
    try {
        var context = VM.createContext(sandbox);
        var script = new VM.Script(FS.readFileSync(p).toString());
        script.runInContext(context, { filename: p });
    } catch (e) {
        console.log(e);
        console.log("INCONCLUSIVE: at <init> (%s:0:0) Unable to load script from %s: %s", __filename, p, e);
        return true;
    }
    return false;
}).length > 0)
    return;
*/

/**
 * Writes a formatted message to the console.
 * @param {string|string[]=} message Message(s) to emit.
 * @param {number=2} severity Severity of error: -1=inconclusive,0=Debug,1=info,2=pass,3=warning,4=fail,5=error
 * @param {string=} file Name of file associated with message. 
 * @param {number=} line Line number (1-based) associated with message.
 * @param {number=} column Column number (1-based) associated with message.
 */
function TestResult(message, severity, file, line, column) {
    this.message = message;
    this.severity = severity;
    this.file = file;
    this.line = line;
    this.column = column;

    this.getMessage = function() {
        if (typeof(this.message) == "undefined" || this.message === null)
            this.message = "";
        else if (typeof(this.message) == "object" && Array.isArray(this.message)) {
            for (var i = 0; i < this.message.length; i++) {
                if (typeof(this.message[i]) == "string")
                    continue;
                if (this.message[i] == "undefined" || this.message[i] === null)
                    this.message[i] = "";
                else
                    this.message[i] = ""+this.message[i];
            }
        } else if (typeof(this.message) != "string")
            this.message = "" + this.message;
        return this.message;
    };

    this.getSeverity = function() {
        if (typeof(this.severity) !== "number")
            this.severity = (typeof(this.severity) == "undefined" || this.severity === null) ? Number.NaN : parseInt(this.severity);
        if (isNaN(severity))
            this.severity = 2;
        else if (this.severity < -1)
            this.severity = -1;
        else if (this.severity > 5)
            this.severity = 5;
        return this.severity;
    };

    this.getFile = function() {
        if (typeof(this.file) == "undefined" || this.file === null)
            this.file = "";
        else if (typeof(this.message) != "string")
            this.file = "" + this.file;
        return this.file;
    };

    this.getLine = function() {
        if (typeof(this.line) !== "number")
            this.line = (typeof(this.line) == "undefined" || this.line === null) ? Number.NaN : parseInt(this.line);
        if (this.line < 1)
            this.line = Number.NaN;
        return this.line;
    };

    this.getColumn = function() {
        if (typeof(this.column) !== "number")
            this.column = (typeof(this.column) == "undefined" || this.column === null) ? Number.NaN : parseInt(this.column);
        if (this.column < 1)
            this.column = Number.NaN;
        return this.column;
    };

    this.toString = function() {
        var logLine;
        var severity = this.getSeverity();
        switch (severity) {
            case 0:
                logLine = "DEBUG";
                break;
            case 1:
                logLine = "INFO";
                break;
            case 2:
                logLine = "PASS";
                break;
            case 3:
                logLine = "WARNING";
                break;
            case 4:
                logLine = "FAIL";
                break;
            case 5:
                logLine = "ERROR";
                break;
            default:
                logLine = "INCONCLUSIVE";
                break;
        }
        logLine += " [" + severity;
        var line = this.getLine();
        var column = this.getColumn();
        if (isNaN(line)) {
            if (!isNaN(column))
                logLine += "@," + column;
        } else {
            logLine += "@" + line;
            if (!isNaN(column))
                logLine += "," + column;
        }
        var file = this.getFile().trim();
        if (file.length > 0)
            logLine += "~" + file.replace("\\", "\\\\").replace("[", "\\[").replace("]", "\\]").replace("\r", "\\r").repeat("\n", "\\n");
        var msgLines = [];
        (function() {
            var message = this.getMessage();
            if (typeof(message) == "string")
                return [message.trim()];
            return message;    
        })().forEach(function(s) {
            msgLines = msgLines.concat(s.split(/\r\n?|\n/g).map(function(l) { return l.trim(); }));
        });
        for (var len = msgLines.length - 1; len > 1; len--) {
            if (msgLines[len].length > 0)
                break;
            msgLines.pop();
        }
        while (msgLines.length > 0 && msgLines[0].length == 0)
            msgLines.unshift();
        if (msgLines.length == 0)
            return logline + "]";
        else
            return logLine + "] " + message.join("\n\t");
    };
}

/**
 * Creates a TestResult inconclusive message object.
 * @param {string|string[]=} message Test result message.
 * @param {string=} file File associated with test result.
 * @param {number=} line Line number (1-based) associated with message.
 * @param {number=} column Column number (1-based) associated with message.
 */
TestResult.CreateInconclusive = function(message, file, line, column) {
    return new TestResult(message, -1, file, line, column);
};

/**
 * Creates a TestResult debug message object.
 * @param {string|string[]=} message Test result message.
 * @param {string=} file File associated with message.
 * @param {number=} line Line number (1-based) associated with message.
 * @param {number=} column Column number (1-based) associated with message.
 */
TestResult.CreateDebug = function(message, file, line, column) {
    return new TestResult(message, 0, file, line, column);
};

/**
 * Creates a TestResult debug message object.
 * @param {string|string[]=} message Test result message.
 * @param {string=} file File associated with message.
 * @param {number=} line Line number (1-based) associated with message.
 * @param {number=} column Column number (1-based) associated with message.
 */
TestResult.CreateInfo = function(message, file, line, column) {
    return new TestResult(message, 1, file, line, column);
};

/**
 * Creates a TestResult debug message object.
 * @param {string|string[]=} message Test result message.
 * @param {string=} file File associated with message.
 * @param {number=} line Line number (1-based) associated with message.
 * @param {number=} column Column number (1-based) associated with message.
 */
TestResult.CreatePass = function(message, file, line, column) {
    return new TestResult(message, 2, file, line, column);
};

/**
 * Creates a TestResult debug message object.
 * @param {string|string[]=} message Test result message.
 * @param {string=} file File associated with message.
 * @param {number=} line Line number (1-based) associated with message.
 * @param {number=} column Column number (1-based) associated with message.
 */
TestResult.CreateWarning = function(message, file, line, column) {
    return new TestResult(message, 3, file, line, column);
};

/**
 * Creates a TestResult debug message object.
 * @param {string|string[]=} message Test result message.
 * @param {string=} file File associated with message.
 * @param {number=} line Line number (1-based) associated with message.
 * @param {number=} column Column number (1-based) associated with message.
 */
TestResult.CreateFail = function(message, file, line, column) {
    return new TestResult(message, 4, file, line, column);
};

/**
 * Creates a TestResult debug message object.
 * @param {string|string[]=} message Test result message.
 * @param {string=} file File associated with message.
 * @param {number=} line Line number (1-based) associated with message.
 * @param {number=} column Column number (1-based) associated with message.
 */
TestResult.CreateError = function(message, file, line, column) {
    return new TestResult(message, 5, file, line, column);
};

/**
 * Parses stack trace into file, line, column information.
 * @param {string} stackTrace Stack trace to parse.
 */
TestResult.parseStackTrace = function(stackTrace) {

};

/**
 * Creates a TestResult object from an error.
 * @param {Error} error Error from which to generate message and file/line information.
 * @param {string|string[]=} message Additional message(s) to emit.
 * @param {number=5} severity Severity of error: -1=inconclusive,0=Debug,1=info,2=pass,3=warning,4=fail,5=error
 * @param {number=} stackDepth Maximum number of entries to parse from stack.
 */
TestResult.FromErrorObject = function(error, message, severity, stackDepth) {

};

var path = PATH.join(__dirname, "..", "Dist", "JSUnitTesting.js")
try {
    var context = VM.createContext(sandbox);
    var script = new VM.Script(FS.readFileSync(path).toString());
    script.runInContext(context, { filename: 'JSUnitTesting.js' });
} catch (e) {
    console.log(e);
    console.log("INCONCLUSIVE: at <init> (%s:0:0) Unable to load script from %s: %s", __filename, path, e);
    return;
}
JsUnitTesting = sandbox.JsUnitTesting;
try {
    var testColl = new JsUnitTesting.TestCollection([], "myTest", "1234");
} catch (e) {
    console.log(e);
    console.log(Object.getOwnPropertyNames(sandbox));
}