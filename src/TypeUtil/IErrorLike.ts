/**
 * Represents an object which may contain properties similar to Error objects.
 */
export interface IErrorLike {
    message?: string;
    description?: string;
    name?: string;
    number?: number;
    fileName?: string;
    lineNumber?: number;
    columnNumber?: number;
    stack?: string;
    innerError?: any;
    [key: string]: any;
}