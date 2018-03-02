/**
 * @classDescription	Represents an error with an optional inner error
 * @param {Number} errNumber	An error number
 * @param {String} descriptionText	Text describing error
 * @param {Object} innerErrorObj	Inner error
 * @constructor
 */
function NestedError(errNumber, descriptionText, innerErrorObj) {
	Error.call(this, (errNumber === undefined) ? NestedError.prototype.number : errNumber, (descriptionText === undefined) ? "Unexpected Error" : descriptionText);
	this.innerError = innerErrorObj;
}
NestedError.prototype = new Error();
NestedError.prototype.constructor = NestedError;