import { util } from "../TypeUtil/util";

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
        this._rawValue = util.asNumber(value, NotEvaluated_Value);
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
        this._message = asString(value, "");
        if (this._message.trim().length == 0)
            this._message = ResultStatus.getTitle(this._statusValue);
    }

    get type() : string { return this._type; }

    constructor(value?: number, message?: string) {
        if (!util.nil(value))
            this.rawValue = value;
        let m = util.asString(message, "");
        if (m.trim().length > 0)
            this.message = m;
    }
    
    static asStatusValue(value: number) : ResultStatusValue {
        let v : number = util.asNumber(value, NotEvaluated_Value);
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