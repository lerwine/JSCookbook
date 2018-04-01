let newLineString = "\n";
let whitespaceRegex = /^\s*$/;
let trimEndRegex = /^(\s*\S+(\s+\S+)*)/;
let lineSplitRegex = /\r\n?|\n/g;
let boolRegex = /^(?:(t(?:rue)?|y(?:es)?|[+-]?(?:0*[1-9]\d*(?:\.\d+)?|0+\.0*[1-9]\d*)|\+)|(f(?:alse)?|no?|[+-]?0+(?:\.0+)?|-))$/i;
let ucFirstRegex = /^([^a-zA-Z\d]*[a-z])(.+)?$/g;

export interface AnyFunction { (...args: any[]): any; }

export interface AnyConstructor<T> { new(...args: any[]): T; };

/**
 * @namespace
 * Contains functions for converting and testing types.
 */
export abstract class util {
    /**
     * Indicates whether a value is defined.
     * @param value Value to test.
     * @returns {boolean} True if the value is defined; otherwise, false if it is undefined. This also returns true if the value is null.
     */
    static defined(value?: any) : boolean { return typeof(value) !== "undefined"; }

    /**
     * Tests whether a value is an object.
     * @param value Value to test.
     * @returns {boolean} True if the value's type is "object" and it is not null; otherwise false.
     */
    static isObjectType(value?: any) : value is object { return typeof(value) === "object" && value !== null; }

    /**
     * Tests whether a value is an object and is not an array.
     * @param value Value to test.
     * @returns {boolean} True if the value's type is "object", it is not null and it is not an array; otherwise false.
     */
    static isNonArrayObject(value: any) : value is { [key: string]: any } { return typeof(value) == "object" && value !== null && !Array.isArray(value); }

    /**
     * Tests whether a value is a string
     * @param value Value to test.
     * @returns {boolean} True if the value is a string; otherwise, false.
     */
    static isString(value?: any) : value is string { return typeof(value) === "string"; }
    
    /**
     * Tests whether a value is a function.
     * @param value Value to test.
     * @returns {boolean} True if the value is a function; otherwise, false.
     */
    static isFunction(value?: any) : value is AnyFunction { return typeof(value) === "function"; }
    
    /**
     * Tests whether a value is a boolean type.
     * @param value Value to test.
     * @returns {boolean} True if the value is boolean; otherwise, false.
     */
    static isBoolean(value?: any) : value is boolean { return typeof(value) === "boolean"; }
    
    /**
     * Tests whether a value is a number type.
     * @param value Value to test.
     * @returns {boolean} True if the value is a number and is not NaN; otherwise, false.
     */
    static isNumber(value?: any) : value is number { return typeof(value) === "number" && !isNaN(value); }
    
    /**
     * Tests whether a value is undefined or null.
     * @param value Value to test.
     * @returns {boolean} True if the value is undefined or null; othwerise, false.
     */
    static nil(value?: any) : value is undefined|null { return !util.defined(value) || value === null; }
    
    /**
     * Tests whether a string is undefined, null or empty.
     * @param value String to test.
     * @returns {boolean} True if the value is undefined, null or empty; otherwise, false.
     */
    static isNilOrEmptyString(value?: string|null) : boolean { return util.nil(value) || (util.isString(value) && value.length == 0); }
    
    /**
     * Tests whether a string is undefined, null, empty or contains only whitespace characters.
     * @param value String to test.
     * @returns {boolean} True if the value is undefined, null, empty or contains only whitespace characters; otherwise, false.
     */
    static isNilOrWhitespace(value?: string|null) : boolean { return util.nil(value) || (util.isString(value) && whitespaceRegex.test(value)); }

    /**
     * Convert a value to a string.
     * @param value Value to convert.
     * @param {string|null} [defaultValue] Default value to return if the value was undefined, null or if it converts to an empty string. If this is not defined, then an undefined value is returned when the value was undefined or null.
     * @param {boolean} [ignoreWhitespace] If true, and the converted value contains only whitespace, then it is treated as though it was converted to an empty string by returning the default value.
     * @returns {string|null=} Value converted to a string.
     * @description     If the value is converted to an empty string, and the default value is null, then a null value will be returned.
     * If any array is passed, then the 'join' method is called with a newline character as the parameter.
     * Otherwise, this method first attempts to call the value's "valueOf" function it is an object type, then it comply calls the "toString" method to convert it to a string.
     */
    static asString(value: any, defaultValue? : string|null, ignoreWhitespace? : boolean) : string {
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
        let s: string;
        if (!util.isString(value))
            s = (Array.isArray(value)) ? value.join(newLineString) : (function() {
                if (util.isObjectType(value) && util.isFunction(value.valueOf)) {
                    try {
                        let v = value.valueOf();
                        if (util.isString(v))
                            return v;
                        if (!util.nil(v)) {
                            if (Array.isArray(v))
                                return v.join(newLineString);
                            value = v;
                        }
                    } catch (e) { }
                }
                try {
                    let s = value.toString();
                    if (util.isString(s))
                        return s;
                } catch (e) { }
                return value + "";
            })();
        else
            s = value;
        if ((ignoreWhitespace) ? whitespaceRegex.test(s) : s.length == 0) {
            let d = util.asString(defaultValue);
            if (util.isString(d))
                return d;
        }
        return s;
    }
    
    /**
     * Trims trailing whitespace from the end of a string.
     * @param {string} text Text to trim.
     * @returns {string} String with trailing whitespace removed.
     */
    static trimEnd(text : string) : string {
        text = util.asString(text, "");
        let m = trimEndRegex.exec(text);
        if (util.nil(m))
            return "";
        return m[1];
    }
    
    /**
     * Convert a value to a number.
     * @param value Convert a value to a number.
     * @param {number|null} [defaultValue] Default value to return if the value was undefined, null, could not be converted to a number or is a NaN value.
     * @returns {number|null=} String converted to a number.
     * @description This method will first attempt to get a number value through the value's "valueOf" method if the value is an object type.
     * If the value is a boolean type, then it will return 1 for true, and 0 for false. Otherwise, it will convert it to a string and attempt to
     * parse a number value.
     */
    static asNumber(value: any, defaultValue? : number) : number {
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
        let n : number = null;
        if (typeof(value) !== "number") {
            if (util.isObjectType(value) && util.isFunction(value.valueOf)) {
                try {
                    let i = value.valueOf();
                    if (util.isNumber(i))
                        return i;
                    if (!util.nil(i))
                        value = i;
                } catch (e) { }
            }
            if (util.isBoolean(value))
                return (value) ? 1 : 0;
            value = util.asString(value, "").trim();
            n = (value.length == 0) ? NaN : parseFloat(value);
        } else
            n = value;
        
        if (isNaN(n) && !util.nil(defaultValue))
            return util.asNumber(defaultValue);
        return n;
    }
    
    /**
     * Convert a value to a number rounded to the nearest integer.
     * @param value Value to be converted.
     * @param {number|null} [defaultValue] Default value to return if the value was undefined, null, could not be converted to a number or is a NaN value.
     * @returns {number|null=} Value converted to an integer.
     * @description This method will first attempt to get a number value through the value's "valueOf" method if the value is an object type.
     * If the value is a boolean type, then it will return 1 for true, and 0 for false. Otherwise, it will convert it to a string and attempt to
     * parse a number value. If the number is not an integer, then it will be rounded to the nearest integer value.
     */
    static asInteger(value: any, defaultValue? : number) : number {
        let v: number = util.asNumber(value, defaultValue);
        if (util.nil(v) || isNaN(v) || Number.isInteger(v))
            return  v;
        return Math.round(v);
    }
    
    /**
     * Convert a value to a boolean value.
     * @param value Value to be converted.
     * @param {boolean|null} [defaultValue] Default value to return if the value was undefined, null or could not be converted to a boolean value.
     * @returns {boolean|null=} Value converted to a boolean type.
     * @description This method will first attempt to get a boolean value through the value's "valueOf" method if the value is an object type.
     * If the value is a number type (an not a NaN value), then it will return true for non-zero and false for zero. Otherwise, it will convert it to a string and attempt to
     * parse a true/false, t/f, yes/no, y/n (all case-insensitive) or number value in order to derive a boolean result.
     */
    static asBoolean(value: any, defaultValue? : boolean) : boolean {
        if (typeof(value) === "boolean")
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
        if (typeof(value) === "number")
            return !isNaN(value) && value != 0;
        if (util.isObjectType(value) && util.isFunction(value.valueOf)) {
            try {
                let n = value.valueOf();
                if (util.isNumber(n))
                    return n != 0;
                if (util.isBoolean(value))
                    return value;
                if (!util.nil(n))
                    value = n;
            } catch (e) { }
        }
        let mg = boolRegex.exec(util.asString(value, "").trim());
        if (util.nil(mg))
            return util.asBoolean(defaultValue);
        return util.nil(mg[2]);
    }

    /**
     * Gets the name of a value's constructor function.
     * @param value Value from which to retrieve the constructor class name.
     * @returns {string} The first named constructor function in the prototype inheritance chain or the value's type if a named constructor could not be found.
     */
    static getClassName(value: any) : string {
        if (!util.defined(value))
            return "undefined";
        if (value === null)
            return "null";
        let prototype, constructor;
        if (util.isFunction(value)) {
            constructor = value;
            prototype = value.prototype;
        } else {
            prototype = Object.getPrototypeOf(value);
            constructor = prototype.constructor;
            while (!util.isFunction(constructor)) {
                prototype = Object.getPrototypeOf(prototype);
                if (util.nil(prototype))
                    return typeof(value);
                constructor = prototype.constructor;
            }
        }
        if (util.isString(constructor.name) && constructor.name.length > 0)
            return constructor.name;
        let basePrototype = Object.getPrototypeOf(prototype);
        if (util.nil(basePrototype)) {
            if (util.isString(prototype.name) && prototype.name.length > 0)
                return prototype.name;
            if (util.isString(value.name) && value.name.length > 0)
                return value.name;
            return typeof(value);
        }
        let name = util.getClassName(basePrototype);
        if (name == "Object") {
            if (util.isString(prototype.name) && prototype.name.length > 0)
                return prototype.name;
            if (util.isString(value.name) && value.name.length > 0)
                return value.name;
        }
        return name;
    }
    
    /**
     * Gets ordered list of named constructor functions in the value's prototype inheritance chain.
     * @param value Value from which to extract the inheritance chain.
     * @returns {string[]} An array of string values with the first element being the first named constructor function in the value's inherited prototypes.
     */
    static getInheritanceChain(value: any) : string[] {
        if (!util.defined(value))
            return ["undefined"];
        if (value === null)
            return ["null"];
        let prototype, constructor;
        if (util.isFunction(value)) {
            constructor = value;
            prototype = value.prototype;
        } else {
            prototype = Object.getPrototypeOf(value);
            constructor = prototype.constructor;
            while (!util.isFunction(constructor)) {
                prototype = Object.getPrototypeOf(prototype);
                if (util.nil(prototype))
                    return [typeof(value)];
                constructor = prototype.constructor;
            }
        }
        
        let basePrototype = Object.getPrototypeOf(prototype);
        if (util.nil(basePrototype)) {
            if (util.isString(constructor.name) && constructor.name.length > 0)
                return [constructor.name];
            if (util.isString(prototype.name) && prototype.name.length > 0)
                return [prototype.name];
            if (util.isString(value.name) && value.name.length > 0)
                return [value.name];
            return [typeof(value)];
        }
        let arr = util.getInheritanceChain(basePrototype);
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
        
        return [typeof(value)];
    }
    
    /**
     * Searches the value's inherited prototype chain for a constructor function.
     * @param value Value to test.
     * @param {AnyFunction} classConstructor Constructor function to look for.
     * @returns {boolean} True if the value is determined to inherit from the specified class; otherwise false.
     */
    static derivesFrom<T>(value: any, classConstructor : AnyConstructor<T>) : value is T {
        if (!util.defined(value))
            return !util.defined(classConstructor);
        if (!util.defined(classConstructor))
            return false;
        if (value === null)
            return classConstructor === null;
        let classProto;
        if (util.isFunction(classConstructor)) {
            classProto = classConstructor.prototype;
        } else {
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
            
        let valueProto, valueConstructor;
        if (util.isFunction(value)) {
            valueConstructor = value;
            valueProto = value.prototype;
        } else {
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
        
        let constructorChain = [];
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
        for (let i = 0; i < constructorChain.length; i++) {
            if (constructorChain[i] === classConstructor)
                return true;
        }
        return false;
    }
    
    /**
     * Gets extended type string for a value.
     * @param value Value to determine type.
     * @returns {string} Value's type. If the value is null, then "null" is returned. If it is NaN, then "NaN" is returned.
     * Otherwise, the type and class name, separated by a space, is returned. If the class name could not be determined, then just the object type is returned.
     */
    static typeOfExt(value: any) : string {
        let t = typeof(value);
        if (t == "object") {
            if (value === null)
                return "null";
        } else if (t != "function") {
            if (t == "number" && isNaN(value))
                return "NaN";
            return t;
        }
    
        let n = util.getClassName(value);
        if (n == t)
            return t;
        return t + " " + n;
    }
    
    /**
     * Indents the lines of a text and trims trailing whitespace.
     * @param text Text to be indented.
     * @param indent String to use for indenting. Defaults to a single tab character.
     * @param skipLineCount Number of initial lines to preclude from indentation.
     * @returns {string} A string containing lines indented with trailing white space removed.
     */
    static indentText(text : string|string[], indent? : string, skipLineCount? : number) : string {
        let arr : string[], joinedText : string;
        if (util.nil(text) || !util.isObjectType(text) || !Array.isArray(text))
            text = this.asString(text, "");
        if (typeof(text) != "string") {
            arr = text;
            if (arr.length == 0)
                return "";
            if (arr.length == 1)
                joinedText = util.asString(arr[0], "");
            else
                joinedText = arr.join(newLineString);
        } else
            joinedText = util.asString(text, "");
        if (joinedText.length == 0)
            return joinedText;
        indent = util.asString(indent, "\t");
        skipLineCount = util.asInteger(skipLineCount, 0);
        arr = joinedText.split(lineSplitRegex).map(function(s) { return util.trimEnd(s); });
        if (arr.length == 1) {
            if (skipLineCount < 1 && arr[0].length > 1)
                return indent + arr[0];
            return arr[0];
        }
        return arr.map(function(s, i) {
            if (i < skipLineCount || s.length == 0)
                return s;
            return indent + s;
        }).join(newLineString);
    }
    
    private static _serializeToString(obj: any) : string {
        if (!util.defined(obj))
            return "undefined";
        if (obj === null)
            return "null";
        let type = typeof(obj);
        if (type == "number")
            return (isNaN(obj)) ? "NaN" : JSON.stringify(obj);
        if (type == "boolean" || type == "string")
            return JSON.stringify(obj);
        let className = util.getClassName(obj);
        if (typeof(obj.toJSON) != "function") {
            if (type == "object")
            {
                if (util.derivesFrom(obj, Error)) {
                    var e: {[k: string]: any} = obj;
                    var jObj: {[k: string]: any} = {};
                    if (!util.nil(e.message)) {
                        jObj.message = util.asString(e.message, "");
                        if (!util.nil(e.description)) {
                            if (jObj.message.trim().length > 0)
                                jObj.description = util.asString(e.description, "");
                            else {
                                let s = util.asString(e.description, "");
                                if (s.trim().length > 0 || s.length > jObj.message.length)
                                    jObj.message = s;
                            }
                        }
                    } else if (!util.nil(e.description))
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
                    var arr : any[] = obj;
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
        if (util.isFunction(obj.toJSON) || type == "object")
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

    /**
     * Serializes an object and its properties in a JSON-like representation.
     * @param obj Object to serialize.
     * @returns {string} Object converted to a JSON-like representation.
     */
    static serializeToString(obj: any) : string {
        if (!util.defined(obj))
            return "undefined";
        if (obj === null)
            return "null";
        let type = typeof(obj);
        if (type == "number")
            return (isNaN(obj)) ? "NaN" : JSON.stringify(obj);
        if (type == "boolean" || type == "string")
            return JSON.stringify(obj);
        let className = util.getClassName(obj);
        let n;
        if (typeof(obj.toJSON) != "function") {
            if (type == "object") {
                let elements : string[] = [];
                let propertyLines : string[] = [];
                let byName: {[k: string]: any} = {};
                if (Array.isArray(obj)) {
                    elements = obj.map(function(e) { return util._serializeToString(e); });
                    for (n in obj) {
                        let i = util.asNumber(n, null);
                        let v: any = obj[n];
                        if ((!util.nil(i) && n !== "length") || i < 0 || i > obj.length) {
                            byName[n] = util._serializeToString(obj[n]);
                            propertyLines.push(JSON.stringify(n) + ": " + util._serializeToString(obj[n]));
                        }
                    }
                } else {
                    for (n in obj) {
                        if (n !== "length") {
                            byName[n] = util._serializeToString(obj[n]);
                            propertyLines.push(JSON.stringify(n) + ": " + util._serializeToString(obj[n]));
                        }
                    }
                }
                if (util.derivesFrom<{[k: string]: any}>(obj, Error)) {
                    if (!util.nil(obj.columnNumber) && util.nil(byName.columnNumber))
                        propertyLines.unshift("\"columnNumber\": " + util._serializeToString(obj.columnNumber));
                    if (!util.nil(obj.lineNumber) && util.nil(byName.lineNumber))
                        propertyLines.unshift("\"lineNumber\": " + util._serializeToString(obj.lineNumber));
                    if (!util.nil(obj.fileName) && util.nil(byName.fileName))
                        propertyLines.unshift("\"fileName\": " + util._serializeToString(obj.fileName));
                    if (!util.nil(obj.number) && util.nil(byName.number))
                        propertyLines.unshift("\"number\": " + util._serializeToString(obj.number));
                    if (!util.nil(obj.name) && util.nil(byName.name))
                        propertyLines.unshift("\"name\": " + util._serializeToString(obj.name));
                    if (!util.nil(obj.description) && util.nil(byName.description)) {
                        if (util.nil(obj.message) || (util.isString(obj.message) && util.isString(obj.description) && obj.description.length > obj.message.length && obj.message.trim().length == 0)) {
                            byName.message = obj.description;
                            propertyLines.unshift("\"message\": " + util._serializeToString(obj.description));
                        }
                        else
                            propertyLines.unshift("\"description\": " + util._serializeToString(obj.description));
                    }

                    if (!util.nil(obj.message) && util.nil(byName.message))
                        propertyLines.unshift("\"message\": " + util._serializeToString(obj.message));
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
                            return "[" + newLineString + elements.map(function(e) { return util.indentText(e); }).join(newLineString) + newLineString + "]";
                        return "{" + newLineString + "\t\"className\": " + JSON.stringify(className) + "," + newLineString + "\t\"type\": " + JSON.stringify(type) + "," + newLineString +
                            "\t\"elements\": [" + newLineString + elements.map(function(e) { return util.indentText(e, "\t\t"); }).join(newLineString) + newLineString + "]" + newLineString + ", \t\"properties\": {}" + newLineString + "}";
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
                if (!util.defined(e))
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
        let lines = [];
        for (n in obj) {
            let v = obj[n];
            if (!util.defined(v))
                lines.push(JSON.stringify(n) + ": undefined");
            else if (v === null)
                lines.push(n + ((typeof(v) == "number") ? ": NaN" : ": null"));
            else if (typeof(v) == "number")
                lines.push(JSON.stringify(n) + ": " + ((isNaN(v)) ? "NaN" : JSON.stringify(v, undefined, "\t")));
            else if (typeof(v.toJSON) == "function" || typeof(v) == "boolean" || typeof(v) == "string" ||
                    typeof(v) == "object")
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
}