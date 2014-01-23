var JsUnitTesting = JsUnitTesting || {};

/**
 * @classDescription	A single unit test to be performed
 * @param {function} testFunc	Required. Function to be executed as the test
 * @param {string} name	Optional. Name of unit test
 * @param {object} testContextObj	Optional. Test-specific context object
 * @remarks	When 'testFunc' is called, a JsUnitTesting.TestContext object is passed as the only parameter.
 *	The JsUnitTesting.TestContext object contains a property which holds the testContextObj value as well as the context object (if any) defined by the test collection.
 * @constructor
 */
 JsUnitTesting.UnitTest = function(testFunc, name, order, testContextObj, isSelected) {
	if (typeof(testFunc) != 'function')
		throw 'testFunc must be a function';
		
	this.__testFunc__ = testFunc;
	this.__name__ = (name === undefined || name === null) ? JsUnitTesting.Utility.getFunctionName(testFunc) : ((typeof(name) == 'string') ? name : String(name));
	this.__order__ = (order === undefined) ? null : order;
	this.__context__ = testContextObj;
	this.__lastResult__ = undefined;
	this.setIsSelected(isSelected);
};
JsUnitTesting.UnitTest.prototype =  new JsUnitTesting.UnitTest();
JsUnitTesting.UnitTest.prototype.constructor =  JsUnitTesting.UnitTest;

JsUnitTesting.UnitTest.prototype.compareTo = function(unitTestObj) {
	if (typeof(unitTestObj) != 'object' || !(unitTestObj instanceof  JsUnitTesting.UnitTest) || this.getOrder() < unitTestObj.getOrder())
		return -1;
	
	return (this.getOrder() > unitTestObj.getOrder()) ? 1 : 0;
};

JsUnitTesting.UnitTest.prototype.getLastResult = function() {
	return this.__lastResult__;
};

JsUnitTesting.UnitTest.prototype.setLastResult = function(testContextObj) {
	
};

JsUnitTesting.UnitTest.prototype.getIsSelected = function() {
	return this.__selected__;
};

JsUnitTesting.UnitTest.prototype.setIsSelected = function(isSelected) {
	this.__selected__ = (isSelected === undefined || isSelected) ? true : false;
};

JsUnitTesting.UnitTest.prototype.toString = function() {
	// TODO: If unit test has been executed, return string output of results;
	return this.getName();
};
JsUnitTesting.UnitTest.prototype.valueOf = function() {
	return this.getName();
};

/**
 * Execute unit test
 * @return {JsUnitTesting.TestContext}	Returns result of unit test
 */
JsUnitTesting.UnitTest.prototype.execTestFunc = function(testCollection) {
	var tc = JsUnitTesting.Utility.ensureInstanceOf(testCollection, JJsUnitTesting.TestCollection, true, function(obj, errorObj) {
		JsUnitTesting.Assert.Fail = function("Only items of type 'JsUnitTesting.TestCollection' passed to this method.", this, undefined, errorObj);
	});
	
	this.__lastResult__ = new JsUnitTesting.TestContext(this, testCollection);
	this.__lastResult__.setStarted();
	try {
		this.__testFunc__(this.__lastResult__);
		this.__lastResult__.setCompleted();
	} catch (e) {
		this.__lastResult__.setCompleted();
		this.__lastResult__.setSuccess(false);
		this.__lastResult__.setError(e);
	}
	
	this.setIsSelected(!this.__lastResult__.getSuccess());
	
	return this.__lastResult__;
};

/**
 * Get execution order of unit test
 * @return {String}	Returns execution order of unit test
 */
JsUnitTesting.UnitTest.prototype.getOrder = function() {
	return this.__order__;
};

/**
 * Get name of unit test
 * @return {String}	Returns name of unit test
 */
JsUnitTesting.UnitTest.prototype.getName = function() {
	return this.__name__;
};

/**
 * Get name of unit test
 * @return {String}	Returns name of unit test
 */
JsUnitTesting.UnitTest.prototype.getContextObject = function() {
	return this.__context__;
};
