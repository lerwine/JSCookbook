import { ResultStatusValue, ResultStatus } from "./ResultStatus";
import { ErrorInfo } from "../TypeUtil/ErrorInfo";
import { TestDefinition } from "./TestDefinition";
import { util } from "../TypeUtil/util";

export class TestResult {
    private _status: ResultStatus;
    private _testId: string = "";
    private _testIndex: number|null = null;
    private _dataIndex: number|null = null;
    private _description: string = "";
    private _error: ErrorInfo|null = null;

    get status(): ResultStatus { return this._status; }
    get testId(): string { return this._testId; }
    get testIndex() : number|null { return this._testIndex; }
    get dataIndex() : number|null { return this._dataIndex; }
    get description(): string { return this._description; }
    get error(): ErrorInfo|null { return this._error; }

    constructor(value?: string|TestDefinition, error?: ErrorInfo|null, status?: ResultStatusValue|number|null, testIndex?: number|null, dataIndex?: number|null) {
        if (util.nil(status)) {
            if (util.nil(error))
                this._status = new ResultStatus((util.nil(value)) ? ResultStatusValue.notEvaluated : ResultStatusValue.pass);
            else
                this._status = new ResultStatus((error.isWarning) ? ResultStatusValue.inconclusive : ResultStatusValue.error, error.message);
        } else if (util.nil(error))
            this._status = new ResultStatus(status);
        else
            this._status = new ResultStatus(status, error.message);
        if (!util.nil(value)) {
            if (util.derivesFrom<TestDefinition>(value, TestDefinition)) {

            } else
                this._description = util.asString(value, "");
        }
        if (!util.nil(error))
            this._error = error;
    }
}