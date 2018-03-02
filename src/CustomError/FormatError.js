/**
 * @classDescription	Represents a formatting error
 * @param {Number} errNumber	An error number
 * @param {String} descriptionText	Text describing error
 * @param {String} ctxFormatString	Copy of formatted string in which error occurred
 * @param {Number} ctxPosition	Position at which which error occurred
 * @param {Object} innerErrorObj	Inner error
 * @constructor
 */
function FormatError(errNumber, descriptionText, ctxFormatString, ctxPosition, innerError) {
	NestedError.call(this, errNumber, (descriptionText === undefined) ? "Format Error" : descriptionText, innerError);
	this.formatString = ctxFormatString;
	this.position = ctxPosition;
}
FormatError.prototype = new NestedError();
FormatError.prototype.constructor = FormatError;