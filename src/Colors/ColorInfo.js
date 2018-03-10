var ColorInfo = (function() {
    var __ColorSpace_HSB = "hsb";
    var __ColorSpace_RGB = "rgb";
    var __ValueType_INT = "int";
    var __ValueType_FLOAT = "float";
    var __floatDigitRe = /^\d+\.\d+$/i;
    var __hexDigitRe = /^(?:\#|0x)?([a-f\d]{2}$)/i;
    var __hexStringRe = /^(?:\#|0x)?(?:([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})|([a-f\d])([a-f\d])([a-f\d]))$/i;

    var __asNumber = function(value) {
        if (typeof(value) != "undefined" && value !== null) {
            if (typeof(value) == "number") {
                if (!isNaN(value))
                    return value;
            } else if (typeof(value) == "string" && (value = value.trim().length > 0)) {
                if (__floatDigitRe.test(value))
                    return parseFloat(value);
                var m = __hexDigitRe.exec(value);
                if (!__isNil(m))
                    return parseInt(m[1], 16);

                var n = parseFloat(value);
                if (!isNaN(n))
                    return n;
            }
        }
    };

    var __isNil = function(value) { return typeof(value) == "undefined" || value === null; };
    
    var __asInteger = function(value) {
        if (!__isNil(value)) {
            if (typeof(value) == "number") {
                if (!isNaN(value)) {
                    if (Number.isInteger(value))
                        return value;
                    return Math.round(value);
                }
            } else if (typeof(value) == "string" && (value = value.trim().length > 0)) {
                var m = __hexDigitRe.exec(value);
                if (!__isNil(m))
                    return parseInt(m[1], 16);
                var n = parseInt(value);
                if (!isNaN(n))
                    return n;
            }
        }
    };
    
    var __parseHexString = function(text) {
        if (__isNil(text))
            return text;
        if (typeof(text) != "string")
            throw new Error("Argument must be a string value.");
        var m = __hexStringRe.exec(text);
        if (__isNil(m))
            throw new Error("Invalid hexidecimal color string");
        if (!__isNil(m[1]))
            return new Rgb8BitColorValues(parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16));

        return new Rgb8BitColorValues(parseInt(m[4]+m[4], 16), parseInt(m[5]+m[5], 16), parseInt(m[6]+m[6], 16));
    };
    
    var __rgbToHsb = function(rgb) {
        if (arguments.length > 1)
            return __rgbCvToHsb(new RgbPercentColorValues(arguments[0], arguments[1], arguments[2]));
        if (!__isNil(rgb)) {
            if (Array.isArray(rgb))
                return __rgbCvToHsb(new RgbPercentColorValues(rgb[0], rgb[1], rgb[2]));
            else {
                var arr = [
                    (typeof(rgb.red) == "function") ? rgb.red() : ((__isNil(rgb.red)) ? rgb.r : rgb.red),
                    (typeof(rgb.green) == "function") ? rgb.green() : ((__isNil(rgb.green)) ? rgb.g : rgb.green),
                    (typeof(rgb.blue) == "function") ? rgb.blue() : ((__isNil(rgb.blue)) ? rgb.b : rgb.blue)
                ];
                if (((typeof(rgb.valueType) == "function") ? rgb.valueType() : rgb.valueType) === __ValueType_INT)
                    return __rgbCvToHsb(new Rgb8BitColorValues(arr[0], arr[1], arr[2]));
                else
                    return __rgbCvToHsb(new RgbPercentColorValues(arr[0], arr[1], arr[2]));
            }
        }
    };
    
    var __hsbToRgb = function(hsb) {
        if (arguments.length > 1)
            return __hsbCvToRgb(new HsbPercentColorValues(arguments[0], arguments[1], arguments[2]));
        if (!__isNil(hsb)) {
            if (Array.isArray(hsb))
                return __hsbCvToHsb(new HsbPercentColorValues(hsb[0], hsb[1], hsb[2]));
            var arr = [
                (typeof(hsb.hue) == "function") ? hsb.hue() : ((__isNil(hsb.hue)) ? hsb.h : hsb.hue),
                (typeof(hsb.saturation) == "function") ? hsb.saturation() : ((__isNil(hsb.saturation)) ? hsb.s : hsb.saturation),
                (typeof(hsb.brightness) == "function") ? hsb.brightness() : ((__isNil(hsb.brightness)) ? hsb.b : hsb.brightness)
            ];
            if (((typeof(hsb.valueType) == "function") ? hsb.valueType() : hsb.valueType) === __ValueType_INT)
                return __hsbCvToRgb(new Hsb8BitColorValues(arr[0], arr[1], arr[2]));
            else
                return __hsbCvToRgb(new HsbPercentColorValues(arr[0], arr[1], arr[2]));
        }
    };
    
    var __setRgbHsb = function(rgb, hsb) {
        this.rgb = rgb;
        this.hsb = hsb;
    };
    
    var __rgbCvToHsb = function(rgb) {
        var errorMessages = rgb.getErrorMessages();
        if (errorMessages.length > 0)
            throw new Error(errorMessages.join("; "));
        var red, green, blue;
        if (rgb.valueType == __ValueType_INT) {
            red = rgb.red / 255;
            green = rgb.green / 255;
            blue = rgb.blue / 255;
        } else {
            red = rgb.red / 100;
            green = rgb.green / 100;
            blue = rgb.blue / 100;
        }
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
            return new HsbPercentColorValues(0.0, 0.0, max * 100.0);

        hue = ((max == red) ? ((green - blue) / delta) : ((max == green) ? (2.0 + (blue - red) / delta) :
            (4.0 + (red - green) / delta))) * 60.0;
        if (hue < 0.0)
            hue += 360.0;
        var mm = max + min;
        brightness = mm / 2.0;
        return new HsbPercentColorValues(hue, ((brightness <= 0.5) ? (delta / mm) : (delta / (2.0 - mm))) * 100.0, brightness * 100.0);
    };
    
    var __hsbCvToRgb = function(hsb) {
        var errorMessages = hsb.getErrorMessages();
        if (errorMessages.length > 0)
            throw new Error(errorMessages.join("; "));
        var hue, saturation, brightness;
        if (hsb.valueType == __ValueType_INT) {
            hue = (hsb.hue / 2.55) * 3.6;
            green = hsb.green / 255;
            blue = hsb.blue / 255;
        } else {
            hue = hsb.hue;
            saturation = hsb.saturation / 100;
            brightness = hsb.brightness / 100;
        }

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
        max *= 100;
        mid *= 100;
        min *= 100;
        switch (sextant)
        {
            case 0:
                return new RgbPercentColorValues(max, mid, min);
            case 1:
                return new RgbPercentColorValues(mid, max, min);
            case 2:
                return new RgbPercentColorValues(min, max, mid);
            case 3:
                return new RgbPercentColorValues(min, mid, max);
            case 4:
                return new RgbPercentColorValues(mid, min, max);
        }
        return new RgbPercentColorValues(max, min, mid);
    };

    function RgbPercentColorValues(red, green, blue) {
        this.red = __red = (typeof(red) == "undefined") ? 0 : red;
        this.green = __green = (typeof(green) == "undefined") ? 0 : green;
        this.blue = __blue = (typeof(blue) == "undefined") ? 0 : blue;
        this.colorSpace = __ColorSpace_RGB;
        this.valueType = __ValueType_FLOAT;
        this.propertyNames = ["red", "green", "blue"];
        this.maxValues = [100, 100, 100];
        this.setRed = function(value) {
            if (typeof(value) == "string")
                value = parseFloat(value);
            if (typeof(value) != "number" || isNaN(value))
                throw new Error("Invalid Red value");
            if (value < 0)
                throw new Error("Red value cannot be less than zero");
            if (value > 100)
                throw new Error("Red value cannot be greater than 100");
            if (this.red == value)
                return false;
            this.red = value;
            return true;
        };
        this.setGreen = function(value) {
            if (typeof(value) == "string")
                value = parseFloat(value);
            if (typeof(value) != "number" || isNaN(value))
                throw new Error("Invalid Green value");
            if (value < 0)
                throw new Error("Green value cannot be less than zero");
            if (value > 100)
                throw new Error("Green value cannot be greater than 100");
            if (this.green == value)
                return false;
            this.green = value;
            return true;
        };
        this.setBlue = function(value) {
            if (typeof(value) == "string")
                value = parseFloat(value);
            if (typeof(value) != "number" || isNaN(value))
                throw new Error("Invalid Blue value");
            if (value < 0)
                throw new Error("Blue value cannot be less than zero");
            if (value > 100)
                throw new Error("Blue value cannot be greater than 100");
            if (this.blue == value)
                return false;
            this.blue = value;
            return true;
        };
        this.getValues = function() {
            this.getErrorMessages();
            return [ this.red, this.green, this.blue ];
        };
        this.isChanged = function() { return this.__red !== this.red || this.__green !== this.green || this.__blue !== this.blue; };
        this.getErrorMessages = function() {
            if (typeof(this.errorMessages) != "undefined" && this.__red === this.red && this.__green === this.green &&
                    this.__blue === this.blue)
                return this.errorMessages;
            this.errorMessages = [];
            for (var i = 0; i < this.propertyNames.length; i++) {
                var name = this.propertyNames[i];
                value = this[name];
                var t = typeof(value);
                if (t === "undefined") {
                    this.errorMessages.push("The " + name + " value is undefined");
                    continue;
                }
                if (t == "string") {
                    var n = parseFloat(value);
                    if (!isNaN(n))
                        value = n;
                    t = typeof(value);
                }
                if (t != "number") {
                    if (value === null)
                        this.errorMessages.push("The " + name + " value is null");
                    else
                        this.errorMessages.push("The " + name + " is of type [" + t + "]");
                } else if (isNaN(value))
                    this.errorMessages.push("The " + name + " value is not a number");
                else if (value < 0)
                    this.errorMessages.push("The " + name + " value is less than zero");
                else if (value > 100)
                    this.errorMessages.push("The " + name + " value is greater than 100");
                this[name] = value;
                this["__" + name] = value;
            }
            return this.errorMessages;
        };
    }
    
    function Rgb8BitColorValues(red, green, blue) {
        this.red = __red = (typeof(red) == "undefined") ? 0 : red;
        this.green = __green = (typeof(green) == "undefined") ? 0 : green;
        this.blue = __blue = (typeof(blue) == "undefined") ? 0 : blue;
        this.colorSpace = __ColorSpace_RGB;
        this.valueType = __ValueType_INT;
        this.propertyNames = ["red", "green", "blue"];
        this.maxValues = [255, 255, 255];
        this.setRed = function(value) {
            if (typeof(value) == "string")
                value = parseInt(value);
            if (typeof(value) != "number" || isNaN(value))
                throw new Error("Invalid Red value");
            if (!Number.isInteger(value))
                value = Math.round(value);
            if (value < 0)
                throw new Error("Red value cannot be less than zero");
            if (value > 255)
                throw new Error("Red value cannot be greater than 255");
            if (this.red == value)
                return false;
            this.red = value;
            return true;
        };
        this.setGreen = function(value) {
            if (typeof(value) == "string")
                value = parseInt(value);
            if (typeof(value) != "number" || isNaN(value))
                throw new Error("Invalid Green value");
            if (!Number.isInteger(value))
                value = Math.round(value);
            if (value < 0)
                throw new Error("Green value cannot be less than zero");
            if (value > 255)
                throw new Error("Green value cannot be greater than 255");
            if (this.green == value)
                return false;
            this.green = value;
            return true;
        };
        this.setBlue = function(value) {
            if (typeof(value) == "string")
                value = parseInt(value);
            if (typeof(value) != "number" || isNaN(value))
                throw new Error("Invalid Blue value");
            if (!Number.isInteger(value))
                value = Math.round(value);
            if (value < 0)
                throw new Error("Blue value cannot be less than zero");
            if (value > 255)
                throw new Error("Blue value cannot be greater than 255");
            if (this.blue == value)
                return false;
            this.blue = value;
            return true;
        };
        this.getValues = function() {
            this.getErrorMessages();
            return [ this.red, this.green, this.blue ];
        };
        this.isChanged = function() { return this.__red !== this.red || this.__green !== this.green || this.__blue !== this.blue; };
        this.getErrorMessages = function() {
            if (typeof(this.errorMessages) != "undefined" && this.__red === this.red && this.__green === this.green &&
                    this.__blue === this.blue)
                return this.errorMessages;
            this.errorMessages = [];
            for (var i = 0; i < this.propertyNames.length; i++) {
                var name = this.propertyNames[i];
                value = this[name];
                var t = typeof(value);
                if (t === "undefined") {
                    this.errorMessages.push("The " + name + " value is undefined");
                    continue;
                }
                if (t == "string") {
                    var n = parseFloat(value);
                    if (!isNaN(n))
                        value = n;
                    t = typeof(value);
                }
                if (t != "number") {
                    if (value === null)
                        this.errorMessages.push("The " + name + " value is null");
                    else
                        this.errorMessages.push("The " + name + " is of type [" + t + "]");
                } else if (isNaN(value))
                    this.errorMessages.push("The " + name + " value is not a number");
                else {
                    if (!Number.isInteger(value))
                        value = Math.round(value);
                    if (value < 0)
                        this.errorMessages.push("The " + name + " value is less than zero");
                    else if (value > 255)
                        this.errorMessages.push("The " + name + " value is greater than 255");
                }
                this[name] = value;
                this["__" + name] = value;
            }
            return this.errorMessages;
        };
    }
    
    function HsbPercentColorValues(hue, saturation, brightness) {
        this.hue = __hue = (typeof(hue) == "undefined") ? 0 : hue;
        this.saturation = __saturation = (typeof(saturation) == "undefined") ? 0 : saturation;
        this.brightness = __brightness = (typeof(brightness) == "undefined") ? 0 : brightness;
        this.colorSpace = __ColorSpace_HSB;
        this.valueType = __ValueType_FLOAT;
        this.propertyNames = ["hue", "saturation", "brightness"];
        this.maxValues = [360, 100, 100];
        this.setHue = function(value) {
            if (typeof(value) == "string")
                value = parseFloat(value);
            if (typeof(value) != "number" || isNaN(value))
                throw new Error("Invalid Hue value");
            if (value < 0)
                throw new Error("Hue value cannot be less than zero");
            if (value > 360)
                throw new Error("Hue value cannot be greater than 360");
            if (value == 360)
                value = 0;
            if (this.hue == value)
                return false;
            this.hue = value;
            return true;
        };
        this.setSaturation = function(value) {
            if (typeof(value) == "string")
                value = parseFloat(value);
            if (typeof(value) != "number" || isNaN(value))
                throw new Error("Invalid Saturation value");
            if (value < 0)
                throw new Error("Saturation value cannot be less than zero");
            if (value > 100)
                throw new Error("Saturation value cannot be greater than 100");
            if (this.saturation == value)
                return false;
            this.saturation = value;
            return true;
        };
        this.setBrightness = function(value) {
            if (typeof(value) == "string")
                value = parseFloat(value);
            if (typeof(value) != "number" || isNaN(value))
                throw new Error("Invalid Brightness value");
            if (value < 0)
                throw new Error("Brightness value cannot be less than zero");
            if (value > 100)
                throw new Error("Brightness value cannot be greater than 100");
            if (this.brightness == value)
                return false;
            this.brightness = value;
            return true;
        };
        this.getValues = function() {
            this.getErrorMessages();
            return [ this.hue, this.saturation, this.brightness ];
        };
        this.isChanged = function() { return this.__hue !== this.hue || this.__saturation !== this.saturation || this.__brightness !== this.brightness; };
        this.getErrorMessages = function() {
            if (typeof(this.errorMessages) != "undefined" && this.__hue === this.hue && this.__saturation === this.saturation &&
                    this.__brightness === this.brightness)
                return this.errorMessages;
            this.errorMessages = [];
            for (var i = 0; i < this.propertyNames.length; i++) {
                var name = this.propertyNames[i];
                value = this[name];
                var t = typeof(value);
                if (t === "undefined") {
                    this.errorMessages.push("The " + name + " value is undefined");
                    continue;
                }
                if (t == "string") {
                    var n = parseFloat(value);
                    if (!isNaN(n))
                        value = n;
                    t = typeof(value);
                }
                if (t != "number") {
                    if (value === null)
                        this.errorMessages.push("The " + name + " value is null");
                    else
                        this.errorMessages.push("The " + name + " is of type [" + t + "]");
                } else if (isNaN(value))
                    this.errorMessages.push("The " + name + " value is not a number");
                else if (value < 0)
                    this.errorMessages.push("The " + name + " value is less than zero");
                else if (value > this.maxValues[i])
                    this.errorMessages.push("The " + name + " value is greater than " + this.maxValues[i]);
                else if (value == 360)
                    value = 0;
                this[name] = value;
                this["__" + name] = value;
            }
            return this.errorMessages;
        };
    }
    
    function Hsb8BitColorValues(hue, saturation, brightness) {
        this.hue = __hue = hue;
        this.saturation = __saturation = saturation;
        this.brightness = __brightness = brightness;
        this.colorSpace = __ColorSpace_HSB;
        this.valueType = __ValueType_INT;
        this.propertyNames = ["hue", "saturation", "brightness"];
        this.maxValues = [255, 255, 255];
        this.setHue = function(value) {
            if (typeof(value) == "string")
                value = parseInt(value);
            if (typeof(value) != "number" || isNaN(value))
                throw new Error("Invalid Hue value");
            if (!Number.isInteger(value))
                value = Math.round(value);
            if (value < 0)
                throw new Error("Hue value cannot be less than zero");
            if (value > 255)
                throw new Error("Hue value cannot be greater than 255");
            if (value == 255)
                value = 0;
            if (this.hue == value)
                return false;
            this.hue = value;
            return true;
        };
        this.setSaturation = function(value) {
            if (typeof(value) == "string")
                value = parseInt(value);
            if (typeof(value) != "number" || isNaN(value))
                throw new Error("Invalid Saturation value");
            if (!Number.isInteger(value))
                value = Math.round(value);
            if (value < 0)
                throw new Error("Saturation value cannot be less than zero");
            if (value > 255)
                throw new Error("Saturation value cannot be greater than 255");
            if (this.saturation == value)
                return false;
            this.saturation = value;
            return true;
        };
        this.setBrightness = function(value) {
            if (typeof(value) == "string")
                value = parseInt(value);
            if (typeof(value) != "number" || isNaN(value))
                throw new Error("Invalid Brightness value");
            if (!Number.isInteger(value))
                value = Math.round(value);
            if (value < 0)
                throw new Error("Brightness value cannot be less than zero");
            if (value > 255)
                throw new Error("Brightness value cannot be greater than 255");
            if (this.brightness == value)
                return false;
            this.brightness = value;
            return true;
        };
        this.getValues = function() {
            this.getErrorMessages();
            return [ this.hue, this.saturation, this.brightness ];
        };
        this.isChanged = function() { return this.__hue !== this.hue || this.__saturation !== this.saturation || this.__brightness !== this.brightness; };
        this.getErrorMessages = function() {
            if (typeof(this.errorMessages) != "undefined" && this.__hue === this.hue && this.__saturation === this.saturation &&
                    this.__brightness === this.brightness)
                return this.errorMessages;
            this.errorMessages = [];
            for (var i = 0; i < this.propertyNames.length; i++) {
                var name = this.propertyNames[i];
                value = this[name];
                var t = typeof(value);
                if (t === "undefined") {
                    this.errorMessages.push("The " + name + " value is undefined");
                    continue;
                }
                if (t == "string") {
                    var n = parseFloat(value);
                    if (!isNaN(n))
                        value = n;
                    t = typeof(value);
                }
                if (t != "number") {
                    if (value === null)
                        this.errorMessages.push("The " + name + " value is null");
                    else
                        this.errorMessages.push("The " + name + " is of type [" + t + "]");
                } else if (isNaN(value))
                    this.errorMessages.push("The " + name + " value is not a number");
                else {
                    if (!Number.isInteger(value))
                        value = Math.round(value);
                    if (value < 0)
                        this.errorMessages.push("The " + name + " value is less than zero");
                    else if (value > 255)
                        this.errorMessages.push("The " + name + " value is greater than 255");
                    else if (value == 255 && name == "hue")
                        value = 0;
                }
                this[name] = value;
                this["__" + name] = value;
            }
            return this.errorMessages;
        };
    }
    
    function ColorInfo(color) {
        var colorValues = { };

        this.rgbValueType = function() { return colorValues.rgb.valueType; };

        this.hsbValueType = function() { return colorValues.hsb.valueType; };

        this.red = function(value) {
            if (__isNil(value))
                return colorValues.rgb.red;
            if (colorValues.rgb.setRed(value))
                __setRgbHsb.call(colorValues, colorValues.rgb, ColorInfo.__rgbCvToHsb(colorValues.rgb));
        };

        this.green = function(value) {
            if (__isNil(value))
                return colorValues.rgb.green;
            if (colorValues.rgb.setGreen(value))
                __setRgbHsb.call(colorValues, colorValues.rgb, ColorInfo.__rgbCvToHsb(colorValues.rgb));
        };

        this.blue = function(value) {
            if (__isNil(value))
                return colorValues.rgb.blue;
            if (colorValues.rgb.setBlue(value))
                __setRgbHsb.call(colorValues, colorValues.rgb, ColorInfo.__rgbCvToHsb(colorValues.rgb));
        };

        this.hue = function(value) {
            if (__isNil(value))
                return colorValues.hsb.hue;
            if (colorValues.hsb.setHue(value))
                __setRgbHsb.call(colorValues, ColorInfo.__hsbCvToRgb(colorValues.hsb), colorValues.hsb);
        };

        this.saturation = function(value) {
            if (__isNil(value))
                return colorValues.hsb.saturation;
            if (colorValues.hsb.setSaturation(value))
                __setRgbHsb.call(colorValues, ColorInfo.__hsbCvToRgb(colorValues.hsb), colorValues.hsb);
        };

        this.brightness = function(value) {
            if (__isNil(value))
                return colorValues.hsb.brightness;
            if (colorValues.hsb.setBrightness(value))
                __setRgbHsb.call(colorValues, ColorInfo.__hsbCvToRgb(colorValues.hsb), colorValues.hsb);
        };

        this.rgbHexString = function(value) {
            if (__isNil(value))
                return rgb.map(function(i) {
                    if (i < 16)
                        return "0" + i.toString(16);
                    return i.toString(16);
                }).join("");
            var newRgb = __parseHexString(value);
            if (newRgb[0] == rgb[0] && newRgb[1] == rgb[1] && newRgb[2] == rgb[2])
                return;
            rgb = newRgb;
            hsb = __rgbToHsb(rgb);
        };

        if (__isNil(color))
            __setRgbHsb.call(colorValues, new Rgb8BitColorValues(), new HsbPercentColorValues());
        else if (typeof(color) == "string") {
            var rgb = __parseHexString(color);
            __setRgbHsb.call(colorValues, rgb, __rgbCvToHsb(rgb));
        } 
        else if (typeof(color) == "object") {
            var newRgb = null, newHsb = null, em;
            if (cs === __ColorSpace_RGB) {
                newRgb = __rgbToHsb(color);
                em = newRgb.getErrorMessages();
            }
            else if (cs === __ColorSpace_HSB) {
                newHsb = __hsbToRgb(color);
                em = newHsb.getErrorMessages();
            }
            else {
                newRgb = __rgbToHsb(color);
                em = newRgb.getErrorMessages();
                if (newRgb.getErrorMessages().length > 0) {
                    newHsb = __hsbToRgb(color);
                    if (newHsb.getErrorMessages().length < newRgb.getErrorMessages().length) {
                        em = newHsb.getErrorMessages();
                        newRgb = null;
                    }
                    else
                    newHsb = null;
                }
            }
            if (em.length > 0)
                throw new Error(em.join("; "));
            if (newHsb == null)
                __setRgbHsb.call(colorValues, newRgb, __rgbCvToHsb(newRgb));
            else
                __setRgbHsb.call(colorValues, __hsbCvToRgb(newHsb), newHsb);
        }
    }

    ColorInfo.getInnerMethods = function() {
        return {
            asInteger: __asInteger,
            asNumber: __asNumber,
            hsbCvToRgb: __hsbCvToRgb,
            hsbToRgb: __hsbToRgb,
            isNil: __isNil,
            rgbCvToHsb: __rgbCvToHsb,
            rgbToHsb: __rgbToHsb,
            parseHexString: __parseHexString
        };
    };

    ColorInfo.Rgb8BitColorValues = Rgb8BitColorValues;
    ColorInfo.RgbPercentColorValues = RgbPercentColorValues;
    ColorInfo.Hsb8BitColorValues = Hsb8BitColorValues;
    ColorInfo.HsbPercentColorValues = HsbPercentColorValues;

    return ColorInfo;
})();