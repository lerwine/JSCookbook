import { IErrorLike } from "./IErrorLike";
export declare class ErrorInfo implements IErrorLike {
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
    constructor(value?: Error | IErrorLike | string, isWarning?: boolean);
    static asErrorInfo(value: any): ErrorInfo | null;
}
