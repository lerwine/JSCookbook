JsUnitTesting = {
    Utility: {
        /**
        * Describe function
        * @param {Array} arrayObj (Required) Describe parameter
        * @param {Function} callback (Required) Describe parameter
        * @param {Object} thisArg (Optional, default = undefined) Describe parameter
        * @return {Array}	Describe return value
        */
        mapArray: function (arrayObj, callback, thisArg) {
            var result = new Array();

            for (var i = 0; i < arrayObj.length; i++) {
                if (thisArg !== undefined)
                    result.push(callback.call(thisArg, arrayObj[i] /* currentValue */));
                else
                    result.push(callback(arrayObj[i] /* currentValue */));
            }

            return result;
        },

        /**
        * Describe function
        * @param {Array} arrayObj (Required) Describe parameter
        * @param {Function} callback (Required) Describe parameter
        * @param {Object} thisArg (Optional, default = undefined) Describe parameter
        * @return {Array}	Describe return value
        */
        filterArray: function (arrayObj, callback, thisArg) {
            var result = new Array();

            for (var i = 0; i < arrayObj.length; i++) {
                if ((thisArg === undefined) ? callback(arrayObj[i]) : callback.call(thisArg, arrayObj[i]))
                    result.push(arrayObj[i]);
            }

            return result;
        },

        /**
        * Describe function
        * @param {Array} arrayObj (Required) Describe parameter
        * @param {Function} callback (Required) Describe parameter
        * @param {Object} initialValue (Optional, default = undefined) Describe parameter
        * @return {Object}	Describe return value
        */
        reduceArray: function (arrayObj, callback, initialValue) {
            var previousValue = initialValue;
            for (var i = 0; i < arrayObj.length; i++)
                previousValue = callback(previousValue, arrayObj[i] /* currentValue */, i /* index */, arrayObj /* array */);

            return previousValue;
        },

        /**
        * Describe function
        * @param {Object} value (Required) Describe parameter
        * @param {String} defaultValue (Optional, default = undefined) Describe parameter
        * @return {String}	Describe return value
        */
        convertToString: function (value, defaultValue) {
            if (value === undefined || value === null) {
                if (defaultValue === undefined)
                    return value;

                return JsUnitTesting.Utility.convertToString(defaultValue);
            }

            var result;
            switch (typeof (value)) {
                case 'string':
                    result = value;
                    break;
                case 'number':
                case 'boolean':
                    result = value.toString();
                    break;
                case 'object':
                    if (value instanceof Array)
                        return JsUnitTesting.Utility.reduceArray(value, function (previousValue, currentValue) {
                            return previousValue + JsUnitTesting.Utility.convertToString(currentValue);
                        }, '');

                    if (value instanceof Error)
                        result = value.message;
                    else {
                        try {
                            result = value.toString();
                        } catch (e) {
                            try {
                                result = String(value);
                            } catch (err) {
                                throw 'Object cannot be converted to a string value';
                            }
                        }
                    }
                    break;
                default:
                    try {
                        result = String(value);
                    } catch (err) {
                        try {
                            result = value.toString();
                        } catch (err) {
                            throw 'Type ' + typeof (value) + ' cannot be converted to a string value';
                        }
                    }
                    break;
            }

            return ((result === undefined || result === null) ? JsUnitTesting.Utility.convertToString(strDefaultValue) : ((typeof (result) == 'string') ? result : String(value)));
        },

        /**
        * Describe function
        * @param {Object} value (Required) Describe parameter
        * @return {String}	Describe return value
        */
        trimString: function (value) {
            var s = JsUnitTesting.Utility.convertToString(value, undefined);
            if (s === undefined)
                return value;

            return s.replace(/^\s+/, '').replace(/\s+$/, '');
        },

        /**
        * Describe function
        * @param {Object} value (Required) Describe parameter
        * @param {Number} defaultValue (Optional, default = undefined) Describe parameter
        * @return {Number}	Describe return value
        */
        convertToNumber: function (value, defaultValue) {
            if (value === undefined || value === null) {
                if (defaultValue === undefined)
                    return value;

                return JsUnitTesting.Utility.convertToNumber(defaultValue);
            }

            return (typeof (value) == 'number') ? value : Number(value);
        },

        /**
        * Describe function
        * @param {Object} obj (Required) Describe parameter
        * @param {Function} typeObj (Required) Describe parameter
        * @param {Boolean} allowNullOrUndefined (Optional, default = false) Describe parameter
        * @param {Function} onValidationFailFunc (Optional, default = undefined) Describe parameter
        * @param {Object} thisArg (Optional, default = undefined) Describe parameter
        * @return {Object}	Describe return value
        */
        ensureInstanceOf: function (obj, typeObj, allowNullOrUndefined, onValidationFailFunc, thisArg) {
            var result = obj;

            var errorObj = undefined;

            if (obj === undefined || obj === null) {
                if (allowNullOrUndefined)
                    return undefined;
            } else {
                try {
                    if (obj instanceof typeObj)
                        errorObj = null;
                } catch (e) {
                    errorObj = e;
                }
            }

            if (errorObj === null)
                return result;

            if (onValidationFailFunc !== undefined)
                result = (thisArg === undefined) ? onValidationFailFunc(result, errorObj) : onValidationFailFunc.call(thisArg, result, errorObj);

            return result;
        },

        /**
        * Describe function
        * @param {Object} obj (Required) Describe parameter
        * @param {Function} callback (Optional, default = undefined) Describe parameter
        * @param {Object} thisArg (Optional, default = undefined) Describe parameter
        * @return {Array}	Describe return value
        */
        mapObjectToArray: function (obj, callback, thisArg) {
            var result = new Array();

            for (var propertyName in obj) {
                if (thisArg !== undefined)
                    result.push(callback.call(thisArg, obj[propertyName] /* currentValue */, propertyName));
                else
                    result.push(callback(obj[propertyName] /* currentValue */, propertyName));
            }

            return result;
        },

        /**
        * Describe function
        * @param {Object} obj (Required) Describe parameter
        * @param {Function} callback (Optional, default = undefined) Describe parameter
        * @param {Object} initialValue (Optional, default = undefined) Describe parameter
        * @param {Object} thisArg (Optional, default = undefined) Describe parameter
        * @return {Object}	Describe return value
        */
        reduceObject: function (obj, callback, initialValue, thisArg) {
            var previousValue = initialValue;
            if (obj === undefined || obj === null)
                return initialValue;

            previousValue = initialValue;

            for (var propertyName in obj) {
                if (thisArg !== undefined)
                    previousValue = callback.call(thiArg, previousValue, obj[propertyName] /* currentValue */, propertyName, obj);
                else
                    previousValue = callback(previousValue, obj[propertyName] /* currentValue */, propertyName, obj);
            }

            return previousValue;
        },

        /**
        * Describe function
        * @param {Boolean} paramName (Required/Optional, default = undefined) Describe parameter
        * @return {Object}	Describe return value
        */
        getFunctionName: function (func) {
            if (obj === null || object === undefined || !(typeof obj == 'function'))
                throw 'func is not a function';

            var re = /^function\s+([^(]+)/i;
            var r = re.exec(func.toString());
            if (r != null)
                return r[1];

            return null;
        }
    },

    /**
 * @classDescription	Describe class
 * @param {Number}	number (Optional) Describe parameter
 * @param {String}	description (Optional) Describe parameter
 * @param {String}	unitTestName (Optional) Describe parameter
 * @param {String}	testCollectionName (Optional) Describe parameter
 * @param {Object}	innerError (Optional) Describe parameter
 * @constructor
 */
 AssertionError: function (number, description, unitTestName, testCollectionName, innerError) {
        var initError = undefined;
        try {
            Error.call(this, JsUnitTesting.Utility.convertToNumber(number, JsUnitTesting.AssertionError.prototype.number),
                JsUnitTesting.Utility.convertToString(description, "Unexpected Error"));
        } catch (err) {
            initError = err;
        }
        if (initError === undefined) {
            try {
                this.__testCollectionName__ = JsUnitTesting.Utility.convertToString(testCollectionName);
            } catch (err) {
                initError = err;
            }
            try {
                this.__unitTestName__ = JsUnitTesting.Utility.convertToString(unitTestName);
            } catch (err) {
                initError = err;
            }

            if (initError === undefined) {
                this.__innerError__ = innerError;
                return;
            }
        }
        else
            Error.call(this, JsUnitTesting.AssertionError.prototype.number, "JsUnitTesting.AssertionError object initialization failure");

        this.__innerError__ = JsUnitTesting.AssertionError.createFromErrorObject(initError, this.__unitTestName__, this.__testCollectionName__,
		    new JsUnitTesting.AssertionError((isNan(number)) ? undefined : number, description, this.__unitTestName__, this.__testCollectionName__, innerError));
    },
    
    /**
    * @classDescription	Describe class
    * @param {JsUnitTesting.TestExecutionObject}	testExecutionObject (Required) Describe parameter
    * @constructor
    */
    Assert: function (testExecutionObject) {
        if (testExecutionObject === undefined || testExecutionObject === null || typeof (testExecutionObject) !== 'object' || !(testExecutionObject instanceof JsUnitTesting.TestExecutionObject)) {
            if (arguments.length < 2 || !arguments[1])
                throw 'First argument must be of type JsUnitTesting.TestExecutionObject.';

            if (testExecutionObject === undefined)
                return;
        }

        this.__testExecutionContext__ = testExecutionObject;
    },
    
    /**
    * @classDescription	Describe class
    * @param {JsUnitTesting.UnitTest}	unitTest (Required/Optional, default = undefined) Describe parameter
    * @param {JsUnitTesting.TestCollection}	testCollection (Required/Optional, default = undefined) Describe parameter
    * @constructor
    */
    TestExecutionObject: function (unitTest, testCollection) {
        JsUnitTesting.Utility.ensureInstanceOf(unitTest, JsUnitTesting.UnitTest, false, function (obj, errorObj) {
            this.assert.fail("Only items of type 'JsUnitTesting.UnitTest' passed to this method as the first argument.", errorObj);
        }, this);

        var tc = JsUnitTesting.Utility.ensureInstanceOf(testCollection, JsUnitTesting.TestCollection, true, function (obj, errorObj) {
            this.assert.fail("Only items of type 'JsUnitTesting.TestCollection' passed to this method as the second argument.", errorObj);
        });

        this.testName = unitTest.getName();
        this.context = unitTest.getContextObject();
        if (tc === undefined) {
            this.testCollectionName = undefined;
            this.collectionContext = undefined;
        } else {
            this.testCollectionName = tc.getName();
            this.collectionContext = tc.getContextObject();
        }
        this.assert = new JsUnitTesting.Assert(this);
    },

    /**
    * @classDescription	Describe class
    * @param {Function}	testFunc (Required) Describe parameter
    * @param {String}	name (Optional, default = '') Describe parameter
    * @param {Number}	order (Required/Optional, default = null) Describe parameter
    * @param {Object}	testContextObj (Optional, default = undefined) Describe parameter
    * @param {Boolean}	isSelected (Optional, default = true) Describe parameter
    * @constructor
    */
    UnitTest: function (testFunc, name, order, testContextObj, isSelected) {
        if (typeof (testFunc) != 'function')
            throw 'testFunc must be a function';

        this.__testFunc__ = testFunc;
        this.__name__ = (name === undefined || name === null) ? JsUnitTesting.Utility.getFunctionName(testFunc) : ((typeof (name) == 'string') ? name : String(name));
        this.__order__ = (order === undefined || order === null) ? null : Number(order);
        this.__context__ = testContextObj;
        this.__lastResult__ = undefined;
        this.setIsSelected(isSelected);
    },

    /**
    * @classDescription	Describe class
    * @param {String}	name (Optional, default = '') Describe parameter
    * @param {Object}	testCollectionContextObj (Optional, default = undefined) Describe parameter
    * @constructor
    */
    TestCollection: function (name, testCollectionContextObj) {
        this.__name__ = JsUnitTesting.Utility.convertToString(name, '');
        this.__contextObject__ = testCollectionContextObj;
        this.__items__ = new Array();
    },

    /**
    * @classDescription	Describe class
    * @param {JsUnitTesting.UnitTest}	unitTest (Required) Describe parameter
    * @param {String}	testCollectionName (Optional, default = '') Describe parameter
    * @param {Date}	started (Required) Describe parameter
    * @param {Date}	completed (Required) Describe parameter
    * @param {Boolean}	success (Required) Describe parameter
    * @param {JsUnitTesting.AssertionError}	executionError (Optional) Describe parameter
    * @param {Object}	testOutput (Optional) Describe parameter
    * @constructor
    */
    TestResult: function (unitTest, testCollectionName, started, completed, success, executionError, testOutput) {
        this.__unitTest__ = unitTest;
        this.__testCollectionName__ = JsUnitTesting.Utility.convertToString(testCollectionName, '');
        this.__started__ = started;
        this.__completed__ = completed;
        this.__success__ = success;
        this.__executionError__ = executionError;
        this.__testOutput__ = testOutput;
    }
};

JsUnitTesting.AssertionError.prototype = new Error();
JsUnitTesting.AssertionError.prototype.constructor = JsUnitTesting.AssertionError;
JsUnitTesting.AssertionError.prototype.__testCollectionName__ = '';
JsUnitTesting.AssertionError.prototype.__unitTestName__ = '';
JsUnitTesting.AssertionError.prototype.__innerError__ = new Error();

/**
 * Describe function
 * @param {Object}	errObj (Optional) Describe parameter
 * @param {String}	unitTestName (Optional) Describe parameter
 * @param {String}	testCollectionName (Optional) Describe parameter
 * @param {Object}	innerError (Optional) Describe parameter
 * @return {JsUnitTesting.AssertionError}	Describe return value
 */
JsUnitTesting.AssertionError.createFromErrorObject = function (errObj, unitTestName, testCollectionName, innerError) {
    if (errObj === null || errObj === undefined)
        return new JsUnitTesting.AssertionError(undefined, undefined, unitTestName, testCollectionName, innerError);

    if (typeof (errObj) == 'object' && errObj instanceof Error)
        return new JsUnitTesting.AssertionError(errObj.number, errObj.message, unitTestName, testCollectionName, innerError);

    var message;
    try {
        message = JsUnitTesting.Utility.convertToString(errObj);
    } catch (err) {
        message = String(err);
    }
    return new JsUnitTesting.AssertionError(undefined, message, unitTestName, testCollectionName, innerError);
};

/**
 * Describe function
 * @return {Object}	Describe return value
 */
sUnitTesting.AssertionError.prototype.getInnerError = function () { return this.__innerError__; };

/**
 * Describe function
 * @return {String}	Describe return value
 */
JsUnitTesting.AssertionError.prototype.getUnitTestName = function () { return this.__unitTestName__; };

/**
 * Describe function
 * @return {String}	Describe return value
 */
JsUnitTesting.AssertionError.prototype.getTestCollectionName = function () { return this.__testCollectionName__; };

/**
 * Describe function
 * @return {string}	Describe return value
 */
JsUnitTesting.AssertionError.prototype.getTableHtml = function () {
	var getRowHtml = function(headingHtml, value, valueIsHtml) {
		var result = '<tr><td';
		if (JsUnitTesting.TestResult.headingCellClassName !== undefined)
			result += ' class="' + JsUnitTesting.TestResult.headingCellClassName + '"';
		result += '>' + headingHtml + '</td><td';
		var cellClassName = JsUnitTesting.TestResult.specialContentCellClassName;
		var content;
		if (valueIsHtml)
			content = value;
		else {
			if (value === undefined)
				content = "(undefined)";
			else if (value === null)
				content = "(null)";
			else {
				try {
					var s = JsUnitTesting.Utility.convertToString(value, '');
					if (JsUnitTesting.Utility.trimString(s).length == 0)
						content = "&nbsp;";
					else
						content = JsUnitTesting.TestResult.encodeHTML(s);
					cellClassName = JsUnitTesting.TestResult.normalContentCellClassName;
				} catch (err) {
					content = "(could not be displayed)";
				}
				
				if (cellClassName !== undefined)
					htmlTableCellElement.className = cellClassName;
			}
		}
			
		
		if (cellClassName !== undefined)
			result += ' class="' + cellClassName + '"';
		
		return result + '>' + content + '</td></tr>';
	};
	
    var table = '<table';
	if (JsUnitTesting.TestResult.errorTableClassName !== undefined)
		table += ' class="' + JsUnitTesting.TestResult.errorTableClassName + '"';
	table += '>' + getRowHtml("Number:", this.number) + getRowHtml("Message:", this.message);
	if (this.stack !== undefined)
		table += getRowHtml("Stack Trace:", String(this.stack));
	var e = this.getInnerError();
	if (e !== null && e !== undefined) {
		if (typeof(e) == 'object') {
			if (e instanceof JsUnitTesting.AssertionError)
				table += getRowHtml("Inner Error:", e.getHtmlTable());
			else if (e instanceof Error) {
				var innerTable = '<table';
				if (JsUnitTesting.TestResult.errorTableClassName !== undefined)
					innerTable += ' class="' + JsUnitTesting.TestResult.errorTableClassName + '"';
				innerTable += getRowHtml("Number:", e.number);
				innerTable += getRowHtml("Message:", e.message);
				if (e.stack !== undefined)
					innerTable += getRowHtml("Stack Trace:", String(e.stack));
				table += getRowHtml("Inner Error:", innerTable, true);
			} else
				table += getRowHtml("Inner Error:", String(e));
        } else
			table += getRowHtml("Inner Error:", String(e));
	}
	
	return table;
};

JsUnitTesting.Assert.prototype = new JsUnitTesting.Assert();
JsUnitTesting.Assert.prototype.constructor = JsUnitTesting.Assert;

JsUnitTesting.Assert.prototype.__throw__ = function (name, description, errObj) {
    throw new JsUnitTesting.AssertionError(JsUnitTesting.Utility.arrayIndexOf(JsUnitTesting.Assert.ErrorNumbers, name), description, this.__testExecutionContext__.getTestName(), this.__testExecutionContext__.getCollectionName(), errorObj);
};

/**
* Describe function
* @param {String} description (Optional) Describe parameter
* @param {Object} errObj (Optional) Describe parameter
*/
JsUnitTesting.Assert.prototype.indeterminate = function (description, errObj) {
    this.__throw__('indeterminate', description, errorObj);
};

/**
* Describe function
* @param {String} description (Optional) Describe parameter
* @param {Object} errObj (Optional) Describe parameter
*/
JsUnitTesting.Assert.prototype.fail = function (description, errorObj) {
    this.__throw__('fail', description, errorObj);
};

/**
* Describe function
* @param {Object} actualValue (Required) Describe parameter
* @param {String} failMessage (Optional) Describe parameter
*/
JsUnitTesting.Assert.prototype.isUndefined = function (actualValue, failMessage) {
    if (actualValue !== undefined)
        this.__throw__('isUndefined', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is defined"));
};

/**
* Describe function
* @param {Object} actualValue (Required) Describe parameter
* @param {String} failMessage (Optional) Describe parameter
*/
JsUnitTesting.Assert.prototype.isDefined = function (actualValue, failMessage) {
    if (actualValue === undefined)
        this.__throw__('isDefined', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is not defined"));
};

/**
* Describe function
* @param {Object} actualValue (Required) Describe parameter
* @param {String} failMessage (Optional) Describe parameter
*/
JsUnitTesting.Assert.prototype.isNull = function (actualValue, failMessage) {
    if (actualValue !== null)
        this.__throw__('isNull', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is not null"));
};

/**
* Describe function
* @param {Object} actualValue (Required) Describe parameter
* @param {String} failMessage (Optional) Describe parameter
*/
JsUnitTesting.Assert.prototype.isNotNull = function (actualValue, failMessage) {
    if (actualValue === null)
        this.__throw__('isNotNull', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is null"));
};

/**
* Describe function
* @param {Object} actualValue (Required) Describe parameter
* @param {String} failMessage (Optional) Describe parameter
*/
JsUnitTesting.Assert.prototype.isNullOrUndefined = function (actualValue, failMessage) {
    if (actualValue !== undefined || actualValue !== null)
        this.__throw__('isNullOrUndefined', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is not null or undefined"));
};

/**
* Describe function
* @param {Object} actualValue (Required) Describe parameter
* @param {String} failMessage (Optional) Describe parameter
*/
JsUnitTesting.Assert.prototype.isNotNullAndDefined = function (actualValue, failMessage) {
    if (actualValue === null)
        this.__throw__('isNotNullAndDefined', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is null or undefined"));
};

/**
* Describe function
* @param {Object} actualValue (Required) Describe parameter
* @param {String} failMessage (Optional) Describe parameter
*/
JsUnitTesting.Assert.prototype.isNotANumber = function (actualValue, failMessage) {
    if (!isNan(actualValue))
        this.__throw__('isNotANumber', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is a number"));
};

/**
* Describe function
* @param {Object} actualValue (Required) Describe parameter
* @param {String} failMessage (Optional) Describe parameter
*/
JsUnitTesting.Assert.prototype.isANumber = function (actualValue, failMessage) {
    if (isNan(actualValue))
        this.__throw__('isANumber', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is  not a number"));
};

/**
* Describe function
* @param {Object} actualValue (Required) Describe parameter
* @param {String} failMessage (Optional) Describe parameter
*/
JsUnitTesting.Assert.prototype.isString = function (actualValue, failMessage) {
    if (typeof (actualValue) != 'string')
        this.__throw__('isString', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is not a string type"));
};

/**
* Describe function
* @param {Object} actualValue (Required) Describe parameter
* @param {String} failMessage (Optional) Describe parameter
*/
JsUnitTesting.Assert.prototype.isNotString = function (actualValue, failMessage) {
    if (typeof (actualValue) == 'string')
        this.__throw__('isString', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is a string type"));
};

/**
* Describe function
* @param {Object} actualValue (Required) Describe parameter
* @param {String} failMessage (Optional) Describe parameter
* @param {Boolean} trimValue (Optional, default = false) Whether to convert to string and trim the leading and trailing whitespace of the result
*/
JsUnitTesting.Assert.prototype.isEmpty = function (actualValue, failMessage, trimValue) {
    var success;
    try {
        if (actualValue === undefined || actualValue === null)
            success = true;
        else {
            if (typeof (actualValue) == 'object') {
                if (typeof (actualValue.length) != 'number')
                    throw 'Object does not have a "length" property';
                success = (actualValue.length == 0);
            } else {
                var s = (typeof (actualValue) != 'string') ? actualValue : String(actualValue);
                success = (((trimValue) ? JsUnitTesting.Utility.trimString(s) : s).length == 0);
            }
        }
    } catch (err) {
        JsUnitTesting.Assert.prototype.indeterminate("Unable to convert" + typeof (actualValue) + " to a string.", err);
    }

    if (!success)
        this.__throw__('isEmpty', JsUnitTesting.Utility.convertToString(failMessage, "Actual is not empty"));
};

/**
* Describe function
* @param {Object} actualValue (Required) Describe parameter
* @param {String} failMessage (Optional) Describe parameter
* @param {Boolean} trimValue (Optional, default = false) Whether to convert to string and trim the leading and trailing whitespace of the result
*/
JsUnitTesting.Assert.prototype.isNotEmpty = function (actualValue, failMessage, trimValue) {
    var success;
    try {
        if (actualValue === undefined || actualValue === null)
            success = false;
        else {
            if (typeof (actualValue) == 'object') {
                if (typeof (actualValue.length) != 'number')
                    throw 'Object does not have a "length" property';
                success = (actualValue.length != 0);
            } else {
                var s = (typeof (actualValue) != 'string') ? actualValue : String(actualValue);
                success = (((trimValue) ? JsUnitTesting.Utility.trimString(s) : s).length != 0);
            }
        }
    } catch (err) {
        JsUnitTesting.Assert.prototype.indeterminate("Unable to convert" + typeof (actualValue) + " to a string.", err);
    }

    if (!success)
        this.__throw__('isNotEmpty', JsUnitTesting.Utility.convertToString(failMessage, "Actual is empty"));
};

/**
* Describe function
* @param {Function} expectedClass (Required) Describe parameter
* @param {Object} actualValue (Required) Describe parameter
* @param {String} failMessage (Optional) Describe parameter
*/
JsUnitTesting.Assert.prototype.isInstanceOf = function (expectedClass, actualValue, failMessage) {
    var success;
    try {
        if (typeof (expectedClass) != 'function')
            throw "First parameter must be a class (function)";

        success = (typeof (actualValue) == 'object' && actualValue instanceof expectedClass);
    } catch (err) {
        JsUnitTesting.Assert.prototype.indeterminate("Unable to determine if actual type " + typeof (actualValue) + " is an instance type " + JsUnitTesting.Utility.getFunctionName(expectedClass) + ".", err);
    }

    if (!success)
        this.__throw__('isInstanceOf', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is not an instance of the expected type"));
};

/**
* Describe function
* @param {Function} expectedClass (Required) Describe parameter
* @param {Object} actualValue (Required) Describe parameter
* @param {String} failMessage (Optional) Describe parameter
*/
JsUnitTesting.Assert.prototype.isNotInstanceOf = function (expectedClass, actualValue, failMessage) {
    var success;
    try {
        if (typeof (expectedClass) != 'function')
            throw "First parameter must be a class (function)";

        success = (typeof (actualValue) != 'object' || !(actualValue instanceof expectedClass));
    } catch (err) {
        JsUnitTesting.Assert.prototype.indeterminate("Unable to determine if actual type " + typeof (actualValue) + " is an instance type " + JsUnitTesting.Utility.getFunctionName(expectedClass) + ".", err);
    }

    if (!success)
        this.__throw__('isNotInstanceOf', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is an instance of the expected type"));
};

JsUnitTesting.Assert.prototype.__prepareValueForCompare__ = function (value, ignoreCase) {
    if (ignoreCase === undefined || (typeof (value) != 'string' && typeof (value) != 'object'))
        return value;

    var s = (typeof (value) == 'string') ? value : JsUnitTesting.Utility.convertToString(value);

    if (ignoreCase)
        return s.toLowerCase();

    return s;
};

/**
* Describe function
* @param {Object} expectedValue (Required) Describe parameter
* @param {Object} actualValue (Required) Describe parameter
* @param {String} failMessage (Optional) Describe parameter
* @param {Boolean} ignoreCase (Optional, default = false) Describe parameter
*/
JsUnitTesting.Assert.prototype.areEqual = function (expectedValue, actualValue, failMessage, ignoreCase) {
    var success;
    try {
        success = (this.__prepareValueForCompare__(expectedValue, ignoreCase) == this.__prepareValueForCompare__(actualValue, ignoreCase));
    } catch (err) {
        JsUnitTesting.Assert.prototype.indeterminate("Unable to determine if expected type " + typeof (expectedValue) + " is equal to actual type " + typeof (actualValue) + ".", err);
    }

    if (!success)
        this.__throw__('areEqual', JsUnitTesting.Utility.convertToString(failMessage, "Actual value does not match the expected value"));
};

/**
* Describe function
* @param {Object} expectedValue (Required) Describe parameter
* @param {Object} actualValue (Required) Describe parameter
* @param {String} failMessage (Optional) Describe parameter
* @param {Boolean} ignoreCase (Optional, default = false) Describe parameter
*/
JsUnitTesting.Assert.prototype.areNotEqual = function (expectedValue, actualValue, failMessage, ignoreCase) {
    var success;
    try {
        success = (this.__prepareValueForCompare__(expectedValue, ignoreCase) != this.__prepareValueForCompare__(actualValue, ignoreCase));
    } catch (err) {
        JsUnitTesting.Assert.prototype.indeterminate("Unable to determine if expected type " + typeof (expectedValue) + " is equal to actual type " + typeof (actualValue) + ".", err);
    }

    if (!success)
        this.__throw__('areNotEqual', JsUnitTesting.Utility.convertToString(failMessage, "Actual value matches the expected value"));
};

/**
* Describe function
* @param {Object} maxExclusiveValue (Required) Describe parameter
* @param {Object} actualValue (Required) Describe parameter
* @param {String} failMessage (Optional) Describe parameter
* @param {Boolean} ignoreCase (Optional, default = false) Describe parameter
*/
JsUnitTesting.Assert.prototype.isLessThan = function (maxExclusiveValue, actualValue, failMessage, ignoreCase) {
    var success;
    try {
        success = (this.__prepareValueForCompare__(actualValue, ignoreCase) < this.__prepareValueForCompare__(maxExclusiveValue, ignoreCase));
    } catch (err) {
        JsUnitTesting.Assert.prototype.indeterminate("Unable to compare maximum exclusive type " + typeof (maxExclusiveValue) + " to actual type " + typeof (actualValue) + ".", err);
    }

    if (!success)
        this.__throw__('isLessThan', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is not less than the maximum exclusive value"));
};

/**
* Describe function
* @param {Object} minExclusiveValue (Required) Describe parameter
* @param {Object} actualValue (Required) Describe parameter
* @param {String} failMessage (Optional) Describe parameter
* @param {Boolean} ignoreCase (Optional, default = false) Describe parameter
*/
JsUnitTesting.Assert.prototype.isGreaterThan = function (minExclusiveValue, actualValue, failMessage, ignoreCase) {
    var success;
    try {
        success = (this.__prepareValueForCompare__(actualValue, ignoreCase) > this.__prepareValueForCompare__(minExclusiveValue, ignoreCase));
    } catch (err) {
        JsUnitTesting.Assert.prototype.indeterminate("Unable to compare minimum exclusive type " + typeof (minExclusiveValue) + " to actual type " + typeof (actualValue) + ".", err);
    }

    if (!success)
        this.__throw__('isGreaterThan', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is not greater than the minimum exclusive value"));
};

/**
* Describe function
* @param {Object} minInclusiveValue (Required) Describe parameter
* @param {Object} actualValue (Required) Describe parameter
* @param {String} failMessage (Optional) Describe parameter
* @param {Boolean} ignoreCase (Optional, default = false) Describe parameter
*/
JsUnitTesting.Assert.prototype.isNotLessThan = function (minInclusiveValue, actualValue, failMessage, ignoreCase) {
    var success;
    try {
        success = (this.__prepareValueForCompare__(actualValue, ignoreCase) >= this.__prepareValueForCompare__(minInclusiveValue, ignoreCase));
    } catch (err) {
        JsUnitTesting.Assert.prototype.indeterminate("Unable to compare minimum inclusive type " + typeof (minInclusiveValue) + " to actual type " + typeof (actualValue) + ".", err);
    }

    if (!success)
        this.__throw__('isNotLessThan', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is less than the minimum inclusive value"));
};

/**
* Describe function
* @param {Object} maxInclusiveValue (Required) Describe parameter
* @param {Object} actualValue (Required) Describe parameter
* @param {String} failMessage (Optional) Describe parameter
* @param {Boolean} ignoreCase (Optional, default = false) Describe parameter
*/
JsUnitTesting.Assert.prototype.isNotGreaterThan = function (maxInclusiveValue, actualValue, failMessage, ignoreCase) {
    var success;
    try {
        success = (this.__prepareValueForCompare__(actualValue, ignoreCase) <= this.__prepareValueForCompare__(maxInclusiveValue, ignoreCase));
    } catch (err) {
        JsUnitTesting.Assert.prototype.indeterminate("Unable to compare maximum inclusive type " + typeof (maxInclusiveValue) + " to actual type " + typeof (actualValue) + ".", err);
    }

    if (!success)
        this.__throw__('isNotGreaterThan', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is greater than the maximum inclusive value"));
};

JsUnitTesting.TestExecutionObject.prototype = new Object();
JsUnitTesting.TestExecutionObject.prototype.constructor = JsUnitTesting.TestExecutionObject;
JsUnitTesting.TestExecutionObject.prototype.testName = undefined;
JsUnitTesting.TestExecutionObject.prototype.testCollectionName = undefined;
JsUnitTesting.TestExecutionObject.prototype.context = undefined;
JsUnitTesting.TestExecutionObject.prototype.collectionContext = undefined;
JsUnitTesting.TestExecutionObject.prototype.assert = new JsUnitTesting.Assert();
JsUnitTesting.TestExecutionObject.prototype.testName = '';
JsUnitTesting.TestExecutionObject.prototype.testCollectionName = '';
JsUnitTesting.TestExecutionObject.prototype.context = {};
JsUnitTesting.TestExecutionObject.prototype.collectionContext = {};
JsUnitTesting.TestExecutionObject.prototype.assert = new JsUnitTesting.Assert.prototype;

JsUnitTesting.Assert.prototype.__testExecutionContext__ = JsUnitTesting.TestExecutionObject.prototype;

JsUnitTesting.UnitTest.prototype = new Object();
JsUnitTesting.UnitTest.prototype.constructor = JsUnitTesting.UnitTest;
JsUnitTesting.UnitTest.prototype.__testFunc__ = function (unitTest, testCollection) { };
JsUnitTesting.UnitTest.prototype.__name__ = '';
JsUnitTesting.UnitTest.prototype.__order__ = 0;
JsUnitTesting.UnitTest.prototype.__context__ = {};

/**
* Describe function
* @param {JsUnitTesting.UnitTest} paramName (Required) Describe parameter
* @return {Number}	Describe return value
*/
JsUnitTesting.UnitTest.prototype.compareTo = function (unitTest) {
    if (typeof (unitTest) != 'object' || !(unitTest instanceof JsUnitTesting.UnitTest) || this.getOrder() < unitTest.getOrder())
        return -1;

    return (this.getOrder() > unitTest.getOrder()) ? 1 : 0;
};

/**
* Describe function
* @return {JsUnitTesting.TestResult}	Describe return value
*/
JsUnitTesting.UnitTest.prototype.getLastResult = function () {
    return this.__lastResult__;
};

/**
* Describe function
* @param {JsUnitTesting.TestResult} paramName (Optional, default = undefined) Describe parameter
* @return {Object}	Describe return value
*/
JsUnitTesting.UnitTest.prototype.setLastResult = function (testResult) {
    if (testResult === undefined || testResult === null)
        this.__ = undefined;
    else if (testResult instanceof JsUnitTesting.TestResult)
        throw "If first argument is defined, it must be of type 'JsUnitTesting.TestResult'";
    else
        this.__ = testResult;
};

/**
* Describe function
* @return {Boolean}	Describe return value
*/
JsUnitTesting.UnitTest.prototype.getIsSelected = function () {
    return this.__selected__;
};

/**
* Describe function
* @param {Boolean} paramName (Optional, default = true) Describe parameter
*/
JsUnitTesting.UnitTest.prototype.setIsSelected = function (isSelected) {
    this.__selected__ = (arguments.length == 0 || isSelected) ? true : false;
};

/**
* Describe function
* @return {String}	Describe return value
*/
JsUnitTesting.UnitTest.prototype.toString = function () {
    return this.getName();
};

/**
* Describe function
* @return {String}	Describe return value
*/
JsUnitTesting.UnitTest.prototype.valueOf = function () {
    return this.getName();
};

/**
* Describe function
* @param {JsUnitTesting.TestCollection} testCollection (Optional, default = undefined) Describe parameter
* @return {JsUnitTesting.TestResult}	Describe return value
*/
JsUnitTesting.UnitTest.prototype.execTestFunc = function (testCollection) {
    var tc = JsUnitTesting.Utility.ensureInstanceOf(testCollection, JsUnitTesting.TestCollection, true, function (obj, errorObj) {
        this.__context__.assert.fail("Only items of type 'JsUnitTesting.TestCollection' passed to this method.", errorObj);
    }, this);

    var thisArg = new JsUnitTesting.TestExecutionObject(this, testCollection);
    var started = new Date();
    var completed, success, executionError, testOutput;

    try {
        testOutput = this.__testFunc__.call(thisArg, this, testCollection);
        completed = new Date();
        success = true;
    } catch (err) {
        completed = new Date();
        testOutput = undefined;
        success = false;
        if (err instanceof JsUnitTesting.AssertionError)
            executionError = err;
        else
            executionError = JsUnitTesting.AssertionError.createFromErrorObject(errObj, this.getName(), (testCollection === undefined || testCollection === null) ? undefined : testCollection.getName());
    }

    this.setIsSelected(!success);
    this.__lastResult__ = new JsUnitTesting.TestResult(this, testCollection.getName(), started, completed, success, executionError, testOutput);

    return this.__lastResult__;
};

/**
* Describe function
* @return {Number}	Describe return value
*/
JsUnitTesting.UnitTest.prototype.getOrder = function () {
    return this.__order__;
};

/**
* Describe function
* @return {String}	Describe return value
*/
JsUnitTesting.UnitTest.prototype.getName = function () {
    return this.__name__;
};

/**
* Describe function
* @return {Object}	Describe return value
*/
JsUnitTesting.UnitTest.prototype.getContextObject = function () {
    return this.__context__;
};

JsUnitTesting.TestCollection.prototype = new Object();
JsUnitTesting.TestCollection.prototype.constructor = JsUnitTesting.TestCollection;
JsUnitTesting.TestCollection.prototype.__name__ = '';
JsUnitTesting.TestCollection.prototype.__contextObject__ = {};
JsUnitTesting.TestCollection.prototype.__items__ = new Array();

JsUnitTesting.TestCollection.prototype.__ensureItemType__ = function (itemObj) {
    if (itemObj === undefined || itemObj === null || typeof (itemObj) != 'object' || !(itemObj instanceof JsUnitTesting.UnitTest))
        throw "Only items of type 'JsUnitTesting.UnitTest' can be added to a 'JsUnitTesting.TestCollection' object.";
};

/**
* Describe function
* @return {String}	Describe return value
*/
JsUnitTesting.TestCollection.prototype.toString = function () {
    // TODO: If test collection has been executed, return string output of last results;
    return this.getName();
};

/**
* Describe function
* @return {String}	Describe return value
*/
JsUnitTesting.TestCollection.prototype.valueOf = function () {
    return this.getName();
};

JsUnitTesting.TestCollection.prototype.__items__ = new Array();

/**
* Describe function
* @return {String}	Describe return value
*/
JsUnitTesting.TestCollection.prototype.getName = function () {
    return this.__name__;
};

/**
* Describe function
* @return {Object}	Describe return value
*/
JsUnitTesting.TestCollection.prototype.getContextObject = function () {
    return this__contextObject__;
};

/**
* Describe function
* @return {Number}	Describe return value
*/
JsUnitTesting.TestCollection.prototype.getLength = function () {
    return this.__items__.length;
};

/**
* Describe function
* @return {JsUnitTesting.UnitTest}	Describe return value
*/
JsUnitTesting.TestCollection.prototype.pop = function () {
    return this.__items__.pop();
};

/**
* Describe function
* @return {JsUnitTesting.UnitTest}	Describe return value
*/
JsUnitTesting.TestCollection.prototype.shift = function () {
    return this.__items__.shift();
};

/**
* Describe function
* @param {JsUnitTesting.UnitTest} unitTestObj (Required) Describe parameter
*/
JsUnitTesting.TestCollection.prototype.push = function (unitTestObj) {
    this.__ensureItemType__(unitTestObj);
    return this.__items__.push(unitTestObj);
};

/**
* Describe function
* @param {JsUnitTesting.UnitTest} unitTestObj (Required) Describe parameter
*/
JsUnitTesting.TestCollection.prototype.unshift = function (unitTestObj) {
    this.__ensureItemType__(unitTestObj);
    return this.__items__.unshift(unitTestObj);
};

/**
* Describe function
* @param {Number/String} indexOrName (Required) Describe parameter
* @return {JsUnitTesting.UnitTest}	Describe return value
*/
JsUnitTesting.TestCollection.prototype.item = function (indexOrName) {
    if (indexOrName === undefined || indexOrName === null)
        throw "Invalid index or name";

    if (typeof (indexOrName) === 'number') {
        if (indexOrName > -1 && indexOrName < this.__items__.length)
            return this.__items__[indexOrName];
    }

    if (typeof (indexOrName) != 'string')
        return this.item(String(indexOrName), (typeof (indexOrName) === 'number'));

    for (var i = 0; i < this.__items__.length; i++) {
        if (this.__items__[i].getName() == s)
            return this.__items__[i];
    }

    if (isNaN(indexOrName) || arguments[1])
        return undefined;

    return this.item(parseInt(indexOrName), true);
};

/**
* Run tests
* @param {Boolean} runAllTests	(Optional, default = false) Whether to run all tests.
* @return {JsUnitTesting.TestResult}	Returns test results
*/
JsUnitTesting.TestCollection.prototype.runTests = function (runAllTests) {
    var orderContext = {
        index: 0,
        getNextIndex: function () {
            var result = this.index;
            this.index++;
            return result;
        }
    };

    var orderedTests = JsUnitTesting.Utility.mapArray(this.__items__, function (item, orderContext) {
        var result = { arrayOrder: this.getNextIndex(), item: item };
    });

    orderedTests.sort(function (a, b) {
        var r = a.item.compareTo(b.item);
        if (r != 0)
            return r;

        if (a.arrayOrder < b.arrayOrder)
            return -1;

        return (a.arrayOrder > b.arrayOrder) ? 1 : 0;
    });

    var results = new Array();
    for (var i = 0; i < orderedTests.length; i++) {
        var ut = orderedTests[i];
        if (runAllTests || ut.getIsSelected())
            results.push(ut.execTestFunc(this));
    }

    return results;
};

JsUnitTesting.TestResult.prototype = new Object();
JsUnitTesting.TestResult.prototype.constructor = JsUnitTesting.TestResult;
JsUnitTesting.TestResult.prototype.__unitTest__ = JsUnitTesting.UnitTest.prototype;
JsUnitTesting.TestResult.prototype.__testCollectionName__ = '';
JsUnitTesting.TestResult.prototype.__started__ = new Date();
JsUnitTesting.TestResult.prototype.__completed__ = new Date();
JsUnitTesting.TestResult.prototype.__success__ = false;
JsUnitTesting.TestResult.prototype.__executionError__ = JsUnitTesting.AssertionError.prototype;
JsUnitTesting.TestResult.prototype.__testOutput__ = {};

JsUnitTesting.UnitTest.prototype.__lastResult__ = JsUnitTesting.TestResult.prototype;

/**
* Describe function
* @return {JsUnitTesting.UnitTest}	Describe return value
*/
JsUnitTesting.TestResult.prototype.getUnitTest = function () {
    return this.__unitTest__;
};

/**
* Describe function
* @return {String}	Describe return value
*/
JsUnitTesting.TestResult.prototype.getTestCollectionName = function () {
    return this.__testCollectionName__;
};

/**
* Describe function
* @return {Date}	Describe return value
*/
JsUnitTesting.TestResult.prototype.getStarted = function () {
    return this.__started__;
};

/**
* Describe function
* @return {Date}	Describe return value
*/
JsUnitTesting.TestResult.prototype.getCompleted = function () {
    return this.__completed__;
};

/**
* Describe function
* @return {Boolean}	Describe return value
*/
JsUnitTesting.TestResult.prototype.getSuccess = function () {
    return this.__success__;
};

/**
* Describe function
* @return {JsUnitTesting.AssertionError}	Describe return value
*/
JsUnitTesting.TestResult.prototype.getExecutionError = function () {
    return this.__executionError__;
};

/**
* Describe function
* @return {Object}	Describe return value
*/
JsUnitTesting.TestResult.prototype.getTestOutput = function () {
    return this.__testOutput__;
};

JsUnitTesting.TestResult.resultTableClassName = 'results';
JsUnitTesting.TestResult.errorTableClassName = 'error';
JsUnitTesting.TestResult.oddRowClassName = undefined;
JsUnitTesting.TestResult.evenRowClassName = 'altRow';
JsUnitTesting.TestResult.headingCellClassName = 'heading';
JsUnitTesting.TestResult.normalContentCellClassName = undefined;
JsUnitTesting.TestResult.specialContentCellClassName = 'special';
JsUnitTesting.TestResult.encodeHTML = function (value) {
    return JsUnitTesting.Utility.convertToString(value, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
};

/**
* Describe function
* @return {string}	Describe return value
*/
JsUnitTesting.TestResult.prototype.getRowHtml = function (rowNum) {
    var getCellHtml = function (value) {
        var cellClassName = JsUnitTesting.TestResult.specialContentCellClassName;
        var content;
        if (value === undefined)
            content = "(undefined)";
        else if (value === null)
            content = "(null)";
        else {
            try {
                var s = JsUnitTesting.Utility.convertToString(value, '');
                if (JsUnitTesting.Utility.trimString(s).length == 0)
                    content = "&nbsp;";
                else
                    content = JsUnitTesting.TestResult.encodeHTML(s);
                cellClassName = JsUnitTesting.TestResult.normalContentCellClassName;
            } catch (err) {
                content = "(could not be displayed)";
            }

            if (cellClassName !== undefined)
                htmlTableCellElement.className = cellClassName;
        }

        var result = '<td';
        if (cellClassName !== undefined)
            result += ' class="' + cellClassName + '"';

        return result + '>' + content + '</td>';
    };

    var result = '<tr';
    if ((rowNum % 2) == 1) {
        if (JsUnitTesting.TestResult.oddRowClassName !== undefined)
            result += ' class="' + JsUnitTesting.TestResult.oddRowClassName + '"';
    } else if (JsUnitTesting.TestResult.evenRowClassName !== undefined)
        result += ' class="' + JsUnitTesting.TestResult.evenRowClassName + '"';
    result += '>' + getCellHtml(this.__unitTest__.getName()) + getCellHtml((this.__success__) ? "Yes" : "No") + getCellHtml(this.__started__) + '<td';
    if (JsUnitTesting.TestResult.normalContentCellClassName !== undefined)
        result += ' class="' + JsUnitTesting.TestResult.normalContentCellClassName + '"';
    result += '>'
    if (this.__executionError__ !== undefined && this.__executionError__ !== null)
        result += this.__executionError__.getTableHtml();
    else
        result += "&nbsp;";

    return result + '</td>' + getCellHtml(this.__testOutput__) + '</tr>'; ;
};
