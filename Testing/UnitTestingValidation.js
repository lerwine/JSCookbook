var PATH = require('path');
var FS   = require('fs');
var OS   = require('os');
var UTIL = require("util");
var VM = require("vm");

/**
 * Enum for test result status.
 * @readonly
 * @enum {number}
 */
var ResultStatus = {
    /** Test results were inconclusive. */
    Inconclusive: -2,
    /** Test was not evaluated. */
    NotEvaluated: -1,
    /** Test result object contains debug information and does not indicate result status. */
    Debug: 0,
    /** Test result object is informational and does not indicate result status. */
    Info: 1,
    /** Test result object is for a test that has passed. */
    Pass: 2,
    /** Test result object is for a test that has passed with a warning message. */
    Warning: 3,
    /** Test result object is for a test that has failed.  */
    Fail: 4,
    /** Test result object is for a test that has failed due to an exception being thrown. */
    Error: 5
};
TestUtility = {
    isNil: function(o) { return typeof(o) == "undefined" || o === null; },

    asString: function(s) {
        if (TestUtility.isNil(s))
            return "";
        if (typeof(s) == "string")
            return s;
        if (Array.isArray(s))
            return s.join("\n");
        try { s = s.toString(); }
        catch (e) { /* okay to ignore */ }
        if (TestUtility.isNil(s))
            return "";
        if (typeof(s) == "string")
            return s;
        return s + "";
    },

    asNumber: function(n) {
        if (TestUtility.isNil(n))
            return Number.NaN;
        if (typeof(n) != "number") {
            if (typeof(n.valueOf) == "function") {
                try {
                    var v = n.valueOf();
                    if (typeof(v) == "number" && !isNaN(v) && Number.isFinite(v))
                        return v;
                } catch (e) { /* okay to ignore */ }
            }
            if (typeof(n) == "object") {
                if (Array.isArray(n) && n.length > 0) {
                    n = n[0];
                    if (TestUtility.isNil(n))
                        return Number.NaN;
                } else
                    return Number.NaN;
            }
            if (typeof(n) !== "string")
                return Number.NaN;
            try { n = parseFloat(n); } catch (e) { return Number.NaN; }
        }
        if (isNaN(n) || !Number.isFinite(n))
            return Number.NaN;
        return n;
    },

    asInteger: function(n) {
        n = TestUtility.asNumber(n);
        if (isNaN(n) || Number.isInteger(n))
            return n;
        return Math.round(n);
    },

    normalizeStringLines: function(arr) {
        if (TestUtility.isNil(arr))
            return [];
        var i;
        if (typeof(arr) == "object" && Array.isArray(arr)) {
            if (arr.length == 0)
                return arr;
        } else
            arr = [arr];
        var re = /\r\n?|\n/g;
        for (i = 0; i < arr.length; i++) {
            var a = (arr[i] = TestUtility.asString(arr[i]).trimRight()).split(re);
            if (a.length > 1) {
                arr.splice(i, 1, a);
                i += a.length - 1;
            }
        }
        for (i = arr.length - 1; i > 1; i--) {
            if (arr[i].length > 0)
                break;
            arr.pop();
        }
        while (arr.length > 1 && arr[0].length == 0)
            arr.unshift();

        return arr;
    },

    toNameAndId: function(o) {
        if (!TestUtility.isNil(o)) {
            if (typeof(o) != "object")
                return TestUtility.toNameAndId({ id: o });
            if (!Array.isArray(o)) {
                if (typeof(o.id) !== "undefined") {
                    if (o.id === null)
                        o.id = undefined;
                    else {
                        o.id = IDandName.asNumberOrString(o.id);
                        if ((typeof(o.id) == "string") ? (o.id = o.id.trim()).length == 0 : isNaN(o.id))
                            o.id = undefined;
                    }
                }
                if (typeof(o.name) !== "undefined") {
                    if (o.name === null)
                        o.name = undefined;
                    else {
                        o.name = TestUtility.asString(o.id).trim();
                        if (o.name.length == 0)
                            o.name = undefined;
                    }
                }
                return o;
            }
            if (o.length > 0) {
                var id = IDandName.asNumberOrString(o[0]);
                if (typeof(id) == "string" && (id = id.trim()).length == 0)
                    id = Number.NaN;
                if (o.length == 1 || (o.length > 1 && TestUtility.isNil(o[1]))) {
                    if (typeof(id) == "string" || !isNaN(id))
                        return { id: id };
                } else {
                    var s = TestUtility.asString(o[1]).trim();
                    if (typeof(id) == "string" || !isNaN(id)) {
                        if (s.length > 0)
                            return { name: s };
                    } else {
                        if (s.length > 0)
                            return { id: id, name: s };
                        return { id: id };
                    }
                }
            }
        }
    }
};
var IDandName = (function(TestUtility) {
    /**
     * Represents a unique identifer with an optional descriptive name.
     * @class
     * @property {number|string} id Unique identifier.
     * @property {string} [name] User-friendly name.
     * number|string|{ id: number|string, name: string }
     */
    function IDandName(id, name) {
        /**
         * Unique identifier.
         * @type {number|string=}
         */
        this.id = id;

        /**
         * Descriptive name.
         * @type {string=}
         */
        this.name = name;

        this.normalizeProperties();
    }
    /**
     * Ensures property values are normalized.
     */
    IDandName.prototype.normalizeProperties = function() {
        if (typeof(this.name) !== "undefined") {
            if (this.name === null)
                this.name = undefined;
            else
                this.name = TestUtility.asString(this.name).trim();
        }
        if (typeof(this.id) !== "undefined") {
            var n = IDandName.asNumberOrString(this.line);
            if ((typeof(n) == "string") ? (n = n.trim()).length == 0 : isNaN(n))
                this.line = undefined;
            else
                this.line = n;
        }
    };
    /**
     * Ensures an object is a IDandName object, converting it if necessary.
     */
    IDandName.asIDandName = function(obj) {
        if (!TestUtility.isNil(obj))
            return new IDandName();
        if (typeof(obj) == "object") {
            if (IDandName.prototype.isPrototypeOf(obj))
                return obj;
            if (!TestUtility.isNil(obj.id) || !TestUtility.isNil(obj.name))
                return new IDandName(obj.id, obj.name);
            if (Array.isArray(obj)) {
                if (obj.length == 0)
                    return new FilePoIDandNamesition();
                if (obj.length == 1)
                    return new IDandName(obj[0]);
                return new IDandName(obj[0], obj[1]);
            }
        }
        return new IDandName(obj);
    };
    /**
     * Attempts to convert an object to a number, otherwise, converts it to a string.
     * @param {*} o Object to be converted a number or a string.
     * @returns {number|string} Object converted to a number or a string.
     */
    IDandName.asNumberOrString = function(o) {
        if (TestUtility.isNil(o))
            return Number.NaN;
        if (typeof(o) == "string")
            return o;
        var n;
        if (typeof(o) == "number") {
            if (isNaN(o) || !Number.isFinite(o))
                return Number.NaN;
            return o;
        }
        if (typeof(o.valueOf) == "function") {
            try {
                n = o.valueOf();
                if (typeof(n) == "number" && !isNaN(n) && Number.isFinite(n))
                    return n;
            } catch (e) { /* okay to ignore */ }
        }
        if (typeof(o) == "object" && Array.isArray(o)) {
            if (o.length == 0 || TestUtility.isNil(o[0]) || (typeof(o[0]) == "object" && Array.isArray(o[0])))
                return Number.NaN;
            n = IDandName.asNumberOrString(o[0]);
            if (typeof(n) == "string" || !isNaN(n))
                return n;
            o = o[0];
        }
        o = TestUtility.asString(o);
        try { n = parseFloat(o); } catch (e) { return o; }
        if (isNaN(n) || n.toString().length != o.length)
            return o;
        return n;
    };
    return IDandName;
})(TestUtility);

var FilePosition = (function(TestUtility) {
    /**
     * Represents a position within a file.
     * @param {string} name Name or path of a file.
     * @param {number} [line] Line number (1-based) within the specified file.
     * @param {number} [column] Column number (1-based) within the specified line of the file.
     * string|{ name: string, line: number, column: number }
     */
    function FilePosition(name, line, column) {
        /**
         * Name or path of file.
         * @type {string}
         */
        this.name = name;

        /**
         * Line number (1-based) within file.
         * @type {number=}
         */
        this.line = line;

        /**
         * Column number (1-based) within specified line of file.
         * @type {number=}
         */
        this.column = column;

        this.normalizeProperties();
    }
    /**
     * Ensures property values are normalized.
     */
    FilePosition.prototype.normalizeProperties = function() {
        if (typeof(this.name) !== "undefined") {
            if (this.name === null)
                this.name = undefined;
            else
                this.name = TestUtility.asString(this.name).trim();
        }
        
        var n = TestUtility.asInteger(this.line);
        if (isNaN(n))
            this.line = undefined;
        else
            this.line = n;
        n = TestUtility.asInteger(this.column);
        if (isNaN(n))
            this.column = undefined;
        else
            this.column = n;
    };
    /**
     * Ensures an object is a FilePosition object, converting it if necessary.
     */
    FilePosition.asFilePosition = function(obj) {
        if (!TestUtility.isNil(obj))
            return new FilePosition();
        if (typeof(obj) == "object") {
            if (FilePosition.prototype.isPrototypeOf(obj))
                return obj;
            if (!TestUtility.isNil(obj.name) || !TestUtility.isNil(obj.line) || !TestUtility.isNil(obj.column))
                return new FilePosition(obj.name, obj.line, obj.column);
            if (Array.isArray(obj)) {
                if (obj.length == 0)
                    return new FilePosition();
                if (obj.length == 1)
                    return new FilePosition(obj[0]);
                if (obj.length == 2)
                    return new FilePosition(obj[0], obj[1]);
                return new FilePosition(obj[0], obj[1], obj[2]);
            }
        }
        return new FilePosition(obj);
    };
    return FilePosition;
})(TestUtility);

var TestDescriptor = (function(TestUtility, IDandName) {
    /**
     * Describes unit test.
     * @class
     * @param {number|string} id Unique identifer of a unit test.
     * @param {string} [name] Descriptive name of a unit test.
     * @param {number|string|{ id: number|string, name: string }} [group] Identifies the group which contains the test being described.
     * number|string|{ id: number|string, name: string, group: number|string|{ id: number|string, name: string } }
     */
    var TestDescriptor = function(id, name, group) {
        IDandName.call(this, id, name);
        this.group = IDandName.asIDandName(group);
    };
    TestDescriptor.prototype = Object.create(IDandName.prototype);
    TestDescriptor.prototype.constructor = TestDescriptor;
    /**
     * Ensures property values are normalized.
     */
    TestDescriptor.prototype.normalizeProperties = function() {
        IDandName.prototype.normalizeProperties.call(this);
        this.group = IDandName.asIDandName(this.group);
    };
    /**
     * Ensures an object is a TestDescriptor object, converting it if necessary.
     */
    TestDescriptor.asTestDescriptor = function(obj) {
        if (!TestUtility.isNil(obj))
            return new TestDescriptor();
        if (typeof(obj) == "object") {
            if (TestDescriptor.prototype.isPrototypeOf(obj))
                return obj;
            if (!TestUtility.isNil(obj.id) || !TestUtility.isNil(obj.name) || !TestUtility.isNil(obj.group))
                return new TestDescriptor(obj.id, obj.name, obj.group);
            if (Array.isArray(obj)) {
                if (obj.length == 0)
                    return new TestDescriptor();
                if (obj.length == 1)
                    return new TestDescriptor(obj[0]);
                if (obj.length == 2)
                    return new TestDescriptor(obj[0], obj[1]);
                return new TestDescriptor(obj[0], obj[1], obj[2]);
            }
        }
        return new TestDescriptor(obj);
    };
    return TestDescriptor;
})(TestUtility, IDandName);

var TestDataDesriptor = (function(TestUtility, IDandName) {
    /**
     * Describes the data that was passed to a unit test method.
     * @param {number|string|{ id: number|string, name: string }} [item] Data item passed to a unit test method.
     * @param {number|string|{ id: number|string, name: string }} [set] Data set containing data item passed to a unit test method.
     * number|string|{ item: number|string|{ id: number|string, name: string }, set: number|string|{ id: number|string, name: string } }
     */
    function TestDataDesriptor(item, set) {
        this.item = item;
        this.set = set;
        this.normalizeProperties();
    }
    /**
     * Ensures property values are normalized.
     */
    TestDataDesriptor.prototype.normalizeProperties = function() {
        this.item = IDandName.asIDandName(this.item);
        this.set = IDandName.asIDandName(this.set);
    };
    /**
     * Ensures an object is a TestDataDesriptor object, converting it if necessary.
     */
    TestDataDesriptor.asTestDataDesriptor = function(obj) {
        if (!TestUtility.isNil(obj))
            return new IDandName();
        if (typeof(obj) == "object") {
            if (IDandName.prototype.isPrototypeOf(obj))
                return obj;
            if (!TestUtility.isNil(obj.id) || !TestUtility.isNil(obj.name))
                return new IDandName(obj.id, obj.name);
            if (Array.isArray(obj)) {
                if (obj.length == 0)
                    return new FilePoIDandNamesition();
                if (obj.length == 1)
                    return new IDandName(obj[0]);
                return new IDandName(obj[0], obj[1]);
            }
        }
        return new IDandName(obj);
    };
    return TestDataDesriptor;
})(TestUtility, IDandName);

var TestResult = (function(TestUtility, IDandName, FilePosition, TestDescriptor, TestDataDesriptor) {
    /**
     * Creates a new TestResult object.
     * @class
     * @param {{ message: string|string[], status: ResultStatus, test: number|string|{ id: number|string, name: string, group: number|string|{ id: number|string, name: string } }, data: number|string|{ item: number|string|{ id: number|string, name: string }, set: number|string|{ id: number|string, name: string } }, file: string|{ name: string, line: number, column: number }, metaData: * } properties Properties used for initializing the test result.
     */
    function TestResult(properties) {
        /**
         * Zero or more short messages describing test results.
         * @type {string[]}
         */
        this.message = [];
    
        /**
         * Status (severity) of the test result.
         * @type {ResultStatus}
         */
        this.status = ResultStatus.Inconclusive;
    
        /**
         * Describes teh test that was executed.
         * @type {TestDescriptor}
         */
        this.test = new TestDescriptor();
    
        /**
         * Describes the data that was passed to the test method.
         * @type {TestDataDesriptor}
         */
        this.data = new TestDataDesriptor();
    
        /**
         * Indicates the file and/or position associated with the test result.
         * @type {FilePosition}
         */
        this.file = new FilePosition();
    
        /**
         * Arbitrary user-defined meta data to include with the test result.
         */
        this.metaData = null;
        if (!TestUtility.isNil(properties)) {
            this.message = properties.message;
            this.status = properties.status;
            this.test = properties.test;
            this.data = properties.data;
            this.file = properties.file;
            this.metaData = properties.metaData;
        }
    
        this.normalizeProperties();
    
        /**
         * Generates a string that can be used for logging.
         */
        this.toString = function() {
            this.normalizeProperties();
            var logLine;
            switch (this.status) {
                case ResultStatus.NotEvaluated:
                    logLine = "NOT_EVALUATED";
                    break;
                case ResultStatus.Debug:
                    logLine = "DEBUG";
                    break;
                case ResultStatus.Info:
                    logLine = "INFO";
                    break;
                case ResultStatus.Pass:
                    logLine = "PASS";
                    break;
                case ResultStatus.Warning:
                    logline = "WARNING"
                    break;
                case ResultStatus.Fail:
                    logLine = "FAIL";
                    break;
                case ResultStatus.Error:
                    logLine = "ERROR";
                    break;
                default:
                    logLine = "INCONCLUSIVE";
                    break;
            }
            logLine += " [" + this.status;
            var line = this.file.line;
            var column = this.file.column;
            if (TestUtility.isNil(line) ) {
                if (TestUtility.isNil(column))
                    logLine += "@," + column;
            } else {
                logLine += "@" + line;
                if (TestUtility.isNil(column))
                    logLine += "," + column;
            }
            var file = this.file.name;
            if (!TestUtility.isNil(file) && file.length > 0)
                logLine += "~" + file.replace("\\", "\\\\").replace("[", "\\[").replace("]", "\\]").replace("\r", "\\r").repeat("\n", "\\n");
            var msgLines = this.message;
            if (msgLines.length == 0)
                return logline + "]";
            else
                return logLine + "] " + msgLines.join("\n\t");
        };
    }
    
    /**
     * Ensures property values are normalized.
     */
    TestResult.prototype.normalizeProperties = function() {
        var util = TestUtility;
        var id;
        this.message = util.normalizeStringLines(this.message);
        this.status = util.asInteger(this.status);
        if (isNaN(this.status))
            this.status = ResultStatus.Info;
        else if (this.status < ResultStatus.Inconclusive)
            this.status = ResultStatus.Inconclusive;
        else if (this.status > ResultStatus.Error)
            this.status = ResultStatus.Error;
        this.test = TestDescriptor.asTestDescriptor(this.test);
        this.data = TestDataDesriptor.asTestDataDesriptor(this.data);
        this.file = FilePosition.asFilePosition(this.file);
    };
    
    
    /**
     * Creates a {@link TestResult} object representing inconclusive test results.
     * @param {string|string[]} message Message describing test results.
     * @param {string|{ name: string, line: number, column: number }} filePosition File and/or position related to the test result.
     * @param {number|string|{ item: number|string|{ id: number|string, name: string }, set: number|string|{ id: number|string, name: string } }} data Identifies the data that was passed to the unit test method.
     * @param {number|string|{ id: number|string, name: string, group: number|string|{ id: number|string, name: string } }} test Identifies the unit test that was executed.
     * @param {*} metaData Arbitrary user-defined meta data to include with the test result.
     * @returns {TestResult}
     */
    TestResult.CreateInconclusive = function(message, filePosition, data, test, metaData) {
        return new TestResult({
            message: message,
            status: ResultStatus.Inconclusive,
            test: test,
            data: data,
            file: filePosition,
            metaData: metaData
        });
    };
    
    /**
     * Creates a {@link TestResult} object containing only debug information, not indicating any test result status.
     * @param {string|string[]} message Message describing test results.
     * @param {string|{ name: string, line: number, column: number }} filePosition File and/or position related to the test result.
     * @param {number|string|{ item: number|string|{ id: number|string, name: string }, set: number|string|{ id: number|string, name: string } }} data Identifies the data that was passed to the unit test method.
     * @param {number|string|{ id: number|string, name: string, group: number|string|{ id: number|string, name: string } }} test Identifies the unit test that was executed.
     * @param {*} metaData Arbitrary user-defined meta data to include with the test result.
     * @returns {TestResult}
     */
    TestResult.CreateDebug = function(message, filePosition, data, test, metaData) {
        return new TestResult({
            message: message,
            status: ResultStatus.Debug,
            test: test,
            data: data,
            file: filePosition,
            metaData: metaData
        });
    };
    
    /**
     * Creates an informational {@link TestResult} object, not indicating any test result status.
     * @param {string|string[]} message Message describing test results.
     * @param {string|{ name: string, line: number, column: number }} filePosition File and/or position related to the test result.
     * @param {number|string|{ item: number|string|{ id: number|string, name: string }, set: number|string|{ id: number|string, name: string } }} data Identifies the data that was passed to the unit test method.
     * @param {number|string|{ id: number|string, name: string, group: number|string|{ id: number|string, name: string } }} test Identifies the unit test that was executed.
     * @param {*} metaData Arbitrary user-defined meta data to include with the test result.
     * @returns {TestResult}
     */
    TestResult.CreateInfo = function(message, filePosition, data, test, metaData) {
        return new TestResult({
            message: message,
            status: ResultStatus.Info,
            test: test,
            data: data,
            file: filePosition,
            metaData: metaData
        });
    };
    
    /**
     * Creates a {@link TestResult} object indicating that a test has passed.
     * @param {string|string[]} message Message describing test results.
     * @param {string|{ name: string, line: number, column: number }} filePosition File and/or position related to the test result.
     * @param {number|string|{ item: number|string|{ id: number|string, name: string }, set: number|string|{ id: number|string, name: string } }} data Identifies the data that was passed to the unit test method.
     * @param {number|string|{ id: number|string, name: string, group: number|string|{ id: number|string, name: string } }} test Identifies the unit test that was executed.
     * @param {*} metaData Arbitrary user-defined meta data to include with the test result.
     * @returns {TestResult}
     */
    TestResult.CreatePass = function(message, filePosition, data, test, metaData) {
        return new TestResult({
            message: message,
            status: ResultStatus.Pass,
            test: test,
            data: data,
            file: filePosition,
            metaData: metaData
        });
    };
    
    /**
     * Creates a {@link TestResult} object, indicating a test has passed with a warning.
     * @param {string|string[]} message Message describing test results.
     * @param {string|{ name: string, line: number, column: number }} filePosition File and/or position related to the test result.
     * @param {number|string|{ item: number|string|{ id: number|string, name: string }, set: number|string|{ id: number|string, name: string } }} data Identifies the data that was passed to the unit test method.
     * @param {number|string|{ id: number|string, name: string, group: number|string|{ id: number|string, name: string } }} test Identifies the unit test that was executed.
     * @param {*} metaData Arbitrary user-defined meta data to include with the test result.
     * @returns {TestResult}
     */
    TestResult.CreateWarning = function(message, filePosition, data, test, metaData) {
        return new TestResult({
            message: message,
            status: ResultStatus.Warning,
            test: test,
            data: data,
            file: filePosition,
            metaData: metaData
        });
    };
    
    /**
     * Creates a {@link TestResult} debug message object.
     * @param {string|string[]} message Message describing test results.
     * @param {string|{ name: string, line: number, column: number }} filePosition File and/or position related to the test result.
     * @param {number|string|{ item: number|string|{ id: number|string, name: string }, set: number|string|{ id: number|string, name: string } }} data Identifies the data that was passed to the unit test method.
     * @param {number|string|{ id: number|string, name: string, group: number|string|{ id: number|string, name: string } }} test Identifies the unit test that was executed.
     * @param {*} metaData Arbitrary user-defined meta data to include with the test result.
     * @returns {TestResult}
     */
    TestResult.CreateFail = function(message, filePosition, data, test, metaData) {
        return new TestResult({
            message: message,
            status: ResultStatus.Fail,
            test: test,
            data: data,
            file: filePosition,
            metaData: metaData
        });
    };
    
    /**
     * Creates a {@link TestResult} debug message object.
     * @param {string|string[]} message Message describing test results.
     * @param {string|{ name: string, line: number, column: number }} filePosition File and/or position related to the test result.
     * @param {number|string|{ item: number|string|{ id: number|string, name: string }, set: number|string|{ id: number|string, name: string } }} data Identifies the data that was passed to the unit test method.
     * @param {number|string|{ id: number|string, name: string, group: number|string|{ id: number|string, name: string } }} test Identifies the unit test that was executed.
     * @param {*} metaData Arbitrary user-defined meta data to include with the test result.`
     * @returns {TestResult}`
     */
    TestResult.CreateError = function(message, filePosition, data, test, metaData) {
        return new TestResult({
            message: message,
            status: ResultStatus.Error,
            test: test,
            data: data,
            file: filePosition,
            metaData: metaData
        });
    };
    
    /**
     * Parses stack trace into file, line, column information.
     * @param {string} stackTrace Stack trace to parse.
     */
    TestResult.parseStackTrace = function(stackTrace) {
        var typeAndMessageRe = /^([^\s:]*):\s*(.*)/;
        var methodAndLocation = /^s+at\s+([^\s\(\)]+(?:\s+[^\s\(\)]+)*)s*\(([^:\(\)]+):(\d+):(\d+)\)/g;
        return TestUtility.asString(stackTrace).split(/\r\n?|\n/g).map(function(line) {
            var m = typeAndMessageRe.exec(line);
            if (!TestUtility.isNil(m))
                return { type: m[1], message: m[2] };
            m = methodAndLocation.exec(line);
            if (!TestUtility.isNil(m))
                return { method: m[1], file: m[2], line: m[3], column: m[4], original: line };
            if (line.length > 0)
                return { info: line };
            return null;
        }).filter(function(o) { return (o !== null); });
    };
    
    /**
     * Creates a {@link TestResult} from an error.
     * @param {Error} error Error from which to generate message and file/line information
     * @param {string|string[]} [message] Additional messages to include in the test result.
     * @param {number|string|{ item: number|string|{ id: number|string, name: string }, set: number|string|{ id: number|string, name: string } }} data Identifies the data that was passed to the unit test method.
     * @param {number|string|{ id: number|string, name: string, group: number|string|{ id: number|string, name: string } }} test Identifies the unit test that was executed.
     * @param {ResultStatus} [status=ResultStatus.Error] Status and/or severity of the error.
     * @param {number} [stackDepth] Maximum number of entries to parse from the stack.
     * @param {*} metaData Arbitrary user-defined meta data to include with the test result.
     * @returns {TestResult[]}
     */
    TestResult.FromErrorObject = function(error, message, data, test, status, stackDepth, metaData) {
        status = TestUtility.asInteger(status);
        if (isNaN(status))
            status = ResultStatus.Error;
        else if (status < ResultStatus.Inconclusive)
            status = ResultStatus.Inconclusive;
        else if (status > ResultStatus.Error)
            status = ResultStatus.Error;
        var currentResultArgs = {
            message: TestUtility.normalizeStringLines(message),
            status: status,
            test: test,
            data: data,
            metaData: metaData
        };
        if (TestUtility.isNil(error)) 
            return new TestResult(currentResultArgs);
        
        var initialMessage = null;
        var stackOutCount = 0;
        var outArr = [];
        TestResult.parseStackTrace(error.stack).forEach(function(o) {
            if (!TestUtility.isNil(o.message)) {
                initialMessage = o.type + ": " + o.message;
                if (currentResultArgs.status != status) {
                    outArr.push(new TestResult(currentResultArgs));
                    currentResultArgs = {
                        message: TestUtility.normalizeStringLines(initialMessage),
                        status: status,
                        test: test,
                        data: data,
                        metaData: metaData
                    };
                } else
                    currentResultArgs.message.unshift(initialMessage);
            } else if (TestUtility.isNil(o.file)) {
                if (TestUtility.isNil(stackDepth) || stackOutCount < stackDepth) {
                    stackOutCount++;
                    if (currentResultArgs.status != status) {
                        outArr.push(new TestResult(currentResultArgs));
                        currentResultArgs = {
                            message: TestUtility.normalizeStringLines(initialMessage),
                            status: status,
                            test: test,
                            data: data,
                            metaData: metaData
                        };
                    }
                    currentResultArgs.file = new FilePosition(o.file, o.line, o.column);
                    outArr.push(new TestResult(currentResultArgs));
                    currentResultArgs = {
                        message: TestUtility.normalizeStringLines(initialMessage),
                        status: status,
                        test: test,
                        data: data,
                        metaData: metaData
                    };
                } else {
                    if (currentResultArgs.status != ResultStatus.Info) {
                        outArr.push(new TestResult(currentResultArgs));
                        currentResultArgs = {
                            message: TestUtility.normalizeStringLines(o.original),
                            status: ResultStatus.Info,
                            test: test,
                            data: data,
                            metaData: metaData
                        };
                    } else
                        currentResultArgs.message.push(o.original);
                }
            } else {
                if (currentResultArgs.status != ResultStatus.Info) {
                    outArr.push(new TestResult(currentResultArgs));
                    currentResultArgs = {
                        message: TestUtility.normalizeStringLines(o.info),
                        status: ResultStatus.Info,
                        test: test,
                        data: data,
                        metaData: metaData
                    };
                } else
                    currentResultArgs.message.push(o.info);
            }
        });
        outArr.push(new TestResult(currentResultArgs));
        return outArr;
    };
    return TestResult;
})(TestUtility, IDandName, FilePosition, TestDescriptor, TestDataDesriptor);

var path = PATH.join(__dirname, "..", "Dist", "JSUnitTesting.js");
var sandbox = { };
var testResults = [];
try {
    var context = VM.createContext(sandbox);
    var script = new VM.Script(FS.readFileSync(path).toString());
    script.runInContext(context, { filename: 'JSUnitTesting.js' });
    testResults.push(TestResult.CreatePass("File loaded"));
} catch (e) {
    testResults.push(TestResult.FromErrorObject(e, "Unable to load script from " + path, undefined, undefined, ResultStatus.Inconclusive));
    console.log(e);
    testResults.forEach(function(r) { console.log(r.toString()); });
    return;
}
JsUnitTesting = sandbox.JsUnitTesting;
try {
    var testColl = new JsUnitTesting.TestCollection([], "myTest", "1234");
    testResults.push(TestResult.CreatePass("Test collection created."));
} catch (e) {
    console.log(e);
    console.log(Object.getOwnPropertyNames(sandbox));
    testResults.push(TestResult.FromErrorObject(e));
}
testResults.forEach(function(r) { console.log(r.toString()); });