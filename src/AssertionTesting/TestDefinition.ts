import { util, AnyFunction } from "../TypeUtil/util";
import { ResultStatus, ResultStatusValue } from "./ResultStatus";
import { ErrorInfo } from "../TypeUtil/ErrorInfo";

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
    result?: string|ResultStatusValue|number|ErrorInfo|Error|{
        message?: string|null;
        status?: ResultStatusValue|number|null;
        error?: ErrorInfo|null;
    }|null;
    data?: any;
}

export interface MethodSettings {
    callback: AnyFunction;
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
    private _testMethod: AnyFunction;
    private _iterations: IterationSettings[];
    private _lastResult: ResultStatus = new ResultStatus();

    get testId() : string { return this._testId; }
    
    get description() : string { return this._description; }
    set description(value : string) { this._description = util.asString(value, ""); }

    get iterations() : IterationSettings[] { return this._iterations; }
    set iterations(value : IterationSettings[]) { this._iterations = (util.nil(value)) ? [] : ((Array.isArray(value)) ? value : [value]); }

    get lastResult() : ResultStatus { return this._lastResult; }
    
    constructor(testId: string, testMethod: MethodSettings|AnyFunction, iteration?: IterationSettings[]|IterationSettings) {
        this._testId = util.asString(testId, "");
        if (util.nil(testMethod))
            throw new Error("Test method must be defined.");
        if (util.isFunction(testMethod))
            this._testMethod = testMethod;
        else {
            this._testMethod = testMethod.callback;
            this._description = util.asString(testMethod.description, "");
        }
        if (util.nil(iteration))
            this._iterations = [{ args: [] }];
        else if (Array.isArray(iteration))
            this._iterations = iteration;
        else
            this._iterations = [iteration];
    }

    invoke(testIndex?: number|null, thisObj?: { [key: string]: any }) : ResultStatusValue {
        if (util.nil(thisObj))
            thisObj = {
                test: {
                    id: this._testId,
                    lastResult: this._lastResult,
                    index: testIndex
                },
                description: this._description,
                iteration: { }
            };
        else if (util.isNonArrayObject(thisObj)) {
            if (!util.isNonArrayObject(thisObj.test)) {
                thisObj.test = {
                    id: this._testId,
                    lastResult: this._lastResult,
                    index: testIndex,
                    data: thisObj.test
                };
            }
            if (!util.isNonArrayObject(thisObj.iteration))
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
        iterations.map(function(iterationSettings, iterationIndex) {
            if (util.nil(iterationSettings))
                iterationSettings = { args: [] };
            else if (!util.isNonArrayObject(iterationSettings)) {
                if (Array.isArray(iterationSettings))
                    iterationSettings = { args: iterationSettings };
                else
                    iterationSettings = { args: [], metaData: { data: iterationSettings } };
            } else if (util.nil(iterationSettings.args))
                iterationSettings.args = [];
            else if (!Array.isArray(iterationSettings.args)) {
                if (util.isNonArrayObject(iterationSettings.metaData))
                    iterationSettings.metaData.data = iterationSettings.args;
                else
                    iterationSettings.metaData = { data: iterationSettings.args }
                iterationSettings.args = [];
            }
            if (util.isNonArrayObject(thisObj.test)) {
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
            if (!util.isNonArrayObject(thisObj.iteration))
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
                if (util.nil(result))
                    result = { status: ResultStatusValue.pass };
                else if (util.isString(result))
                    result = { message: result, status: ResultStatusValue.pass };
                else if (util.isNumber(result))
                    result = { status: result };
                else if (util.derivesFrom<ErrorInfo>(result, ErrorInfo))
                    result = { status: (result.isWarning) ? ResultStatusValue.inconclusive : ResultStatusValue.error, error: result };
                else if (util.derivesFrom<Error>(result, Error))
                    result = { status: ResultStatusValue.error, error: new ErrorInfo(result) }
                else if (!util.isNonArrayObject(result))
                    result = { status: ResultStatusValue.pass, message: util.asString(result, null) };
                else if (util.nil(result.status))
                    result.status = ResultStatusValue.pass;
            } catch (err) {
                result = { status: ResultStatusValue.error, error: err }
            }
            if (util.derivesFrom<Error>(result.error, Error))
                result.error = new ErrorInfo(result.error);
            else if (!util.nil(result.error) && !util.derivesFrom<ErrorInfo>(result.error, ErrorInfo))
                result.error = new ErrorInfo(result.error);
            if (util.nil(result.message) || (result.message = util.asString(result.message, "")).trim().length == 0) {
                if (!util.nil(result.error) && !util.nil(result.error.message) && (result.error.message = util.asString(result.error.message, "").trim()).length > 0)
                    result.message = result.error.message;
                else
                    result.message = "";
            }
            if (result.message.trim().length == 0)
                result.message = ResultStatus.getTitle(result.status);
            this._lastResult = new ResultStatus(result.status, result.message);
            
        });
    }
}