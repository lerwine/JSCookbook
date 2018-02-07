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
	Error.prototype.constructor.call(this, JsUnitTesting.Utility.convertToString(description, "Unexpected Error"));
	this.number = JsUnitTesting.Utility.convertToNumber(number, -1);
	this.innerError = innerError;
}
JsUnitTesting.AssertionError.prototype = new Error.prototype;
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
