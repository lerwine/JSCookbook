declare namespace TypeUtil {
    interface IErrorLike {
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
}
