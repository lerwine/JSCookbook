namespace TypeUtil {
    /**
     * @class
     * Object which can contain information that represents an error.
     */
    export class ErrorInfo implements IErrorLike {
        private _isWarning: boolean = false;
        private _message: string = "";
        private _description?: string = null;
        private _name: string = "undefined";
        private _number?: number = null;
        private _fileName?: string = null;
        private _lineNumber?: number = null;
        private _columnNumber?: number = null;
        private _stack?: string = null;
        private _innerError?: ErrorInfo = null;

        get isWarning() : boolean { return this._isWarning; }
        set isWarning(value: boolean) { this._isWarning = asBoolean(value, false); }

        get message() : string { return this._message; }
        set message(value: string) { this._message = asString(value, ""); }

        get description() : string { return this._description; }
        set description(value: string) { this._description = asString(value, null); }

        get name() : string { return this._name; }
        set name(value: string) { this._name = asString(value, "undefined"); }

        get number() : number { return this._number; }
        set number(value: number) { this._number = asNumber(value, null); }

        get fileName() : string { return this._fileName; }
        set fileName(value: string) { this._fileName = asString(value, null); }

        get lineNumber() : number { return this._lineNumber; }
        set lineNumber(value: number) { this._lineNumber = asNumber(value, null); }

        get columnNumber() : number { return this._columnNumber; }
        set columnNumber(value: number) { this._columnNumber = asNumber(value, null); }

        get stack() : string { return this._stack; }
        set stack(value: string) { this._stack = asString(value, null); }

        get innerError() : ErrorInfo { return this._innerError; }
        set innerError(value) { this._innerError = ErrorInfo.asErrorInfo(value); }

        metaData: {[k: string]: any}|null = null;

        constructor(value?: string|any[]|{[k: string]: any}|null, isWarning?: boolean) {
            this.isWarning = (typeof(isWarning) == "boolean") && isWarning;

            if (typeof(value) === "undefined")
                return;
            
            this.name = typeof(value);
            if (value === null)
                return;
            
            if (typeof(value) == "string") {
                this.message = value;
                return;
            }

            let foundMetaData = false;
            let metaData: {[k: string]: any} = {};
            if (Array.isArray(value)) {
                this.message = asString(value, "");
                for (var n in value) {
                    if (n == "length")
                        continue;
                    var i = asNumber(n, null);
                    if (nil(i) || i < 0 || i >= value.length) {
                        foundMetaData = true;
                        metaData[n] = value[n];
                    }
                }
            } else {
                let message: string|null = null;
                let description: string|null = null;
                let name: string|null = null;
                for (var n in value) {
                    switch (n) {
                        case "length":
                            break;
                        case "message":
                            message = asString(value.message, "");
                            break;
                        case "description":
                            description = asString(value.description, null);
                            break;
                        case "name":
                            name = asString(value.name, null);
                            break;
                        case "number":
                            this.number = asNumber(value.number, null);
                            break;
                        case "fileName":
                            this.fileName = asString(value.description, null);
                            break;
                        case "lineNumber":
                            this.lineNumber = asNumber(value.lineNumber, null);
                            break;
                        case "columnNumber":
                            this.columnNumber = asNumber(value.columnNumber, null);
                            break;
                        case "stack":
                            this.stack = asString(value.stack, null);
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
                    } else
                        this.message = message;
                } else if (description != null)
                    this.message = description;
                if (name == null)
                    name = typeof(value);
            }

            if (foundMetaData)
                this.metaData = metaData;
        }

        static asErrorInfo(value: ErrorInfo|string|any[]|{[k: string]: any}|null) : ErrorInfo|null {
            if (!defined(value))
                return null;
            
            if (derivesFrom<ErrorInfo>(value, ErrorInfo))
                return value;

            return new ErrorInfo(value);
        }
    }
}