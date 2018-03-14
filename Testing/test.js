var regexPatterns = [
    { name: 'pathAndLine', pattern: /^$/ },
    { name: 'severityAndError', pattern: /^$/ },
    { name: 'jsStackTrace', pattern: /^$/ }
];

var testData = [
    {
        text: "C:\Users\lerwi\Github\JSCookbook\Testing\test.js:1",
        file: "C:\Users\lerwi\Github\JSCookbook\Testing\test.js", line: 1, column: null,
        method: null, severity: null, message: null,
        pathAndLine: ["C:\Users\lerwi\Github\JSCookbook\Testing\test.js", "1"],
        severityAndError: null,
        jsStackTrace: null
    }, {
        text: "Error: this is an error",
        file: null, line: null, column: null,
        method: null, severity: "Error", message: "this is an error",
        pathAndLine: ["Error: this is an error", null],
        severityAndError: ["Error", "this is an error"],
        jsStackTrace: null
    }, {
        text: "    at Object.<anonymous> (C:\Users\lerwi\Github\JSCookbook\Testing\test.js:1:69)",
        file: "C:\Users\lerwi\Github\JSCookbook\Testing\test.js", line: 1, column: 69,
        method: "Object.<anonymous>", severity: null, message: null,
        pathAndLine: null,
        severityAndError: null,
        jsStackTrace: ["Object.<anonymous>", "C:\Users\lerwi\Github\JSCookbook\Testing\test.js", "1", "69"]
    }, {
        text: "    at Module._compile (module.js:570:32)",
        file: "module.js", line: 570, column: 32,
        method: "Module._compile", severity: null, message: null,
        pathAndLine: null,
        severityAndError: null,
        jsStackTrace: ["Module._compile>", "module.js", "1", "69"]
    }, {
        text: "    at Object.Module._extensions..js (module.js:579:10)",
        file: "module.js", line: 570, column: 32,
        method: "Object.Module._extensions..js", severity: null, message: null,
        expression: "jsStackTrace"
    }, {
        text: "    at Module.load (module.js:487:32)",
        file: "module.js", line: 570, column: 32,
        method: "Module.load", severity: null, message: null,
        expression: "jsStackTrace"
    }, {
        text: "    at tryModuleLoad (module.js:446:12)",
        file: "module.js", line: 570, column: 32,
        method: "tryModuleLoad", severity: null, message: null,
        expression: "jsStackTrace"
    }, {
        text: "    at Function.Module._load (module.js:438:3)",
        file: "module.js", line: 570, column: 32,
        method: "Function.Module._load", severity: null, message: null,
        expression: "jsStackTrace"
    }, {
        text: "    at Module.runMain (module.js:604:10)",
        file: "module.js", line: 570, column: 32,
        method: "Module.runMain", severity: null, message: null,
        expression: "jsStackTrace"
    }, {
        text: "    at run (bootstrap_node.js:389:7)",
        file: "bootstrap_node.js", line: 570, column: 32,
        method: "run", severity: null, message: null,
        expression: "jsStackTrace"
    }, {
        text: "    at startup (bootstrap_node.js:149:9)",
        file: "bootstrap_node.js", line: 570, column: 32,
        method: "startup", severity: null, message: null,
        expression: "jsStackTrace"
    }, {
        text: "    at bootstrap_node.js:502:3",
        file: "bootstrap_node.js", line: 570, column: 32,
        method: null, severity: null, message: null,
        expression: "jsStackTrace"
    }, {
        text: "Error: There you are",
        file: null, line: null, column: null,
        method: null, severity: "Error", message: "There you are",
        expression: "severityAndError"
    }, {
        text: "    at MyClass.te (C:\Users\lerwi\Github\JSCookbook\Testing\test.js:2:34)",
        file: "C:\Users\lerwi\Github\JSCookbook\Testing\test.js", line: 570, column: 32,
        method: "MyClass.te", severity: null, message: null,
        expression: "jsStackTrace"
    }, {
        text: "    at ms (C:\Users\lerwi\Github\JSCookbook\Testing\test.js:7:7)",
        file: "C:\Users\lerwi\Github\JSCookbook\Testing\test.js", line: 570, column: 32,
        method: "ms", severity: null, message: null,
        expression: "jsStackTrace"
    }, {
        text: "    at Object.<anonymous> (C:\Users\lerwi\Github\JSCookbook\Testing\test.js:10:1)",
        file: "C:\Users\lerwi\Github\JSCookbook\Testing\test.js", line: 570, column: 32,
        method: "Object.<anonymous>", severity: null, message: null,
        expression: "jsStackTrace"
    }, {
        text: "    at Module._compile (module.js:570:32)",
        file: "module.js", line: 570, column: 32,
        method: "Module._compile", severity: null, message: null,
        expression: "jsStackTrace"
    }, {
        text: "    at run (bootstrap_node.js:389:7)",
        file: "bootstrap_node.js", line: 570, column: 32,
        method: "run", severity: null, message: null,
        expression: "jsStackTrace"
    }, {
        text: "Error: E",
        file: null, line: null, column: null,
        method: null, severity: "Error", message: "E",
        expression: "severityAndError"
    }, {
        text: "    at MyClass.(C:\tezt) (c:\woo) (C:\Users\lerwi\Github\JSCookbook\Testing\test.js:7:11)",
        file: "C:\Users\lerwi\Github\JSCookbook\Testing\test.js", line: 570, column: 32,
        method: "MyClass.(C:\tezt) (c:\woo)", severity: null, message: null,
        expression: "jsStackTrace"
    }, {
        text: "    at ms (C:\Users\lerwi\Github\JSCookbook\Testing\test.js:11:30)",
        file: "C:\Users\lerwi\Github\JSCookbook\Testing\test.js", line: 570, column: 32,
        method: " ", severity: null, message: null,
        expression: "jsStackTrace"
    }, {
        text: "    at Object.<anonymous> (C:\Users\lerwi\Github\JSCookbook\Testing\test.js:14:1)",
        file: "C:\Users\lerwi\Github\JSCookbook\Testing\test.js", line: 570, column: 32,
        method: "Object.<anonymous>", severity: null, message: null,
        expression: "jsStackTrace"
    }
];