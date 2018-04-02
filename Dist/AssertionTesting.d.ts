import { TypeUtil as typeUtil } from './TypeUtil';
export declare namespace AssertionTesting {
    enum ResultStatusValue {
        notEvaluated = -1,
        inconclusive = 0,
        pass = 1,
        fail = 2,
        error = 3,
    }
    function isIResultStatus(value: any): value is IResultStatus;
    interface IResultStatus {
        statusValue: ResultStatusValue;
        message: string;
    }
    class AssertionError extends Error {
        private _isInconclusive;
        readonly isInconclusive: boolean;
        constructor(message: string, isInconclusive?: boolean);
    }
    function inconclusive(message: string): void;
    function fail(message: string): void;
    function areEqual(expected: any, actual: any, message?: string): void;
    function areAlike(expected: any, actual: any, message?: string): void;
    function areNotEqual(expected: any, actual: any, message?: string): void;
    function areNotAlike(expected: any, actual: any, message?: string): void;
    class ResultStatus implements IResultStatus {
        private _statusValue;
        private _rawValue;
        private _message;
        private _type;
        statusValue: ResultStatusValue;
        rawValue: number;
        message: string;
        readonly type: string;
        constructor(value?: number, message?: string);
        static asStatusValue(value: number): ResultStatusValue;
        static getType(value: number): string;
        static getTitle(value: number): string;
    }
    class TestResult {
        private _status;
        private _testId;
        private _testIndex;
        private _dataIndex;
        private _description;
        private _error;
        readonly status: ResultStatus;
        readonly testId: string;
        readonly testIndex: number | null;
        readonly dataIndex: number | null;
        readonly description: string;
        readonly error: typeUtil.ErrorInfo | null;
        constructor(value?: string | TestDefinition, error?: typeUtil.ErrorInfo | null, status?: ResultStatus | ResultStatusValue | number | null, testIndex?: number | null, dataIndex?: number | null);
    }
    interface TestInvocationInfo {
        test: {
            id: string;
            lastResult: ResultStatus;
            index?: number | null;
            description?: string | null;
        };
        iteration: {
            index?: number | null;
            description?: string | null;
            metaData?: {
                [key: string]: any;
            };
        };
        result?: string | ResultStatusValue | number | typeUtil.ErrorInfo | Error | {
            message?: string | null;
            status?: ResultStatusValue | number | null;
            error?: typeUtil.ErrorInfo | null;
        } | null;
    }
    interface MethodSettings {
        callback: TestMethod;
        description?: string;
    }
    interface IterationSettings {
        args: any[];
        description?: string;
        metaData?: {
            [key: string]: any;
        };
    }
    interface TestMethod {
        (args: any[], testInfo: TestInvocationInfo): any;
    }
    class TestDefinition {
        private _testId;
        private _description;
        private _testMethod;
        private _iterations;
        private _lastResult;
        readonly testId: string;
        description: string;
        iterations: IterationSettings[];
        readonly lastResult: ResultStatus;
        constructor(testId: string, testMethod: MethodSettings | TestMethod, iteration?: IterationSettings[] | IterationSettings);
        invoke(testIndex?: number | null, thisObj?: {
            [key: string]: any;
        }): ResultStatusValue;
    }
}
