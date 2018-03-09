function ColorInfo(color) {
    var rgb = [0, 0, 0], hsb = [0, 0, 0];

    if (ColorInfo.isNil(color))
        return;

    var newRgb, newHsb;
    if (typeof(color) == "string")
        newRgb = ColorInfo.parseHexString(color);
    else if (typeof(color) == "object") {
        newRgb = [ColorInfo.asInteger(color.r), ColorInfo.asInteger(color.g), ColorInfo.asInteger(color.b)];
        newHsb = [ColorInfo.asNumber(color.h), ColorInfo.asNumber(color.s), ColorInfo.asNumber(color.b)];
        if (typeof(newRgb[0]) == "number" && typeof(newRgb[1]) == "number" && typeof(newRgb[2]) == "number")
            newHsb = undefined;
        else if (typeof(newHsb[0]) == "number" && typeof(newHsb[1]) == "number" && typeof(newHsb[2]) == "number")
            newRgb = undefined;
        else if (!gs.isNil(color.model)) {
            if (typeof(color.model.hexString) != "string")
                throw new Error("Invalid model.hexString value");
            newRgb = ColorInfo.parseHexString(color.model.hexString);
            if (ColorInfo.isNil(newRgb))
                throw new Error("Invalid model.hexString value");
            newHsb = undefined;
        } else {
            var v = newRgb.filter(function(o) { return ColorInfo.isNil(0); }).length;
            if (newHsb.filter(function(o) { return ColorInfo.isNil(0); }).length > v)
                throw new Error("Cannot get color from {h, s, b} property values");
            if (v == 0)
                throw new Error("Color property values not specified");
            throw new Error("Cannot get color from {r, g, b} property values.");
        }
    } else
        throw new Error("Invalid color argument type");
    if (ColorInfo.isNil(newHsb)) {
        hsb = ColorInfo.rgbToHsb(newRgb);
        rgb = newRgb;
    } else {
        rgb = ColorInfo.hsbToRgb(newHsb);
        hsb = ColorInfo.rgbToHsb(rgb);
    }

    this.red = function(value) {
        if (ColorInfo.isNil(value))
            return rgb[0];
        var i = ColorInfo.asInteger(value);
        if (ColorInfo.isNil(i))
            throw new Error("Invalid Red value");
        if (i < 0 || i > 255)
            throw new Error("Red must be a value from 0 to 255.");
        if (rgb[0] == i)
            return;
        rgb[0] = i;
        hsb = ColorInfo.rgbToHsb(rgb);
    };

    this.green = function(value) {
        if (ColorInfo.isNil(value))
            return rgb[1];
        var i = ColorInfo.asInteger(value);
        if (ColorInfo.isNil(i))
            throw new Error("Invalid Green value");
        if (i < 0 || i > 255)
            throw new Error("Green must be a value from 0 to 255.");
        if (rgb[1] == i)
            return;
        rgb[1] = i;
        hsb = ColorInfo.rgbToHsb(rgb);
    };

    this.blue = function(value) {
        if (ColorInfo.isNil(value))
            return rgb[2];
        var i = ColorInfo.asInteger(value);
        if (ColorInfo.isNil(i))
            throw new Error("Invalid Green value");
        if (i < 0 || i > 255)
            throw new Error("Green must be a value from 0 to 255.");
        if (rgb[2] == i)
            return;
        rgb[2] = i;
        hsb = ColorInfo.rgbToHsb(rgb);
    };

    this.hue = function(value) {
        if (ColorInfo.isNil(value))
            return hsb[0];
        var i = ColorInfo.asInteger(value);
        if (ColorInfo.isNil(i))
            throw new Error("Invalid Red value");
        if (i < 0 || i > 255)
            throw new Error("Red must be a value from 0 to 255.");
        if (hsb[0] == i)
            return;
        hsb[0] = i;
        rgb = ColorInfo.hsbToRgb(hsb);
        hsb = ColorInfo.rgbToHsb(rgb);
    };

    this.saturation = function(value) {
        if (ColorInfo.isNil(value))
            return hsb[1];
        var i = ColorInfo.asInteger(value);
        if (ColorInfo.isNil(i))
            throw new Error("Invalid Green value");
        if (i < 0 || i > 255)
            throw new Error("Green must be a value from 0 to 255.");
        if (hsb[1] == i)
            return;
        hsb[1] = i;
        rgb = ColorInfo.hsbToRgb(hsb);
        hsb = ColorInfo.rgbToHsb(rgb);
    };

    this.brightness = function(value) {
        if (ColorInfo.isNil(value))
            return hsb[2];
        var i = ColorInfo.asInteger(value);
        if (ColorInfo.isNil(i))
            throw new Error("Invalid Green value");
        if (i < 0 || i > 255)
            throw new Error("Green must be a value from 0 to 255.");
        if (hsb[2] == i)
            return;
        hsb[2] = i;
        rgb = ColorInfo.hsbToRgb(hsb);
        hsb = ColorInfo.rgbToHsb(rgb);
    };

    this.rgbHexString = function(value) {
        if (ColorInfo.isNil(value))
            return rgb.map(function(i) {
                if (i < 16)
                    return "0" + i.toString(16);
                return i.toString(16);
            }).join("");
        var newRgb = ColorInfo.parseHexString(value);
        if (newRgb[0] == rgb[0] && newRgb[1] == rgb[1] && newRgb[2] == rgb[2])
            return;
        rgb = newRgb;
        hsb = ColorInfo.rgbToHsb(rgb);
    };
}
ColorInfo.FloatDigitRe = /^\d+\.\d+$/i;
ColorInfo.HexDigitRe = /^(?:\#|0x)?([a-f\d]{2}$)/i;
ColorInfo.HexStringRe = /^(?:\#|0x)?(?:([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})|([a-f\d])([a-f\d])([a-f\d]))$/i;
ColorInfo.asNumber = function(value) {
    if (typeof(value) != "undefined" && value !== null) {
        if (typeof(value) == "number") {
            if (!isNaN(value))
                return value;
        } else if (typeof(value) == "string" && (value = value.trim().length > 0)) {
            if (ColorInfo.FloatDigitRe.test(value))
                return parseFloat(value);
            var m = ColorInfo.HexDigitRe.exec(value);
            if (!ColorInfo.isNil(m))
                return parseInt(m[1], 16);

            var n = parseFloat(value);
            if (!isNaN(n))
                return n;
        }
    }
};
ColorInfo.isNil = function(value) { return typeof(value) == "undefined" || value === null; }
ColorInfo.asInteger = function(value) {
    if (!ColorInfo.isNil(value)) {
        if (typeof(value) == "number") {
            if (!isNaN(value)) {
                if (Number.isInteger(value))
                    return value;
                return Math.round(value);
            }
        } else if (typeof(value) == "string" && (value = value.trim().length > 0)) {
            var m = ColorInfo.HexDigitRe.exec(value);
            if (!ColorInfo.isNil(m))
                return parseInt(m[1], 16);
            var n = parseInt(value);
            if (!isNaN(n))
                return n;
        }
    }
};
ColorInfo.parseHexString = function(text) {
    if (ColorInfo.isNil(text))
        return text;
    if (typeof(text) != "string")
        throw new Error("Argument must be a string value.");
    var m = ColorInfo.HexStringRe.exec(text);
    if (ColorInfo.isNil(m))
        throw new Error("Invalid hexidecimal color string");
    if (!ColorInfo.isNil(m[1]))
        return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
    return [parseInt(m[4]+m[4], 16), parseInt(m[5]+m[5], 16), parseInt(m[6]+m[6], 16)];
};
ColorInfo.rgbToHsb = function(rgb) {
    var r, g, b;
    if (arguments.length > 1) {
        r = arguments[0];
        g = arguments[1];
        if (arguments.length > 2)
            b = arguments[2];
    } else {
        if (!ColorInfo.isNil(rgb)) {
            if (Array.isArray(rgb)) {
                if (rgb.length > 0) {
                    r = rgb[0];
                    if (rgb.length > 1) {
                        g = rgb[1];
                        if (rgb.length > 2)
                            b = rgb[2];
                    }
                }
                if (ColorInfo.isNil(r))
                    r = rgb.r;
                if (ColorInfo.isNil(g))
                    g = rgb.g;
                if (ColorInfo.isNil(b))
                    b = rgb.b;
            } else {
                r = rgb.r;
                g = rgb.g;
                b = rgb.b;
            }
        }
    }
    r = ColorInfo.asInteger(r);
    if (ColorInfo.isNil(r))
        throw new Error("Invalid Red value");
    g = ColorInfo.asInteger(g);
    if (ColorInfo.isNil(g))
        throw new Error("Invalid Green value");
    b = ColorInfo.asInteger(b);
    if (ColorInfo.isNil(b))
        throw new Error("Invalid Blue value");
    if (r < 0 || r > 255)
        throw new Error("Red must be a value from 0 to 255");
    if (g < 0 || g > 255)
        throw new Error("Green must be a value from 0 to 255");
    if (b < 0 || b > 255)
        throw new Error("Blue must be a value from 0 to 255");
    r = r / 255.0;
    g = g / 255.0;
    b = b / 255.0;
    var max, min;
    if (r < g) {
        if (b < r) {
            min = b;
            max = g;
        } else {
            min = r;
            max = (b < g) ? g : b;
        }
    } else if (b < g) {
        min = b;
        max = r;
    } else {
        min = g;
        max = (r < b) ? b : r;
    }

    var delta = max - min;
    if (delta == 0.0)
    {
        br = max;
        h = 0.0;
        s = 0.0;
        return [ 0.0, 0.0, max * 100.0];
    }

    h = ((max == r) ? ((g - b) / delta) : ((max == g) ? (2.0 + (b - r) / delta) :
        (4.0 + (r - g) / delta))) * 60.0;
    if (h < 0.0)
        h += 360.0;
    var mm = max + min;
    br = mm / 2.0;
    if (br <= 0.5)
        s = delta / mm;
    else
        s = delta / (2.0 - mm);
    return [ h, s * 100.0, br * 100.0];
};
ColorInfo.hsbToRgb = function(hsb) {
    var h, s, b;
    if (arguments.length > 1) {
        h = arguments[0];
        s = arguments[1];
        if (arguments.length > 2)
            b = arguments[2];
    } else {
        if (!ColorInfo.isNil(hsb)) {
            if (Array.isArray(hsb)) {
                if (hsb.length > 0) {
                    h = hsb[0];
                    if (hsb.length > 1) {
                        s = hsb[1];
                        if (hsb.length > 2)
                            b = hsb[2];
                    }
                }
                if (ColorInfo.isNil(h))
                    h = hsb.h;
                if (ColorInfo.isNil(s))
                    s = hsb.s;
                if (ColorInfo.isNil(b))
                    b = hsb.b;
            } else {
                h = hsb.h;
                s = hsb.s;
                b = hsb.b;
            }
        }
    }
    h = ColorInfo.asNumber(h);
    if (ColorInfo.isNil(h))
        throw new Error("Invalid Hue value");
    s = ColorInfo.asNumber(s);
    if (ColorInfo.isNil(s))
        throw new Error("Invalid Saturation value");
    b = ColorInfo.asNumber(b);
    if (ColorInfo.isNil(b))
        throw new Error("Invalid Brightness value");
    if (h < 0 || h > 360)
        throw new Error("Hue must be a value from 0.0 to 360.0");
    if (s < 0 || s > 100)
        throw new Error("Saturation must be a value from 0.0 to 100.0");
    if (b < 0 || b > 100)
        throw new Error("Brightness must be a value from 0.0 to 100.0");
    s = s / 100.0;
    b = b / 100.0;

    var min, max;
    if (b < 0.5) {
        min = b - b * s;
        max = b + b * s;
    } else {
        min = b + b * s - s;
        max = b - b * s + s;
    }

    var sextant = Math.floor(h / 60.0);
    h = ((h >= 300.0) ? h - 360.0 : h) / 60.0 - 2.0 * Math.floor(((sextant + 1.0) % 6) / 2.0);
    var mid = h * (max - min);
    if ((sextant % 2) == 0)
        mid += min;
    else
        mid = min - mid;
    switch (sextant)
    {
        case 0:
            return [ Math.round(max * 255), Math.round(mid * 255), Math.round(min * 255) ];
        case 1:
            return [ Math.round(mid * 255), Math.round(max * 255), Math.round(min * 255) ];
        case 2:
            return [ Math.round(min * 255), Math.round(max * 255), Math.round(mid * 255) ];
        case 3:
            return [ Math.round(min * 255), Math.round(mid * 255), Math.round(max * 255) ];
        case 4:
            return [ Math.round(mid * 255), Math.round(min * 255), Math.round(max * 255) ];
    }
    return [ Math.round(max * 255), Math.round(min * 255), Math.round(mid * 255) ];
};