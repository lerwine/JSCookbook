/**
 * @classDescription	Represents an error finding a property or value based upon a name or index
 * @param {Number} errNumber	An error number
 * @param {String} descriptionText	Text describing error
 * @param {Object} keyOrIndex	Key or index which was not found
 * @param {String} ctxFormatString	Copy of formatted string in which error occurred
 * @param {Number} ctxPosition	Position at which which error occurred
 * @param {Object} innerErrorObj	Inner error
 * @constructor
 */
function KeyNotFoundError(errNumber, descriptionText, keyOrIndex, ctxFormatString, ctxPosition, innerError) {
	FormatError.call(this, errNumber, (descriptionText === undefined) ? "Key or Index Not Found" : descriptionText, ctxFormatString, ctxPosition, innerError)
	this.key = keyOrIndex;
}
KeyNotFoundError.prototype = new FormatError();
KeyNotFoundError.prototype.constructor = KeyNotFoundError;