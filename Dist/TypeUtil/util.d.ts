declare module TypeUtil {
    interface AnyFunction {
        (...args: any[]): any;
    }
    interface AnyConstructor<T> {
        new (...args: any[]): T;
    }
    function defined(value?: any): boolean;
    function isObjectType(value?: any): value is object;
    function isNonArrayObject(value: any): value is {
        [key: string]: any;
    };
    function isString(value?: any): value is string;
    function isFunction(value?: any): value is AnyFunction;
    function isBoolean(value?: any): value is boolean;
    function isNumber(value?: any): value is number;
    function nil(value?: any): value is undefined | null;
    function isNilOrEmptyString(value?: string | null): boolean;
    function isNilOrWhitespace(value?: string | null): boolean;
    function asString(value: any, defaultValue?: string | null, ignoreWhitespace?: boolean): string;
    function asNormalizedString(value: any, defaultValue?: string): any;
    function trimEnd(text: string): string;
    function asNumber(value: any, defaultValue?: number): number;
    function asInteger(value: any, defaultValue?: number): number;
    function asBoolean(value: any, defaultValue?: boolean): boolean;
    function asArray(value: any): any[];
    function getClassName(value: any): string;
    function getInheritanceChain(value: any): string[];
    function derivesFrom<T>(value: any, classConstructor: AnyConstructor<T>): value is T;
    function typeOfExt(value: any): string;
    function indentText(text: string | string[], indent?: string, skipLineCount?: number): string;
    function serializeToString(obj: any): string;
}
