JsUnitTesting = {
    Utility: {
        /**
        * Describe function
        * @param {Array} arrayObj (Required) Describe parameter
        * @param {Object} value (Optional, default = undefined) Describe parameter
        * @return {Number}	Describe return value
        */
        arrayIndexOf: function (arrayObj, value) {
            var result = new Array();

            for (var i = 0; i < arrayObj.length; i++) {
                if (arrayObj[i] === value)
                    return i;
            }

            return -1;
        },

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
            this.number = JsUnitTesting.Utility.convertToNumber(number, 0);
            this.message = JsUnitTesting.Utility.convertToString(description, "Unexpected Error");
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
        if (arguments.length == 0)
            return;

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
        if (arguments.length == 0)
            return;

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
        if (arguments.length == 0)
            return;

        if (typeof (testFunc) != 'function')
            throw 'testFunc must be a function';

        this.__testFunc__ = testFunc;
        this.__name__ = (name === undefined || name === null) ? JsUnitTesting.Utility.getFunctionName(testFunc) : ((typeof (name) == 'string') ? name : String(name));
        this.__order__ = (order === undefined || order === null) ? null : Number(order);
        this.__context__ = testContextObj;
        this.__lastResult__ = undefined;
        if (arguments.length > 5)
            this.setIsSelected(isSelected);
        else
            this.setIsSelected();
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
