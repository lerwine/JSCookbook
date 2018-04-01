"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var ErrorInfo = (function () {
    function ErrorInfo(value, isWarning) {
        this._isWarning = false;
        this._message = "";
        this._description = null;
        this._name = "";
        this._number = null;
        this._fileName = null;
        this._lineNumber = null;
        this._columnNumber = null;
        this._stack = null;
        this._innerError = null;
    }
    Object.defineProperty(ErrorInfo.prototype, "isWarning", {
        get: function () { return this._isWarning; },
        set: function (value) { this._isWarning = util_1.util.asBoolean(value, false); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorInfo.prototype, "message", {
        get: function () { return this._message; },
        set: function (value) { this._message = util_1.util.asString(value, ""); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorInfo.prototype, "description", {
        get: function () { return this._description; },
        set: function (value) { this._description = util_1.util.asString(value, null); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorInfo.prototype, "name", {
        get: function () { return this._name; },
        set: function (value) { this._name = util_1.util.asString(value, ""); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorInfo.prototype, "number", {
        get: function () { return this._number; },
        set: function (value) { this._number = util_1.util.asNumber(value, null); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorInfo.prototype, "fileName", {
        get: function () { return this._fileName; },
        set: function (value) { this._fileName = util_1.util.asString(value, null); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorInfo.prototype, "lineNumber", {
        get: function () { return this._lineNumber; },
        set: function (value) { this._lineNumber = util_1.util.asNumber(value, null); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorInfo.prototype, "columnNumber", {
        get: function () { return this._columnNumber; },
        set: function (value) { this._columnNumber = util_1.util.asNumber(value, null); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorInfo.prototype, "stack", {
        get: function () { return this._stack; },
        set: function (value) { this._stack = util_1.util.asString(value, null); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorInfo.prototype, "innerError", {
        get: function () { return this._innerError; },
        set: function (value) { this._innerError = util_1.util.asString(value, null); },
        enumerable: true,
        configurable: true
    });
    ErrorInfo.asErrorInfo = function (value) {
        if (!util_1.util.defined(value))
            return null;
    };
    return ErrorInfo;
}());
exports.ErrorInfo = ErrorInfo;
//# sourceMappingURL=ErrorInfo.js.map