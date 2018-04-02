var TypeUtil;
(function (TypeUtil) {
    var ErrorInfo = (function () {
        function ErrorInfo(value, isWarning) {
            this._isWarning = false;
            this._message = "";
            this._description = null;
            this._name = "undefined";
            this._number = null;
            this._fileName = null;
            this._lineNumber = null;
            this._columnNumber = null;
            this._stack = null;
            this._innerError = null;
            this.metaData = null;
            this.isWarning = (typeof (isWarning) == "boolean") && isWarning;
            if (typeof (value) === "undefined")
                return;
            this.name = typeof (value);
            if (value === null)
                return;
            if (typeof (value) == "string") {
                this.message = value;
                return;
            }
            var foundMetaData = false;
            var metaData = {};
            if (Array.isArray(value)) {
                this.message = TypeUtil.asString(value, "");
                for (var n in value) {
                    if (n == "length")
                        continue;
                    var i = TypeUtil.asNumber(n, null);
                    if (TypeUtil.nil(i) || i < 0 || i >= value.length) {
                        foundMetaData = true;
                        metaData[n] = value[n];
                    }
                }
            }
            else {
                var message = null;
                var description = null;
                var name = null;
                for (var n in value) {
                    switch (n) {
                        case "length":
                            break;
                        case "message":
                            message = TypeUtil.asString(value.message, "");
                            break;
                        case "description":
                            description = TypeUtil.asString(value.description, null);
                            break;
                        case "name":
                            name = TypeUtil.asString(value.name, null);
                            break;
                        case "number":
                            this.number = TypeUtil.asNumber(value.number, null);
                            break;
                        case "fileName":
                            this.fileName = TypeUtil.asString(value.description, null);
                            break;
                        case "lineNumber":
                            this.lineNumber = TypeUtil.asNumber(value.lineNumber, null);
                            break;
                        case "columnNumber":
                            this.columnNumber = TypeUtil.asNumber(value.columnNumber, null);
                            break;
                        case "stack":
                            this.stack = TypeUtil.asString(value.stack, null);
                            break;
                        case "innerError":
                            this.innerError = ErrorInfo.asErrorInfo(value);
                            break;
                        default:
                            foundMetaData = true;
                            metaData[n] = value[n];
                            break;
                    }
                }
                if (message !== null) {
                    if (description != null) {
                        if (message.trim().length == 0 && description !== null && (description.length > message.length || description.trim().length > 0))
                            this.message = description;
                        else {
                            this.message = message;
                            this.description = description;
                        }
                    }
                    else
                        this.message = message;
                }
                else if (description != null)
                    this.message = description;
                if (name == null)
                    name = typeof (value);
            }
            if (foundMetaData)
                this.metaData = metaData;
        }
        Object.defineProperty(ErrorInfo.prototype, "isWarning", {
            get: function () { return this._isWarning; },
            set: function (value) { this._isWarning = TypeUtil.asBoolean(value, false); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ErrorInfo.prototype, "message", {
            get: function () { return this._message; },
            set: function (value) { this._message = TypeUtil.asString(value, ""); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ErrorInfo.prototype, "description", {
            get: function () { return this._description; },
            set: function (value) { this._description = TypeUtil.asString(value, null); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ErrorInfo.prototype, "name", {
            get: function () { return this._name; },
            set: function (value) { this._name = TypeUtil.asString(value, "undefined"); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ErrorInfo.prototype, "number", {
            get: function () { return this._number; },
            set: function (value) { this._number = TypeUtil.asNumber(value, null); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ErrorInfo.prototype, "fileName", {
            get: function () { return this._fileName; },
            set: function (value) { this._fileName = TypeUtil.asString(value, null); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ErrorInfo.prototype, "lineNumber", {
            get: function () { return this._lineNumber; },
            set: function (value) { this._lineNumber = TypeUtil.asNumber(value, null); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ErrorInfo.prototype, "columnNumber", {
            get: function () { return this._columnNumber; },
            set: function (value) { this._columnNumber = TypeUtil.asNumber(value, null); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ErrorInfo.prototype, "stack", {
            get: function () { return this._stack; },
            set: function (value) { this._stack = TypeUtil.asString(value, null); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ErrorInfo.prototype, "innerError", {
            get: function () { return this._innerError; },
            set: function (value) { this._innerError = ErrorInfo.asErrorInfo(value); },
            enumerable: true,
            configurable: true
        });
        ErrorInfo.asErrorInfo = function (value) {
            if (!TypeUtil.defined(value))
                return null;
            if (TypeUtil.derivesFrom(value, ErrorInfo))
                return value;
            return new ErrorInfo(value);
        };
        return ErrorInfo;
    }());
    TypeUtil.ErrorInfo = ErrorInfo;
})(TypeUtil || (TypeUtil = {}));
//# sourceMappingURL=ErrorInfo.js.map