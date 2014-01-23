JsUnitTesting.UnitTest.prototype = new JsUnitTesting.UnitTest();
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
        if (err instanceof JsUnitTesting.AssertionError) {
            executionError = err;
        }
        else
            executionError = JsUnitTesting.AssertionError.createFromErrorObject(err, this.getName(), (testCollection === undefined || testCollection === null) ? undefined : testCollection.getName());
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
