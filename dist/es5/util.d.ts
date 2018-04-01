export declare abstract class util {
    static defined(value: any): boolean;
    static isString(value: any): boolean;
    static isFunction(value: any): boolean;
    static isBoolean(value: any): boolean;
    static isNumber(value: any): boolean;
    static nil(value: any): boolean;
    static isNilOrEmptyString(s: string): boolean;
    static isNilOrWhitespace(s: string): boolean;
    static asString(value: any, defaultValue?: string, ignoreWhitespace?: boolean): any;
    static trimEnd(v: string): string;
    static asNumber(value: any, defaultValue?: number): number;
    static asInteger(value: any, defaultValue?: number): number;
    static asBoolean(value: any, defaultValue?: boolean): boolean;
    static getClassName(value: any): string;
    static getInheritanceChain(value: any): string[];
    static derivesFrom(value: any, classConstructor: Function): boolean;
    static typeOfExt(value: any): string;
    static indentText(text: string | string[], indent?: string, skipLineCount?: number): string;
    private static __asPropertyValueString(obj);
    static asPropertyValueString(obj: any): string;
}
