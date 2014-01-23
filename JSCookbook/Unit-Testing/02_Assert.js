JsUnitTesting.Assert.prototype = new JsUnitTesting.Assert();
JsUnitTesting.Assert.prototype.constructor = JsUnitTesting.Assert;
JsUnitTesting.Assert.ErrorNumbers = new Array('indeterminate', 'fail', 'isundefined', 'isdefined', 'isnull', 'isnotnull', 'isnullorundefined', 'isnotnullanddefined', 'isnotanumber', 'isanumber', 'isstring', 'isnotstring', 'isempty',
    'isnotempty', 'isinstanceof', 'isnotinstanceof', 'areequal', 'arenotequal', 'islessthan', 'isgreaterthan', 'isnotlessthan', 'isnotgreaterthan');

JsUnitTesting.Assert.prototype.__throw__ = function (name, description, errorObj) {
    throw new JsUnitTesting.AssertionError(JsUnitTesting.Utility.arrayIndexOf(JsUnitTesting.Assert.ErrorNumbers, name.toLowerCase()), description, this.__testExecutionContext__.testName, 
        this.__testExecutionContext__.testCollectionName, errorObj);
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
        this.__throw__('isNotString', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is a string type"));
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
