var JsUnitTesting = JsUnitTesting || {};
 
/**
 * @classDescription	Represents an error with an optional inner error
 * @param {Number} number	An error number
 * @param {String} description	Text describing error
 * @param {Object} innerError	Inner error
 * @constructor
 */
JsUnitTesting.AssertionError = function(number, description, unitTest, testCollection, innerError) {
	var vDescription;
	Error.call(this, JsUnitTesting.Utility.convertToNumber(number, JsUnitTesting.AssertionError.prototype.number), JsUnitTesting.Utility.convertToString(description, "Unexpected Error");
	this.__innerError__ = innerError;
	if (unitTest === null || unitTest === undefined)
		this.__unitTest__ = undefined;
	else {
		if (typeof(unitTest
}
JsUnitTesting.AssertionError.prototype = new Error();
JsUnitTesting.AssertionError.prototype.constructor = JsUnitTesting.AssertionError;

/**
 * Get inner error
 * @return {object}	Returns inner error object
 */
JsUnitTesting.AssertionError.prototype.getInnerError = function() {
	return this.__innerError__;
};

/**
 * Get associated unit test
 * @return {JsUnitTesting.UnitTest}	Returns associated unit test
 */
JsUnitTesting.AssertionError.prototype.getUnitTest = function() {
	return this.__unitTest__;
};
