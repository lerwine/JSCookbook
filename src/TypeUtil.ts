export namespace TypeUtil {
    export interface AnyFunction { (...args: any[]): any; }

    export interface AnyConstructor<T> { new(...args: any[]): T; };

    let newLineString: string = "\n";
    let whitespaceRegex: RegExp = /^\s*$/;
    let trimEndRegex: RegExp = /^(\s*\S+(\s+\S+)*)/;
    let lineSplitRegex: RegExp = /\r\n?|\n/g;
    let boolRegex: RegExp = /^(?:(t(?:rue)?|y(?:es)?|[+-]?(?:0*[1-9]\d*(?:\.\d+)?|0+\.0*[1-9]\d*)|\+)|(f(?:alse)?|no?|[+-]?0+(?:\.0+)?|-))$/i;
    let ucFirstRegex: RegExp = /^([^a-zA-Z\d]*[a-z])(.+)?$/g;
    let abnormalWhitespaceRegex = /( |(?=[^ ]))\s+/g;

    /**
     * Indicates whether a value is defined.
     * @param value Value to test.
     * @returns {boolean} True if the value is defined; otherwise, false if it is undefined. This also returns true if the value is null.
     */
    export function defined(value?: any) : boolean { return typeof(value) !== "undefined"; }

    /**
     * Tests whether a value is an object.
     * @param value Value to test.
     * @returns {boolean} True if the value's type is "object" and it is not null; otherwise false.
     */
    export function isObjectType(value?: any) : value is object { return typeof(value) === "object" && value !== null; }

    /**
     * Tests whether a value is an object and is not an array.
     * @param value Value to test.
     * @returns {boolean} True if the value's type is "object", it is not null and it is not an array; otherwise false.
     */
    export function isNonArrayObject(value: any) : value is { [key: string]: any } { return typeof(value) == "object" && value !== null && !Array.isArray(value); }

    /**
     * Tests whether a value is a string
     * @param value Value to test.
     * @returns {boolean} True if the value is a string; otherwise, false.
     */
    export function isString(value?: any) : value is string { return typeof(value) === "string"; }
    
    /**
     * Tests whether a value is a function.
     * @param value Value to test.
     * @returns {boolean} True if the value is a function; otherwise, false.
     */
    export function isFunction(value?: any) : value is AnyFunction { return typeof(value) === "function"; }

    /**
     * Tests whether a value is a boolean type.
     * @param value Value to test.
     * @returns {boolean} True if the value is boolean; otherwise, false.
     */
    export function isBoolean(value?: any) : value is boolean { return typeof(value) === "boolean"; }
    
    /**
     * Tests whether a value is a number type.
     * @param value Value to test.
     * @returns {boolean} True if the value is a number and is not NaN; otherwise, false.
     */
    export function isNumber(value?: any) : value is number { return typeof(value) === "number" && !isNaN(value); }

    /**
     * Tests whether a value is undefined or null.
     * @param value Value to test.
     * @returns {boolean} True if the value is undefined or null; othwerise, false.
     */
    export function nil(value?: any) : value is undefined|null { return !defined(value) || value === null; }
    
    /**
     * Tests whether a string is undefined, null or empty.
     * @param value String to test.
     * @returns {boolean} True if the value is undefined, null or empty; otherwise, false.
     */
    export function isNilOrEmptyString(value?: string|null) : boolean { return nil(value) || (isString(value) && value.length == 0); }

    /**
     * Tests whether a string is undefined, null, empty or contains only whitespace characters.
     * @param value String to test.
     * @returns {boolean} True if the value is undefined, null, empty or contains only whitespace characters; otherwise, false.
     */
    export function isNilOrWhitespace(value?: string|null) : boolean { return nil(value) || (isString(value) && whitespaceRegex.test(value)); }

    /**
     * Convert a value to a string.
     * @param value Value to convert.
     * @param {string|null} [defaultValue] Default value to return if the value was undefined, null or if it converts to an empty string. If this is not defined, then an undefined value is returned when the value was undefined or null.
     * @param {boolean} [ignoreWhitespace] If true, and the converted value contains only whitespace, then it is treated as though it was converted to an empty string by returning the default value.
     * @returns {string|null=} Value converted to a string.
     * @description     If the value is converted to an empty string, and the default value is null, then a null value will be returned.
     * If an array is passed, then the 'join' method is called with a newline character as the parameter.
     * Otherwise, this method first attempts to call the value's "valueOf" function it is an object type, then it comply calls the "toString" method to convert it to a string.
     */
    export function asString(value: any, defaultValue? : string|null, ignoreWhitespace? : boolean) : string {
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
        let s: string;
        if (!isString(value))
            s = (Array.isArray(value)) ? value.join(newLineString) : (function() {
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
                    } catch (e) { }
                }
                try {
                    let s = value.toString();
                    if (isString(s))
                        return s;
                } catch (e) { }
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
    
    /**
     * Convert a value to a string with normalized whitespace.
     * @param value Value to convert.
     * @param {string|null} [defaultValue] Default value to return if the value was undefined, null or if it converts to an empty string. If this is not defined, then an undefined value is returned when the value was undefined or null.
     * @returns {string|null=} Value converted to a string.
     * @description     If the value is converted to an empty string, and the default value is null, then a null value will be returned.
     * If an array is passed, then the 'join' method is called with a newline character as the parameter.
     * Otherwise, this method first attempts to call the value's "valueOf" function it is an object type, then it comply calls the "toString" method to convert it to a string.
     */
    export function asNormalizedString(value: any, defaultValue?: string) {
        value = asString(value, defaultValue, true).trim();
        if (nil(value) || value.length == 0)
            return value;
        return value.replace(abnormalWhitespaceRegex, ' ');
    }

    /**
     * Trims trailing whitespace from the end of a string.
     * @param {string} text Text to trim.
     * @returns {string} String with trailing whitespace removed.
     */
    export function trimEnd(text : string) : string {
        text = asString(text, "");
        let m = trimEndRegex.exec(text);
        if (nil(m))
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
    export function asNumber(value: any, defaultValue? : number) : number {
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
        let n : number = null;
        if (typeof(value) !== "number") {
            if (isObjectType(value) && isFunction(value.valueOf)) {
                try {
                    let i = value.valueOf();
                    if (isNumber(i))
                        return i;
                    if (!nil(i))
                        value = i;
                } catch (e) { }
            }
            if (isBoolean(value))
                return (value) ? 1 : 0;
            value = asString(value, "").trim();
            n = (value.length == 0) ? NaN : parseFloat(value);
        } else
            n = value;
        
        if (isNaN(n) && !nil(defaultValue))
            return asNumber(defaultValue);
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
    export function asInteger(value: any, defaultValue? : number) : number {
        let v: number = asNumber(value, defaultValue);
        if (nil(v) || isNaN(v) || Number.isInteger(v))
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
    export function asBoolean(value: any, defaultValue? : boolean) : boolean {
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
        if (isObjectType(value) && isFunction(value.valueOf)) {
            try {
                let n = value.valueOf();
                if (isNumber(n))
                    return n != 0;
                if (isBoolean(value))
                    return value;
                if (!nil(n))
                    value = n;
            } catch (e) { }
        }
        let mg = boolRegex.exec(asString(value, "").trim());
        if (nil(mg))
            return asBoolean(defaultValue);
        return nil(mg[2]);
    }

    /**
     * Converts a value to an array.
     * @param value Value to convert.
     * @description If given value is an array, it is simply returned. If it is not defined, then an empty array is returned. Otherwise, the given value is returned within a single-element array.
     */
    export function asArray(value: any) : any[] {
        if (!defined(value))
            return [];
        if (Array.isArray(value))
            return value;
        return [value];
    }

    /**
     * Gets the name of a value's constructor function.
     * @param value Value from which to retrieve the constructor class name.
     * @returns {string} The first named constructor function in the prototype inheritance chain or the value's type if a named constructor could not be found.
     */
    export function getClassName(value: any) : string {
        if (!defined(value))
            return "undefined";
        if (value === null)
            return "null";
        let prototype, constructor;
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
        let basePrototype = Object.getPrototypeOf(prototype);
        if (nil(basePrototype)) {
            if (isString(prototype.name) && prototype.name.length > 0)
                return prototype.name;
            if (isString(value.name) && value.name.length > 0)
                return value.name;
            return typeof(value);
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

    /**
     * Gets ordered list of named constructor functions in the value's prototype inheritance chain.
     * @param value Value from which to extract the inheritance chain.
     * @returns {string[]} An array of string values with the first element being the first named constructor function in the value's inherited prototypes.
     */
    export function getInheritanceChain(value: any) : string[] {
        if (!defined(value))
            return ["undefined"];
        if (value === null)
            return ["null"];
        let prototype, constructor;
        if (isFunction(value)) {
            constructor = value;
            prototype = value.prototype;
        } else {
            prototype = Object.getPrototypeOf(value);
            constructor = prototype.constructor;
            while (!isFunction(constructor)) {
                prototype = Object.getPrototypeOf(prototype);
                if (nil(prototype))
                    return [typeof(value)];
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
            return [typeof(value)];
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
        
        return [typeof(value)];
    }

    /**
     * Searches the value's inherited prototype chain for a constructor function.
     * @param value Value to test.
     * @param {AnyFunction} classConstructor Constructor function to look for.
     * @returns {boolean} True if the value is determined to inherit from the specified class; otherwise false.
     */
    export function derivesFrom<T>(value: any, classConstructor : AnyConstructor<T>) : value is T {
        if (!defined(value))
            return !defined(classConstructor);
        if (!defined(classConstructor))
            return false;
        if (value === null)
            return classConstructor === null;
        let classProto;
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
            
        let valueProto, valueConstructor;
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

    /**
     * Gets extended type string for a value.
     * @param value Value to determine type.
     * @returns {string} Value's type. If the value is null, then "null" is returned. If it is NaN, then "NaN" is returned.
     * Otherwise, the type and class name, separated by a space, is returned. If the class name could not be determined, then just the object type is returned.
     */
    export function typeOfExt(value: any) : string {
        let t = typeof(value);
        if (t == "object") {
            if (value === null)
                return "null";
        } else if (t != "function") {
            if (t == "number" && isNaN(value))
                return "NaN";
            return t;
        }
    
        let n = getClassName(value);
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
    export function indentText(text : string|string[], indent? : string, skipLineCount? : number) : string {
        let arr : string[], joinedText : string;
        if (nil(text) || !isObjectType(text) || !Array.isArray(text))
            text = this.asString(text, "");
        if (typeof(text) != "string") {
            arr = text;
            if (arr.length == 0)
                return "";
            if (arr.length == 1)
                joinedText = asString(arr[0], "");
            else
                joinedText = arr.join(newLineString);
        } else
            joinedText = asString(text, "");
        if (joinedText.length == 0)
            return joinedText;
        indent = asString(indent, "\t");
        skipLineCount = asInteger(skipLineCount, 0);
        arr = joinedText.split(lineSplitRegex).map(function(s) { return trimEnd(s); });
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
    
    function _serializeToString(obj: any) : string {
        if (!defined(obj))
            return "undefined";
        if (obj === null)
            return "null";
        let type = typeof(obj);
        if (type == "number")
            return (isNaN(obj)) ? "NaN" : JSON.stringify(obj);
        if (type == "boolean" || type == "string")
            return JSON.stringify(obj);
        let className = getClassName(obj);
        if (typeof(obj.toJSON) != "function") {
            if (type == "object")
            {
                if (derivesFrom(obj, Error)) {
                    var e: {[k: string]: any} = obj;
                    var jObj: {[k: string]: any} = {};
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
                    } else if (!nil(e.description))
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
                    var arr : any[] = obj;
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

    /**
     * Serializes an object and its properties in a JSON-like representation.
     * @param obj Object to serialize.
     * @returns {string} Object converted to a JSON-like representation.
     */
    export function serializeToString(obj: any) : string {
        if (!defined(obj))
            return "undefined";
        if (obj === null)
            return "null";
        let type = typeof(obj);
        if (type == "number")
            return (isNaN(obj)) ? "NaN" : JSON.stringify(obj);
        if (type == "boolean" || type == "string")
            return JSON.stringify(obj);
        let className = getClassName(obj);
        let n;
        if (typeof(obj.toJSON) != "function") {
            if (type == "object") {
                let elements : string[] = [];
                let propertyLines : string[] = [];
                let byName: {[k: string]: any} = {};
                if (Array.isArray(obj)) {
                    elements = obj.map(function(e) { return serializeToString(e); });
                    for (n in obj) {
                        let i = asNumber(n, null);
                        let v: any = obj[n];
                        if ((!nil(i) && n !== "length") || i < 0 || i > obj.length) {
                            byName[n] = serializeToString(obj[n]);
                            propertyLines.push(JSON.stringify(n) + ": " + serializeToString(obj[n]));
                        }
                    }
                } else {
                    for (n in obj) {
                        if (n !== "length") {
                            byName[n] = serializeToString(obj[n]);
                            propertyLines.push(JSON.stringify(n) + ": " + serializeToString(obj[n]));
                        }
                    }
                }
                if (derivesFrom<{[k: string]: any}>(obj, Error)) {
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
                            return "[" + newLineString + elements.map(function(e) { return indentText(e); }).join(newLineString) + newLineString + "]";
                        return "{" + newLineString + "\t\"className\": " + JSON.stringify(className) + "," + newLineString + "\t\"type\": " + JSON.stringify(type) + "," + newLineString +
                            "\t\"elements\": [" + newLineString + elements.map(function(e) { return indentText(e, "\t\t"); }).join(newLineString) + newLineString + "]" + newLineString + ", \t\"properties\": {}" + newLineString + "}";
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
                s.split(/\r\n?|\n/).map(function(l: string) { return "\t" + l; }).join(newLineString);
            }).join(",") + newLineString + newLineString + "]";
        }
        let lines = [];
        for (n in obj) {
            let v = obj[n];
            if (!defined(v))
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
    
    /**
     * Represents an object which may contain properties similar to Error objects.
     */
    export interface IErrorLike {
        message?: string;
        description?: string;
        name?: string;
        number?: number;
        fileName?: string;
        lineNumber?: number;
        columnNumber?: number;
        stack?: string;
        innerError?: any;
        [key: string]: any;
    }

    /**
     * @class
     * Object which can contain information that represents an error.
     */
    export class ErrorInfo implements IErrorLike {
        private _isWarning: boolean = false;
        private _message: string = "";
        private _description?: string = null;
        private _name: string = "undefined";
        private _number?: number = null;
        private _fileName?: string = null;
        private _lineNumber?: number = null;
        private _columnNumber?: number = null;
        private _stack?: string = null;
        private _innerError?: ErrorInfo = null;

        get isWarning() : boolean { return this._isWarning; }
        set isWarning(value: boolean) { this._isWarning = asBoolean(value, false); }

        get message() : string { return this._message; }
        set message(value: string) { this._message = asString(value, ""); }

        get description() : string { return this._description; }
        set description(value: string) { this._description = asString(value, null); }

        get name() : string { return this._name; }
        set name(value: string) { this._name = asString(value, "undefined"); }

        get number() : number { return this._number; }
        set number(value: number) { this._number = asNumber(value, null); }

        get fileName() : string { return this._fileName; }
        set fileName(value: string) { this._fileName = asString(value, null); }

        get lineNumber() : number { return this._lineNumber; }
        set lineNumber(value: number) { this._lineNumber = asNumber(value, null); }

        get columnNumber() : number { return this._columnNumber; }
        set columnNumber(value: number) { this._columnNumber = asNumber(value, null); }

        get stack() : string { return this._stack; }
        set stack(value: string) { this._stack = asString(value, null); }

        get innerError() : ErrorInfo { return this._innerError; }
        set innerError(value) { this._innerError = ErrorInfo.asErrorInfo(value); }

        metaData: {[k: string]: any}|null = null;

        constructor(value?: string|any[]|{[k: string]: any}|null, isWarning?: boolean) {
            this.isWarning = (typeof(isWarning) == "boolean") && isWarning;

            if (typeof(value) === "undefined")
                return;
            
            this.name = typeof(value);
            if (value === null)
                return;
            
            if (typeof(value) == "string") {
                this.message = value;
                return;
            }

            let foundMetaData = false;
            let metaData: {[k: string]: any} = {};
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
            } else {
                let message: string|null = null;
                let description: string|null = null;
                let name: string|null = null;
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
                    } else
                        this.message = message;
                } else if (description != null)
                    this.message = description;
                if (name == null)
                    name = typeof(value);
            }

            if (foundMetaData)
                this.metaData = metaData;
        }

        static asErrorInfo(value: ErrorInfo|string|any[]|{[k: string]: any}|null) : ErrorInfo|null {
            if (!defined(value))
                return null;
            
            if (derivesFrom<ErrorInfo>(value, ErrorInfo))
                return value;

            return new ErrorInfo(value);
        }
    }
}