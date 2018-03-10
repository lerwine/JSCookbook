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