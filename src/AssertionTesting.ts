import util = require('./TypeUtil');

module AssertionTesting {
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
    
    export class ResultStatus {
        private _statusValue: ResultStatusValue = NotEvaluated_Value;
        private _rawValue: number = NotEvaluated_Value;
        private _message: string = NotEvaluated_Title;
        private _type: string = NotEvaluated_Type;
    
        get statusValue(): ResultStatusValue { return this._statusValue; }
        
        set statusValue(value: ResultStatusValue) { this.rawValue = ResultStatus.asStatusValue(value); }
    
        get rawValue(): number { return this._rawValue; }
    
        set rawValue(value : number) {
            var oldValue: number = this._statusValue;
            this._rawValue = util.TypeUtil.asNumber(value, NotEvaluated_Value);
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
            this._message = util.TypeUtil.asString(value, "");
            if (this._message.trim().length == 0)
                this._message = ResultStatus.getTitle(this._statusValue);
        }
    
        get type() : string { return this._type; }
    
        constructor(value?: number, message?: string) {
            if (!util.TypeUtil.nil(value))
                this.rawValue = value;
            let m = util.TypeUtil.asString(message, "");
            if (m.trim().length > 0)
                this.message = m;
        }
        
        static asStatusValue(value: number) : ResultStatusValue {
            let v : number = util.TypeUtil.asNumber(value, NotEvaluated_Value);
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
        private _error: util.TypeUtil.ErrorInfo|null = null;
    
        get status(): ResultStatus { return this._status; }
        get testId(): string { return this._testId; }
        get testIndex() : number|null { return this._testIndex; }
        get dataIndex() : number|null { return this._dataIndex; }
        get description(): string { return this._description; }
        get error(): util.TypeUtil.ErrorInfo|null { return this._error; }
    
        constructor(value?: string|TestDefinition, error?: util.TypeUtil.ErrorInfo|null, status?: ResultStatusValue|number|null, testIndex?: number|null, dataIndex?: number|null) {
            if (util.TypeUtil.nil(status)) {
                if (util.TypeUtil.nil(error))
                    this._status = new ResultStatus((util.TypeUtil.nil(value)) ? ResultStatusValue.notEvaluated : ResultStatusValue.pass);
                else
                    this._status = new ResultStatus((error.isWarning) ? ResultStatusValue.inconclusive : ResultStatusValue.error, error.message);
            } else if (util.TypeUtil.nil(error))
                this._status = new ResultStatus(status);
            else
                this._status = new ResultStatus(status, error.message);
            if (!util.TypeUtil.nil(value)) {
                if (util.TypeUtil.derivesFrom<TestDefinition>(value, TestDefinition)) {
    
                } else
                    this._description = util.TypeUtil.asString(value, "");
            }
            if (!util.TypeUtil.nil(error))
                this._error = error;
        }
    }

    export interface TestInvokeThisObj {
        test: {
            id: string;
            lastResult: ResultStatus;
            index?: number|null;
            data?: any;
        };
        description?: string|null;
        iteration: {
            index?: number|null;
            description?: string|null;
            metaData?: { [key: string]: any };
            data?: any;
        }
        result?: string|ResultStatusValue|number|util.TypeUtil.ErrorInfo|Error|{
            message?: string|null;
            status?: ResultStatusValue|number|null;
            error?: util.TypeUtil.ErrorInfo|null;
        }|null;
        data?: any;
    }
    
    export interface MethodSettings {
        callback: util.TypeUtil.AnyFunction;
        description?: string;
    }
    
    export interface IterationSettings {
        args: any[];
        description?: string;
        metaData?: { [key: string]: any };
    }
    
    export class TestDefinition {
        private _testId: string;
        private _description: string = "";
        private _testMethod: util.TypeUtil.AnyFunction;
        private _iterations: IterationSettings[];
        private _lastResult: ResultStatus = new ResultStatus();
    
        get testId() : string { return this._testId; }
        
        get description() : string { return this._description; }
        set description(value : string) { this._description = util.TypeUtil.asString(value, ""); }
    
        get iterations() : IterationSettings[] { return this._iterations; }
        set iterations(value : IterationSettings[]) { this._iterations = (util.TypeUtil.nil(value)) ? [] : ((Array.isArray(value)) ? value : [value]); }
    
        get lastResult() : ResultStatus { return this._lastResult; }
        
        constructor(testId: string, testMethod: MethodSettings|util.TypeUtil.AnyFunction, iteration?: IterationSettings[]|IterationSettings) {
            this._testId = util.TypeUtil.asString(testId, "");
            if (util.TypeUtil.nil(testMethod))
                throw new Error("Test method must be defined.");
            if (util.TypeUtil.isFunction(testMethod))
                this._testMethod = testMethod;
            else {
                this._testMethod = testMethod.callback;
                this._description = util.TypeUtil.asString(testMethod.description, "");
            }
            if (util.TypeUtil.nil(iteration))
                this._iterations = [{ args: [] }];
            else if (Array.isArray(iteration))
                this._iterations = iteration;
            else
                this._iterations = [iteration];
        }
    
        invoke(testIndex?: number|null, thisObj?: { [key: string]: any }) : ResultStatusValue {
            if (util.TypeUtil.nil(thisObj))
                thisObj = {
                    test: {
                        id: this._testId,
                        lastResult: this._lastResult,
                        index: testIndex
                    },
                    description: this._description,
                    iteration: { }
                };
            else if (util.TypeUtil.isNonArrayObject(thisObj)) {
                if (!util.TypeUtil.isNonArrayObject(thisObj.test)) {
                    thisObj.test = {
                        id: this._testId,
                        lastResult: this._lastResult,
                        index: testIndex,
                        data: thisObj.test
                    };
                }
                if (!util.TypeUtil.isNonArrayObject(thisObj.iteration))
                    thisObj.iteration = { data: thisObj.iteration };
            } else
                thisObj = {
                    test: {
                        id: this._testId,
                        lastResult: this._lastResult,
                        index: testIndex
                    },
                    description: this._description,
                    iteration: { },
                    data: thisObj
                };
            let iterations: IterationSettings[] = this._iterations;
            if (iterations.length == 0)
                iterations.push({ args: [] });
            for (var iterationIndex = 0; iterationIndex < iterations.length; iterationIndex++) {
                let iterationSettings = iterations[iterationIndex];
                if (util.TypeUtil.nil(iterationSettings))
                    iterationSettings = { args: [] };
                else if (!util.TypeUtil.isNonArrayObject(iterationSettings)) {
                    if (Array.isArray(iterationSettings))
                        iterationSettings = { args: iterationSettings };
                    else
                        iterationSettings = { args: [], metaData: { data: iterationSettings } };
                } else if (util.TypeUtil.nil(iterationSettings.args))
                    iterationSettings.args = [];
                else if (!Array.isArray(iterationSettings.args)) {
                    if (util.TypeUtil.isNonArrayObject(iterationSettings.metaData))
                        iterationSettings.metaData.data = iterationSettings.args;
                    else
                        iterationSettings.metaData = { data: iterationSettings.args }
                    iterationSettings.args = [];
                }
                if (util.TypeUtil.isNonArrayObject(thisObj.test)) {
                    thisObj.test.id = this._testId;
                    thisObj.test.lastResult = this._lastResult;
                    thisObj.test.index = testIndex;
                } else
                    thisObj.test = {
                        id: this._testId,
                        lastResult: this._lastResult,
                        index: testIndex
                    };
                thisObj.description = this._description;
                if (!util.TypeUtil.isNonArrayObject(thisObj.iteration))
                    thisObj.iteration = {
                        index: iterationIndex,
                        description: iterationSettings.description,
                        metaData: iterationSettings.metaData
                    };
                else {
                    thisObj.iteration.index = iterationIndex;
                    thisObj.description = iterationSettings.description;
                    thisObj.metaData = iterationSettings.metaData;
                }
                /*string|ResultStatusValue|number|ErrorInfo|Error|{
            message?: string|null;
            status?: ResultStatusValue|number|null;
            error?: ErrorInfo|null;
        }|null
                */
                let result: { [key: string]: any };
                try {
                    var output = this._testMethod.apply(thisObj, iterationSettings.args);
                    result = thisObj.result;
                    if (util.TypeUtil.nil(result))
                        result = { status: ResultStatusValue.pass };
                    else if (util.TypeUtil.isString(result))
                        result = { message: result, status: ResultStatusValue.pass };
                    else if (util.TypeUtil.isNumber(result))
                        result = { status: result };
                    else if (util.TypeUtil.derivesFrom<util.TypeUtil.ErrorInfo>(result, util.TypeUtil.ErrorInfo))
                        result = { status: (result.isWarning) ? ResultStatusValue.inconclusive : ResultStatusValue.error, error: result };
                    else if (util.TypeUtil.derivesFrom<Error>(result, Error))
                        result = { status: ResultStatusValue.error, error: new util.TypeUtil.ErrorInfo(result) }
                    else if (!util.TypeUtil.isNonArrayObject(result))
                        result = { status: ResultStatusValue.pass, message: util.TypeUtil.asString(result, null) };
                    else if (util.TypeUtil.nil(result.status))
                        result.status = ResultStatusValue.pass;
                } catch (err) {
                    result = { status: ResultStatusValue.error, error: err }
                }
                if (util.TypeUtil.derivesFrom<Error>(result.error, Error))
                    result.error = new util.TypeUtil.ErrorInfo(result.error);
                else if (!util.TypeUtil.nil(result.error) && !util.TypeUtil.derivesFrom<util.TypeUtil.ErrorInfo>(result.error, util.TypeUtil.ErrorInfo))
                    result.error = new util.TypeUtil.ErrorInfo(result.error);
                if (util.TypeUtil.nil(result.message) || (result.message = util.TypeUtil.asString(result.message, "")).trim().length == 0) {
                    if (!util.TypeUtil.nil(result.error) && !util.TypeUtil.nil(result.error.message) && (result.error.message = util.TypeUtil.asString(result.error.message, "").trim()).length > 0)
                        result.message = result.error.message;
                    else
                        result.message = "";
                }
                if (result.message.trim().length == 0)
                    result.message = ResultStatus.getTitle(result.status);
                this._lastResult = new ResultStatus(result.status, result.message);
                if (this._lastResult.statusValue != ResultStatusValue.pass)
                    break;
            }

            return this._lastResult.statusValue;
        }
    }
}