import util = require('./TypeUtil');

export module ColorInfo {
    let floatDigitRegex = /^\d+\.\d+$/i;
    let hexDigitReRegex = /^(?:\#|0x)?([a-f\d]{2}$)/i;
    let hexStringReRegex = /^(?:\#|0x)?(?:([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})|([a-f\d])([a-f\d])([a-f\d]))$/i;

    export interface IRGB {
        r: number,
        g: number,
        b: number,
        isFloat?: boolean
    }

    export interface IHSV {
        h: number,
        s: number,
        v: number,
        is8Bit?: boolean
    }

    export function isRgb(value: any, strict?: boolean) : value is IRGB {
        return (util.TypeUtil.isNonArrayObject(value) && util.TypeUtil.isNumber(value.r) && util.TypeUtil.isNumber(value.g) && util.TypeUtil.isNumber(value.b) &&
            (!util.TypeUtil.defined(value.isFloat) || util.TypeUtil.isBoolean(value.isFloat)));
    }
    
    export function isHsv(value: any, strict?: boolean) : value is IHSV {
        return (util.TypeUtil.isNonArrayObject(value) && util.TypeUtil.isNumber(value.h) && util.TypeUtil.isNumber(value.s) && util.TypeUtil.isNumber(value.v) &&
            (!util.TypeUtil.defined(value.is8Bit) || util.TypeUtil.isBoolean(value.is8Bit)));
    }
    
    function parseHexString(text: string) {
        var m = hexStringReRegex.exec(text);
        if (util.TypeUtil.nil(m))
            throw new Error("Invalid hexidecimal color string");
        if (!util.TypeUtil.nil(m[1]))
            return new RgbColorValues(parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16));

        return new RgbColorValues(parseInt(m[4]+m[4], 16), parseInt(m[5]+m[5], 16), parseInt(m[6]+m[6], 16));
    }

    export class RgbColorValues implements IRGB {
        private _r: number = 0;
        private _g: number = 0;
        private _b: number = 0;

        get r() { return this._r; }
        set r(value: number) {
            if (!util.TypeUtil.isNumber(value) || value < 0 || value > 255)
                throw new Error("Red value must be a number from 0 to 255, inclusive.");
            this._r = (Number.isInteger(value)) ? value : Math.round(value);
        }

        get g() { return this._g; }
        set g(value: number) {
            if (!util.TypeUtil.isNumber(value) || value < 0 || value > 100.0)
                throw new Error("Green value must be a number from 0 to 255, inclusive.");
            this._g = (Number.isInteger(value)) ? value : Math.round(value);
        }

        get b() { return this._b; }
        set b(value: number) {
            if (!util.TypeUtil.isNumber(value) || value < 0 || value > 100.0)
                throw new Error("Blue value must be a number from 0 to 255, inclusive.");
            this._b = (Number.isInteger(value)) ? value : Math.round(value);
        }

        constructor(r?: number, g?: number, b?: number) {
            if (util.TypeUtil.isNumber(r))
                this.r = r;
            if (util.TypeUtil.isNumber(b))
                this.g = g;
            if (util.TypeUtil.isNumber(g))
                this.b = b;
        }

        toHsv() : HsvColorValues {
            let red = this.r / 255, green = this.g / 255, blue = this.b / 255;
            let max: number, min: number;
            if (red < green) {
                if (blue < red) {
                    min = blue;
                    max = green;
                } else {
                    min = red;
                    max = (blue < green) ? green : blue;
                }
            } else if (blue < green) {
                min = blue;
                max = red;
            } else {
                min = green;
                max = (red < blue) ? blue : red;
            }
    
            let delta = max - min;
            if (delta == 0.0)
                return new HsvColorValues(0.0, 0.0, max * 100.0);
    
            let hue = ((max == red) ? ((green - blue) / delta) : ((max == green) ? (2.0 + (blue - red) / delta) :
                (4.0 + (red - green) / delta))) * 60.0;
            if (hue < 0.0)
                hue += 360.0;
            let mm = max + min;
            let brightness = mm / 2.0;
            return new HsvColorValues(hue, ((brightness <= 0.5) ? (delta / mm) : (delta / (2.0 - mm))) * 100.0, brightness * 100.0);
        }
    }
    
    export class HsvColorValues implements IHSV {
        private _h: number = 0;
        private _s: number = 0;
        private _v: number = 0;

        get h() { return this._h; }
        set h(value: number) {
            if (!util.TypeUtil.isNumber(value) || value < 0.0 || value > 360.0)
                throw new Error("Hue value must be a number from 0.0 to 360.0, inclusive.");
            this._h = (value == 360) ? 0 : value;
        }

        get s() { return this._s; }
        set s(value: number) {
            if (!util.TypeUtil.isNumber(value) || value < 0.0 || value > 100.0)
                throw new Error("Saturation value must be a number from 0.0 to 100.0, inclusive.");
            this._s = value;
        }

        get v() { return this._v; }
        set v(value: number) {
            if (!util.TypeUtil.isNumber(value) || value < 0.0 || value > 100.0)
                throw new Error("Brightness value must be a number from 0.0 to 100.0, inclusive.");
            this._v = value;
        }

        constructor(h?: number, s?: number, v?: number) {
            if (util.TypeUtil.isNumber(h))
                this.h = h;
            if (util.TypeUtil.isNumber(s))
                this.s = s;
            if (util.TypeUtil.isNumber(v))
                this.v = v;
        }

        toRgb(): RgbColorValues {
            let hue = this.h, saturation = this.s / 100, brightness = this.v / 100;
    
            let min: number, max: number;
            if (brightness < 0.5) {
                min = brightness - brightness * saturation;
                max = brightness + brightness * saturation;
            } else {
                min = brightness + brightness * saturation - saturation;
                max = brightness - brightness * saturation + saturation;
            }
    
            let sextant = Math.floor(hue / 60.0);
            hue = ((hue >= 300.0) ? hue - 360.0 : hue) / 60.0 - 2.0 * Math.floor(((sextant + 1.0) % 6) / 2.0);
            let mid = hue * (max - min);
            if ((sextant % 2) == 0)
                mid += min;
            else
                mid = min - mid;
            
            switch (sextant)
            {
                case 0:
                    return new RgbColorValues(max * 255, mid * 255, min * 255);
                case 1:
                    return new RgbColorValues(mid * 255, max * 255, min * 255);
                case 2:
                    return new RgbColorValues(min * 255, max * 255, mid * 255);
                case 3:
                    return new RgbColorValues(min * 255, mid * 255, max * 255);
                case 4:
                    return new RgbColorValues(mid * 255, min * 255, max * 255);
            }
            return new RgbColorValues(max * 255, min * 255, mid * 255);
        }
    }
    
    export class ColorInfo {
        private _rgb?: RgbColorValues|null = null;
        private _hsv?: HsvColorValues|null = null;

        get r() {
            if (util.TypeUtil.nil(this._rgb))
                this._rgb = this._hsv.toRgb();
            return this._rgb.r;
        }
        set r(value: number) {
            if (!util.TypeUtil.isNumber(value) || value < 0 || value > 255)
                throw new Error("Red value must be a number from 0 to 255, inclusive.");
            if (util.TypeUtil.nil(this._rgb))
                this._rgb = this._hsv.toRgb();
            if (this._rgb.r == value)
                return;
            this._rgb.r = (Number.isInteger(value)) ? value : Math.round(value);
            this._hsv = null;
        }

        get g() {
            if (util.TypeUtil.nil(this._rgb))
                this._rgb = this._hsv.toRgb();
            return this._rgb.g;
        }
        set g(value: number) {
            if (!util.TypeUtil.isNumber(value) || value < 0 || value > 100.0)
                throw new Error("Green value must be a number from 0 to 255, inclusive.");
            if (util.TypeUtil.nil(this._rgb))
                this._rgb = this._hsv.toRgb();
            if (this._rgb.g == value)
                return;
            this._rgb.g = (Number.isInteger(value)) ? value : Math.round(value);
            this._hsv = null;
        }

        get b() {
            if (util.TypeUtil.nil(this._rgb))
                this._rgb = this._hsv.toRgb();
            return this._rgb.b;
        }
        set b(value: number) {
            if (!util.TypeUtil.isNumber(value) || value < 0 || value > 100.0)
                throw new Error("Blue value must be a number from 0 to 255, inclusive.");
            if (util.TypeUtil.nil(this._rgb))
                this._rgb = this._hsv.toRgb();
            if (this._rgb.b == value)
                return;
            this._rgb.b = (Number.isInteger(value)) ? value : Math.round(value);
            this._hsv = null;
        }

        get h() {
            if (util.TypeUtil.nil(this._hsv))
                this._hsv = this._rgb.toHsv();
            return this._hsv.h;
        }
        set h(value: number) {
            if (!util.TypeUtil.isNumber(value) || value < 0.0 || value > 360.0)
                throw new Error("Hue value must be a number from 0.0 to 360.0, inclusive.");
            if (value == 360)
                value = 0;
            if (util.TypeUtil.nil(this._hsv))
                this._hsv = this._rgb.toHsv();
            if (this._hsv.h == value)
                return;
            this._hsv.h = (value == 360) ? 0 : value;
            this._rgb = null;
        }

        get s() {
            if (util.TypeUtil.nil(this._hsv))
                this._hsv = this._rgb.toHsv();
            return this._hsv.s;
        }
        set s(value: number) {
            if (!util.TypeUtil.isNumber(value) || value < 0.0 || value > 100.0)
                throw new Error("Saturation value must be a number from 0.0 to 100.0, inclusive.");
            if (util.TypeUtil.nil(this._hsv))
                this._hsv = this._rgb.toHsv();
            if (this._hsv.s == value)
                return;
            this._hsv.s = value;
            this._rgb = null;
        }

        get v() {
            if (util.TypeUtil.nil(this._hsv))
                this._hsv = this._rgb.toHsv();
            return this._hsv.v;
        }
        set v(value: number) {
            if (!util.TypeUtil.isNumber(value) || value < 0.0 || value > 100.0)
                throw new Error("Brightness value must be a number from 0.0 to 100.0, inclusive.");
            if (util.TypeUtil.nil(this._hsv))
                this._hsv = this._rgb.toHsv();
            if (this._hsv.v == value)
                return;
            this._hsv.v = value;
            this._rgb = null;
        }

        constructor(color?: IRGB|IHSV|string) {
            if (isRgb(color)) {
                if (color.isFloat)
                    this._rgb = new RgbColorValues(color.r * 2.55, color.g * 2.55, color.b * 2.55);
                else
                    this._rgb = new RgbColorValues(color.r, color.g, color.b);
            } else if (isHsv(color)) {
                if (color.is8Bit)
                    this._hsv = new HsvColorValues((color.h * 3.6) / 2.55, color.s / 2.55, color.v / 2.55);
                else
                    this._hsv = new HsvColorValues(color.h, color.s, color.v);
            } else if (util.TypeUtil.isString(color))
                this._rgb = parseHexString(color);
            else
                this._rgb = new RgbColorValues();
        }
    }
}