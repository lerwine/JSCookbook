export var TypeUtil;
(function (TypeUtil) {
    ;
    let newLineString = "\n";
    let whitespaceRegex = /^\s*$/;
    let trimEndRegex = /^(\s*\S+(\s+\S+)*)/;
    let lineSplitRegex = /\r\n?|\n/g;
    let boolRegex = /^(?:(t(?:rue)?|y(?:es)?|[+-]?(?:0*[1-9]\d*(?:\.\d+)?|0+\.0*[1-9]\d*)|\+)|(f(?:alse)?|no?|[+-]?0+(?:\.0+)?|-))$/i;
    let ucFirstRegex = /^([^a-zA-Z\d]*[a-z])(.+)?$/g;
    let abnormalWhitespaceRegex = /( |(?=[^ ]))\s+/g;
    function defined(value) { return typeof (value) !== "undefined"; }
    TypeUtil.defined = defined;
    function isObjectType(value) { return typeof (value) === "object" && value !== null; }
    TypeUtil.isObjectType = isObjectType;
    function isNonArrayObject(value) { return typeof (value) == "object" && value !== null && !Array.isArray(value); }
    TypeUtil.isNonArrayObject = isNonArrayObject;
    function isString(value) { return typeof (value) === "string"; }
    TypeUtil.isString = isString;
    function isFunction(value) { return typeof (value) === "function"; }
    TypeUtil.isFunction = isFunction;
    function isBoolean(value) { return typeof (value) === "boolean"; }
    TypeUtil.isBoolean = isBoolean;
    function isNumber(value) { return typeof (value) === "number" && !isNaN(value); }
    TypeUtil.isNumber = isNumber;
    function nil(value) { return !defined(value) || value === null; }
    TypeUtil.nil = nil;
    function isNilOrEmptyString(value) { return nil(value) || (isString(value) && value.length == 0); }
    TypeUtil.isNilOrEmptyString = isNilOrEmptyString;
    function isNilOrWhitespace(value) { return nil(value) || (isString(value) && whitespaceRegex.test(value)); }
    TypeUtil.isNilOrWhitespace = isNilOrWhitespace;
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
        let s;
        if (!isString(value))
            s = (Array.isArray(value)) ? value.join(newLineString) : (function () {
                if (isObjectType(value) && isFunction(value.valueOf)) {
                    try {
                        let v = value.valueOf();
                        if (isString(v))
                            return v;
                        if (!nil(v)) {
                            if (Array.isArray(v))
                                return v.join(newLineString);
                            value = v;
                        }
                    }
                    catch (e) { }
                }
                try {
                    let s = value.toString();
                    if (isString(s))
                        return s;
                }
                catch (e) { }
                return value + "";
            })();
        else
            s = value;
        if ((ignoreWhitespace) ? whitespaceRegex.test(s) : s.length == 0) {
            let d = asString(defaultValue);
            if (isString(d))
                return d;
        }
        return s;
    }
    TypeUtil.asString = asString;
    function asNormalizedString(value, defaultValue) {
        value = asString(value, defaultValue, true).trim();
        if (nil(value) || value.length == 0)
            return value;
        return value.replace(abnormalWhitespaceRegex, ' ');
    }
    TypeUtil.asNormalizedString = asNormalizedString;
    function trimEnd(text) {
        text = asString(text, "");
        let m = trimEndRegex.exec(text);
        if (nil(m))
            return "";
        return m[1];
    }
    TypeUtil.trimEnd = trimEnd;
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
        let n = null;
        if (typeof (value) !== "number") {
            if (isObjectType(value) && isFunction(value.valueOf)) {
                try {
                    let i = value.valueOf();
                    if (isNumber(i))
                        return i;
                    if (!nil(i))
                        value = i;
                }
                catch (e) { }
            }
            if (isBoolean(value))
                return (value) ? 1 : 0;
            value = asString(value, "").trim();
            n = (value.length == 0) ? NaN : parseFloat(value);
        }
        else
            n = value;
        if (isNaN(n) && !nil(defaultValue))
            return asNumber(defaultValue);
        return n;
    }
    TypeUtil.asNumber = asNumber;
    function asInteger(value, defaultValue) {
        let v = asNumber(value, defaultValue);
        if (nil(v) || isNaN(v) || Number.isInteger(v))
            return v;
        return Math.round(v);
    }
    TypeUtil.asInteger = asInteger;
    function asBoolean(value, defaultValue) {
        if (typeof (value) === "boolean")
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
        if (typeof (value) === "number")
            return !isNaN(value) && value != 0;
        if (isObjectType(value) && isFunction(value.valueOf)) {
            try {
                let n = value.valueOf();
                if (isNumber(n))
                    return n != 0;
                if (isBoolean(value))
                    return value;
                if (!nil(n))
                    value = n;
            }
            catch (e) { }
        }
        let mg = boolRegex.exec(asString(value, "").trim());
        if (nil(mg))
            return asBoolean(defaultValue);
        return nil(mg[2]);
    }
    TypeUtil.asBoolean = asBoolean;
    function asArray(value) {
        if (!defined(value))
            return [];
        if (Array.isArray(value))
            return value;
        return [value];
    }
    TypeUtil.asArray = asArray;
    function getClassName(value) {
        if (!defined(value))
            return "undefined";
        if (value === null)
            return "null";
        let prototype, constructor;
        if (isFunction(value)) {
            constructor = value;
            prototype = value.prototype;
        }
        else {
            prototype = Object.getPrototypeOf(value);
            constructor = prototype.constructor;
            while (!isFunction(constructor)) {
                prototype = Object.getPrototypeOf(prototype);
                if (nil(prototype))
                    return typeof (value);
                constructor = prototype.constructor;
            }
        }
        if (isString(constructor.name) && constructor.name.length > 0)
            return constructor.name;
        let basePrototype = Object.getPrototypeOf(prototype);
        if (nil(basePrototype)) {
            if (isString(prototype.name) && prototype.name.length > 0)
                return prototype.name;
            if (isString(value.name) && value.name.length > 0)
                return value.name;
            return typeof (value);
        }
        let name = getClassName(basePrototype);
        if (name == "Object") {
            if (isString(prototype.name) && prototype.name.length > 0)
                return prototype.name;
            if (isString(value.name) && value.name.length > 0)
                return value.name;
        }
        return name;
    }
    TypeUtil.getClassName = getClassName;
    function getInheritanceChain(value) {
        if (!defined(value))
            return ["undefined"];
        if (value === null)
            return ["null"];
        let prototype, constructor;
        if (isFunction(value)) {
            constructor = value;
            prototype = value.prototype;
        }
        else {
            prototype = Object.getPrototypeOf(value);
            constructor = prototype.constructor;
            while (!isFunction(constructor)) {
                prototype = Object.getPrototypeOf(prototype);
                if (nil(prototype))
                    return [typeof (value)];
                constructor = prototype.constructor;
            }
        }
        let basePrototype = Object.getPrototypeOf(prototype);
        if (nil(basePrototype)) {
            if (isString(constructor.name) && constructor.name.length > 0)
                return [constructor.name];
            if (isString(prototype.name) && prototype.name.length > 0)
                return [prototype.name];
            if (isString(value.name) && value.name.length > 0)
                return [value.name];
            return [typeof (value)];
        }
        let arr = getInheritanceChain(basePrototype);
        if (isString(constructor.name) && constructor.name.length > 0) {
            arr.unshift(constructor.name);
            return arr;
        }
        if (isString(prototype.name) && prototype.name.length > 0) {
            arr.unshift(prototype.name);
            return arr;
        }
        if (arr.length > 0)
            return arr;
        if (isString(value.name) && value.name.length > 0)
            return [value.name];
        return [typeof (value)];
    }
    TypeUtil.getInheritanceChain = getInheritanceChain;
    function derivesFrom(value, classConstructor) {
        if (!defined(value))
            return !defined(classConstructor);
        if (!defined(classConstructor))
            return false;
        if (value === null)
            return classConstructor === null;
        let classProto;
        if (isFunction(classConstructor)) {
            classProto = classConstructor.prototype;
        }
        else {
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
        let valueProto, valueConstructor;
        if (isFunction(value)) {
            valueConstructor = value;
            valueProto = value.prototype;
        }
        else {
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
        let constructorChain = [];
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
        for (let i = 0; i < constructorChain.length; i++) {
            if (constructorChain[i] === classConstructor)
                return true;
        }
        return false;
    }
    TypeUtil.derivesFrom = derivesFrom;
    function typeOfExt(value) {
        let t = typeof (value);
        if (t == "object") {
            if (value === null)
                return "null";
        }
        else if (t != "function") {
            if (t == "number" && isNaN(value))
                return "NaN";
            return t;
        }
        let n = getClassName(value);
        if (n == t)
            return t;
        return t + " " + n;
    }
    TypeUtil.typeOfExt = typeOfExt;
    function indentText(text, indent, skipLineCount) {
        let arr, joinedText;
        if (nil(text) || !isObjectType(text) || !Array.isArray(text))
            text = this.asString(text, "");
        if (typeof (text) != "string") {
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
        skipLineCount = asInteger(skipLineCount, 0);
        arr = joinedText.split(lineSplitRegex).map(function (s) { return trimEnd(s); });
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
    }
    TypeUtil.indentText = indentText;
    function _serializeToString(obj) {
        if (!defined(obj))
            return "undefined";
        if (obj === null)
            return "null";
        let type = typeof (obj);
        if (type == "number")
            return (isNaN(obj)) ? "NaN" : JSON.stringify(obj);
        if (type == "boolean" || type == "string")
            return JSON.stringify(obj);
        let className = getClassName(obj);
        if (typeof (obj.toJSON) != "function") {
            if (type == "object") {
                if (derivesFrom(obj, Error)) {
                    var e = obj;
                    var jObj = {};
                    if (!nil(e.message)) {
                        jObj.message = asString(e.message, "");
                        if (!nil(e.description)) {
                            if (jObj.message.trim().length > 0)
                                jObj.description = asString(e.description, "");
                            else {
                                let s = asString(e.description, "");
                                if (s.trim().length > 0 || s.length > jObj.message.length)
                                    jObj.message = s;
                            }
                        }
                    }
                    else if (!nil(e.description))
                        jObj.message = asString(e.description, "");
                    if (!nil(e.name))
                        jObj.name = asString(e.name);
                    if (!nil(e.number))
                        jObj.number = asNumber(e.number);
                    if (!nil(e.fileName))
                        jObj.fileName = asString(e.fileName);
                    if (!nil(e.lineNumber))
                        jObj.lineNumber = asNumber(e.lineNumber);
                    if (!nil(e.columnNumber))
                        jObj.columnNumber = asNumber(e.columnNumber);
                    if (!nil(e.stack))
                        jObj.stack = asString(e.stack);
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
                            newLineString + "\t\"elements\": " + indentText(JSON.stringify(arr), "\t\t", 1) + " }";
                    return "{" + newLineString + "\t\"className\": " + JSON.stringify(className) + "," + newLineString + "\t\"type\": " + JSON.stringify(type) + "," +
                        newLineString + "\t\"elements\": [" + newLineString + indentText(JSON.stringify(arr), "\t\t\t", 1) + newLineString + "\t] }";
                }
                return "{" + newLineString + "\t\"className\": " + JSON.stringify(className) + "," + newLineString + "\t\"type\": " + JSON.stringify(type) + "," +
                    newLineString + "\t\"properties\": " + indentText(JSON.stringify(obj), "\t\t", 1) + " }";
            }
            return "{" + newLineString + "\t\"className\": " + JSON.stringify(className) + "," + newLineString + "\t\"type\": " + JSON.stringify(type) + "," +
                newLineString + "\t\"value\": " + JSON.stringify(obj.toString()) + " }";
        }
        if (isFunction(obj.toJSON) || type == "object")
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
    function serializeToString(obj) {
        if (!defined(obj))
            return "undefined";
        if (obj === null)
            return "null";
        let type = typeof (obj);
        if (type == "number")
            return (isNaN(obj)) ? "NaN" : JSON.stringify(obj);
        if (type == "boolean" || type == "string")
            return JSON.stringify(obj);
        let className = getClassName(obj);
        let n;
        if (typeof (obj.toJSON) != "function") {
            if (type == "object") {
                let elements = [];
                let propertyLines = [];
                let byName = {};
                if (Array.isArray(obj)) {
                    elements = obj.map(function (e) { return serializeToString(e); });
                    for (n in obj) {
                        let i = asNumber(n, null);
                        let v = obj[n];
                        if ((!nil(i) && n !== "length") || i < 0 || i > obj.length) {
                            byName[n] = serializeToString(obj[n]);
                            propertyLines.push(JSON.stringify(n) + ": " + serializeToString(obj[n]));
                        }
                    }
                }
                else {
                    for (n in obj) {
                        if (n !== "length") {
                            byName[n] = serializeToString(obj[n]);
                            propertyLines.push(JSON.stringify(n) + ": " + serializeToString(obj[n]));
                        }
                    }
                }
                if (derivesFrom(obj, Error)) {
                    if (!nil(obj.columnNumber) && nil(byName.columnNumber))
                        propertyLines.unshift("\"columnNumber\": " + serializeToString(obj.columnNumber));
                    if (!nil(obj.lineNumber) && nil(byName.lineNumber))
                        propertyLines.unshift("\"lineNumber\": " + serializeToString(obj.lineNumber));
                    if (!nil(obj.fileName) && nil(byName.fileName))
                        propertyLines.unshift("\"fileName\": " + serializeToString(obj.fileName));
                    if (!nil(obj.number) && nil(byName.number))
                        propertyLines.unshift("\"number\": " + serializeToString(obj.number));
                    if (!nil(obj.name) && nil(byName.name))
                        propertyLines.unshift("\"name\": " + serializeToString(obj.name));
                    if (!nil(obj.description) && nil(byName.description)) {
                        if (nil(obj.message) || (isString(obj.message) && isString(obj.description) && obj.description.length > obj.message.length && obj.message.trim().length == 0)) {
                            byName.message = obj.description;
                            propertyLines.unshift("\"message\": " + serializeToString(obj.description));
                        }
                        else
                            propertyLines.unshift("\"description\": " + serializeToString(obj.description));
                    }
                    if (!nil(obj.message) && nil(byName.message))
                        propertyLines.unshift("\"message\": " + serializeToString(obj.message));
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
                                "\t\"elements\": [ " + indentText(elements[0], "\t", 1) + " ]" + newLineString + ", \t\"properties\": {}" + newLineString + "}";
                        }
                        if (className == "Array")
                            return "[" + newLineString + elements.map(function (e) { return indentText(e); }).join(newLineString) + newLineString + "]";
                        return "{" + newLineString + "\t\"className\": " + JSON.stringify(className) + "," + newLineString + "\t\"type\": " + JSON.stringify(type) + "," + newLineString +
                            "\t\"elements\": [" + newLineString + elements.map(function (e) { return indentText(e, "\t\t"); }).join(newLineString) + newLineString + "]" + newLineString + ", \t\"properties\": {}" + newLineString + "}";
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
                if (!defined(e))
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
        let lines = [];
        for (n in obj) {
            let v = obj[n];
            if (!defined(v))
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
    }
    TypeUtil.serializeToString = serializeToString;
    class ErrorInfo {
        constructor(value, isWarning) {
            this._isWarning = false;
            this._message = "";
            this._description = null;
            this._name = "undefined";
            this._number = null;
            this._fileName = null;
            this._lineNumber = null;
            this._columnNumber = null;
            this._stack = null;
            this._innerError = null;
            this.metaData = null;
            this.isWarning = (typeof (isWarning) == "boolean") && isWarning;
            if (typeof (value) === "undefined")
                return;
            this.name = typeof (value);
            if (value === null)
                return;
            if (typeof (value) == "string") {
                this.message = value;
                return;
            }
            let foundMetaData = false;
            let metaData = {};
            if (Array.isArray(value)) {
                this.message = asString(value, "");
                for (var n in value) {
                    if (n == "length")
                        continue;
                    var i = asNumber(n, null);
                    if (nil(i) || i < 0 || i >= value.length) {
                        foundMetaData = true;
                        metaData[n] = value[n];
                    }
                }
            }
            else {
                let message = null;
                let description = null;
                let name = null;
                for (var n in value) {
                    switch (n) {
                        case "length":
                            break;
                        case "message":
                            message = asString(value.message, "");
                            break;
                        case "description":
                            description = asString(value.description, null);
                            break;
                        case "name":
                            name = asString(value.name, null);
                            break;
                        case "number":
                            this.number = asNumber(value.number, null);
                            break;
                        case "fileName":
                            this.fileName = asString(value.description, null);
                            break;
                        case "lineNumber":
                            this.lineNumber = asNumber(value.lineNumber, null);
                            break;
                        case "columnNumber":
                            this.columnNumber = asNumber(value.columnNumber, null);
                            break;
                        case "stack":
                            this.stack = asString(value.stack, null);
                            break;
                        case "innerError":
                            this.innerError = ErrorInfo.asErrorInfo(value);
                            break;
                        default:
                            foundMetaData = true;
                            metaData[n] = value[n];
                            break;
                    }
                }
                if (message !== null) {
                    if (description != null) {
                        if (message.trim().length == 0 && description !== null && (description.length > message.length || description.trim().length > 0))
                            this.message = description;
                        else {
                            this.message = message;
                            this.description = description;
                        }
                    }
                    else
                        this.message = message;
                }
                else if (description != null)
                    this.message = description;
                if (name == null)
                    name = typeof (value);
            }
            if (foundMetaData)
                this.metaData = metaData;
        }
        get isWarning() { return this._isWarning; }
        set isWarning(value) { this._isWarning = asBoolean(value, false); }
        get message() { return this._message; }
        set message(value) { this._message = asString(value, ""); }
        get description() { return this._description; }
        set description(value) { this._description = asString(value, null); }
        get name() { return this._name; }
        set name(value) { this._name = asString(value, "undefined"); }
        get number() { return this._number; }
        set number(value) { this._number = asNumber(value, null); }
        get fileName() { return this._fileName; }
        set fileName(value) { this._fileName = asString(value, null); }
        get lineNumber() { return this._lineNumber; }
        set lineNumber(value) { this._lineNumber = asNumber(value, null); }
        get columnNumber() { return this._columnNumber; }
        set columnNumber(value) { this._columnNumber = asNumber(value, null); }
        get stack() { return this._stack; }
        set stack(value) { this._stack = asString(value, null); }
        get innerError() { return this._innerError; }
        set innerError(value) { this._innerError = ErrorInfo.asErrorInfo(value); }
        static asErrorInfo(value) {
            if (!defined(value))
                return null;
            if (derivesFrom(value, ErrorInfo))
                return value;
            return new ErrorInfo(value);
        }
    }
    TypeUtil.ErrorInfo = ErrorInfo;
})(TypeUtil || (TypeUtil = {}));
//# sourceMappingURL=TypeUtil.js.map