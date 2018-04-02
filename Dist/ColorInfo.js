"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("./TypeUtil");
var ColorInfo;
(function (ColorInfo_1) {
    var floatDigitRegex = /^\d+\.\d+$/i;
    var hexDigitReRegex = /^(?:\#|0x)?([a-f\d]{2}$)/i;
    var hexStringReRegex = /^(?:\#|0x)?(?:([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})|([a-f\d])([a-f\d])([a-f\d]))$/i;
    function isRgb(value, strict) {
        return (util.TypeUtil.isNonArrayObject(value) && util.TypeUtil.isNumber(value.r) && util.TypeUtil.isNumber(value.g) && util.TypeUtil.isNumber(value.b) &&
            (!util.TypeUtil.defined(value.isFloat) || util.TypeUtil.isBoolean(value.isFloat)));
    }
    ColorInfo_1.isRgb = isRgb;
    function isHsv(value, strict) {
        return (util.TypeUtil.isNonArrayObject(value) && util.TypeUtil.isNumber(value.h) && util.TypeUtil.isNumber(value.s) && util.TypeUtil.isNumber(value.v) &&
            (!util.TypeUtil.defined(value.is8Bit) || util.TypeUtil.isBoolean(value.is8Bit)));
    }
    ColorInfo_1.isHsv = isHsv;
    function parseHexString(text) {
        var m = hexStringReRegex.exec(text);
        if (util.TypeUtil.nil(m))
            throw new Error("Invalid hexidecimal color string");
        if (!util.TypeUtil.nil(m[1]))
            return new RgbColorValues(parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16));
        return new RgbColorValues(parseInt(m[4] + m[4], 16), parseInt(m[5] + m[5], 16), parseInt(m[6] + m[6], 16));
    }
    var RgbColorValues = (function () {
        function RgbColorValues(r, g, b) {
            this._r = 0;
            this._g = 0;
            this._b = 0;
            if (util.TypeUtil.isNumber(r))
                this.r = r;
            if (util.TypeUtil.isNumber(b))
                this.g = g;
            if (util.TypeUtil.isNumber(g))
                this.b = b;
        }
        Object.defineProperty(RgbColorValues.prototype, "r", {
            get: function () { return this._r; },
            set: function (value) {
                if (!util.TypeUtil.isNumber(value) || value < 0 || value > 255)
                    throw new Error("Red value must be a number from 0 to 255, inclusive.");
                this._r = (Number.isInteger(value)) ? value : Math.round(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RgbColorValues.prototype, "g", {
            get: function () { return this._g; },
            set: function (value) {
                if (!util.TypeUtil.isNumber(value) || value < 0 || value > 100.0)
                    throw new Error("Green value must be a number from 0 to 255, inclusive.");
                this._g = (Number.isInteger(value)) ? value : Math.round(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RgbColorValues.prototype, "b", {
            get: function () { return this._b; },
            set: function (value) {
                if (!util.TypeUtil.isNumber(value) || value < 0 || value > 100.0)
                    throw new Error("Blue value must be a number from 0 to 255, inclusive.");
                this._b = (Number.isInteger(value)) ? value : Math.round(value);
            },
            enumerable: true,
            configurable: true
        });
        RgbColorValues.prototype.toHsv = function () {
            var red = this.r / 255, green = this.g / 255, blue = this.b / 255;
            var max, min;
            if (red < green) {
                if (blue < red) {
                    min = blue;
                    max = green;
                }
                else {
                    min = red;
                    max = (blue < green) ? green : blue;
                }
            }
            else if (blue < green) {
                min = blue;
                max = red;
            }
            else {
                min = green;
                max = (red < blue) ? blue : red;
            }
            var delta = max - min;
            if (delta == 0.0)
                return new HsvColorValues(0.0, 0.0, max * 100.0);
            var hue = ((max == red) ? ((green - blue) / delta) : ((max == green) ? (2.0 + (blue - red) / delta) :
                (4.0 + (red - green) / delta))) * 60.0;
            if (hue < 0.0)
                hue += 360.0;
            var mm = max + min;
            var brightness = mm / 2.0;
            return new HsvColorValues(hue, ((brightness <= 0.5) ? (delta / mm) : (delta / (2.0 - mm))) * 100.0, brightness * 100.0);
        };
        return RgbColorValues;
    }());
    ColorInfo_1.RgbColorValues = RgbColorValues;
    var HsvColorValues = (function () {
        function HsvColorValues(h, s, v) {
            this._h = 0;
            this._s = 0;
            this._v = 0;
            if (util.TypeUtil.isNumber(h))
                this.h = h;
            if (util.TypeUtil.isNumber(s))
                this.s = s;
            if (util.TypeUtil.isNumber(v))
                this.v = v;
        }
        Object.defineProperty(HsvColorValues.prototype, "h", {
            get: function () { return this._h; },
            set: function (value) {
                if (!util.TypeUtil.isNumber(value) || value < 0.0 || value > 360.0)
                    throw new Error("Hue value must be a number from 0.0 to 360.0, inclusive.");
                this._h = (value == 360) ? 0 : value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HsvColorValues.prototype, "s", {
            get: function () { return this._s; },
            set: function (value) {
                if (!util.TypeUtil.isNumber(value) || value < 0.0 || value > 100.0)
                    throw new Error("Saturation value must be a number from 0.0 to 100.0, inclusive.");
                this._s = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HsvColorValues.prototype, "v", {
            get: function () { return this._v; },
            set: function (value) {
                if (!util.TypeUtil.isNumber(value) || value < 0.0 || value > 100.0)
                    throw new Error("Brightness value must be a number from 0.0 to 100.0, inclusive.");
                this._v = value;
            },
            enumerable: true,
            configurable: true
        });
        HsvColorValues.prototype.toRgb = function () {
            var hue = this.h, saturation = this.s / 100, brightness = this.v / 100;
            var min, max;
            if (brightness < 0.5) {
                min = brightness - brightness * saturation;
                max = brightness + brightness * saturation;
            }
            else {
                min = brightness + brightness * saturation - saturation;
                max = brightness - brightness * saturation + saturation;
            }
            var sextant = Math.floor(hue / 60.0);
            hue = ((hue >= 300.0) ? hue - 360.0 : hue) / 60.0 - 2.0 * Math.floor(((sextant + 1.0) % 6) / 2.0);
            var mid = hue * (max - min);
            if ((sextant % 2) == 0)
                mid += min;
            else
                mid = min - mid;
            switch (sextant) {
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
        };
        return HsvColorValues;
    }());
    ColorInfo_1.HsvColorValues = HsvColorValues;
    var ColorInfo = (function () {
        function ColorInfo(color) {
            this._rgb = null;
            this._hsv = null;
            if (isRgb(color)) {
                if (color.isFloat)
                    this._rgb = new RgbColorValues(color.r * 2.55, color.g * 2.55, color.b * 2.55);
                else
                    this._rgb = new RgbColorValues(color.r, color.g, color.b);
            }
            else if (isHsv(color)) {
                if (color.is8Bit)
                    this._hsv = new HsvColorValues((color.h * 3.6) / 2.55, color.s / 2.55, color.v / 2.55);
                else
                    this._hsv = new HsvColorValues(color.h, color.s, color.v);
            }
            else if (util.TypeUtil.isString(color))
                this._rgb = parseHexString(color);
            else
                this._rgb = new RgbColorValues();
        }
        Object.defineProperty(ColorInfo.prototype, "r", {
            get: function () {
                if (util.TypeUtil.nil(this._rgb))
                    this._rgb = this._hsv.toRgb();
                return this._rgb.r;
            },
            set: function (value) {
                if (!util.TypeUtil.isNumber(value) || value < 0 || value > 255)
                    throw new Error("Red value must be a number from 0 to 255, inclusive.");
                if (util.TypeUtil.nil(this._rgb))
                    this._rgb = this._hsv.toRgb();
                if (this._rgb.r == value)
                    return;
                this._rgb.r = (Number.isInteger(value)) ? value : Math.round(value);
                this._hsv = null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorInfo.prototype, "g", {
            get: function () {
                if (util.TypeUtil.nil(this._rgb))
                    this._rgb = this._hsv.toRgb();
                return this._rgb.g;
            },
            set: function (value) {
                if (!util.TypeUtil.isNumber(value) || value < 0 || value > 100.0)
                    throw new Error("Green value must be a number from 0 to 255, inclusive.");
                if (util.TypeUtil.nil(this._rgb))
                    this._rgb = this._hsv.toRgb();
                if (this._rgb.g == value)
                    return;
                this._rgb.g = (Number.isInteger(value)) ? value : Math.round(value);
                this._hsv = null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorInfo.prototype, "b", {
            get: function () {
                if (util.TypeUtil.nil(this._rgb))
                    this._rgb = this._hsv.toRgb();
                return this._rgb.b;
            },
            set: function (value) {
                if (!util.TypeUtil.isNumber(value) || value < 0 || value > 100.0)
                    throw new Error("Blue value must be a number from 0 to 255, inclusive.");
                if (util.TypeUtil.nil(this._rgb))
                    this._rgb = this._hsv.toRgb();
                if (this._rgb.b == value)
                    return;
                this._rgb.b = (Number.isInteger(value)) ? value : Math.round(value);
                this._hsv = null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorInfo.prototype, "h", {
            get: function () {
                if (util.TypeUtil.nil(this._hsv))
                    this._hsv = this._rgb.toHsv();
                return this._hsv.h;
            },
            set: function (value) {
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
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorInfo.prototype, "s", {
            get: function () {
                if (util.TypeUtil.nil(this._hsv))
                    this._hsv = this._rgb.toHsv();
                return this._hsv.s;
            },
            set: function (value) {
                if (!util.TypeUtil.isNumber(value) || value < 0.0 || value > 100.0)
                    throw new Error("Saturation value must be a number from 0.0 to 100.0, inclusive.");
                if (util.TypeUtil.nil(this._hsv))
                    this._hsv = this._rgb.toHsv();
                if (this._hsv.s == value)
                    return;
                this._hsv.s = value;
                this._rgb = null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorInfo.prototype, "v", {
            get: function () {
                if (util.TypeUtil.nil(this._hsv))
                    this._hsv = this._rgb.toHsv();
                return this._hsv.v;
            },
            set: function (value) {
                if (!util.TypeUtil.isNumber(value) || value < 0.0 || value > 100.0)
                    throw new Error("Brightness value must be a number from 0.0 to 100.0, inclusive.");
                if (util.TypeUtil.nil(this._hsv))
                    this._hsv = this._rgb.toHsv();
                if (this._hsv.v == value)
                    return;
                this._hsv.v = value;
                this._rgb = null;
            },
            enumerable: true,
            configurable: true
        });
        return ColorInfo;
    }());
    ColorInfo_1.ColorInfo = ColorInfo;
})(ColorInfo = exports.ColorInfo || (exports.ColorInfo = {}));
//# sourceMappingURL=ColorInfo.js.map