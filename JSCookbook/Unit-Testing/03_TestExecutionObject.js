JsUnitTesting.TestExecutionObject.prototype = new JsUnitTesting.TestExecutionObject();
JsUnitTesting.TestExecutionObject.prototype.constructor = JsUnitTesting.TestExecutionObject;
JsUnitTesting.TestExecutionObject.prototype.testName = '';
JsUnitTesting.TestExecutionObject.prototype.testCollectionName = '';
JsUnitTesting.TestExecutionObject.prototype.context = {};
JsUnitTesting.TestExecutionObject.prototype.collectionContext = {};
JsUnitTesting.TestExecutionObject.prototype.assert = new JsUnitTesting.Assert();

JsUnitTesting.Assert.prototype.__testExecutionContext__ = new JsUnitTesting.TestExecutionObject();
