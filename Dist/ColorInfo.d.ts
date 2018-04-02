export declare module ColorInfo {
    interface IRGB {
        r: number;
        g: number;
        b: number;
        isFloat?: boolean;
    }
    interface IHSV {
        h: number;
        s: number;
        v: number;
        is8Bit?: boolean;
    }
    function isRgb(value: any, strict?: boolean): value is IRGB;
    function isHsv(value: any, strict?: boolean): value is IHSV;
    class RgbColorValues implements IRGB {
        private _r;
        private _g;
        private _b;
        r: number;
        g: number;
        b: number;
        constructor(r?: number, g?: number, b?: number);
        toHsv(): HsvColorValues;
    }
    class HsvColorValues implements IHSV {
        private _h;
        private _s;
        private _v;
        h: number;
        s: number;
        v: number;
        constructor(h?: number, s?: number, v?: number);
        toRgb(): RgbColorValues;
    }
    class ColorInfo {
        private _rgb?;
        private _hsv?;
        r: number;
        g: number;
        b: number;
        h: number;
        s: number;
        v: number;
        constructor(color?: IRGB | IHSV | string);
    }
}
