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
 * @param {string|string[]} message Message(s) to emit.
 * @param {number=2} severity Severity of error: -1=inconclusive,0=Debug,1=verbose,2=pass,3=warning,4=fail,5=error
 * @param {string=} file Name of file associated with message. 
 * @param {number=} line Line number (1-based) associated with message.
 * @param {number=} column Column number (1-based) associated with message.
 */
function emitResult(message, severity, file, line, column) {
    if (typeof(severity) !== "number")
        severity = (typeof(severity) == "undefined" || severity === null) ? Number.NaN : parseInt(severity);
    if (isNaN(severity))
        severity = 2;
    else if (severity < -1)
        severity = -1;
    else if (severity > 5)
        severity = 5;
    if (typeof(message) == "undefined" || message === null)
        message = "";
    else {
        var re = /\r\n?|\n/g;
        var nonBlankFilter = function(s) { return s.length > 0; };
        if (typeof(message) == "object" && Array.isArray(message)) {
                var arr = [];
                message.forEach(function(s) {
                    arr = arr.concat(((typeof(s) == "string") ? s : ((typeof(s) == "undefined" || s === null) ? "" : s+"")).split(re));
                });
                message = arr;
        } else
            message = ((typeof(message) == "string") ? message : ((typeof(message) == "undefined" || message === null) ? "" : message+"")).split(re)
        message = message.map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
        if (message.length == 0)
            message = "";
        else
            message = (message.length == 1) ? message[0] : message.join("\n\t");
    }
    if (message.length > 0)
        message = " " + message;
    if (typeof(line) !== "number")
        line = (typeof(line) == "undefined" || line === null) ? Number.NaN : parseInt(line);
    if (typeof(column) !== "number")
        column = (typeof(column) == "undefined" || column === null) ? Number.NaN : parseInt(column);
    var logLine;
    switch (severity) {
        case 0:
            logLine = "DEBUG";
            break;
        case 1:
            logLine = "VERBOSE";
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
    if (isNaN(line) || line < 1) {
        if (!isNaN(column) && column > 0)
            logLine += "@," + column;
    } else {
        logLine += "@" + line;
        if (!isNaN(column) && column > 0)
            logLine += "," + column;
    }
    if (typeof(file) != "undefined" && file !== null) {
        file = ((typeof(file) == "string") ? file : file+"").trim();
        if (file.length > 0)
            logLine += "~" + file.replace("\\", "\\\\").replace("[", "\\[").replace("]", "\\]").replace("\r", "\\r").repeat("\n", "\\n");
    }
    console.log("%s]%s", logLine, message);
}

/**
 * Writes formatted error message to the console.
 * @param {Error} error Error to be emitted.
 * @param {string|string[]=} message Additional message(s) to emit.
 * @param {number=4} severity Severity of error: -1=inconclusive,0=Debug,1=verbose,2=pass,3=warning,4=fail,5=error
 */
function emitError(error, message, severity) {

}

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