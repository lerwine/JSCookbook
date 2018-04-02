import { TypeUtil as typeUtil } from './TypeUtil';

export namespace AssertionTesting {
    export enum ResultStatusValue {
        notEvaluated = -1,
        inconclusive = 0,
        pass = 1,
        fail = 2,
        error = 3
    }
    
    const NotEvaluated_Value = ResultStatusValue.notEvaluated;
    const NotEvaluated_Type = "notEvaluated";
    const NotEvaluated_Title = "Not Evaluated";
    
    export function isIResultStatus(value: any) : value is IResultStatus {
        return typeUtil.isNonArrayObject(value) && typeUtil.isNumber(value.statusValue) && typeUtil.isString(value.message);
    }
    
    export interface IResultStatus {
        statusValue: ResultStatusValue;
        message: string
    }

    export class AssertionError extends Error {
        private _isInconclusive: boolean = false;
        get isInconclusive(): boolean { return this._isInconclusive; }
        constructor(message: string, isInconclusive?: boolean) {
            super(message);
            if (typeUtil.isBoolean(isInconclusive))
                this._isInconclusive = isInconclusive;
        }
    }

    export function inconclusive(message: string) { throw new AssertionError(message, true);}

    export function fail(message: string) { throw new AssertionError(message); }

    export function areEqual(expected: any, actual: any, message?: string) {
        if (expected === actual)
            return;
        
        if (typeUtil.isNilOrWhitespace(message))
            fail("Expected: " + typeUtil.serializeToString(expected) + "; Actual: " + typeUtil.serializeToString(actual));
            
        fail("Expected: " + typeUtil.serializeToString(expected) + "; Actual: " + typeUtil.serializeToString(actual) + " (" + message + ")");
    }

    export function areAlike(expected: any, actual: any, message?: string) {
        if (expected == actual)
            return;
        
        if (typeUtil.isNilOrWhitespace(message))
            fail("Expected: " + typeUtil.serializeToString(expected) + "; Actual: " + typeUtil.serializeToString(actual));
            
        fail("Expected: " + typeUtil.serializeToString(expected) + "; Actual: " + typeUtil.serializeToString(actual) + " (" + message + ")");
    }

    export function areNotEqual(expected: any, actual: any, message?: string) {
        if (expected !== actual)
            return;
        
        if (typeUtil.isNilOrWhitespace(message))
            fail("Not Expected: " + typeUtil.serializeToString(expected) + "; Actual: " + typeUtil.serializeToString(actual));
            
        fail("Not Expected: " + typeUtil.serializeToString(expected) + "; Actual: " + typeUtil.serializeToString(actual) + " (" + message + ")");
    }

    export function areNotAlike(expected: any, actual: any, message?: string) {
        if (expected != actual)
            return;
        
        if (typeUtil.isNilOrWhitespace(message))
            fail("Not Expected: " + typeUtil.serializeToString(expected) + "; Actual: " + typeUtil.serializeToString(actual));
            
        fail("Not Expected: " + typeUtil.serializeToString(expected) + "; Actual: " + typeUtil.serializeToString(actual) + " (" + message + ")");
    }

    export class ResultStatus implements IResultStatus {
        private _statusValue: ResultStatusValue = NotEvaluated_Value;
        private _rawValue: number = NotEvaluated_Value;
        private _message: string = NotEvaluated_Title;
        private _type: string = NotEvaluated_Type;
    
        get statusValue(): ResultStatusValue { return this._statusValue; }
        
        set statusValue(value: ResultStatusValue) { this.rawValue = ResultStatus.asStatusValue(value); }
    
        get rawValue(): number { return this._rawValue; }
    
        set rawValue(value : number) {
            var oldValue: number = this._statusValue;
            this._rawValue = typeUtil.asNumber(value, NotEvaluated_Value);
            this._statusValue = ResultStatus.asStatusValue(this._rawValue);
            if (this._statusValue == oldValue)
                return;
            this._type = ResultStatus.getType(this._statusValue);
            let m = ResultStatus.getTitle(oldValue);
            if (this._message.trim().toLowerCase() == m)
                this._message = m;
        }
    
        get message(): string { return this._message; }
        
        set message(value: string) {
            this._message = typeUtil.asString(value, "");
            if (this._message.trim().length == 0)
                this._message = ResultStatus.getTitle(this._statusValue);
        }
    
        get type() : string { return this._type; }
    
        constructor(value?: number, message?: string) {
            if (!typeUtil.nil(value))
                this.rawValue = value;
            let m = typeUtil.asString(message, "");
            if (m.trim().length > 0)
                this.message = m;
        }
        
        static asStatusValue(value: number) : ResultStatusValue {
            let v : number = typeUtil.asNumber(value, NotEvaluated_Value);
            switch (v) {
                case ResultStatusValue.inconclusive:
                case ResultStatusValue.pass:
                case ResultStatusValue.fail:
                case ResultStatusValue.error:
                    return v;
            }
            if (v > ResultStatusValue.error)
                return ResultStatusValue.error;
            return ResultStatusValue.notEvaluated;
        }
    
        static getType(value: number) : string {
            switch (ResultStatus.asStatusValue(value)) {
                case ResultStatusValue.inconclusive:
                    return "inconclusive";
                case ResultStatusValue.pass:
                    return "pass";
                case ResultStatusValue.fail:
                    return "fail";
                case ResultStatusValue.error:
                    return "error";
            }
            return NotEvaluated_Type;
        }
        
        static getTitle(value: number) : string {
            switch (ResultStatus.asStatusValue(value)) {
                case ResultStatusValue.inconclusive:
                    return "Inconclusive";
                case ResultStatusValue.pass:
                    return "Passed";
                case ResultStatusValue.fail:
                    return "Failed";
                case ResultStatusValue.error:
                    return "Unexpected Error";
            }
            return NotEvaluated_Title;
        }
    }
    
    export class TestResult {
        private _status: ResultStatus;
        private _testId: string = "";
        private _testIndex: number|null = null;
        private _dataIndex: number|null = null;
        private _description: string = "";
        private _error: typeUtil.ErrorInfo|null = null;
    
        get status(): ResultStatus { return this._status; }
        get testId(): string { return this._testId; }
        get testIndex() : number|null { return this._testIndex; }
        get dataIndex() : number|null { return this._dataIndex; }
        get description(): string { return this._description; }
        get error(): typeUtil.ErrorInfo|null { return this._error; }
    
        constructor(value?: string|TestDefinition, error?: typeUtil.ErrorInfo|null, status?: ResultStatus|ResultStatusValue|number|null, testIndex?: number|null, dataIndex?: number|null) {
            if (typeUtil.nil(status)) {
                if (typeUtil.nil(error))
                    this._status = new ResultStatus((typeUtil.nil(value)) ? ResultStatusValue.notEvaluated : ResultStatusValue.pass);
                else
                    this._status = new ResultStatus((error.isWarning) ? ResultStatusValue.inconclusive : ResultStatusValue.error, error.message);
            } else if (!typeUtil.isNumber(status))
                this._status = status;
            else if (typeUtil.nil(error))
                this._status = new ResultStatus(status);
            else
                this._status = new ResultStatus(status, error.message);
            if (!typeUtil.nil(value)) {
                if (typeUtil.derivesFrom<TestDefinition>(value, TestDefinition)) {
    
                } else
                    this._description = typeUtil.asString(value, "");
            }
            if (!typeUtil.nil(error))
                this._error = error;
        }
    }

    export interface TestInvocationInfo {
        test: {
            id: string;
            lastResult: ResultStatus;
            index?: number|null;
            description?: string|null;
        };
        iteration: {
            index?: number|null;
            description?: string|null;
            metaData?: { [key: string]: any };
        }
        result?: string|ResultStatusValue|number|typeUtil.ErrorInfo|Error|{
            message?: string|null;
            status?: ResultStatusValue|number|null;
            error?: typeUtil.ErrorInfo|null;
        }|null;
    }
    
    export interface MethodSettings {
        callback: TestMethod;
        description?: string;
    }

    export interface IterationSettings {
        args: any[];
        description?: string;
        metaData?: { [key: string]: any };
    }

    export interface TestMethod { (args: any[], testInfo: TestInvocationInfo): any; }
    
    export class TestDefinition {
        private _testId: string;
        private _description: string = "";
        private _testMethod: TestMethod;
        private _iterations: IterationSettings[];
        private _lastResult: ResultStatus = new ResultStatus();
    
        get testId() : string { return this._testId; }
        
        get description() : string { return this._description; }
        set description(value : string) { this._description = typeUtil.asString(value, ""); }
    
        get iterations() : IterationSettings[] { return this._iterations; }
        set iterations(value : IterationSettings[]) { this._iterations = (typeUtil.nil(value)) ? [] : ((Array.isArray(value)) ? value : [value]); }
    
        get lastResult() : ResultStatus { return this._lastResult; }
        
        constructor(testId: string, testMethod: MethodSettings|TestMethod, iteration?: IterationSettings[]|IterationSettings) {
            this._testId = typeUtil.asString(testId, "");
            if (typeUtil.nil(testMethod))
                throw new Error("Test method must be defined.");
            if (typeUtil.isFunction(testMethod))
                this._testMethod = testMethod;
            else {
                this._testMethod = testMethod.callback;
                this._description = typeUtil.asString(testMethod.description, "");
            }
            if (typeUtil.nil(iteration))
                this._iterations = [{ args: [] }];
            else if (Array.isArray(iteration))
                this._iterations = iteration;
            else
                this._iterations = [iteration];
        }
    
        invoke(testIndex?: number|null, thisObj?: { [key: string]: any }) : ResultStatusValue {
            if (typeUtil.nil(thisObj))
                thisObj = { };
            else if (!typeUtil.isNonArrayObject(thisObj))
            thisObj = { thisObj: thisObj };
            let iterations: IterationSettings[] = this._iterations;
            if (iterations.length == 0)
                iterations.push({ args: [] });
            for (var iterationIndex = 0; iterationIndex < iterations.length; iterationIndex++) {
                let iterationSettings = iterations[iterationIndex];
                if (typeUtil.nil(iterationSettings))
                    iterationSettings = { args: [] };
                else if (!typeUtil.isNonArrayObject(iterationSettings)) {
                    if (Array.isArray(iterationSettings))
                        iterationSettings = { args: iterationSettings };
                    else
                        iterationSettings = { args: [], metaData: { data: iterationSettings } };
                } else if (typeUtil.nil(iterationSettings.args))
                    iterationSettings.args = [];
                else if (!Array.isArray(iterationSettings.args)) {
                    if (typeUtil.isNonArrayObject(iterationSettings.metaData))
                        iterationSettings.metaData.data = iterationSettings.args;
                    else
                        iterationSettings.metaData = { data: iterationSettings.args }
                    iterationSettings.args = [];
                }
                
                let result: TestResult;
                try {
                    var invocationInfo: TestInvocationInfo = {
                        test: {
                            id: this._testId,
                            index: testIndex,
                            lastResult: this._lastResult
                        },
                        iteration: {
                            index: iterationIndex,
                            description: iterationSettings.description,
                            metaData: iterationSettings.metaData
                        }
                    }
                    var output = this._testMethod.call(thisObj, iterationSettings.args, invocationInfo);
                    if (typeUtil.nil(invocationInfo.result))
                        result = new TestResult(this, undefined, ResultStatusValue.pass, testIndex, iterationIndex)
                    else if (typeUtil.isString(invocationInfo.result))
                        result = new TestResult(this, undefined, new ResultStatus(ResultStatusValue.pass, invocationInfo.result), testIndex, iterationIndex);
                    else if (typeUtil.isNumber(invocationInfo.result))
                        result = new TestResult(this, undefined, invocationInfo.result, testIndex, iterationIndex);
                    else if (typeUtil.derivesFrom<typeUtil.ErrorInfo>(invocationInfo.result, typeUtil.ErrorInfo))
                        result = new TestResult(this, invocationInfo.result, (invocationInfo.result.isWarning) ? ResultStatusValue.inconclusive : ResultStatusValue.error, testIndex, iterationIndex);
                    else if (typeUtil.derivesFrom<Error>(result, Error))
                        result = new TestResult(this, new typeUtil.ErrorInfo(invocationInfo.result), ResultStatusValue.error, testIndex, iterationIndex);
                    else
                        result = new TestResult(this, undefined, new ResultStatus(ResultStatusValue.pass, typeUtil.asString(result, null)), testIndex, iterationIndex);
                } catch (err) {
                    result = new TestResult(this, new typeUtil.ErrorInfo(err), ResultStatusValue.error, testIndex, iterationIndex);
                }
                this._lastResult = result.status;
                if (this._lastResult.statusValue != ResultStatusValue.pass)
                    break;
            }

            return this._lastResult.statusValue;
        }
    }
}