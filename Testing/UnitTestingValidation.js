var PATH = require('path');
var FS   = require('fs');
var OS   = require('os');
var UTIL = require("util");
var VM = require("vm");

var jsPath = PATH.join(__dirname, "..", "Dist", "JSUnitTesting.js");
var testPath = PATH.join(__dirname, "..", "src", "JSUnitTesting", "validation_test.js");
var sandbox = { };
var testResults = [];
var re = /\r\n|\n/g;
var jsContent, jsLineCount, testContent;
try {
    jsContent = FS.readFileSync(jsPath).toString() + "\n";
} catch (e) {
    console.error(e);
    return;
}
jsLineCount = jsContent.split(re).length - 1;
try {
    testContent = FS.readFileSync(testPath).toString();
} catch (e) {
    console.error(e);
    console.log("First line of test script is " + jsLineCount);
    return;
}
try {
    var context = VM.createContext(sandbox);
    var script = new VM.Script(jsContent + testContent);
    script.runInContext(context, { filename: 'JSUnitTesting.js' });
} catch (e) {
    console.error(e);
    console.log("First line of test script is " + jsLineCount);
    return;
}

sandbox.validationResults.forEach(function(obj) {
    console.log(obj.toString());
});
var errorCount = sandbox.validationResults.filter(function(obj) { return (obj.status == "ERROR" || obj.status == "FAIL"); }).length;
var warningCount = sandbox.validationResults.filter(function(obj) { return (obj.status == "WARN"); }).length;
var passCount = sandbox.validationResults.filter(function(obj) { return (obj.status == "PASS"); }).length;
console.log("First line of test script is " + jsLineCount);
if (errorCount > 0)
    console.error("%d failed, %d warnings, %d passed", errorCount, warningCount, passCount);
else if (warningCount > 0)
    console.error("None failed, %d warnings, %d passed", warningCount, passCount);
else
    console.error("%d passed", passCount);