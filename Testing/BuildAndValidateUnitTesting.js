import { execFileSync } from 'child_process';

//import { DEFAULT_ECDH_CURVE } from 'tls';

var PATH = require('path');
var FS   = require('fs');
var OS   = require('os');
var UTIL = require("util");
var UglifyJS = require("uglify-js2");

var vsCodeTasks = JSON.parse(FS.readFileSync(PATH.join(__dirname, "..", ".vscode", "tasks.json")).toString());
vsCodeTasks.tasks
var inputPath = PATH.join(__dirname, "..", "JSCookbook", "JSUnitTesting");
var inputFiles = [
    "Utility.js",
    "TypeSpec.js",
    "TestResult.js",
    "UnitTest.js",
    "TestCollection.js",
    "AssertionError.js",
    "Assert.js"].map(function(s) { return {
        name: s,
        path: PATH.join(inputPath, s)
    }; });
var inputPaths = inputFiles.map(function(o) { return o.path; });
console.log("Source files: \n" + inputPaths.join("\t\n"));
console.log("Building minified version");
var min = UglifyJS.minify(inputPaths, { compress: true });
if (min.error) {
    console.log("Build Error: " + min.error.message + "\n" + JSON.stringify(min.error));
    return;
}
var path = PATH.join(__dirname, "..", "Dist", "JSUnitTesting.min.js.map");
console.log("Saving " + path);
FS.writeFileSync(path, min.map);
path = PATH.join(__dirname, "..", "Dist", "JSUnitTesting.min.js");
console.log("Saving " + path);
FS.writeFileSync(path, min.code);
console.log("Building expanded version");
var source_map = UglifyJS.SourceMap();
var stream = UglifyJS.OutputStream({
    indent_start  : 0,     // start indentation on every line (only when `beautify`)
    indent_level  : 4,     // indentation level (only when `beautify`)
    quote_keys    : false, // quote all keys in object literals?
    space_colon   : true,  // add a space after colon signs?
    ascii_only    : false, // output ASCII-safe? (encodes Unicode characters as ASCII)
    inline_script : false, // escape "</script"?
    width         : 120,    // informative maximum line width (for beautified output)
    max_line_len  : 32000, // maximum line length (for non-beautified output)
    ie_proof      : true,  // output IE-safe code?
    beautify      : true, // beautify output?
    source_map    : source_map,  // output a source map
    bracketize    : false, // use brackets every time?
    comments      : true, // output comments?
    semicolons    : true,  // use semicolons to separate statements? (otherwise, newlines)
});
inputFiles.forEach(function(file){
    var code = FS.readFileSync(file.path, "utf8");
    var ast = UglifyJS.parse(code, { filename: file.name });
    ast.print(stream);
});
path = PATH.join(__dirname, "..", "Dist", "JSUnitTesting.js.map");
console.log("Saving " + path);
FS.writeFileSync(path, source_map.toString());
path = PATH.join(__dirname, "..", "Dist", "JSUnitTesting.js");
console.log("Saving " + path);
FS.writeFileSync(path, stream.toString());
console.log("Loading JSUnitTesting (Build Finished).");
execFileSync(PATH.join(__dirname, "UnitTestValidation.js"));
