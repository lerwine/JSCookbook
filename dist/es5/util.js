"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var newLineString = "\n";
var whitespaceRegex = /^\s*$/;
var trimEndRegex = /^(\s*\S+(\s+\S+)*)/;
var lineSplitRegex = /\r\n?|\n/g;
var boolRegex = /^(?:(t(?:rue)?|y(?:es)?|[+-]?(?:0*[1-9]\d*(?:\.\d+)?|0+\.0*[1-9]\d*)|\+)|(f(?:alse)?|no?|[+-]?0+(?:\.0+)?|-))$/i;
var ucFirstRegex = /^([^a-zA-Z\d]*[a-z])(.+)?$/g;
var util = (function () {
    function util() {
    }
    util.defined = function (value) { return typeof (value) !== "undefined"; };
    util.isString = function (value) { return typeof (value) === "string"; };
    util.isFunction = function (value) { return typeof (value) === "function"; };
    util.isBoolean = function (value) { return typeof (value) === "boolean"; };
    util.isNumber = function (value) { return typeof (value) === "number" && !isNaN(value); };
    util.nil = function (value) { return !util.defined(value) || value === null; };
    util.isNilOrEmptyString = function (s) { return util.nil(s) || (util.isString(s) && s.length == 0); };
    util.isNilOrWhitespace = function (s) { return util.nil(s) || (util.isString(s) && whitespaceRegex.test(s)); };
    util.asString = function (value, defaultValue, ignoreWhitespace) {
        if (!util.defined(value)) {
            if (util.nil(defaultValue))
                return defaultValue;
            return util.asString(defaultValue);
        }
        if (value === null) {
            if (util.nil(defaultValue))
                return value;
            return util.asString(defaultValue);
        }
        if (!util.isString(value))
            value = (Array.isArray(value)) ? value.join(newLineString) : (function () {
                try {
                    var s = value.toString();
                    if (util.isString(s))
                        return s;
                }
                catch (e) { }
                return value + "";
            })();
        if ((ignoreWhitespace) ? whitespaceRegex.test(value) : value.length == 0) {
            var d = util.asString(defaultValue);
            if (util.isString(d))
                return d;
        }
        return value;
    };
    util.trimEnd = function (v) {
        var s = util.asString(v, "");
        var m = trimEndRegex.exec(s);
        if (util.nil(m))
            return "";
        return m[1];
    };
    util.asNumber = function (value, defaultValue) {
        if (!util.defined(value)) {
            if (util.nil(defaultValue))
                return (util.defined(defaultValue)) ? defaultValue : value;
            return util.asNumber(defaultValue);
        }
        if (value === null) {
            if (util.nil(defaultValue))
                return value;
            return util.asNumber(defaultValue, value);
        }
        var n = null;
        if (typeof (value) !== "number") {
            if (util.isFunction(value.valueOf)) {
                try {
                    var i = value.valueOf();
                    if (util.isNumber(i))
                        return i;
                    if (!util.nil(i))
                        n = i;
                }
                catch (e) { }
            }
            if (util.isBoolean(value))
                return (value) ? 1 : 0;
            value = util.asString(value, "").trim();
            n = (value.length == 0) ? NaN : parseFloat(value);
        }
        else
            n = value;
        if (isNaN(n) && !util.nil(defaultValue))
            return util.asNumber(defaultValue);
        return n;
    };
    util.asInteger = function (value, defaultValue) {
        var v = util.asNumber(value, defaultValue);
        if (util.nil(v) || isNaN(v) || Number.isInteger(v))
            return v;
        return Math.round(v);
    };
    util.asBoolean = function (value, defaultValue) {
        if (typeof (value) === "boolean")
            return value;
        if (!util.defined(value)) {
            if (util.nil(defaultValue))
                return defaultValue;
            return util.asBoolean(defaultValue);
        }
        if (value === null) {
            if (util.nil(defaultValue))
                return (util.defined(defaultValue)) ? defaultValue : value;
            return util.asBoolean(defaultValue, value);
        }
        if (typeof (value) === "number")
            return !isNaN(value) && value != 0;
        if (util.isFunction(value.valueOf)) {
            try {
                var n = value.valueOf();
                if (util.isNumber(n))
                    return n != 0;
                if (util.isBoolean(value))
                    return value;
                if (!util.nil(n))
                    value = n;
            }
            catch (e) { }
        }
        var mg = boolRegex.exec(util.asString(value, "").trim());
        if (util.nil(mg))
            return util.asBoolean(defaultValue);
        return util.nil(mg[2]);
    };
    util.getClassName = function (value) {
        if (!util.defined(value))
            return "undefined";
        if (value === null)
            return "null";
        var prototype, constructor;
        if (util.isFunction(value)) {
            constructor = value;
            prototype = value.prototype;
        }
        else {
            prototype = Object.getPrototypeOf(value);
            constructor = prototype.constructor;
            while (!util.isFunction(constructor)) {
                prototype = Object.getPrototypeOf(prototype);
                if (util.nil(prototype))
                    return typeof (value);
                constructor = prototype.constructor;
            }
        }
        if (util.isString(constructor.name) && constructor.name.length > 0)
            return constructor.name;
        var basePrototype = Object.getPrototypeOf(prototype);
        if (util.nil(basePrototype)) {
            if (util.isString(prototype.name) && prototype.name.length > 0)
                return prototype.name;
            if (util.isString(value.name) && value.name.length > 0)
                return value.name;
            return typeof (value);
        }
        var name = util.getClassName(basePrototype);
        if (name == "Object") {
            if (util.isString(prototype.name) && prototype.name.length > 0)
                return prototype.name;
            if (util.isString(value.name) && value.name.length > 0)
                return value.name;
        }
        return name;
    };
    util.getInheritanceChain = function (value) {
        if (!util.defined(value))
            return ["undefined"];
        if (value === null)
            return ["null"];
        var prototype, constructor;
        if (util.isFunction(value)) {
            constructor = value;
            prototype = value.prototype;
        }
        else {
            prototype = Object.getPrototypeOf(value);
            constructor = prototype.constructor;
            while (!util.isFunction(constructor)) {
                prototype = Object.getPrototypeOf(prototype);
                if (util.nil(prototype))
                    return [typeof (value)];
                constructor = prototype.constructor;
            }
        }
        var basePrototype = Object.getPrototypeOf(prototype);
        if (util.nil(basePrototype)) {
            if (util.isString(constructor.name) && constructor.name.length > 0)
                return [constructor.name];
            if (util.isString(prototype.name) && prototype.name.length > 0)
                return [prototype.name];
            if (util.isString(value.name) && value.name.length > 0)
                return [value.name];
            return [typeof (value)];
        }
        var arr = util.getInheritanceChain(basePrototype);
        if (util.isString(constructor.name) && constructor.name.length > 0) {
            arr.unshift(constructor.name);
            return arr;
        }
        if (util.isString(prototype.name) && prototype.name.length > 0) {
            arr.unshift(prototype.name);
            return arr;
        }
        if (arr.length > 0)
            return arr;
        if (util.isString(value.name) && value.name.length > 0)
            return [value.name];
        return [typeof (value)];
    };
    util.derivesFrom = function (value, classConstructor) {
        if (!util.defined(value))
            return !util.defined(classConstructor);
        if (!util.defined(classConstructor))
            return false;
        if (value === null)
            return classConstructor === null;
        var classProto;
        if (util.isFunction(classConstructor)) {
            classProto = classConstructor.prototype;
        }
        else {
            classProto = Object.getPrototypeOf(classConstructor);
            classConstructor = classProto.constructor;
            while (!util.isFunction(classConstructor)) {
                classProto = Object.getPrototypeOf(classProto);
                if (util.nil(classProto))
                    break;
                classConstructor = classProto.constructor;
            }
        }
        if (value instanceof classConstructor)
            return true;
        var valueProto, valueConstructor;
        if (util.isFunction(value)) {
            valueConstructor = value;
            valueProto = value.prototype;
        }
        else {
            valueProto = Object.getPrototypeOf(value);
            valueConstructor = valueProto.constructor;
            while (!util.isFunction(valueConstructor)) {
                valueProto = Object.getPrototypeOf(valueProto);
                if (util.nil(valueProto))
                    break;
                valueConstructor = valueProto.constructor;
            }
        }
        if (util.nil(valueConstructor))
            return (util.nil(classConstructor) && util.nil(classProto) == util.nil(valueProto));
        if (valueConstructor === classConstructor)
            return true;
        if (util.nil(valueProto))
            return (util.nil(classProto) && valueConstructor === classConstructor);
        var constructorChain = [];
        do {
            if (valueProto instanceof classConstructor)
                return true;
            constructorChain.push(valueConstructor);
            valueConstructor = null;
            do {
                valueProto = Object.getPrototypeOf(valueProto);
                if (util.nil(valueProto))
                    break;
                valueConstructor = valueProto.constructor;
            } while (util.nil(valueConstructor));
        } while (!util.nil(valueConstructor));
        for (var i = 0; i < constructorChain.length; i++) {
            if (constructorChain[i] === classConstructor)
                return true;
        }
        return false;
    };
    util.typeOfExt = function (value) {
        var t = typeof (value);
        if (t == "object") {
            if (value === null)
                return "null";
        }
        else if (t != "function") {
            if (t == "number" && isNaN(value))
                return "NaN";
            return t;
        }
        var n = util.getClassName(value);
        if (n == t)
            return t;
        return t + " " + n;
    };
    util.indentText = function (text, indent, skipLineCount) {
        var arr, joinedText;
        if (typeof (text) == "object" && text != null && Array.isArray(text)) {
            arr = text;
            if (arr.length == 0)
                return "";
            if (arr.length == 1)
                joinedText = asString(arr[0], "");
            else
                joinedText = arr.join(newLineString);
        }
        else
            joinedText = asString(text, "");
        if (joinedText.length == 0)
            return joinedText;
        indent = asString(indent, "\t");
        skipLineCount = util.asInteger(skipLineCount, 0);
        arr = joinedText.split(lineSplitRegex).map(function (s) { return util.trimEnd(s); });
        if (arr.length == 1) {
            if (skipLineCount < 1 && arr[0].length > 1)
                return indent + arr[0];
            return arr[0];
        }
        return arr.map(function (s, i) {
            if (i < skipLineCount || s.length == 0)
                return s;
            return indent + s;
        }).join(newLineString);
    };
    util.__asPropertyValueString = function (obj) {
        if (!util.defined(obj))
            return "undefined";
        if (obj === null)
            return "null";
        var type = typeof (obj);
        if (type == "number")
            return (isNaN(obj)) ? "NaN" : JSON.stringify(obj);
        if (type == "boolean" || type == "string")
            return JSON.stringify(obj);
        var className = util.getClassName(obj);
        if (typeof (obj.toJSON) != "function") {
            if (type == "object") {
                if (util.derivesFrom(obj, Error)) {
                    var e = obj;
                    var jObj = {};
                    if (!util.nil(e.message)) {
                        jObj.message = util.asString(e.message, "");
                        if (!util.nil(e.description)) {
                            if (jObj.message.trim().length > 0)
                                jObj.description = util.asString(e.description, "");
                            else {
                                var s = util.asString(e.description, "");
                                if (s.trim().length > 0 || s.length > jObj.message.length)
                                    jObj.message = s;
                            }
                        }
                    }
                    else if (!util.nil(e.description))
                        jObj.message = util.asString(e.description, "");
                    if (!util.nil(e.name))
                        jObj.name = util.asString(e.name);
                    if (!util.nil(e.number))
                        jObj.number = util.asNumber(e.number);
                    if (!util.nil(e.fileName))
                        jObj.fileName = util.asString(e.fileName);
                    if (!util.nil(e.lineNumber))
                        jObj.lineNumber = util.asNumber(e.lineNumber);
                    if (!util.nil(e.columnNumber))
                        jObj.columnNumber = util.asNumber(e.columnNumber);
                    if (!util.nil(e.stack))
                        jObj.stack = util.asString(e.stack);
                    return JSON.stringify({
                        className: className,
                        type: type,
                        properties: jObj
                    }, undefined, "\t");
                }
                if (Array.isArray(obj)) {
                    var arr = obj;
                    if (arr.length == 0)
                        return "{" + newLineString + "\t\"className\": " + JSON.stringify(className) + "," + newLineString + "\t\"type\": " + JSON.stringify(type) + "," +
                            newLineString + "\t\"elements\": [] }";
                    if (arr.length == 1)
                        return "{" + newLineString + "\t\"className\": " + JSON.stringify(className) + "," + newLineString + "\t\"type\": " + JSON.stringify(type) + "," +
                            newLineString + "\t\"elements\": " + util.indentText(JSON.stringify(arr), "\t\t", 1) + " }";
                    return "{" + newLineString + "\t\"className\": " + JSON.stringify(className) + "," + newLineString + "\t\"type\": " + JSON.stringify(type) + "," +
                        newLineString + "\t\"elements\": [" + newLineString + util.indentText(JSON.stringify(arr), "\t\t\t", 1) + newLineString + "\t] }";
                }
                return "{" + newLineString + "\t\"className\": " + JSON.stringify(className) + "," + newLineString + "\t\"type\": " + JSON.stringify(type) + "," +
                    newLineString + "\t\"properties\": " + util.indentText(JSON.stringify(obj), "\t\t", 1) + " }";
            }
            return "{" + newLineString + "\t\"className\": " + JSON.stringify(className) + "," + newLineString + "\t\"type\": " + JSON.stringify(type) + "," +
                newLineString + "\t\"value\": " + JSON.stringify(obj.toString()) + " }";
        }
        if (typeof (obj.toJSON) == "function" || type == "object")
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
    };
    util.asPropertyValueString = function (obj) {
        if (!util.defined(obj))
            return "undefined";
        if (obj === null)
            return "null";
        var type = typeof (obj);
        if (type == "number")
            return (isNaN(obj)) ? "NaN" : JSON.stringify(obj);
        if (type == "boolean" || type == "string")
            return JSON.stringify(obj);
        var className = util.getClassName(obj);
        var n;
        if (typeof (obj.toJSON) != "function") {
            if (type == "object") {
                var elements = [];
                var propertyLines = [];
                var byName = {};
                if (Array.isArray(obj)) {
                    elements = obj.map(function (e) { return util.__asPropertyValueString(e); });
                    for (n in obj) {
                        var i = util.asNumber(n, null);
                        var v = obj[n];
                        if ((!util.nil(i) && n !== "length") || i < 0 || i > obj.length) {
                            byName[n] = util.__asPropertyValueString(obj[n]);
                            propertyLines.push(JSON.stringify(n) + ": " + util.__asPropertyValueString(obj[n]));
                        }
                    }
                }
                else {
                    for (n in obj) {
                        if (n !== "length") {
                            byName[n] = util.__asPropertyValueString(obj[n]);
                            propertyLines.push(JSON.stringify(n) + ": " + util.__asPropertyValueString(obj[n]));
                        }
                    }
                }
                if (util.derivesFrom(obj, Error)) {
                    if (!util.nil(obj.columnNumber) && util.nil(byName.columnNumber))
                        propertyLines.unshift("\"columnNumber\": " + util.__asPropertyValueString(obj.columnNumber));
                    if (!util.nil(obj.lineNumber) && util.nil(byName.lineNumber))
                        propertyLines.unshift("\"lineNumber\": " + util.__asPropertyValueString(obj.lineNumber));
                    if (!util.nil(obj.fileName) && util.nil(byName.fileName))
                        propertyLines.unshift("\"fileName\": " + util.__asPropertyValueString(obj.fileName));
                    if (!util.nil(obj.number) && util.nil(byName.number))
                        propertyLines.unshift("\"number\": " + util.__asPropertyValueString(obj.number));
                    if (!util.nil(obj.name) && util.nil(byName.name))
                        propertyLines.unshift("\"name\": " + util.__asPropertyValueString(obj.name));
                    if (!util.nil(obj.description) && util.nil(byName.description)) {
                        if (util.nil(obj.message) || (util.isString(obj.message) && util.isString(obj.description) && obj.description.length > obj.message.length && obj.message.trim().length == 0)) {
                            byName.message = obj.description;
                            propertyLines.unshift("\"message\": " + util.__asPropertyValueString(obj.description));
                        }
                        else
                            propertyLines.unshift("\"description\": " + util.__asPropertyValueString(obj.description));
                    }
                    if (!util.nil(obj.message) && util.nil(byName.message))
                        propertyLines.unshift("\"message\": " + util.__asPropertyValueString(obj.message));
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
                                return "[ " + util.trimEnd(elements[0]) + " ]";
                            return "{" + newLineString + "\t\"className\": " + JSON.stringify(className) + "," + newLineString + "\t\"type\": " + JSON.stringify(type) + "," + newLineString +
                                "\t\"elements\": [ " + util.indentText(elements[0], "\t", 1) + " ]" + newLineString + ", \t\"properties\": {}" + newLineString + "}";
                        }
                        if (className == "Array")
                            return "[" + newLineString + elements.map(function (e) { return util.indentText(e); }).join(newLineString) + newLineString + "]";
                        return "{" + newLineString + "\t\"className\": " + JSON.stringify(className) + "," + newLineString + "\t\"type\": " + JSON.stringify(type) + "," + newLineString +
                            "\t\"elements\": [" + newLineString + elements.map(function (e) { return util.indentText(e, "\t\t"); }).join(newLineString) + newLineString + "]" + newLineString + ", \t\"properties\": {}" + newLineString + "}";
                    }
                    if (className == "Object")
                        return "{ \"type\": " + JSON.stringify(type) + ", \"properties\": {} }";
                    return "{ \"className\": " + JSON.stringify(className) + ", \"type\": " + JSON.stringify(type) + ", \"properties\": {} }";
                }
            }
            return JSON.stringify({
                className: className,
                type: type,
                value: obj.toString()
            }, undefined, "\t");
        }
        if (typeof (obj.toJSON) == "function")
            return JSON.stringify({
                className: className,
                type: type,
                data: obj.toJSON()
            }, undefined, "\t");
        if (typeof (obj) != "object")
            return JSON.stringify({
                className: className,
                type: type,
                data: obj.toString()
            }, undefined, "\t");
        if (Array.isArray(obj)) {
            if (obj.length == 0)
                return "[]";
            return "[" + newLineString + obj.map(function (e) {
                if (!util.defined(e))
                    return "undefined";
                if (e === null)
                    return "null";
                if (typeof (e) == "number")
                    return (isNaN(e)) ? "NaN" : JSON.stringify(e, undefined, "\t");
                if (typeof (e.toJSON) == "function" || typeof (e) == "boolean" || typeof (e) == "string" ||
                    typeof (e) == "object")
                    return JSON.stringify(e, undefined, "\t");
                return e.toString();
            }).map(function (s) {
                s.split(/\r\n?|\n/).map(function (l) { return "\t" + l; }).join(newLineString);
            }).join(",") + newLineString + newLineString + "]";
        }
        var lines = [];
        for (n in obj) {
            var v = obj[n];
            if (!util.defined(v))
                lines.push(JSON.stringify(n) + ": undefined");
            else if (v === null)
                lines.push(n + ((typeof (v) == "number") ? ": NaN" : ": null"));
            else if (typeof (v) == "number")
                lines.push(JSON.stringify(n) + ": " + ((isNaN(v)) ? "NaN" : JSON.stringify(v, undefined, "\t")));
            else if (typeof (v.toJSON) == "function" || typeof (v) == "boolean" || typeof (v) == "string" ||
                typeof (v) == "object")
                lines.push(JSON.stringify(n) + ": " + JSON.stringify(v, undefined, "\t"));
            else
                lines.push(JSON.stringify(n) + ": " + v.toString());
        }
        if (lines.length == 0)
            return "{}";
        return "{" + newLineString + lines.map(function (s) {
            s.split(/\r\n?|\n/).map(function (l) { return "\t" + l; }).join(newLineString);
        }).join("," + newLineString) + newLineString + "}";
    };
    return util;
}());
exports.util = util;
//# sourceMappingURL=util.js.map