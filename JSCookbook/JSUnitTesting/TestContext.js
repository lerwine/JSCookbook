var JsUnitTesting = JsUnitTesting || {};

/**
 * @classDescription	A single unit test to be performed
 * @param {JsUnitTesting.UnitTest} unitTest	Required. Unit test being executed
 * @param {unitTest} testCollection	Optional. Unit test collection being executed
 * @constructor
 */
JsUnitTesting.TestContext = function(unitTest, testCollection) {
	JsUnitTesting.Utility.ensureInstanceOf(unitTest, JJsUnitTesting.UnitTest, false, function(obj, errorObj) {
		JsUnitTesting.Assert.Fail = function("Only items of type 'JsUnitTesting.UnitTest' passed to this method as the first argument.", undefined, undefined, errorObj);
	});
	var tc = JsUnitTesting.Utility.ensureInstanceOf(testCollection, JJsUnitTesting.TestCollection, true, function(obj, errorObj) {
		JsUnitTesting.Assert.Fail = function("Only items of type 'JsUnitTesting.TestCollection' passed to this method as the second argument.", undefined, undefined, errorObj);
	});
	this.__testName__ = unitTest.getName();
	this.__testContext__ = unitTest.getContextObject();
	if (tc === undefined) {
		this.__testCollectionName__ =  undefined;
		this.__testCollectionContext__ = undefined;
	} else {
		this.__testCollectionName__ =  tc.getName();
		this.__testCollectionContext__ = tc.getContextObject();
	}
	this.__started__ = undefined;
	this.__completed__ = undefined;
	this.__error__ = undefined;
	this.__success__ = undefined;
};
JsUnitTesting.TestContext.prototype = new JsUnitTesting.TestContext();
JsUnitTesting.TestContext.prototype.constructor =  JsUnitTesting.TestContext;

/**
 * Get name of unit test
 * @return {String}	Returns name of unit test
 */
JsUnitTesting.TestContext.prototype.getTestName = function() {
	return this.__testName__;
};

/**
 * Get context object associated with unit test
 * @return {Object}	Returns unit test context object
 */
JsUnitTesting.TestContext.prototype.getTestContextObject = function() {
	return this.__testContext__;
};

/**
 * Get name of unit test collection
 * @return {String}	Returns name of unit test collection
 */
JsUnitTesting.TestContext.prototype.getCollectionName = function() {
	return this.__testCollectionName__;
};

/**
 * Get context object associated with unit test collection
 * @return {Object}	Returns unit test collection context object
 */
JsUnitTesting.TestContext.prototype.getCollectionContextObject = function() {
	return this.__testCollectionContext__;
};

/**
 * Get get date and time when unit test started
 * @return {Date}	Returns date and time of start of unit test
 */
JsUnitTesting.TestContext.prototype.getStarted = function() {
	return this.__started__;
};

/**
 * Set get date and time when unit test started to current date/time
 */
JsUnitTesting.TestContext.prototype.setStarted = function() {
	this.__started__ = Date;
	this.__error__ = undefined;
	this.__completed__ = undefined;
	this.__success__ = true;
};

/**
 * Get get date and time when unit test started
 * @return {Date}	Returns date and time of start of unit test
 */
JsUnitTesting.TestContext.prototype.getCompleted = function() {
	return this.__completed__;
};

/**
 * Set get date and time when unit test completed to current date/time
 */
JsUnitTesting.TestContext.prototype.setCompleted = function() {
	this.__completed__ = Date;
};

/**
 * Set get date and time when unit test completed to current date/time
 */
JsUnitTesting.TestContext.prototype.setError = function(errObj) {
	this.__error__ = errObj;
};

/**
 * Get indicator whether the execution was a success
 * @return {Date}	Returns indicator whether the execution was a success
 */
JsUnitTesting.TestContext.prototype.getSuccess = function() {
	return this.__success__;
};

/**
 * Set indicator whether the execution was a success
 */
JsUnitTesting.TestContext.prototype.setSuccess = function(bSuccess) {
	this.__success__ = (bSuccess === undefined || bSuccess === null) ? undefined : ((bSuccess) ? true : false);
};
