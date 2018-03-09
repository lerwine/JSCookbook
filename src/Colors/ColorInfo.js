function ColorInfo(color) {
    var rgb = [0, 0, 0], hsb = [0, 0, 0], baseValueInfo;

    var updateBaseValues = function() {
        if (baseValueInfo.colorSpace == "rgb") {
            if (baseValueInfo.valueType == "percent") {
                baseValueInfo.red = rgb[0];
                baseValueInfo.green = rgb[1];
                baseValueInfo.blue = rgb[2];
            } else {
                baseValueInfo.red = this.red8Bit();
                baseValueInfo.green = this.green8Bit();
                baseValueInfo.blue = this.blue8Bit();
            }
        } else if (baseValueInfo.valueType == "percent") {
            baseValueInfo.hue = hsb[0];
            baseValueInfo.saturation = hsb[1];
            baseValueInfo.brightness = hsb[2];
        } else {
            baseValueInfo.hue = Math.round((hsb[1] * 2.55) / 3.6);
            baseValueInfo.saturation = Math.round(hsb[1] * 2.55);
            baseValueInfo.brightness = Math.round(hsb[2] * 2.55);
        }
    };

    if (ColorInfo.isNil(color))
        baseValueInfo = { red: 0, green: 0, blue: 0, colorSpace: "rgb", valueType: "percent" };
    else {
        if (typeof(color) == "string")
            baseValueInfo = ColorInfo.parseColorString(color);
        else if (typeof(color) == "object") {
            if ((color.colorSpace === "rgb" || color.colorSpace === "hsb") && (color.valueType === "percent" || color.valueType === "8bit"))
                baseValueInfo = color;
            else
            {
                var rgbOriginal = {
                    red: ColorInfo.asInteger(color.red), green: ColorInfo.asInteger(color.green), blue: ColorInfo.asInteger(color.blue),
                    colorSpace: "rgb", valueType: (color.valueType === "8bit") ? "8bit" : "percent"
                };
                if (ColorInfo.isNil(rgbOriginal.red)) {
                    rgbOriginal.red = ColorInfo.asInteger(color.r);
                    if (ColorInfo.isNil(rgbOriginal.red)) {
                        rgbOriginal.red = (ColorInfo.isNil(color.red)) ? color.r : color.red;
                        if (typeof(rgbOriginal.red) == "function")
                            rgbOriginal.red = rgbOriginal.red();
                    }
                }
                if (ColorInfo.isNil(rgbOriginal.green)) {
                    rgbOriginal.green = ColorInfo.asInteger(color.g);
                    if (ColorInfo.isNil(rgbOriginal.green)) {
                        rgbOriginal.green = (ColorInfo.isNil(color.green)) ? color.g : color.green;
                        if (typeof(rgbOriginal.green) == "function")
                            rgbOriginal.green = rgbOriginal.green();
                    }
                }
                if (ColorInfo.isNil(rgbOriginal.blue)) {
                    rgbOriginal.blue = ColorInfo.asInteger(color.b);
                    if (ColorInfo.isNil(rgbOriginal.blue)) {
                        rgbOriginal.blue = (ColorInfo.isNil(color.blue)) ? color.b : color.blue;
                        if (typeof(rgbOriginal.blue) == "function")
                            rgbOriginal.blue = rgbOriginal.blue();
                    }
                }
                if (color.colorSpace === "rgb")
                    baseValueInfo = rgbOriginal;
                else {
                    var hsbOriginal = {
                        hue: ColorInfo.asInteger(color.hue), saturation: ColorInfo.asInteger(color.saturation), brightness: ColorInfo.asInteger(color.brightness),
                        colorSpace: "hsb", valueType: rgbOriginal.valueType
                    };
                    if (ColorInfo.isNil(hsbOriginal.hue)) {
                        hsbOriginal.hue = ColorInfo.asInteger(color.h);
                        if (ColorInfo.isNil(hsbOriginal.hue)) {
                            hsbOriginal.hue = (ColorInfo.isNil(color.hue)) ? color.h : color.hue;
                            if (typeof(hsbOriginal.hue) == "function")
                                hsbOriginal.hue = hsbOriginal.hue();
                        }
                    }
                    if (ColorInfo.isNil(hsbOriginal.saturation)) {
                        hsbOriginal.saturation = ColorInfo.asInteger(color.s);
                        if (ColorInfo.isNil(hsbOriginal.saturation)) {
                            hsbOriginal.saturation = (ColorInfo.isNil(color.saturation)) ? color.s : color.saturation;
                            if (typeof(hsbOriginal.saturation) == "function")
                                hsbOriginal.saturation = hsbOriginal.saturation();
                        }
                    }
                    if (ColorInfo.isNil(hsbOriginal.brightness)) {
                        hsbOriginal.brightness = ColorInfo.asInteger(color.b);
                        if (ColorInfo.isNil(hsbOriginal.brightness)) {
                            hsbOriginal.brightness = (ColorInfo.isNil(color.brightness)) ? color.b : color.brightness;
                            if (typeof(hsbOriginal.brightness) == "function")
                            hsbOriginal.brightness = hsbOriginal.brightness();
                        }
                    }
                    if (color.colorSpace === "hsb")
                        baseValueInfo = hsbOriginal;
                    else if (typeof(rgbOriginal.red) == "number" && typeof(rgbOriginal.green) == "number" && typeof(rgbOriginal.blue) == "number") {
                        baseValueInfo = rgbOriginal;
                        if ((rgbOriginal.red < 0 || rgbOriginal.green < 0 || rgbOriginal.blue < 0 || (rgbOriginal.valueType == "8bit") ? (rgbOriginal.red > 255 ||rgbOriginal.green > 255 || rgbOriginal.blue > 255) :
                                (rgbOriginal.red > 1 || rgbOriginal.green > 1 || rgbOriginal.blue > 1)) && typeof(hsbOriginal.hue) == "number" && typeof(hsbOriginal.saturation) == "number" && typeof(hsbOriginal.brightness) == "number")
                            baseValueInfo = rgbOriginal;
                    } else if (!(ColorInfo.isNil(hsbOriginal.hue) || ColorInfo.isNil(hsbOriginal.saturation) || ColorInfo.isNil(hsbOriginal.brightness)))
                        baseValueInfo = hsbOriginal;
                    else if (!(ColorInfo.isNil(rgbOriginal.red) || ColorInfo.isNil(rgbOriginal.green) || ColorInfo.isNil(colrgbOriginalor.blue)))
                        baseValueInfo = rgbOriginal;
                    else
                        throw new Error("Input object does not have all RGB or HSB values");
                }
            }
        } else
            throw new Error("Invalid color argument type")
        
        var names = (baseValueInfo.colorSpace == "rgb") ? ["red", "green", "blue"] : ["hue", "saturation", "brightness"];
        var values;
        if (baseValueInfo.valueType == "8bit") {
            values = names.map(function(n) {
                var v = baseValueInfo[n];
                if (ColorInfo.isNil(v))
                    throw new Error("Value for " + n + " not found.");
                if (typeof(v) != "number") {
                    if (typeof(v) != "string")
                        throw new Error("Invalid type for " + n + " value.");
                    v = parseInt(v);
                }
                if (isNaN(v))
                    throw new Error("Invalid " + n + " value.");
                if (v < 0 || v > 255)
                    throw new Error("Value of " + n + " is out of range.");
                baseValueInfo[n] = v;
                return v;
            });
            if (baseValueInfo.colorSpace == "hsb")
                values[0] = (values[0] == 255) ? 0 : values[0] * 360;
            values = values.map(function(v) { return v / 2.55; });
        } else
            values = names.map(function(n) {
                var v = baseValueInfo[n];
                if (ColorInfo.isNil(v))
                    throw new Error("Value for " + n + " not found.");
                if (typeof(v) != "number") {
                    if (typeof(v) != "string")
                        throw new Error("Invalid type for " + n + " value.");
                    v = parseFloat(v);
                }
                if (isNaN(v))
                    throw new Error("Invalid " + n + " value.");
                if (v < 0 || v > ((n == "hue") ? 360 : 100))
                    throw new Error("Value of " + n + " is out of range.");
                baseValueInfo[n] = v;
                return v;
            });
        
        if ((baseValueInfo.colorSpace == "hsb")) {
            rgb = ColorInfo.hsbToRgb(values);
            hsb = ColorInfo.rgbToHsb(rgb);
        } else {
            hsb = ColorInfo.rgbToHsb(values);
            rgb = values;
        }
    }

    this.red = function(value) {
        if (ColorInfo.isNil(value))
            return rgb[0];
        var i = ColorInfo.asInteger(value);
        if (ColorInfo.isNil(i))
            throw new Error("Invalid Red value");
        if (i < 0 || i > 100)
            throw new Error("Red must be a value from 0 to 100.");
        if (rgb[0] == i)
            return;
        rgb[0] = i;
        hsb = ColorInfo.rgbToHsb(rgb);
        updateBaseValues();
    };

    this.red8Bit = function(value) {
        if (ColorInfo.isNil(value))
            return Math.round(rgb[0] * 2.55);
        var i = ColorInfo.asInteger(value);
        if (ColorInfo.isNil(i))
            throw new Error("Invalid Red 8-bit value");
        if (i < 0 || i > 255)
            throw new Error("8-bit red must be a value from 0 to 255.");
        i /= 2.55;
        if (rgb[0] == i)
            return;
        rgb[0] = i;
        hsb = ColorInfo.rgbToHsb(rgb);
        updateBaseValues();
    };

    this.green = function(value) {
        if (ColorInfo.isNil(value))
            return rgb[1];
        var i = ColorInfo.asInteger(value);
        if (ColorInfo.isNil(i))
            throw new Error("Invalid Green value");
        if (i < 0 || i > 100)
            throw new Error("Green must be a value from 0 to 100.");
        if (rgb[1] == i)
            return;
        rgb[1] = i;
        hsb = ColorInfo.rgbToHsb(rgb);
        updateBaseValues();
    };

    this.green8Bit = function(value) {
        if (ColorInfo.isNil(value))
            return Math.round(rgb[1] * 2.55);
        var i = ColorInfo.asInteger(value);
        if (ColorInfo.isNil(i))
            throw new Error("Invalid Green 8-bit value");
        if (i < 0 || i > 255)
            throw new Error("8-bit green must be a value from 0 to 255.");
        i /= 2.55;
        if (rgb[1] == i)
            return;
        rgb[1] = i;
        hsb = ColorInfo.rgbToHsb(rgb);
        updateBaseValues();
    };

    this.blue = function(value) {
        if (ColorInfo.isNil(value))
            return rgb[2];
        var i = ColorInfo.asInteger(value);
        if (ColorInfo.isNil(i))
            throw new Error("Invalid Blue value");
        if (i < 0 || i > 100)
            throw new Error("Blue must be a value from 0 to 100.");
        if (rgb[2] == i)
            return;
        rgb[2] = i;
        hsb = ColorInfo.rgbToHsb(rgb);
        updateBaseValues();
    };

    this.blue8Bit = function(value) {
        if (ColorInfo.isNil(value))
            return Math.round(rgb[1] * 2.55);
        var i = ColorInfo.asInteger(value);
        if (ColorInfo.isNil(i))
            throw new Error("Invalid Blue 8-bit value");
        if (i < 0 || i > 255)
            throw new Error("8-bit blue must be a value from 0 to 255.");
        i /= 2.55;
        if (rgb[2] == i)
            return;
        rgb[2] = i;
        hsb = ColorInfo.rgbToHsb(rgb);
        updateBaseValues();
    };

    this.hue = function(value) {
        if (ColorInfo.isNil(value))
            return hsb[0];
        var i = ColorInfo.asInteger(value);
        if (ColorInfo.isNil(i))
            throw new Error("Invalid Hue value");
        if (i < 0 || i > 360)
            throw new Error("Hue must be a degree value from 0.0 to 360.0.");
        if (i == 360)
            i = 0;
        if (hsb[0] == i)
            return;
        hsb[0] = i;
        rgb = ColorInfo.hsbToRgb(hsb);
        hsb = ColorInfo.rgbToHsb(rgb);
        updateBaseValues();
    };

    this.saturation = function(value) {
        if (ColorInfo.isNil(value))
            return hsb[1];
        var i = ColorInfo.asInteger(value);
        if (ColorInfo.isNil(i))
            throw new Error("Invalid Saturation value");
        if (i < 0 || i > 100)
            throw new Error("Saturation must be a percentage value from 0.0 to 100.0.");
        if (hsb[1] == i)
            return;
        hsb[1] = i;
        rgb = ColorInfo.hsbToRgb(hsb);
        hsb = ColorInfo.rgbToHsb(rgb);
        updateBaseValues();
    };

    this.brightness = function(value) {
        if (ColorInfo.isNil(value))
            return hsb[2];
        var i = ColorInfo.asInteger(value);
        if (ColorInfo.isNil(i))
            throw new Error("Invalid Brightness value");
        if (i < 0 || i > 100)
            throw new Error("Brightness must be a percentage value from 0.0 to 100.0.");
        if (hsb[2] == i)
            return;
        hsb[2] = i;
        rgb = ColorInfo.hsbToRgb(hsb);
        hsb = ColorInfo.rgbToHsb(rgb);
        updateBaseValues();
    };

    this.rgbHexString = function(value) {
        if (ColorInfo.isNil(value))
            return rgb.map(function(p) {
                var i = Math.round(p * 2.55);
                if (i < 16)
                    return "0" + i.toString(16);
                return i.toString(16);
            }).join("");
        var newRgb = ColorInfo.parseHexString(value).map(function(i) { return i / 2.55; });
        if (newRgb[0] == rgb[0] && newRgb[1] == rgb[1] && newRgb[2] == rgb[2])
            return;
        rgb = newRgb;
        hsb = ColorInfo.rgbToHsb(rgb);
        updateBaseValues();
    };

    this.hsbHexString = function(value) {
        if (ColorInfo.isNil(value)) {
            var arr = hsb.map(function(p) { return p * 2.55; });
            arr[0] /= 3.6;
            return arr.map(function(p) {
                var i = Math.round(p * 2.55);
                if (i < 16)
                    return "0" + i.toString(16);
                return i.toString(16);
            }).join("");
        }
        var newHsb = ColorInfo.parseHexString(value);
        newHsb[0] *= 3.6;
        newHsb = newHsb.map(function(i) { return i / 2.55; });
        if (newHsb[0] == 360)
            newHsb[0] = 0;
        if (newHsb[0] == hsb[0] && newHsb[1] == hsb[1] && newHsb[2] == hsb[2])
            return;
        rgb = ColorInfo.hsbToRgb(newHsb);
        hsb = ColorInfo.rgbToHsb(rgb);
        updateBaseValues();
    };

    this.baseColorSpace = function(colorSpace) {
        if (ColorInfo.isNil(colorSpace))
            return baseValueInfo.colorSpace;
        
        if (baseValueInfo.colorSpace == colorSpace)
            return;
        
        if (colorSpace === "rgb")
            baseValueInfo = { colorSpace: "rgb", valueType: baseValueInfo.valueType };
        else if (colorSpace == "hsb" || colorSpace == "hsv")
            baseValueInfo = { colorSpace: "hsb", valueType: baseValueInfo.valueType };
        else
            throw new Error("ColorSpace must be either rgb or hsb.");
        updateBaseValues();
    };

    this.baseValueType = function(type) {
        if (ColorInfo.isNil(type))
            return baseValueInfo.valueType;
        
        if (baseValueInfo.valueType == valueType)
            return;
        
        if (valueType === "percent")
            baseValueInfo = { colorSpace: baseValueInfo.colorSpace, valueType: "percent" };
        else if (valueType == "8bit")
            baseValueInfo = { colorSpace: baseValueInfo.colorSpace, valueType: "8bit" };
        else
            throw new Error("ColorSpace must be either percent or 8bit.");
        updateBaseValues();
    };

    this.baseValues = function(values) {
        if (ColorInfo.isNil(values)) {
            if (baseValueInfo.colorSpace == "rgb")
                return [this.baseValueInfo.red, this.baseValueInfo.green, this.baseValueInfo.blue];
            return [this.baseValueInfo.hue, this.baseValueInfo.saturation, this.baseValueInfo.brightness];
        }
        var valueArr;
        if (arguments.length > 1)
            valueArr = [arguments[0], arguments[1], arguments[2]];
        else
            valueArr = (Array.isArray(values)) ? values : valueArr;
        var numberArr = (baseValueInfo.valueType == "percent") ? valueArr.map(function(v) { return ColorInfo.asNumber(v); }) : valueArr.map(function(v) { return ColorInfo.asInteger(v); });
        var names = (baseValueInfo.colorSpace == "rgb") ? ["red", "green", "blue"] : ["hue", "saturation", "brightness"];
        for (var i = 0; i < 3; i++) {
            if (numberArr.length < (i + 1) || typeof(numberArr[i]) != "number")
                throw new Error(ColorInfo.isNil(valueArr[i]) ? "Value at position " + i + " (" + names[i] + ") not provided." : "Invalid value at position " + i + " (" + names[i] + ").");
        }
        if (baseValueInfo.valueType == "8bit") {
            for (var i = 0; i < 3; i++) {
                if (numberArr[i] < 0 || numberArr[i] > 255)
                    throw new Error("Value at position " + i + " (" + names[i] + ") is out of range.");
            }
        } else {
            var ranges = [100, 100, 100];
            if (baseValueInfo.colorSpace == "hsb")
                ranges[0] = 360;
            for (var i = 0; i < 3; i++) {
                if (numberArr[i] < 0 || numberArr[i] > ranges[i])
                    throw new Error("Value at position " + i + " (" + names[i] + ") is out of range.");
            }
        }

        if (baseValueInfo.colorSpace == "rgb") {
            baseValueInfo.red = numberArr[0];
            baseValueInfo.green = numberArr[1];
            baseValueInfo.blue = numberArr[2];
            if (baseValueInfo.valueType == "8bit")
                numberArr = numberArr.map(function(n) { return n / 2.55; });
            if (numberArr[0] != rgb[0] || numberArr[1] != rgb[1] || numberArr[2] != rgb[2]) {
                rgb = numberArr;
                hsb = ColorInfo.rgbToHsb(rgb);
            }
        } else {
            baseValueInfo.hue = numberArr[0];
            baseValueInfo.saturation = numberArr[1];
            baseValueInfo.brightness = numberArr[2];
            if (baseValueInfo.valueType == "8bit") {
                numberArr[0] *= 3.6;
                numberArr = numberArr.map(function(n) { return n / 2.55; });
            }
            if (numberArr[0] == 360) {
                baseValueInfo.hue = 0;
                numberArr[0] = 0;
            }
            if (numberArr[0] != hsb[0] || numberArr[1] != hsb[1] || numberArr[2] != hsb[2]) {
                rgb = ColorInfo.hsbToRgb(numberArr);
                hsb = ColorInfo.rgbToHsb(rgb);
            }
        }
    };

    this.toString = function() {
        return "RGB(" + rgb.map(function(v) { return (Number.isInteger(v)) ? v : Math.round(v * 100) / 100; }).join("%,") + "%)";
    };
}
ColorInfo.FloatDigitRe = /^\d+\.\d+$/i;
ColorInfo.HexDigitRe = /^(?:\#|0x)?([a-f\d]{2}$)/i;
ColorInfo.ByteValueRe = /^(0*(?:2(?:5[0-5]|[0-4]\d)|1\d\d|[1-9]\d?)|0+)$/;
ColorInfo.HexStringRe = /^(?:\#|0x)?(?:([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})|([a-f\d])([a-f\d])([a-f\d]))$/i;
ColorInfo.HsbRe = /^HS[BV]\(\s*(0*(?:360(?:\.0+)?|(?:3[0-5]\d|[12]\d\d|[1-9]\d?)(?:\.\d+)?)|0+(?:\.\d+)?)(?:\xb0|&deg;)?,\s*(0*100(?:\.0+)?|(?:(?:0*[1-9]\d?|0+)(?:\.\d+)?))%?,\s*(0*100(?:\.0+)?|(?:(?:0*[1-9]\d?|0+)(?:\.\d+)?))%?\s*\)$/;
ColorInfo.RgbPctRe = /^RGB\(\s*(?:(0*100\.0+|(?:0*[1-9]\d?|0+)\.\d+)%?|(0*(?:100|[1-9]\d?)|0+)%),\s*(?:(0*100\.0+|(?:0*[1-9]\d?|0+)\.\d+)%?|(0*(?:100|[1-9]\d?)|0+)%),\s*(?:(0*100\.0+|(?:0*[1-9]\d?|0+)\.\d+)%?|(0*(?:100|[1-9]\d?)|0+)%)\s*\)$/;
ColorInfo.Rgb24BitRe = /^RGB\(\s*(0*(?:2(?:5[0-5]|[0-4]\d)|1\d\d|[1-9]\d?)|0+),\s*(0*(?:2(?:5[0-5]|[0-4]\d)|1\d\d|[1-9]\d?)|0+),\s*(0*(?:2(?:5[0-5]|[0-4]\d)|1\d\d|[1-9]\d?)|0+)\s*\)$/;
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
    if (ColorInfo.isNil(m[1]))
        return [m[4], m[5], m[6]].map(function(s) { return parseInt(s+s, 16); });
    return [m[1], m[2], m[3]].map(function(s) { return parseInt(s, 16); });
};

ColorInfo.parseColorString = function(text) {
    if (ColorInfo.isNil(text))
        return text;
    if (typeof(text) != "string")
        throw new Error("Argument must be a string value.");
    var m = ColorInfo.Rgb24BitRe.exec(text);
    if (!ColorInfo.isNil(m))
        return { red: parseInt(m[1]), green: parseInt(m[2]), blue: parseInt(m[3]), colorSpace: "rgb", valueType: "8bit" };
    m = ColorInfo.RgbPctRe.exec(text);
    if (!ColorInfo.isNil(m)) {
        var rgbArr = [m[1], m[2], m[3], m[4], m[5], m[6]].filter(function(v) { return typeof(v) == "string"; }).map(function(s) { return parseFloat(s); });
        return { red: rgbArr[0], green: rgbArr[1], blue: rgbArr[2], colorSpace: "rgb", valueType: "percent" };
    }
         
    m = ColorInfo.HsbRe.exec(text);
    if (!ColorInfo.isNil(m))
        return { hue: parseFloat(m[0]), saturation: parseFloat(m[1]), brightness: parseFloat(m[2]), colorSpace: "hsb", valueType: "percent" };
    m = ColorInfo.HexStringRe.exec(text);
    if (ColorInfo.isNil(m))
        throw new Error("Unknown color string");
    var hexArr = ((ColorInfo.isNil(m[1])) ? [m[4]+m[4], m[5]+m[5], m[6]+m[6]] : [m[1], m[2], m[3]]).map(function(s) { return parseInt(s, 16); });
    return { red: hexArr[0], green: hexArr[1], blue: hexArr[2], colorSpace: "rgb", valueType: "8bit" };
};
ColorInfo.rgbToHsb = function(rgb) {
    var red, green, blue;
    if (arguments.length > 1) {
        red = arguments[0];
        green = arguments[1];
        if (arguments.length > 2)
            blue = arguments[2];
    } else {
        if (!ColorInfo.isNil(rgb)) {
            if (Array.isArray(rgb)) {
                if (rgb.length > 0) {
                    red = rgb[0];
                    if (rgb.length > 1) {
                        green = rgb[1];
                        if (rgb.length > 2)
                            blue = rgb[2];
                    }
                }
                if (ColorInfo.isNil(red))
                    red = (ColorInfo.isNil(rgb.red)) ? rgb.r : ((typeof(rgb.red) == "function") ? rgb.red() : rgb.red);
                if (ColorInfo.isNil(green))
                    green = (ColorInfo.isNil(rgb.green)) ? rgb.g : ((typeof(rgb.green) == "function") ? rgb.green() : rgb.green);
                if (ColorInfo.isNil(blue))
                    blue = (ColorInfo.isNil(rgb.blue)) ? rgb.b : ((typeof(rgb.blue) == "function") ? rgb.blue() : rgb.blue);
            } else {
                red = (ColorInfo.isNil(rgb.red)) ? rgb.r : ((typeof(rgb.red) == "function") ? rgb.red() : rgb.red);
                green = (ColorInfo.isNil(rgb.green)) ? rgb.g : ((typeof(rgb.green) == "function") ? rgb.green() : rgb.green);
                blue = (ColorInfo.isNil(rgb.blue)) ? rgb.b : ((typeof(rgb.blue) == "function") ? rgb.blue() : rgb.blue);
            }
        }
    }
    red = ColorInfo.asInteger(red);
    if (ColorInfo.isNil(red))
        throw new Error("Invalid Red value");
    green = ColorInfo.asInteger(green);
    if (ColorInfo.isNil(green))
        throw new Error("Invalid Green value");
    blue = ColorInfo.asInteger(blue);
    if (ColorInfo.isNil(blue))
        throw new Error("Invalid Blue value");
    if (red < 0.0 || red > 100.0)
        throw new Error("Red must be a percentage value from 0.0 to 100.0");
    if (green < 0.0 || green > 100.0)
        throw new Error("Green must be a percentage value from 0.0 to 100.0");
    if (blue < 0.0 || blue > 100.0)
        throw new Error("Blue must be a percentage value from 0.0 to 100.0");

    red /= 100.0;
    green /= 100.0;
    blue /= 100.0;

    var max, min;
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

    var delta = max - min;
    if (delta == 0.0)
        return [ 0.0, 0.0, max * 100.0];

    var hue = ((max == red) ? ((green - blue) / delta) : ((max == green) ? (2.0 + (blue - red) / delta) :
        (4.0 + (red - green) / delta))) * 60.0;
    if (hue < 0.0)
        hue += 360.0;
    var mm = max + min;
    var brightness = mm / 2.0;
    return [ hue, ((brightness <= 0.5) ? delta / mm : delta / (2.0 - mm)) * 100.0, brightness * 100.0];
};
ColorInfo.hsbToRgb = function(hsb) {
    var hue, saturation, brightness;
    if (arguments.length > 1) {
        hue = arguments[0];
        saturation = arguments[1];
        if (arguments.length > 2)
            brightness = arguments[2];
    } else {
        if (!ColorInfo.isNil(hsb)) {
            if (Array.isArray(hsb)) {
                if (hsb.length > 0) {
                    hue = hsb[0];
                    if (hsb.length > 1) {
                        saturation = hsb[1];
                        if (hsb.length > 2)
                            brightness = hsb[2];
                    }
                }
                if (ColorInfo.isNil(hue))
                    hue = (ColorInfo.isNil(hsb.hue)) ? hsb.h : ((typeof(hsb.hue) == "function") ? hsb.hue() : hsb.hue);
                if (ColorInfo.isNil(saturation))
                    saturation = (ColorInfo.isNil(hsb.saturation)) ? hsb.s : ((typeof(hsb.saturation) == "function") ? hsb.saturation() : hsb.saturation);
                if (ColorInfo.isNil(brightness))
                    brightness = (ColorInfo.isNil(hsb.brightness)) ? hsb.b : ((typeof(hsb.brightness) == "function") ? hsb.brightness() : hsb.brightness);
            } else {
                hue = (ColorInfo.isNil(hsb.hue)) ? hsb.h : ((typeof(hsb.hue) == "function") ? hsb.hue() : hsb.hue);
                saturation = (ColorInfo.isNil(hsb.saturation)) ? hsb.s : ((typeof(hsb.saturation) == "function") ? hsb.saturation() : hsb.saturation);
                brightness = (ColorInfo.isNil(hsb.brightness)) ? hsb.b : ((typeof(hsb.brightness) == "function") ? hsb.brightness() : hsb.brightness);
            }
        }
    }
    hue = ColorInfo.asNumber(hue);
    if (ColorInfo.isNil(hue))
        throw new Error("Invalid Hue value");
    saturation = ColorInfo.asNumber(saturation);
    if (ColorInfo.isNil(saturation))
        throw new Error("Invalid Saturation value");
    brightness = ColorInfo.asNumber(brightness);
    if (ColorInfo.isNil(brightness))
        throw new Error("Invalid Brightness value");
    if (hue < 0 || hue > 360)
        throw new Error("Hue must be a value from 0.0 to 360.0");
    if (saturation < 0 || saturation > 100.0)
        throw new Error("Saturation must be a percentage value from 0.0 to 100.00");
    if (brightness < 0 || brightness > 100.0)
        throw new Error("Brightness must be a percentage value from 0.0 to 100.00");

    if (hue == 360)
        hue = 0;
    saturation /= 100.0;
    brightness /= 100.0;
    
    var min, max;
    if (brightness < 0.5) {
        min = brightness - brightness * saturation;
        max = brightness + brightness * saturation;
    } else {
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
    max *= 100.0;
    min *= 100.0;
    mid *= 100.0;
    switch (sextant)
    {
        case 0:
            return [max, mid, min];
        case 1:
            return [mid, max, min];
        case 2:
            return [min, max, mid];
        case 3:
            return [min, mid, max];
        case 4:
            return [mid, min, max];
    }
    return [max, min, mid];
}
ColorInfo.hsbToRgb8Bit = function(hsb) { return ColorInfo.hsbToRgb(hsb).map(function(v) { return Math.round(v * 2.55); }); };