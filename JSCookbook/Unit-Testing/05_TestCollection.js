JsUnitTesting.TestCollection.prototype = new JsUnitTesting.TestCollection();
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
    return this.__contextObject__;
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

    var orderedTests = JsUnitTesting.Utility.mapArray(this.__items__, function (item) {
        return { arrayOrder: this.getNextIndex(), item: item };
    }, orderContext);

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
        var ut = orderedTests[i].item;
        if (runAllTests || ut.getIsSelected())
            results.push(ut.execTestFunc(this));
    }

    return results;
};
