var JsUnitTesting = JsUnitTesting || {};

/**
 * @classDescription	A single unit test to be performed
 * @param {string} name	Optional. Name of unit test collection
 * @param {object} testCollectionContextObj	Optional. Test collection-specific context object
 * @constructor
 */
JsUnitTesting.TestCollection = function(name, testCollectionContextObj) {
	this.__name__ = JsUnitTesting.Utility.convertToString(name, '');
	this.__contextObject__ = testCollectionContextObj;
	this.__items__ = new Array();
};
JsUnitTesting.TestCollection.prototype =  new JsUnitTesting.TestCollection();
JsUnitTesting.TestCollection.prototype.constructor =  JsUnitTesting.TestCollection;

JsUnitTesting.TestCollection.prototype.__ensureItemType__ = function(itemObj) {
	JsUnitTesting.Utility.ensureInstanceOf(unitTestObj, JsUnitTesting.UnitTest, false, function(itemObj, errorObj) {
		JsUnitTesting.Assert.Fail = function("Only items of type 'JsUnitTesting.UnitTest' can be added to a 'JsUnitTesting.TestCollection' object.", undefined, this, errorObj);
	});
};

JsUnitTesting.TestCollection.prototype.toString = function() {
	// TODO: If test collection has been executed, return string output of last results;
	return this.getName();
};
JsUnitTesting.TestCollection.prototype.valueOf = function() {
	return this.getName();
};

JsUnitTesting.TestCollection.prototype.__items__ = new Array();

/**
 * Get name of test collection
 * @return {String}	Returns name of test collection
 */
JsUnitTesting.TestCollection.prototype.getName = function() {
	return this.__name__;
};

/**
 * Get context object for test collection
 * @return {Object}	Returns context object associated with test collection
 */
JsUnitTesting.TestCollection.prototype.getContextObject = function() {
	return this__contextObject__;
};

/**
 * Get number of unit tests in test collection
 * @return {Number}	Returns length of test collection
 */
JsUnitTesting.TestCollection.prototype.getLength = function() {
	return this.__items__.length;
};

/**
 * Remove and return the last unit test from test collection 
 * @return {JsUnitTesting.UnitTest}	Returns the unit test object at the end of the array
 */
JsUnitTesting.TestCollection.prototype.pop = function() {
	return this.__items__.pop();
};

/**
 * Pull unit test off of a stack whose access is FILO from the start rather than the end 
 * @return {JsUnitTesting.UnitTest}	Returns the unit test object at the start of the array
 */
JsUnitTesting.TestCollection.prototype.shift = function() {
	return this.__items__.shift();
};

/**
 * Pushes unit test onto the end of the test collection like a FILO stack
 * @param {JsUnitTesting.UnitTest} unitTestObj	Object add to end of collection
 */
JsUnitTesting.TestCollection.prototype.push = function(unitTestObj) {
	this.__ensureItemType__(unitTestObj);
	return this.__items__.push(unitTestObj);
};

/**
 * Push unit test onto a stack whose access is FILO from the start rather than the end
 * @param {JsUnitTesting.UnitTest} unitTestObj	Object to remove from the start of collection
 */
JsUnitTesting.TestCollection.prototype.unshift = function(unitTestObj) {
	this.__ensureItemType__(unitTestObj);
	return this.__items__.unshift(unitTestObj);
};

/**
 * Get item by name or index
 * @return {JsUnitTesting.UnitTest}	Returns the unit test at the given index or with the given name
 */
JsUnitTesting.TestCollection.prototype.item = function(indexOrName) {
	if (indexOrName === undefined || indexOrName === null)
		throw "Invalid index or name";
		
	if (typeof(indexOrName) === 'number') {
		if (indexOrName > -1 && indexOrName < this.__items__.length)
			return this.__items__[indexOrName];
	}
	
	if (typeof(indexOrName) != 'string')
		return this.item(String(indexOrName), (typeof(indexOrName) === 'number');
	
	for (var i = 0; i < this.__items__.length; i++) {
		if (this.__items__[i].getName() == s)
			return this.__items__[i];
	}
	
	if (isNaN(indexOrName) || arguments[1])
		return undefined;
	
	return this.item(parseInt(indexOrName), true);
};

/**
 * Runs unit tests
 * @return {Array}	Returns array of JsUnitTesting.TestContext objects representing execution results
 */
JsUnitTesting.TestCollection.prototype.runTests = function(bRunAllTests) {
	var orderContext = {
		index: 0;
		getNextIndex = function () {
			var result = this.index;
			this.index++;
			return result;
		};
	};
	
	var orderedTests = JsUnitTesting.Utility.mapArray(this.__items__, function(item, orderContext) {
		var result = { arrayOrder = this.getNextIndex(), item = item };
	});
	
	orderedTests.sort(function(a, b) {
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
		if (bRunAllTests || ut.getIsSelected())
			results.push(ut.execTestFunc(this));
	}
	
	return results;
};
