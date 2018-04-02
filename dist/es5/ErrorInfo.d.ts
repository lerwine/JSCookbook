declare namespace TypeUtil {
    class ErrorInfo implements IErrorLike {
        private _isWarning;
        private _message;
        private _description?;
        private _name;
        private _number?;
        private _fileName?;
        private _lineNumber?;
        private _columnNumber?;
        private _stack?;
        private _innerError?;
        isWarning: boolean;
        message: string;
        description: string;
        name: string;
        number: number;
        fileName: string;
        lineNumber: number;
        columnNumber: number;
        stack: string;
        innerError: ErrorInfo;
        metaData: {
            [k: string]: any;
        } | null;
        constructor(value?: string | any[] | {
            [k: string]: any;
        } | null, isWarning?: boolean);
        static asErrorInfo(value: ErrorInfo | string | any[] | {
            [k: string]: any;
        } | null): ErrorInfo | null;
    }
}
