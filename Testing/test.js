var AssertionTesting2 = AssertionTesting2 || {};

(function() {
    var newLineString = "\n";
    var whitespaceRegex = /^\s*$/;
    var trimEndRegex = /^(\s*\S+(\s+\S+)*)/;
    var lineSplitRegex = /\r\n?|\n/g;
    var boolRegex = /^(?:(t(?:rue)?|y(?:es)?|[+-]?(?:0*[1-9]\d*(?:\.\d+)?|0+\.0*[1-9]\d*)|\+)|(f(?:alse)?|no?|[+-]?0+(?:\.0+)?|-))$/i;
    var ucFirstRegex = /^([^a-zA-Z\d]*[a-z])(.+)?$/g;

    function defined(value) { return typeof(value) !== "undefined"; }

    function isString(value) { return typeof(value) === "string"; }
    
    function isFunction(value) { return typeof(value) === "function"; }
    
    function isBoolean(value) { return typeof(value) === "boolean"; }
    
    function isNumber(value) { return typeof(value) === "number" && !isNaN(value); }
    
    function nil(value) { return !defined(value) || value === null; }
    
    function isNilOrEmptyString(s) { return nil(s) || (isString(s) && s.length == 0); }
    
    function isNilOrWhitespace(s) { return nil(s) || (isString(s) && whitespaceRegex.test(s)); }
    
    function asString(value, defaultValue, ignoreWhitespace) {
        if (!defined(value)) {
            if (nil(defaultValue))
                return defaultValue;
            return asString(defaultValue);
        }
        if (value === null) {
            if (nil(defaultValue))
                return value;
            return asString(defaultValue);
        }
        if (!isString(value))
            value = (Array.isArray(value)) ? value.join(newLineString) : (function() {
                try {
                    var s = value.toString();
                    if (isString(s))
                        return s;
                } catch (e) { }
                return value + "";
            })();
        if ((ignoreWhitespace) ? whitespaceRegex.test(value) : value.length == 0) {
            var d = asString(defaultValue);
            if (isString(d))
                return d;
        }
        return value;
    }
    
    function trimEnd(v) {
        var s = asString(v, "");
        var m = trimEndRegex.exec(s);
        if (nil(m))
            return "";
        return m[1];
    }
    
    function asNumber(value, defaultValue) {
        if (!defined(value)) {
            if (nil(defaultValue))
                return (defined(defaultValue)) ? defaultValue : value;
            return asNumber(defaultValue);
        }
        if (value === null) {
            if (nil(defaultValue))
                return value;
            return asNumber(defaultValue, value);
        }
        if (typeof(value) !== "number") {
            if (isFunction(value.valueOf)) {
                try {
                    var n = value.valueOf();
                    if (isNumber(n))
                        return n;
                    if (!nil(n))
                        value = n;
                } catch (e) { }
            }
            if (isBoolean(value))
                return (value) ? 1 : 0;
            value = asString(value, "").trim();
            value = (value.length == 0) ? NaN : parseFloat(value);
        }
        
        if (isNaN(value) && !nil(defaultValue))
            return asNumber(defaultValue);
        return value;
    }
    
    function asInteger(value, defaultValue) {
        value = asNumber(value, defaultValue);
        if (nil(value) || isNaN(value) || Number.isInteger(value))
            return value;
        return Math.round(value);
    }
    
    function asBoolean(value, defaultValue) {
        if (typeof(value) === "boolean")
            return value;
    
        if (!defined(value)) {
            if (nil(defaultValue))
                return defaultValue;
            return asBoolean(defaultValue);
        }
        if (value === null) {
            if (nil(defaultValue))
                return (defined(defaultValue)) ? defaultValue : value;
            return asBoolean(defaultValue, value);
        }
        if (typeof(value) === "number")
            return !isNaN(value) && value != 0;
        if (isFunction(value.valueOf)) {
            try {
                var n = value.valueOf();
                if (isNumber(n))
                    return n != 0;
                if (isBoolean(value))
                    return value;
                if (!nil(n))
                    value = n;
            } catch (e) { }
        }
        var mg = boolRegex.exec(asString(value, "").trim());
        if (nil(mg))
            return asBoolean(defaultValue);
        return nil(mg[2]);
    }
    
    function getClassName(value) {
        if (!defined(value))
            return "undefined";
        if (value === null)
            return "null";
        var prototype, constructor;
        if (isFunction(value)) {
            constructor = value;
            prototype = value.prototype;
        } else {
            prototype = Object.getPrototypeOf(value);
            constructor = prototype.constructor;
            while (!isFunction(constructor)) {
                prototype = Object.getPrototypeOf(prototype);
                if (nil(prototype))
                    return typeof(value);
                constructor = prototype.constructor;
            }
        }
        if (isString(constructor.name) && constructor.name.length > 0)
            return constructor.name;
        basePrototype = Object.getPrototypeOf(prototype);
        if (nil(basePrototype)) {
            if (isString(prototype.name) && prototype.name.length > 0)
                return prototype.name;
            if (isString(value.name) && value.name.length > 0)
                return value.name;
            return typeof(value);
        }
        var name = getClassName(basePrototype);
        if (name == "Object") {
            if (isString(prototype.name) && prototype.name.length > 0)
                return prototype.name;
            if (isString(value.name) && value.name.length > 0)
                return value.name;
        }
        return name;
    }
    
    function getInheritanceChain(value) {
        if (!defined(value))
            return ["undefined"];
        if (value === null)
            return ["null"];
        var prototype, constructor;
        if (isFunction(value)) {
            constructor = value;
            prototype = value.prototype;
        } else {
            prototype = Object.getPrototypeOf(value);
            constructor = prototype.constructor;
            while (!isFunction(constructor)) {
                prototype = Object.getPrototypeOf(prototype);
                if (nil(prototype))
                    return typeof(value);
                constructor = prototype.constructor;
            }
        }
        
        basePrototype = Object.getPrototypeOf(prototype);
        if (nil(basePrototype)) {
            if (isString(constructor.name) && constructor.name.length > 0)
                return [constructor.name];
            if (isString(prototype.name) && prototype.name.length > 0)
                return [prototype.name];
            if (isString(value.name) && value.name.length > 0)
                return [value.name];
            return [typeof(value)];
        }
        var arr = getInheritanceChain(basePrototype);
        if (isString(constructor.name) && constructor.name.length > 0)
            return arr.unshift(constructor.name);
        if (isString(prototype.name) && prototype.name.length > 0)
            return arr.unshift(prototype.name);
        if (arr.length > 0)
            return arr;
        
        if (isString(value.name) && value.name.length > 0)
            return [value.name];
        
        return [typeof(value)];
    }
    
    function derivesFrom(value, classConstructor) {
        if (!defined(value))
            return !defined(classConstructor);
        if (!defined(classConstructor))
            return false;
        if (value === null)
            return classConstructor === null;
        var classProto;
        if (isFunction(classConstructor)) {
            classProto = classConstructor.prototype;
        } else {
            classProto = Object.getPrototypeOf(classConstructor);
            classConstructor = classProto.constructor;
            while (!isFunction(classConstructor)) {
                classProto = Object.getPrototypeOf(classProto);
                if (nil(classProto))
                    break;
                classConstructor = classProto.constructor;
            }
        }

        if (value instanceof classConstructor)
            return true;
            
        var valueProto, valueConstructor;
        if (isFunction(value)) {
            valueConstructor = value;
            valueProto = value.prototype;
        } else {
            valueProto = Object.getPrototypeOf(value);
            valueConstructor = valueProto.constructor;
            while (!isFunction(valueConstructor)) {
                valueProto = Object.getPrototypeOf(valueProto);
                if (nil(valueProto))
                    break;
                valueConstructor = valueProto.constructor;
            }
        }
        if (nil(valueConstructor))
            return (nil(classConstructor) && nil(classProto) == nil(valueProto));
        if (valueConstructor === classConstructor)
            return true;
        if (nil(valueProto))
            return (nil(classProto) && valueConstructor === classConstructor);
        
        var constructorChain = [];
        do {
            if (valueProto instanceof classConstructor)
                return true;
            constructorChain.push(valueConstructor);
            valueConstructor = null;
            do {
                valueProto = Object.getPrototypeOf(valueProto);
                if (nil(valueProto))
                    break;
                valueConstructor = valueProto.constructor;
            } while (nil(valueConstructor));
        } while (!nil(valueConstructor));
        for (var i = 0; i < constructorChain.length; i++) {
            if (constructorChain[i] === classConstructor)
                return true;
        }
        return false;
    }
    
    function typeOfExt(value) {
        var t = typeof(value);
        if (t == "object") {
            if (value === null)
                return "null";
        } else if (t != "function") {
            if (t == "number" && isNaN(value))
                return "NaN";
            return t;
        }
    
        var n = getClassName(value);
        if (n == t)
            return t;
        return t + " " + n;
    }
    
    function indentText(text, indent, skipLineCount) {
        var arr;
        if (typeof(text) == "object" && text != null && Array.isArray(text)) {
            if (text.length == 0)
                return "";
            if (text.length == 1)
                text = asString(text[0], "");
            else
                text = arr.join(newLineString);
        } else
            text = asString(text, "");
        if (text.length == 0)
            return text;
        indent = asString(indent, "\t");
        skipLineCount = asInteger(skipLineCount, 0);
        text = text.split(lineSplitRegex).map(function(s) { return trimEnd(s); });
        if (text.length == 1) {
            if (skipLineCount < 1 && text[0].length > 1)
                return indent + text[0];
            return text[0];
        }
        return text.map(function(s, i) {
            if (i < skipLineCount || s.length == 0)
                return s;
            return indent + s;
        }).join(newLineString);
    }
    
    function __asPropertyValueString(obj) {
        if (!defined(obj))
            return "undefined";
        if (obj === null)
            return "null";
        var type = typeof(obj);
        if (type == "number")
            return (isNaN(obj)) ? "NaN" : JSON.stringify(obj);
        if (type == "boolean" || type == "string")
            return JSON.stringify(obj);
        var className = getClassName(obj);
        if (typeof(obj.toJSON) != "function") {
            if (type == "object") {
                if (derivesFrom(obj, Error)) {

                }
            }
        }
        if (typeof(obj.toJSON) == "function" || type == "object")
            return JSON.stringify({
                className: className,
                type: type,
                data: obj.toJSON()
            }, undefined, "\t");
        return JSON.stringify({
            className: className,
            type: type,
            data: obj.toString()
        }, undefined, "\t");
    }
    
    function asPropertyValueString(obj) {
        if (!defined(obj))
            return "undefined";
        if (obj === null)
            return "null";
        var type = typeof(obj);
        if (type == "number")
            return (isNaN(obj)) ? "NaN" : JSON.stringify(obj);
        if (type == "boolean" || type == "string")
            return JSON.stringify(obj);
        var className = getClassName(obj);
        var n;
        if (typeof(obj.toJSON) != "function") {
            if (type == "object") {
                var elements = [];
                var propertyLines = [];
                var byName = {};
                if (Array.isArray(obj)) {
                    elements = obj.map(function(e) { return __asPropertyValueString(e); });
                    for (n in obj) {
                        if ((!isNumber(n) && n !== "length") || n < 0 || n > obj.length) {
                            byName[n] = __asPropertyValueString(obj[n]);
                            propertyLines.push(JSON.stringify(n) + ": " + __asPropertyValueString(obj[n]));
                        }
                    }
                } else {
                    for (n in obj) {
                        if (n !== "length") {
                            byName[n] = __asPropertyValueString(obj[n]);
                            propertyLines.push(JSON.stringify(n) + ": " + __asPropertyValueString(obj[n]));
                        }
                    }
                }
                if (derivesFrom(obj, Error)) {
                    if (!nil(obj.columnNumber) && nil(byName.columnNumber))
                        propertyLines = propertyLines.unshift("\"columnNumber\": " + __asPropertyValueString(obj.columnNumber));
                    if (!nil(obj.lineNumber) && nil(byName.lineNumber))
                        propertyLines = propertyLines.unshift("\"lineNumber\": " + __asPropertyValueString(obj.lineNumber));
                    if (!nil(obj.fileName) && nil(byName.fileName))
                        propertyLines = propertyLines.unshift("\"fileName\": " + __asPropertyValueString(obj.fileName));
                    if (!nil(obj.number) && nil(byName.number))
                        propertyLines = propertyLines.unshift("\"number\": " + __asPropertyValueString(obj.number));
                    if (!nil(obj.name) && nil(byName.name))
                        propertyLines = propertyLines.unshift("\"name\": " + __asPropertyValueString(obj.name));
                    if (!nil(obj.description) && nil(byName.description)) {
                        if (nil(obj.message) || (isString(obj.message) && isString(obj.description) && obj.description.length > obj.message.length && obj.message.trim().length == 0)) {
                            byName.message = obj.description;
                            propertyLines = propertyLines.unshift("\"message\": " + __asPropertyValueString(obj.description));
                        }
                        else
                            propertyLines = propertyLines.unshift("\"description\": " + __asPropertyValueString(obj.description));
                    }

                    if (!nil(obj.message) && nil(byName.message))
                        propertyLines = propertyLines.unshift("\"message\": " + __asPropertyValueString(obj.message));
                }
                if (propertyLines.length == 0) {
                    if (Array.isArray(obj)) {
                        if (elements.length == 0) {
                            if (className == "Array")
                                return "[]";
                            return "{" + newLineString + "\t\"className\": " + JSON.stringify(className) + "," + newLineString + "\t\"type\": " + JSON.stringify(type) + "," + newLineString +
                                "\t\"elements\": []" + newLineString + ", \t\"properties\": {}" + newLineString + "}";
                        }
                        if (elements.length == 1) {
                            if (className == "Array")
                                return "[ " + trimEnd(elements[0]) + " ]";
                            return "{" + newLineString + "\t\"className\": " + JSON.stringify(className) + "," + newLineString + "\t\"type\": " + JSON.stringify(type) + "," + newLineString +
                                "\t\"elements\": [ " + indentText(e, "\t", 1) + " ]" + newLineString + ", \t\"properties\": {}" + newLineString + "}";
                        }
                        if (className == "Array")
                            return "[" + newLineString + elements.map(function(e) { return indentText(e); }).join(newLineString) + newLineString + "]";
                        return "{" + newLineString + "\t\"className\": " + JSON.stringify(className) + "," + newLineString + "\t\"type\": " + JSON.stringify(type) + "," + newLineString +
                            "\t\"elements\": [" + newLineString + elements.map(function(e) { return indentText(e, "\t\t"); }).join(newLineString) + newLineString + "]" + newLineString + ", \t\"properties\": {}" + newLineString + "}";
                    }
                    if (className == "Object")
                        return "{ \"type\": " + JSON.stringify(type) + ", \"properties\": {} }";
                    return "{ \"className\": " + JSON.stringify(className) + ", t\"type\": " + JSON.stringify(type) + ", \"properties\": {} }";
                }
            }
            return JSON.stringify({
                className: className,
                type: type,
                value: obj.toString()
            }, undefined, "\t");
        }

        if (typeof(obj.toJSON) == "function")
            return JSON.stringify({
                className: className,
                type: type,
                data: obj.toJSON()
            }, undefined, "\t");
        if (typeof(obj) != "object")
            return JSON.stringify({
                className: className,
                type: type,
                data: obj.toString()
            }, undefined, "\t");
        if (Array.isArray(obj)) {
            if (obj.length == 0)
                return "[]";
            return "[" + newLineString + obj.map(function(e) {
                if (!defined(e))
                    return "undefined";
                if (e === null)
                    return "null";
                if (typeof(e) == "number")
                    return (isNaN(e)) ? "NaN" : JSON.stringify(e, undefined, "\t");
                if (typeof(e.toJSON) == "function" || typeof(e) == "boolean" || typeof(e) == "string" ||
                        typeof(e) == "object")
                    return JSON.stringify(e, undefined, "\t");
                return e.toString();
            }).map(function(s) {
                s.split(/\r\n?|\n/).map(function(l) { return "\t" + l; }).join(newLineString);
            }).join(",") + newLineString + newLineString + "]";
        }
        var lines = [];
        for (n in obj) {
            var v = obj[n];
            if (!defined(v))
                lines.push(JSON.stringify(n) + ": undefined");
            else if (v === null)
                lines.push(n + ((typeof(v) == "number") ? ": NaN" : ": null"));
            else if (typeof(v) == "number")
                lines.push(JSON.stringify(n) + ": " + ((isNaN(v)) ? "NaN" : JSON.stringify(v, undefined, "\t")));
            else if (typeof(v.toJSON) == "function" || typeof(v) == "boolean" || typeof(v) == "string" ||
                    typeof(ovbj) == "object")
                lines.push(JSON.stringify(n) + ": " + JSON.stringify(v, undefined, "\t"));
            else
                lines.push(JSON.stringify(n) + ": " + v.toString());
        }
        if (lines.length == 0)
            return "{}";
        return "{" + newLineString + lines.map(function(s) {
            s.split(/\r\n?|\n/).map(function(l) { return "\t" + l; }).join(newLineString);
        }).join("," + newLineString) + newLineString + "}";
    }

    function ucFirst(value) {
        if (!nil(value)) {
            var mg = ucFirstRegex.exec(asString(value, ""));
            if (!nil(mg)) {
                if (nil(mg[2]))
                    return mg[1].toUpperCase();
                return mg[1].toUpperCase() + mg[2];
            }
        }
        return value;
    }

    var util = {
        defined: defined,
        isString: isString,
        isFunction: isFunction,
        isBoolean: isBoolean,
        isNumber: isNumber,
        nil: nil,
        isNilOrEmptyString: isNilOrEmptyString,
        isNilOrWhitespace: isNilOrWhitespace,
        asString: asString,
        asNumber: asNumber,
        asInteger: asInteger,
        asBoolean: asBoolean,
        getClassName: getClassName,
        derivesFrom: derivesFrom,
        typeOfExt: typeOfExt,
        ucFirst: ucFirst,
        asPropertyValueString: asPropertyValueString
    };

    AssertionTesting.util = util;

    if (isFunction(Object.defineProperty)) {
        for (var n in AssertionTesting)
            Object.defineProperty(util, n, { enumerable: false, configurable: false, writable: false });
        Object.defineProperty(util, "name", { value: 'util', enumerable: true, configurable: false, writable: false });
        Object.defineProperty(AssertionTesting, "util", { enumerable: true, configurable: false, writable: false });
    } else
        util.name = "name";
    
    function ResultStatus(value, message) {
        if (isFunction(Object.defineProperties)) {
            var statusValue = asNumber(value, ResultStatus.allTypeValuePairs[0].value);
            var type = ResultStatus.getType(statusValue);
            var messageText = asString(message, "");
            if (messageText.trim().length == 0)
                messageText = ResultStatus.getTitle(statusValue);
            Object.defineProperties(this, {
                value: {
                    enumerable: true, configurable: false,
                    get: function() { return statusValue; },
                    set: function(value) {
                        var prevValue = statusValue;
                        statusValue = asNumber(value, ResultStatus.allTypeValuePairs[0].value);
                        // console.log("value: %d => %s", prevValue, JSON.stringify(statusValue));
                        if (prevValue == statusValue)
                            return;
                        type = ResultStatus.getType(statusValue);
                        // console.log("type: %d => %s", statusValue, JSON.stringify(type));
                        if (messageText == ResultStatus.getTitle(prevValue))
                            messageText = ResultStatus.getTitle(statusValue);
                        // console.log("message: %d => %s", statusValue, JSON.stringify(messageText));
                    }
                },
                type: {
                    enumerable: true, configurable: false,
                    get: function() { return type; }
                },
                message: {
                    enumerable: true, configurable: false,
                    get: function() { return messageText; },
                    set: function(message) {
                        messageText = asString(message, "");
                        if (messageText.trim().length == 0)
                            messageText = ResultStatus.getTitle(statusValue);
                    }
                }
            });
        } else {
            this.value = asNumber(value, ResultStatus.allTypeValuePairs[0].value);
            this.type = ResultStatus.getType(this.value);
            this.message = asString(message, "");
            if (this.message.trim().length == 0)
                this.message = this.message.getTitle(this.value);
        }
    }
    if (isFunction(Object.defineProperties)) {
        ResultStatus.prototype.valueOf = function() { return this.value; };
        ResultStatus.prototype.toString = function() { return "(" + this.value + ") " + this.message; };
    } else {
        ResultStatus.prototype.valueOf = function() {
            if (!isNumber(this.value))
                this.value = asNumber(this.value, ResultStatus.allTypeValuePairs[0].value);
            return this.value;
        };
        ResultStatus.prototype.toString = function() {
            if (!isString(this.message))
                this.message = asString(this.message, "");
            value = this.valueOf();
            if (this.message.trim().length == 0)
                this.message = ResultStatus.getTitle(value);
            return "(" + value + ") " + this.message;
        };
    }
    ResultStatus.notEvaluated = -1;
    ResultStatus.inconclusive = 0;
    ResultStatus.pass = 1;
    ResultStatus.fail = 2;
    ResultStatus.error = 3;
    ResultStatus.allTypeValuePairs = ["notEvaluated", "inconclusive", "pass", "fail", "error"]
        .map(function(n) { return { type: n, value: ResultStatus[n] }; })
        .filter(function(a) { return isNumber(a.value) && a.type != "length"; })
        .sort(function(a, b) { return a.value - b.value; });
    ResultStatus.getType = function(value) {
        value = asNumber(value, null);
        var prev = ResultStatus.allTypeValuePairs[0];
        if (!isNumber(value) || value <= prev.value)
            return prev.type;
        for (var i = 1; i < ResultStatus.allTypeValuePairs.length; i++) {
            if (ResultStatus.allTypeValuePairs[i].value == value)
                return ResultStatus.allTypeValuePairs[i].type;
            if (ResultStatus.allTypeValuePairs[i].value > value)
                break;
            prev = ResultStatus.allTypeValuePairs[i];
        }
        return prev.type;
    };
    ResultStatus.getTitle = function(value) {
        switch (ResultStatus.getType(value)) {
            case "inconclusive":
                return "Inconclusive";
            case "pass":
                return "Passed";
            case "fail":
                return "Failed";
            case "error":
                return "Unexpected Error";
        }
        return "Not Evaluated";
    };
    ResultStatus.asResultStatus = function(value) {
        if (derivesFrom(value, ResultStatus))
            return value;
        return new ResultStatus(value);
    };
    if (isFunction(Object.defineProperty)) {
        ResultStatus.allTypeValuePairs.forEach(function(tvp) {
            Object.defineProperty(ResultStatus, tvp.type, { enumerable: true, configurable: false, writable: false });
        });
        Object.defineProperty(ResultStatus, "allTypeValuePairs", { enumerable: false, configurable: false, writable: false });
        Object.defineProperty(ResultStatus, "getType", { enumerable: false, configurable: false, writable: false });
        Object.defineProperty(ResultStatus, "getTitle", { enumerable: false, configurable: false, writable: false });
        Object.defineProperty(ResultStatus, "asResultStatus", { enumerable: false, configurable: false, writable: false });
    }
    ResultStatus.isResultStatus = function(e) { return !nil(e) && e instanceof ResultStatus; };
    AssertionTesting.ResultStatus = ResultStatus;
    
    function TestResultBase(message) {
        if (isFunction(Object.defineProperties)) {
            var messageText = asString(message, "");
            if (messageText.trim().length == 0)
                messageText = ResultStatus.getTitle(statusValue);
            Object.defineProperties(this, {
                message: {
                    enumerable: true, configurable: false,
                    get: function() { return messageText; },
                    set: function(message) { messageText = asString(message, ""); }
                }
            });
        } else {
            this.message = asString(message, "");
            if (this.message.trim().length == 0)
                this.message = this.message.getTitle(this.value);
        }
    }
    TestResultBase.prototype.toJSON = function(name) {
        var jo = { message: this.message };
        for (var pn in this) {
            if (nil(this[pn]))
                jo[pn] = null;
            else if (derivesFrom(this[pn], RegExp))
                jo[pn] = this[pn].toString();
            else if (!isFunction(this[pn])) {  
                if (isFunction(this[pn].toJSON) || !derivesFrom(this[pn], Error))
                    jo[pn] = this[pn];
                else {
                    var e = { };
                    for (var n in this[pn]) {
                        if (!nil(this[pn][n]) && !isFunction(this[pn][n])) 
                            e[n] = this[pn][n];
                    }
                    if (nil(e.name) || (isString(e.name) && e.name.length == 0))
                        e.name = getClassName(e);
                    jo[pn] = e;
                }
            }
        }
        jo.message = this.message;
        return jo;
    };
    
    function ErrorResults(error) {
        if (isFunction(Object.defineProperties)) {
            var isWarning = false, errorName = "", number = null, fileName = null, lineNumber = null, columnNumber = null, stack = null;
            if (typeof(error) !== "object" || error === null || Array.isArray(error))
                TestResultBase.call(this, error);
            else
                TestResultBase.call(this, asString(error.message, error.description));
            Object.defineProperties(this, {
                isWarning: {
                    enumerable: true, configurable: false,
                    get: function() { return isWarning; },
                    set: function(value) { isWarning = asBoolean(value, false); }
                },
                errorName: {
                    enumerable: true, configurable: false,
                    get: function() { return errorName; },
                    set: function(value) { number = asString(value, ""); }
                },
                number: {
                    enumerable: true, configurable: false,
                    get: function() { return number; },
                    set: function(value) { number = asNumber(value, null); }
                },
                fileName: {
                    enumerable: true, configurable: false,
                    get: function() { return number; },
                    set: function(value) { number = asString(value, null); }
                },
                lineNumber: {
                    enumerable: true, configurable: false,
                    get: function() { return number; },
                    set: function(value) { number = asNumber(value, null); }
                },
                columnNumber: {
                    enumerable: true, configurable: false,
                    get: function() { return number; },
                    set: function(value) { number = asNumber(value, null); }
                },
                stack: {
                    enumerable: true, configurable: false,
                    get: function() { return number; },
                    set: function(value) { number = asString(value, null); }
                },
                innerError: {
                    enumerable: true, configurable: false,
                    get: function() { return innerError; },
                    set: function(error) {
                        if (nil(error))
                            this.innerError = null;
                        else if (derivesFrom(error, ErrorResults))
                            this.innerError = error;
                        else
                            this.innerError = new ErrorResults(error);
                    }
                }
            });
            if (nil(error)) {
                this.errorName = typeof(error);
                return;
            }
            this.errorName = error.name;
            if (this.errorName.trim().length == 0)
                this.errorName = asString(error.errorName, this.errorName);
            if (isBoolean(error.isWarning))
                this.isWarning = error.isWarning;
            else {
                var w = this.errorName.trim();
                this.isWarning = w.length > 3 && w.substr(0, 4).toLowerCase() == "warn";
            }
            this.number = error.number;
            this.fileName = error.fileName;
            this.lineNumber = error.lineNumber;
            this.columnNumber = error.columnNumber;
            this.stack = error.stack;
            this.innerError = error.innerError;
            return;
        }

        if (typeof(error) !== "object" || error === null || Array.isArray(error)) {
            TestResultBase.call(this, error);
            if (nil(error)) {
                this.isWarning = false;
                this.errorName = typeof(error);
                this.number = null;
                this.fileName = null;
                this.lineNumber = null;
                this.columnNumber = null;
                this.stack = null;
                return;
            }
        } else
            TestResultBase.call(this, asString(error.message, error.description));
        this.errorName = asString(error.name, "");
        if (this.errorName.trim().length == 0)
            this.errorName = asString(error.errorName, this.errorName);
        if (isBoolean(error.isWarning))
            this.isWarning = error.isWarning;
        else {
            var w = this.errorName.trim();
            this.isWarning = w.length > 3 && w.substr(0, 4).toLowerCase() == "warn";
        }
        this.number = asNumber(error.number, null);
        this.fileName = asString(error.fileName, null);
        this.lineNumber = asNumber(error.lineNumber, null);
        this.columnNumber = asNumber(error.columnNumber, null);
        this.stack = asString(error.stack, null);
        if (nil(error.innerError))
            this.innerError = null;
        else if (derivesFrom(error.innerError, ErrorResults))
            this.innerError = error.innerError;
        else
            this.innerError = new ErrorResults(error.innerError);
    }
    ErrorResults.prototype = new TestResultBase();
    ErrorResults.prototype.constructor = ErrorResults;
    ErrorResults.prototype.toJSON = function(name) {
        var jo = TestResultBase.prototype.toJSON.call(this, name);
        jo.isWarning = this.isWarning;
        jo.errorName = this.errorName;
        jo.number = this.number;
        jo.fileName = this.fileName;
        jo.lineNumber = this.lineNumber;
        jo.columnNumber = this.columnNumber;
        jo.stack = this.stack;
        jo.innerError = this.innerError;
        return jo;
    };
    ErrorResults.isErrorResults = function(e) { return !nil(e) && e instanceof ErrorResults; };
    AssertionTesting.ErrorResults = ErrorResults;

    function AssertionError(message, data, index, testId, description, resultStatus) {
        Error.call(this, message);
        if (isFunction(Object.defineProperties)) {
            var dataObj, testIndex, testIdString, descriptionText, resultStatusObj;
            dataObj = (defined(data)) ? data : null;;
            testIndex = asNumber(index, null);
            testIdString = asString(testId, null);
            descriptionText = asString(description, null);
            if (nil(resultStatus))
                resultStatusObj = ResultStatus.fail;
            else if (derivesFrom(resultStatus, ResultStatus))
                resultStatusObj = resultStatus;
            else
                resultStatusObj = new ResultStatus(resultStatus);
            Object.defineProperties(this, {
                data: {
                    enumerable: true, configurable: false,
                    get: function() { return dataObj; },
                    set: function(value) { dataObj = defined(value) ? value : null; }
                },
                index: {
                    enumerable: true, configurable: false,
                    get: function() { return testIndex; },
                    set: function(value) { testIndex = asNumber(value, null); }
                },
                testId: {
                    enumerable: true, configurable: false,
                    get: function() { return testIdString; },
                    set: function(value) { testIdString = asString(value, null); }
                },
                description: {
                    enumerable: true, configurable: false,
                    get: function() { return descriptionText; },
                    set: function(value) { descriptionText = asString(value, null); }
                },
                resultStatus: {
                    enumerable: true, configurable: false,
                    get: function() { return resultStatusObj; },
                    set: function(status) {
                        if (nil(resultStatus))
                            resultStatusObj = new ResultStatus(ResultStatus.fail);
                        else if (derivesFrom(status, ResultStatus))
                            resultStatusObj = status;
                        else
                            resultStatusObj = new ResultStatus(status);
                    }
                }
            });
            return;
        }
        this.data = data;
        this.index = asNumber(index, null);
        this.testId = asString(testId, null);
        this.description = asString(description, null);
        if (nil(resultStatus))
            this.resultStatus = ResultStatus.fail;
        else if (derivesFrom(resultStatus, ResultStatus))
            this.resultStatus = resultStatus;
        else
            this.resultStatus = new ResultStatus(resultStatus);
    }
    AssertionError.prototype = new Error();
    AssertionError.prototype.constructor = AssertionError;

    function TestInfo(runFunc, id, data, enumerateData) {
        if (!isFunction(runFunc))
            throw new TypeError("runFunc must be a function");
        id = asString(id, "");
        enumerateData = asBoolean(enumerateData);
        if (isFunction(Object.defineProperties)) {
            this.id = asString(id, "");
            this.data = data;
            this.enumerateData = asBoolean(enumerateData);
            this.lastResultStatus = new ResultStatus();
            this.lastResultMessage = this.lastResultStatus.toString();
            this.lastResult = null;



            Object.defineProperties(this, {
                runFunc: {
                    enumerable: true, configurable: false,
                    get: function() { return runFunc; }
                },
                id: {
                    enumerable: true, configurable: false,
                    get: function() { return id; }
                },
                data: {
                    enumerable: true, configurable: false,
                    get: function() { return data; }
                },
                enumerateData: {
                    enumerable: true, configurable: false,
                    get: function() { return enumerateData; }
                },
                lastResultStatus: {
                    enumerable: true, configurable: false,
                    get: function() { return lastResultStatus; }
                },
                lastResultMessage: {
                    enumerable: true, configurable: false,
                    get: function() { return lastResultMessage; }
                }
            });
            return;
        }

        if (!isFunction(runFunc))
            throw new TypeError("runFunc must be a function");
        this.id = asString(id, "");
        this.data = data;
        this.enumerateData = asBoolean(enumerateData);
        this.lastResultStatus = new ResultStatus();
        this.lastResultMessage = this.lastResultStatus.toString();
        this.lastResult = null;
    }
/*
    function TestInfo(runFunc, id, data, enumerateData) {
        if (!isFunction(runFunc))
            throw new TypeError("runFunc must be a function");
        this.id = asString(id, "");
        this.data = data;
        this.enumerateData = asBoolean(enumerateData);
        this.lastResultStatus = new ResultStatus();
        this.lastResultMessage = this.lastResultStatus.toString();
        this.lastResult = null;
    }
    TestInfo.run = function(tests, thisObj) {
        if (nil(tests))
            return tests;
        if (!Array.isArray(tests))
            tests = [tests];
        
        if (nil(thisObj))
            thisObj = {
                util: util,
                assert: {
                    fail: function(description) {
                        throw new AssertionError(description, dataInfo.current, dataInfo.index, testInfo.id);
                    },
                    inconclusive: function(description) {
                        throw new AssertionError(description, dataInfo.current, dataInfo.index, testInfo.id, null, ResultStatus.inconclusive);
                    },
                    areEqual: function(expected, actual, description) {
                        if (defined(expected)) {
                            if (defined(actual) && expected === actual)
                                return;
                        } else if (!defined(actual))
                            return;
                        throw new AssertionError("Failed areEqual assertion - Expected: " + util.inspectify(expected) +
                            "; Actual: " + util.inspectify(actual), dataInfo.current, dataInfo.index, testInfo.id, description);
                    },
                    notEqual: function(notExpected, actual, description) {
                        if (defined(expected)) {
                            if (!defined(actual) || expected !== actual)
                                return;
                        } else if (defined(actual))
                            return;
                        throw new AssertionError("Failed notEqual assertion - Not expected: " + util.inspectify(actual), dataInfo.current, dataInfo.index, testInfo.id, description);
                    },
                    areLike: function(expected, actual, description) {
                        if (nil(expected)) {
                            if (nil(actual))
                                return;
                        } else if (!nil(actual) && expected == actual)
                            return;
                        throw new AssertionError("Failed areLike assertion - Expected: " + util.inspectify(expected) +
                            "; Actual: " + util.inspectify(actual), dataInfo.current, dataInfo.index, testInfo.id, description);
                    },
                    notLike: function(notExpected, actual, description) {
                        if (nil(expected)) {
                            if (!nil(actual))
                                return;
                        } else if (nil(actual) || expected !== actual)
                            return;
                        throw new AssertionError("Failed notLike assertion - Not expected: " + util.inspectify(expected) +
                            "; Actual: " + util.inspectify(actual), dataInfo.current, dataInfo.index, testInfo.id, description);
                    },
                    isDefined: function(actual, description) {
                        if (!defined(actual))
                            throw new AssertionError("Failed isDefined assertion - Defined vzlue expected", dataInfo.current, dataInfo.index, testInfo.id, description);
                    },
                    notDefined: function(actual, description) {
                        if (!defined(actual))
                            throw new AssertionError("Failed notDefined assertion - Undefined value expected; Actual: " + util.inspectify(actual), dataInfo.current, dataInfo.index, testInfo.id, description);
                    },
                    isNil: function(actual, description) {
                        if (!nil(actual))
                            throw new AssertionError("Failed isNil assertion - Null or Undefined value expected; Actual: " + util.inspectify(actual), dataInfo.current, dataInfo.index, testInfo.id, description);
                    },
                    notNil: function(actual, description) {
                        if (nil(actual))
                            throw new AssertionError("Failed notNil assertion - Null or Undefined value not expected; Actual: " + util.inspectify(actual), dataInfo.current, dataInfo.index, testInfo.id, description);
                    },
                    isNull: function(actual, description, objectOnly) {
                        if (!defined(actual) || actual !== null || (objectOnly && typeof(actual) == "number"))
                            throw new AssertionError("Failed isNull assertion - Null value expected; Actual: " + util.inspectify(actual), dataInfo.current, dataInfo.index, testInfo.id, description);
                    },
                    notNull: function(actual, description, objectOnly) {
                        if (!defined(actual) || (actual === null && (!objectOnly || typeof(actual) != "number")))
                            throw new AssertionError("Failed notNull assertion - Null value not expected; Actual: " + util.inspectify(actual), dataInfo.current, dataInfo.index, testInfo.id, description);
                    },
                    isTypeOf: function(expected, actual, description) {
                        
                    },
                    notTypeOf: function(notExpected, actual, description) {
                        
                    },
                    isInstanceOf: function(expected, actual, description) {
                        
                    },
                    notInstanceOf: function(notExpected, actual, description) {
                        
                    },
                    derivesFrom: function(expected, actual, description) {
                        
                    },
                    doesNotDeriveFrom: function(notExpected, actual, description) {
                        
                    },
                    isLessThan: function(maxExcl, actual, description) {
                        
                    },
                    notLessThan: function(minIncl, actual, description) {
                        
                    },
                    isGreaterThan: function(minExcl, actual, description) {
                        
                    },
                    notGreaterThan: function(maxIncl, actual, description) {
                        
                    },
                    inRange: function(min, max, description, minExcl, maxExcl) {
                        
                    },
                    outsideRange: function(lower, upper, description,xlowerIncl, upperIncl) {
                        
                    },
                    isTrue: function(actual, description, like) {
                        
                    },
                    isFalse: function(actual, description, like) {
                        
                    }
                }
            };
        return tests.map(function(ti, testIndex) {
            if (!derivesFrom(testInfo, TestInfo)) {
                if (typeof(testInfo) == "object") {

                }
            }
                return new TestResults(ucFirst(typeOfExt(testInfo)) + " element at index " + testIndex +
                    " does not derive from AssertionTesting.TestInfo", ResultStatus.notRun, null, null, null, testInfo);
            var testInfo = new TestInfo(function() { }, "id", []);
            try {
                if (testInfo.enumerateData) {
    
                }
            } catch (ue) {

            }
            var iterationData = (testInfo.enumerateData && !nil(testInfo.data) && Array.isArray(testInfo.data)) ? testInfo.data :
                [testInfo.data];
            for (var dataIndex = 0; dataIndex < iterationData.length; dataIndex++) {

            }
        });
        this.evaluateNext = function() {
            nextIndex = dataInfo.index;
            try {
                var result;
                if (dataInfo.index === null) {
                    nextIndex = 1;
                    if (dataInfo.data.length == 0)
                        result = runFunc.call(thisObj);
                    else if (dataInfo.data.length == 1)
                        result = runFunc.call(thisObj, dataInfo.data[0]);
                    else {
                        dataInfo.index = 0;
                        result = runFunc.call(thisObj, dataInfo.data[0]);
                    }
                } else {
                    result = runFunc.call(thisObj, dataInfo.data[nextIndex]);
                    nextIndex++;
                }
            } finally {
                dataInfo.index = nextIndex;
                nextIndex = dataInfo.index + 1;
            }
            return (dataInfo.index < dataInfo.data.length);
        };
    }
    function TestResults(message, resultStatus, testInfo, dataIndex, error, output) {
        resultStatus = ResultStatus.asResultStatus(resultStatus);
        var m = asString(message, "").trim();
        if (m.length == 0) {
            if (!nil(error)) {
                m = asString(error.message, error.description).trim();
                if (m.length == 0)
                    m = asString(error, "").toString();
            }
            if (m.length == 0)
                m = asString(resultStatus.name, resultStatus.toString())
        }
        TestResultBase.call(this, m);
        this.resultStatus = resultStatus;
        this.description = null;
        this.testId = null;
        this.dataIndex = null;
        this.data = null;
        if (!nil(testInfo)) {
            this.testId = asString(testInfo.testId, null);
            this.dataIndex = asInteger(testInfo.dataIndex, null);
            if (defined(testInfo.data)) {
                var data = (typeof(data) == "object" && data !== null && Array.isArray(data)) ? testInfo.data : [testInfo.data];
                if (data.length > 0) {
                    if (this.dataIndex === null || this.dataIndex < 0)
                        this.data = (data.length == 1) ? data[0] : data;
                    else if (this.dataIndex < data.length) 
                        this.data = data[this.dataIndex];
                }
            }
        }
        if (!nil(error) && !nil(error.description)) {
            var d = asString(error.description, "").trim();
            if (d.length > 0 && d != this.message)
                this.description = d;
        }
        this.error = (nil(this.error)) ? null : ((ErrorResults.isErrorResults(this.error)) ? this.error :
            new ErrorResults(this.error));
        this.output = (isFunction(output)) ? output.toString() : ((defined(output)) ? ((typeof(output) == "number") ?
            ((isNaN(output)) ? "NaN" : output.toString()) : ((output === null) ? "null" : JSON.stringify(output, undefined, "\t"))) : "undefined ");
    }
    TestResults.prototype = TestResultBase.prototype;
    TestResults.prototype.constructor = TestResults;
    TestResults.prototype.normalize = function() {
        TestResultBase.prototype.normalize.call(this);
        this.resultStatus = ResultStatus.asResultStatus(this.resultStatus);
        this.description = asString(jo.description, null);
        this.testId = asString(jo.description, null);
        this.dataIndex = asInteger(jo.description, null);
        if (!defined(this.data))
            this.data = null;
        this.error = (nil(this.error)) ? null : ((ErrorResults.isErrorResults(this.error)) ? this.error :
            new ErrorResults(this.error));
    };
    TestResults.prototype.toJSON = function(name) {
        var jo = TestResultBase.prototype.toJSON.call(this, name);
        jo.resultStatus = this.resultStatus;
        jo.description = this.description;
        jo.testId = this.testId;
        jo.dataIndex = this.dataIndex;
        jo.data = this.data;
        return jo;
    };
    ErrorResults.isTestResults = function(e) { return !nil(e) && e instanceof TestResults; };
    AssertionTesting.ErrorResults = ErrorResults;
*/


})();

function stringifyArgs(arr) {
    return arr.map(function(a) {
        if (typeof(a) == "undefined")
            return "undefined";
        if (a === null)
            return "null";
        if (typeof(a) == "number") {
            if (isNaN(a))
                return "NaN";
        } else if (typeof(a) == "function")
            return a.toString();
        else if (Array.isArray(a)) {
            if (a.length == 0)
                return "[]";
            return "[ " + a.map(function(a) {
                if (typeof(a) == "undefined")
                    return "undefined";
                if (a === null)
                    return "null";
                if (typeof(a) == "number") {
                    if (isNaN(a))
                        return "NaN";
                } else if (typeof(a) == "function")
                    return a.toString();
                return JSON.stringify(a);
            }).join(", ") + " ]";
        }
        return JSON.stringify(a);
    }).join(", ");
}

function ValidateUtilNamspace() {
    if (typeof(AssertionTesting) === "undefined")
        return ["AssertionTesting namespace not found"];
    if (typeof(AssertionTesting) != "object")
        return ["AssertionTesting namespace is not an object"];
    if (typeof(AssertionTesting.util) === "undefined")
        return ["AssertionTesting.util namespace not found"];
    if (typeof(AssertionTesting.util) != "object")
        return ["AssertionTesting.util namespace is not an object"];

    function ExampleBaseClass() {
        this.name = "ignoreThis";
    }
    function ExampleDerivedClass() {
        ExampleBaseClass.call(this);
        this.name = "ignoreAsWell";
    }
    ExampleDerivedClass.prototype = new ExampleBaseClass();
    ExampleDerivedClass.prototype.constructor = ExampleDerivedClass;
    function ExampleDeepNestedClass() {
        ExampleDerivedClass.call(this);
        this.name = "DeepNested";
    }
    ExampleDeepNestedClass.prototype = new ExampleDerivedClass();
    ExampleDeepNestedClass.prototype.constructor = ExampleDeepNestedClass;
    function ExampleErrorDerived(message) {
        Error.call(this, message);
        this.name = "exampleErrorDerived";
    }
    ExampleErrorDerived.prototype = new Error();
    ExampleErrorDerived.prototype.constructor = ExampleErrorDerived;

    var util = AssertionTesting.util;
    var preCheckErrors = [];
    [
        {
            name: "defined", method: util.defined,
            data: [
                { expected: false, args: [ [], [undefined] ]},
                { expected: true, args: [ [null], [NaN], [false], [[]], [{}], [""], [0] ] }
            ]
        }, {
            name: "nil", method: util.nil,
            data: [
                { expected: true, args: [ [], [undefined], [null] ]},
                { expected: false, args: [ [NaN], [false], [[]], [{}], [""], [0] ] }
            ]
        }, {
            name: "isString", method: util.isString,
            data: [
                { expected: true, args: [ [""] ]},
                { expected: false, args: [ [], [undefined], [null], [NaN], [false], [[""]], [{}], [0] ] }
            ]
        }, {
            name: "isFunction", method: util.isFunction,
            data: [
                { expected: true, args: [ [function() { }] ]},
                { expected: false, args: [ [], [undefined], [null], [NaN], [false], [[]], [{}], [[function() { }]], [0] ] }
            ]
        }, {
            name: "isBoolean", method: util.isBoolean,
            data: [
                { expected: true, args: [ [true], [false] ]},
                { expected: false, args: [ [], [undefined], [null], [NaN], [function() { return true; }], [[true]], [{}], [0], [1], ["true"], ["false"] ] }
            ]
        }, {
            name: "isNumber", method: util.isNumber,
            data: [
                { expected: true, args: [ [Number.NEGATIVE_INFINITY], [Number.POSITIVE_INFINITY], [-1], [0], [1] ]},
                { expected: false, args: [ [], [undefined], [null], [NaN], [function() { return true; }], [[5]], [{}], [true], [false], ["1"], ["0"] ] }
            ]
        }, {
            name: "isNilOrEmptyString", method: util.isNilOrEmptyString,
            data: [
                { expected: true, args: [ [], [undefined], [null], [""] ]},
                { expected: false, args: [ [" "], [" test"], [NaN], [false], [[""]], [{}], [["."]], [{ name: ""}], [0] ] }
            ]
        }, {
            name: "isNilOrWhitespace", method: util.isNilOrWhitespace,
            data: [
                { expected: true, args: [ [], [undefined], [null], [""], [" "], [" \n \t "] ]},
                { expected: false, args: [ [" test"], [NaN], [false], [" \n \t ."], [["."]], [[""]], [{}], [{ name: "" }], [0] ] }
            ]
        }, {
            name: "asString", method: util.asString,
            data: [
                { expected: undefined, args: [ [], [undefined] ] },
                { expected: null, args: [ [null] ] },
                { expected: "", args: [ [undefined, ""], [null, ""], [""], ["", ""] , [[], ""] ] },
                { expected: "12", args: [ [12], [12.0], ["12"], [undefined, 12], [undefined, 12.0], [undefined, "12"], [null, 12], [null, 12.0], [null, "12"], ["", 12], ["", 12.0], ["", "12"] ] },
                { expected: "true", args: [ [true], ["true"], [undefined, true], [ undefined, "true"], [null, true], [ null, "true"], ["", true], [ "", "true"] ] },
                { expected: "function () { return true; }", args: [ [function() { return true; } ] ] },
                { expected: "NaN", args: [ [NaN], [undefined, NaN], [null, NaN] ] },
                { expected: "1\n7", args: [ [[1,"7"]] ] }
            ]
        }, {
            name: "asNumber", method: util.asNumber,
            data: [
                { expected: undefined, args: [ [], [undefined] ] },
                { expected: null, args: [ [null] ] },
                { expected: NaN, args: [ [""], ["one"], [undefined, "two"], ["", "two"], ["one", "two"] ] },
                { expected: 0, args: [ [0], [0, 1], [0, ""], [undefined, 0], [null, 0], ["", 0], ["one", 0], [[], 0], [false], [false, ""], [undefined, false], [null, false], ["", false], ["one", false] , [[], false] ] },
                { expected: 12, args: [ [12], [12.0], ["12"], [undefined, 12], [undefined, 12.0], [undefined, "12"], [null, 12], [null, 12.0], [null, "12"], ["", 12], ["", 12.0], ["", "12"] ] },
                { expected: -12.45, args: [ [-12.45], ["-0012.45"], [undefined, -12.45], [undefined, "-012.450"], [null, -12.45], [null, "-12.45"], ["", -12.45], ["", "-12.45"] ] },
                { expected: 1, args: [ [true], [1], [undefined, true], [ undefined, 1], [null, true], [ null, 1], ["", true], [ "", 1] ] }
            ]
        }, {
            name: "asInteger", method: util.asInteger,
            data: [
                { expected: undefined, args: [ [], [undefined] ] },
                { expected: null, args: [ [null] ] },
                { expected: NaN, args: [ [""], ["one"], [undefined, "two"], ["", "two"], ["one", "two"] ] },
                { expected: 0, args: [ [0], [0, 1], [0, ""], [undefined, 0], [null, 0], ["", 0], ["one", 0], [[], 0], [false], [false, ""], [undefined, false], [null, false], ["", false], ["one", false] , [[], false] ] },
                { expected: 12, args: [ [12], [12.0], ["12"], [undefined, 12], [undefined, 12.0], [undefined, "12"], [null, 12], [null, 12.0], [null, "12"], ["", 12], ["", 12.0], ["", "12"] ] },
                { expected: -12, args: [ [-12.45], ["-0012.45"], [undefined, -12.45], [undefined, "-012.450"], [null, -12.45], [null, "-12.45"], ["", -12.45], ["", "-12.45"] ] },
                { expected: -13, args: [ [-12.55], ["-0012.55"], [undefined, -12.55], [undefined, "-012.550"], [null, -12.55], [null, "-12.55"], ["", -12.55], ["", "-12.55"] ] },
                { expected: 1, args: [ [true], [1], [undefined, true], [ undefined, 1], [null, true], [ null, 1], ["", true], [ "", 1] ] }
            ]
        }, {
            name: "asBoolean", method: util.asBoolean,
            data: [
                { expected: undefined, args: [ [], [undefined], [""], ["one"], [undefined, "two"], ["", "two"], ["one", "two"] ] },
                { expected: null, args: [ [null], ["", null], [null, null], [null, ""], [null, "one"] ] },
                { expected: false, args: [ [0], [0, 1], [0, ""], [undefined, 0], [null, 0], ["", 0], ["one", 0], [[], 0], [false], [false, ""], [undefined, false], [null, false], ["", false], ["one", false] , [[], false] ] },
                { expected: true, args: [ [12], [12.0], ["12"], [undefined, 12], [undefined, 12.0], [undefined, "12"], [null, 12], [null, 12.0], [null, "12"], ["", 12], ["", 12.0], ["", "12"] ] },
                { expected: true, args: [ [-12.45], ["-0012.45"], [undefined, -12.45], [undefined, "-012.450"], [null, -12.45], [null, "-12.45"], ["", -12.45], ["", "-12.45"] ] },
                { expected: true, args: [ [true], [1], [undefined, true], [ undefined, 1], [null, true], [ null, 1], ["", true], [ "", 1] ] }
            ]
        }, {
            name: "getClassName", method: util.getClassName,
            data: [
                { expected: "undefined", args: [ [], [undefined] ] },
                { expected: "null", args: [ [null] ] },
                { expected: "Function", args: [ [ExampleBaseClass], [ExampleDeepNestedClass], [ExampleErrorDerived], [RangeError], [Error] ] },
                { expected: "ExampleBaseClass", args: [ [new ExampleBaseClass()] ] },
                { expected: "ExampleDeepNestedClass", args: [ [new ExampleDeepNestedClass()] ] },
                { expected: "ExampleErrorDerived", args: [ [new ExampleErrorDerived("test")] ] },
                { expected: "RangeError", args: [ [new RangeError("test")] ] },
                { expected: "Error", args: [ [new Error("test")] ] },
                { expected: "Function", args: [ [function() { this.name = "test"; }] ] },
                { expected: "String", args: [ ["test"] ] },
                { expected: "Boolean", args: [ [true] ] },
                { expected: "Array", args: [ [[true]] ] }
            ]
        }, {
            name: "derivesFrom", method: util.derivesFrom,
            data: [
                { expected: true, args: [ [], [undefined, undefined], [null, null], ["", String], [true, Boolean], [7, Number],
                    [new ExampleBaseClass(), ExampleBaseClass], [new ExampleDerivedClass(), ExampleBaseClass], [new ExampleDeepNestedClass(), ExampleBaseClass],
                    [new ExampleDerivedClass(), ExampleDerivedClass], [new ExampleDeepNestedClass(), ExampleDerivedClass],
                    [new ExampleDeepNestedClass(), ExampleDeepNestedClass],
                    [new ExampleErrorDerived(), Error], [new RangeError(), Error], [new Error(), Error],
                    [new ExampleBaseClass(), Object], [new ExampleDerivedClass(), Object], [new ExampleDeepNestedClass(), Object], [new RangeError(), Object],
                    [new Error(), Object], ["", Object], [false, Object], [7, Object] ] },
                { expected: false, args: [
                    [undefined, null], [undefined, String], [undefined, Object], [undefined, ExampleBaseClass], [undefined, ExampleDeepNestedClass], [undefined, ExampleErrorDerived],
                    [null, undefined], [null, String], [null, Object], [null, ExampleBaseClass], [null, ExampleDeepNestedClass], [null, ExampleErrorDerived],
                    [true, undefined], [true, null], [true, String], [true, ExampleBaseClass], [true, ExampleDeepNestedClass], [true, ExampleErrorDerived],
                    [7, undefined], [7, null], [7, String], [7, ExampleBaseClass], [7, ExampleDeepNestedClass], [7, ExampleErrorDerived],
                    ["", undefined], ["", null], ["", Number], ["", ExampleBaseClass], ["", ExampleDeepNestedClass], ["", ExampleErrorDerived],
                    [new ExampleBaseClass(), undefined], [new ExampleBaseClass(), null], [new ExampleBaseClass(), String], [new ExampleBaseClass(), ExampleDeepNestedClass], [new ExampleBaseClass(), ExampleErrorDerived],
                    [new ExampleErrorDerived(), undefined], [new ExampleErrorDerived(), null], [new ExampleErrorDerived(), String], [new ExampleErrorDerived(), ExampleDeepNestedClass]
                ] },
                { expected: "Function", args: [ [ExampleBaseClass], [ExampleDeepNestedClass], [ExampleErrorDerived], [RangeError], [Error] ] },
                { expected: "ExampleBaseClass", args: [ [new ExampleBaseClass()] ] },
                { expected: "ExampleDeepNestedClass", args: [ [new ExampleDeepNestedClass()] ] },
                { expected: "ExampleErrorDerived", args: [ [new ExampleErrorDerived("test")] ] },
                { expected: "RangeError", args: [ [new RangeError("test")] ] },
                { expected: "Error", args: [ [new Error("test")] ] },
                { expected: "Function", args: [ [function() { this.name = "test"; }] ] },
                { expected: "String", args: [ ["test"] ] },
                { expected: "Boolean", args: [ [true] ] },
                { expected: "Array", args: [ [[true]] ] }
            ]
        }
        /*
            derivesFrom: ,
            typeOfExt: typeOfExt,
            ucFirst: ucFirst,
            asPropertyValueString: asPropertyValueString
    */
    ].forEach(function(t) {
        if (typeof(t.method) == "undefined")
            preCheckErrors.push("util." + t.name + " not found.");
        else if (typeof(t.method) != "function")
            preCheckErrors.push("util." + t.name + " is not a function.");
        else {
            t.data.forEach(function(d) {
                d.args.forEach(function(a) {
                    var actual = t.method.apply(this, a);
                    if (typeof(d.expected) == "undefined") {
                        if (typeof(actual) == "undefined")
                            return;
                    } else if (typeof(actual) != "undefined") {
                        if (d.expected === null) {
                            if (actual === null)
                                return;
                        } else if (typeof(d.expected) == "number") {
                            if (typeof(actual) == "number") {
                                if (isNaN(d.expected)) {
                                    if (isNaN(actual))
                                        return;
                                } else if (!isNaN(actual) && d.expected === actual)
                                    return;
                            }
                        } else if (actual !== null && d.expected === actual)
                            return;
                    }
                    preCheckErrors.push("util." + t.name + "(" + stringifyArgs(a) + ") failed - Expected: " + stringifyArgs([d.expected]) + "; Actual: " +
                        stringifyArgs([actual]));
                });
            });
        }
    });

    return preCheckErrors;
}

function ValidateResultStatus() {
    if (AssertionTesting.util.nil(AssertionTesting.ResultStatus))
        return ["AssertionTesting.ResultStatus class not found"];
    if (!AssertionTesting.util.isFunction(AssertionTesting.ResultStatus))
        return ["AssertionTesting.ResultStatus class is not a function"];
    ResultStatus = AssertionTesting.ResultStatus;
    var preCheckErrors = [];

    var types = [
        [ "notEvaluated", "Not Evaluated" ],
        [ "inconclusive", "Inconclusive" ],
        [ "pass", "Passed" ],
        [ "fail", "Failed" ],
        [ "error", "Unexpected Error"]
    ].map(function(a, index) { return { index: index, value: index - 1, type: a[0], title: a[1] }; });
    var initialTypeArr = [];
    types.map(function(t) {
        var actual = ResultStatus.allTypeValuePairs[t.index].value;
        if (t.value !== actual)
            preCheckErrors.push("Expected ResultStatus.allTypeValuePairs[" + t.index + "].value: " + t.value + "; Actual: " + ((defined(actual)) ? JSON.stringify(actual) : "undefined"));

        actual = ResultStatus.allTypeValuePairs[t.index].type;
        if (t.type !== actual) {
            preCheckErrors.push("Expected ResultStatus.allTypeValuePairs[" + t.index + "].type: " + JSON.stringify(t.type) + "; Actual: " + ((defined(actual)) ? JSON.stringify(actual) : "undefined"));
            return;
        }
        
        actual = ResultStatus[t.type];
        if (t.value !== actual) {
            preCheckErrors.push("Expected ResultStatus." + t.type + ": " + t.value + "; Actual: " + ((defined(actual)) ? JSON.stringify(actual) : "undefined"));
            return;
        }

        actual = ResultStatus.getType(t.value);
        if (t.type !== actual) {
            preCheckErrors.push("Expected ResultStatus.getType(" + t.value  + "): " + JSON.stringify(t.type) + "; Actual: " + ((defined(actual)) ? JSON.stringify(actual) : "undefined"));
            return;
        }

        actual = ResultStatus.getTitle(t.value);
        if (t.title !== actual) {
            preCheckErrors.push("Expected ResultStatus.getTitle(" + t.value  + "): " + JSON.stringify(t.title) + "; Actual: " + ((defined(actual)) ? JSON.stringify(actual) : "undefined"));
            return;
        }

        actual = new ResultStatus(t.value);
        initialTypeArr.push(actual);
        if (t.value !== actual.value)
            preCheckErrors.push("Expected new ResultStatus(" + t.value  + ").value: " + t.value + "; Actual: " + ((defined(actual.value)) ? JSON.stringify(actual.value) :
                "undefined"));
        if (t.type !== actual.type)
            preCheckErrors.push("Expected new ResultStatus(" + t.value  + ").type: " + JSON.stringify(t.type) + "; Actual: " + ((defined(actual)) ? JSON.stringify(actual.type) :
                "undefined"));
        if (t.title !== actual.message)
            preCheckErrors.push("Expected new ResultStatus(" + t.value  + ").message: " + JSON.stringify(t.title) + "; Actual: " + ((defined(actual.message)) ?
                JSON.stringify(actual.message) : "undefined"));
        
        [null, "", " "].forEach(function(m) {
            actual = new ResultStatus(t.value, m);
            initialTypeArr.push(actual);
            if (t.value !== actual.value)
                preCheckErrors.push("Expected new ResultStatus(" + t.value  + ", " + JSON.stringify(m) + ").value: " + t.value + "; Actual: " + ((defined(actual.value)) ?
                    JSON.stringify(actual.value) : "undefined"));
            if (t.type !== actual.type)
                preCheckErrors.push("Expected new ResultStatus(" + t.value  + ", " + JSON.stringify(m) + ").type: " + JSON.stringify(t.type) + "; Actual: " +
                    ((defined(actual.type)) ? JSON.stringify(actual.type) : "undefined"));
            if (t.title !== actual.message)
                preCheckErrors.push("Expected new ResultStatus(" + t.value  + ", " + JSON.stringify(m) + ").message: " + JSON.stringify(t.title) + "; Actual: " +
                    ((defined(actual.message)) ? JSON.stringify(actual.message) : "undefined"));
        });
        [".", "My Message", "  My Message "].forEach(function(m) {
            actual = new ResultStatus(t.value, m);
            initialTypeArr.push(actual);
            if (t.value !== actual.value)
                preCheckErrors.push("Expected new ResultStatus(" + t.value  + ", " + JSON.stringify(m) + ").value: " + t.value + "; Actual: " + ((defined(actual.value)) ?
                    JSON.stringify(actual.value) : "undefined"));
            if (t.type !== actual.type)
                preCheckErrors.push("Expected new ResultStatus(" + t.value  + ", " + JSON.stringify(m) + ").type: " + JSON.stringify(t.type) + "; Actual: " +
                    ((defined(actual.type)) ? JSON.stringify(actual.type) : "undefined"));
            if (m !== actual.message)
                preCheckErrors.push("Expected new ResultStatus(" + t.value  + ", " + JSON.stringify(m) + ").message: " + JSON.stringify(m) + "; Actual: " +
                    ((defined(actual.message)) ? JSON.stringify(actual.message) : "undefined"));
        });
    });
    var emptyConstructorStatus = new ResultStatus();
    initialTypeArr.push(emptyConstructorStatus);
    if (types[0].value !== emptyConstructorStatus.value)
        preCheckErrors.push("Expected new ResultStatus(" + types[0].value  + ").value: " + types[0].value + "; Actual: " + ((defined(emptyConstructorStatus.value)) ?
            JSON.stringify(emptyConstructorStatus.value) : "undefined"));
    if (types[0].type !== emptyConstructorStatus.type)
        preCheckErrors.push("Expected new ResultStatus(" + types[0].value  + ").type: " + JSON.stringify(types[0].type) + "; Actual: " + ((defined(emptyConstructorStatus.type)) ?
            JSON.stringify(emptyConstructorStatus.type) : "undefined"));
    if (types[0].title !== emptyConstructorStatus.message)
        preCheckErrors.push("Expected new ResultStatus(" + types[0].value  + ").message: " + JSON.stringify(types[0].title) + "; Actual: " + ((defined(emptyConstructorStatus.message)) ?
            JSON.stringify(emptyConstructorStatus.message) : "undefined"));

    if (preCheckErrors.length > 0)
        return preCheckErrors;
    
    initialTypeArr.forEach(function(initialType) {
        var expectedMessage = initialType.message;
        var currentType = types.filter(function(t) { return t.value == initialType.value; })[0];
        var autoMsg = currentType.title == expectedMessage;
        types.filter(function(t) { return t.value != initialType.value; }).forEach(function(t) {
            if (autoMsg)
                expectedMessage = t.title;
            
            initialType.value = t.value;

            if (t.value !== initialType.value)
                preCheckErrors.push("Expected resultStatus.value = " + t.value  + " => resultStatus.value: " + t.value + "; Actual: " + ((defined(initialType.value)) ?
                    JSON.stringify(initialType.value) : "undefined"));
            if (t.type !== initialType.type)
                preCheckErrors.push("Expected resultStatus.value = " + t.value  + " => resultStatus.type: " + JSON.stringify(t.type) + "; Actual: " +
                    ((defined(initialType.type)) ? JSON.stringify(initialType.type) : "undefined"));
            if (expectedMessage !== initialType.message)
                preCheckErrors.push("Expected resultStatus.value = " + t.value  + " => resultStatus.message: " + JSON.stringify(expectedMessage) + "; Actual: " +
                    ((defined(initialType.message)) ? JSON.stringify(initialType.message) : "undefined"));
        });
        
        if (autoMsg)
            expectedMessage = currentType.title;
        
        initialType.value = currentType.value;

        if (currentType.value !== initialType.value)
            preCheckErrors.push("Expected restore resultStatus.value = " + currentType.value  + " => resultStatus.value: " + currentType.value + "; Actual: " + ((defined(initialType.value)) ?
                JSON.stringify(initialType.value) : "undefined"));
        if (currentType.type !== initialType.type)
            preCheckErrors.push("Expected restore resultStatus.value = " + currentType.value  + " => resultStatus.type: " + JSON.stringify(currentType.type) + "; Actual: " +
                ((defined(initialType.type)) ? JSON.stringify(initialType.type) : "undefined"));
        if (expectedMessage !== initialType.message)
            preCheckErrors.push("Expected restore resultStatus.value = " + currentType.value  + " => resultStatus.message: " + JSON.stringify(expectedMessage) + "; Actual: " +
                ((defined(initialType.message)) ? JSON.stringify(initialType.message) : "undefined"));
        
        if (autoMsg)
            return;
        var customMsg = initialType.message;
        [null, "", " "].forEach(function(m) {
            initialType.message = m;
            if (currentType.value !== initialType.value)
                preCheckErrors.push("Expected resultStatus.message = " + JSON.stringify(m)  + " => resultStatus.value: " + currentType.value + "; Actual: " +
                    ((defined(initialType.value)) ? JSON.stringify(initialType.value) : "undefined"));
            if (currentType.type !== initialType.type)
                preCheckErrors.push("Expected resultStatus.message = " + JSON.stringify(m)  + " => resultStatus.type: " + JSON.stringify(currentType.type) + "; Actual: " +
                    ((defined(initialType.type)) ? JSON.stringify(initialType.type) : "undefined"));
            if (currentType.title !== initialType.message)
                preCheckErrors.push("Expected resultStatus.message = " + JSON.stringify(m)  + " => resultStatus.message: " + JSON.stringify(currentType.title) +
                    "; Actual: " + ((defined(initialType.message)) ? JSON.stringify(initialType.message) : "undefined"));
                    
            initialType.message = customMsg;
            if (currentType.value !== initialType.value)
                preCheckErrors.push("Expected restore resultStatus.message = " + JSON.stringify(customMsg)  + " => resultStatus.value: " + currentType.value +
                    "; Actual: " + ((defined(initialType.value)) ? JSON.stringify(initialType.value) : "undefined"));
            if (currentType.type !== initialType.type)
                preCheckErrors.push("Expected restore resultStatus.message = " + JSON.stringify(customMsg)  + " => resultStatus.type: " + JSON.stringify(currentType.type) +
                    "; Actual: " + ((defined(initialType.type)) ? JSON.stringify(initialType.type) : "undefined"));
            if (customMsg !== initialType.message)
                preCheckErrors.push("Expected restore resultStatus.message = " + JSON.stringify(customMsg)  + " => resultStatus.message: " + JSON.stringify(customMsg) +
                    "; Actual: " + ((defined(initialType.message)) ? JSON.stringify(initialType.message) : "undefined"));
        });
    });

    return preCheckErrors;
}

var preCheckErrors = ValidateUtilNamspace();
if (preCheckErrors.length == 0)
    preCheckErrors = ValidateResultStatus();

if (preCheckErrors.length == 0)
    preCheckErrors.push({ value: 1, type: "pass", message: "No pre-check errors." });
else {
    preCheckErrors = preCheckErrors.map(function(m) {
        if (typeof(m) == "string")
            return { value: 2, type: "fail", message: m };
        if (typeof(m.toJSON) == "function" || typeof(m) == "number" || typeof(m) == "boolean" || Array.isArray(m))
            return { value: (AssertionTesting.util.derivesFrom(m, Error)) ? 3 : 2, type: (AssertionTesting.util.derivesFrom(m, Error)) ? "error" : "fail", message: JSON.stringify(m) };
        if (typeof(m) != "object")
            return { value: (AssertionTesting.util.derivesFrom(m, Error)) ? 3 : 2, type: (AssertionTesting.util.derivesFrom(m, Error)) ? "error" : "fail", message: m.totring() };
        var obj = { };
        if (AssertionTesting.util.derivesFrom(m, Error)) {
            obj.message = m.message;
            obj.name = m.name;
            obj.number = m.number;
            obj.lineNumber = m.lineNumber;
            obj.columnNumber = m.columnNumber;
            obj.message = m.stack;
        }
        for (var p in m) {
            if (AssertionTesting.util.defined(m[p]) && !AssertionTesting.util.isFunction(m[p]))
                obj[p] = m[p];
        }
        return { value: (AssertionTesting.util.derivesFrom(m, Error)) ? 3 : 2, type: (AssertionTesting.util.derivesFrom(m, Error)) ? "error" : "fail",
            message: JSON.stringify(obj) };
     });
}
preCheckErrors.forEach(function(e) {
    if (e.value == 1)
        console.log(JSON.stringify(e));
    else
        console.error(JSON.stringify(e));
});
if (preCheckErrors.length > 1 || preCheckErrors[0].value != 1)
    console.log("%d errors.", preCheckErrors.length);