var JsUnitTesting = JsUnitTesting || {};

JsUnitTesting.Assert = function(testContext) {
	if (testContext === undefined || testContext === null || typeof(testContext) !== 'object' || !(testContext instanceof JsUnitTesting.TestContext))
		throw 'First argument must be of type JsUnitTesting.TestContext.';
		
	this.__testContext__ = testContext;
};
JsUnitTesting.Assert.ErrorNumbers = new Array('indeterminate', 'fail', 'isUndefined', 'isDefined', 'isNull', 'isNotNull', 'isNullOrUndefined', 'isNotNullAndDefined', 'isNotANumber', 'isANumber', 'isString', 'isNotString',
	'isEmpty', 'isNotEmpty', 'isInstanceOf', 'areEqual', 'areNotEqual', 'isLessThan', 'isGreaterThan', 'isNotLessThan', 'isNotGreaterThan');

JsUnitTesting.Assert.prototype.__throw__ = function(name, description, errObj) {
	throw new JsUnitTesting.AssertionError(JsUnitTesting.Assert.ErrorNumbers.indexOf(name), description, this.__testContext__.getTestName(), this.__testContext__.getCollectionName(), errorObj);
};
JsUnitTesting.Assert.prototype.indeterminate = function(description, errObj) {
	this.__throw__('indeterminate', description, errorObj);
};
JsUnitTesting.Assert.prototype.fail = function(description, errorObj) {
	this.__throw__('fail', description, errorObj);
};
JsUnitTesting.Assert.prototype.isUndefined = function(actualValue, failMessage) {
	if (actualValue !== undefined)
		this.__throw__('isUndefined', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is defined"));
};
JsUnitTesting.Assert.prototype.isDefined = function(actualValue, failMessage) {
	if (actualValue === undefined)
		this.__throw__('isDefined', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is not defined"));
};
JsUnitTesting.Assert.prototype.isNull = function(actualValue, failMessage) {
	if (actualValue !== null)
		this.__throw__('isNull', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is not null"));
};
JsUnitTesting.Assert.prototype.isNotNull = function(actualValue, failMessage) {
	if (actualValue === null)
		this.__throw__('isNotNull', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is null"));
};
JsUnitTesting.Assert.prototype.isNullOrUndefined = function(actualValue, failMessage) {
	if (actualValue !== undefined || actualValue !== null)
		this.__throw__('isNullOrUndefined', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is not null or undefined"));
};
JsUnitTesting.Assert.prototype.isNotNullAndDefined = function(actualValue, failMessage) {
	if (actualValue === null)
		this.__throw__('isNotNullAndDefined', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is null or undefined"));
};
JsUnitTesting.Assert.prototype.isNotANumber = function(actualValue, failMessage) {
	if (!isNan(actualValue))
		this.__throw__('isNotANumber', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is a number"));
};
JsUnitTesting.Assert.prototype.isANumber = function(actualValue, failMessage) {
	if (isNan(actualValue))
		this.__throw__('isANumber', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is  not a number"));
};
JsUnitTesting.Assert.prototype.isString = function(actualValue, failMessage) {
	if (typeof(actualValue) != 'string')
		this.__throw__('isString', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is not a string type"));
};
JsUnitTesting.Assert.prototype.isNotString = function(actualValue, failMessage) {
	if (typeof(actualValue) == 'string')
		this.__throw__('isString', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is a string type"));
};
JsUnitTesting.Assert.prototype.isEmpty = function(actualValue, failMessage, trimValue) {
	var success;
	try {
		if (actualValue === undefined || actualValue === null)
			success = true;
		else {
			var s = (typeof(expectedClass) != 'string') ? actualValue : String(actualValue);
			success = (((trimValue) ? JsUnitTesting.Utility.trimString(s) : s).length == 0);
		}
	} catch (err) {
		JsUnitTesting.Assert.prototype.indeterminate("Unable to convert" + typeof(actualValue) + " to a string.", err);
	}
	
	if (!success)
		this.__throw__('isEmpty', JsUnitTesting.Utility.convertToString(failMessage, "Actual is not empty"));
};
JsUnitTesting.Assert.prototype.isNotEmpty = function(actualValue, failMessage, trimValue) {
	var success;
	try {
		if (actualValue === undefined || actualValue === null)
			success = false;
		else {
			var s = (typeof(expectedClass) != 'string') ? actualValue : String(actualValue);
			success = (((trimValue) ? JsUnitTesting.Utility.trimString(s) : s).length != 0);
		}
	} catch (err) {
		JsUnitTesting.Assert.prototype.indeterminate("Unable to convert" + typeof(actualValue) + " to a string.", err);
	}
	
	if (!success)
		this.__throw__('isNotEmpty', JsUnitTesting.Utility.convertToString(failMessage, "Actual is empty"));
};
JsUnitTesting.Assert.prototype.isInstanceOf = function(expectedClass, actualValue, failMessage) {
	var success;
	try {
		if (typeof(expectedClass) != 'function')
			throw "First parameter must be a class (function)";
		
		success = (typeof(actualValue) == 'object' && actualValue instanceof expectedClass);
	} catch (err) {
		JsUnitTesting.Assert.prototype.indeterminate("Unable to determine if expected type " + typeof(expectedValue) + " is equal to actual type " + typeof(actualValue) + ".", err);
	}
	
	if (!success)
		this.__throw__('areEqual', JsUnitTesting.Utility.convertToString(failMessage, "Actual value does not match the expected value"));
};
JsUnitTesting.Assert.prototype.areEqual = function(expectedValue, actualValue, failMessage) {
	var success;
	try {
		success = (expectedValue == actualValue);
	} catch (err) {
		JsUnitTesting.Assert.prototype.indeterminate("Unable to determine if expected type " + typeof(expectedValue) + " is equal to actual type " + typeof(actualValue) + ".", err);
	}
	
	if (!success)
		this.__throw__('areEqual', JsUnitTesting.Utility.convertToString(failMessage, "Actual value does not match the expected value"));
};
JsUnitTesting.Assert.prototype.areNotEqual = function(expectedValue, actualValue, failMessage) {
	var success;
	try {
		success = (expectedValue != actualValue);
	} catch (err) {
		JsUnitTesting.Assert.prototype.indeterminate("Unable to determine if expected type " + typeof(expectedValue) + " is equal to actual type " + typeof(actualValue) + ".", err);
	}
	
	if (!success)
		this.__throw__('areNotEqual', JsUnitTesting.Utility.convertToString(failMessage, "Actual value matches the expected value"));
};
JsUnitTesting.Assert.prototype.isLessThan = function(maxExclusiveValue, actualValue, failMessage) {
	var success;
	try {
		success = (actualValue < maxExclusiveValue);
	} catch (err) {
		JsUnitTesting.Assert.prototype.indeterminate("Unable to compare maximum exclusive type " + typeof(maxExclusiveValue) + " to actual type " + typeof(actualValue) + ".", err);
	}
	
	if (!success)
		this.__throw__('isLessThan', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is not less than the maximum exclusive value"));
};
JsUnitTesting.Assert.prototype.isGreaterThan = function(minExclusiveValue, actualValue, failMessage) {
	var success;
	try {
		success = (actualValue > minExclusiveValue);
	} catch (err) {
		JsUnitTesting.Assert.prototype.indeterminate("Unable to compare minimum exclusive type " + typeof(minExclusiveValue) + " to actual type " + typeof(actualValue) + ".", err);
	}
	
	if (!success)
		this.__throw__('isGreaterThan', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is not greater than the minimum exclusive value"));
};
JsUnitTesting.Assert.prototype.isNotLessThan = function(minInclusiveValue, actualValue, failMessage) {
	var success;
	try {
		success = (actualValue >= minInclusiveValue);
	} catch (err) {
		JsUnitTesting.Assert.prototype.indeterminate("Unable to compare minimum inclusive type " + typeof(minInclusiveValue) + " to actual type " + typeof(actualValue) + ".", err);
	}
	
	if (!success)
		this.__throw__('isNotLessThan', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is less than the minimum inclusive value"));
};
JsUnitTesting.Assert.prototype.isNotGreaterThan = function(maxInclusiveValue, actualValue, failMessage) {
	var success;
	try {
		success = (actualValue <= maxInclusiveValue);
	} catch (err) {
		JsUnitTesting.Assert.prototype.indeterminate("Unable to compare maximum inclusive type " + typeof(maxInclusiveValue) + " to actual type " + typeof(actualValue) + ".", err);
	}
	
	if (!success)
		this.__throw__('isNotGreaterThan', JsUnitTesting.Utility.convertToString(failMessage, "Actual value is greater than the maximum inclusive value"));
};
