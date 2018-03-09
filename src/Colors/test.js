var PercentNumberRe = /^(0*100(?:\.0+)?|(?:(?:0*[1-9]\d?|0+)(?:\.\d+)?))%?$/;
var PercentNumberRe2 = /^(?:(0*100\.0+|(?:0*[1-9]\d?|0+)\.\d+)%?|(0*(?:100|[1-9]\d?)|0+)%)$/;
var DegreeNumberRe = /^(0*(?:360(?:\.0+)?|(?:3[0-5]\d|[12]\d\d|[1-9]\d?)(?:\.\d+)?)|0+(?:\.\d+)?)(?:\xb0|&deg;)?$/;
var ByteValueRe = /^(0*(?:2(?:5[0-5]|[0-4]\d)|1\d\d|[1-9]\d?)|0+)$/;
var HexStringRe = /^(?:\#|0x)?(?:([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})|([a-f\d])([a-f\d])([a-f\d]))$/i;
var HsbRe = /^HS[BV]\(\s*(0*(?:360(?:\.0+)?|(?:3[0-5]\d|[12]\d\d|[1-9]\d?)(?:\.\d+)?)|0+(?:\.\d+)?)(?:\xb0|&deg;)?,\s*(0*100(?:\.0+)?|(?:(?:0*[1-9]\d?|0+)(?:\.\d+)?))%?,\s*(0*100(?:\.0+)?|(?:(?:0*[1-9]\d?|0+)(?:\.\d+)?))%?\s*\)$/;
var RgbPctRe = /^RGB\(\s*(?:(0*100\.0+|(?:0*[1-9]\d?|0+)\.\d+)%?|(0*(?:100|[1-9]\d?)|0+)%),\s*(?:(0*100\.0+|(?:0*[1-9]\d?|0+)\.\d+)%?|(0*(?:100|[1-9]\d?)|0+)%),\s*(?:(0*100\.0+|(?:0*[1-9]\d?|0+)\.\d+)%?|(0*(?:100|[1-9]\d?)|0+)%)\s*\)$/;
var RgbByteRe = /^RGB\(\s*(0*(?:2(?:5[0-5]|[0-4]\d)|1\d\d|[1-9]\d?)|0+),\s*(0*(?:2(?:5[0-5]|[0-4]\d)|1\d\d|[1-9]\d?)|0+),\s*(0*(?:2(?:5[0-5]|[0-4]\d)|1\d\d|[1-9]\d?)|0+)\s*\)$/;
var totalCount = 0;
var passCount = 0;
for (var pct = 0; pct < 101; pct++) {
    var values = [pct.toString()];
    values.push(values[0] + ".0");
    if (pct < 100) {
        values.push(values[0] + ".5");
        values.push(values[0] + ".0125");
    }
    values = values.concat(values.map(function(s) { return "000000000000000000000" + s; }));
    values = values.concat(values.map(function(s) { return s + "%"; }));
    totalCount += values.length;
    passCount += values.filter(function(s) {
        var m = PercentNumberRe.exec(s);
        var t = typeof(m);
        if (t != "undefined" && m !== null)
            return true;
        console.warn("PercentNumberRe.exec(\"" + s + "\") match failed");
        return false;
    }).length;
}
if (totalCount == passCount)
    console.log("PercentNumberRe: All " + totalCount + " tests passed");
else
    console.warn("PercentNumberRe: " + passCount + " passed; " + (totalCount - passCount) + " failed");
    
totalCount = 0;
passCount = 0;
for (var deg = 0; deg < 361; deg++) {
    var values = [deg.toString()];
    values.push(values[0] + ".0");
    if (deg < 360) {
        values.push(values[0] + ".5");
        values.push(values[0] + ".0125");
    }
    values = values.concat(values.map(function(s) { return "000000000000000000000" + s; }));
    values = values.concat(values.map(function(s) { return s + "\xb0"; })).concat(values.map(function(s) { return s + "&deg;"; }));
    totalCount += values.length;
    passCount += values.filter(function(s) {
        var m = DegreeNumberRe.exec(s);
        var t = typeof(m);
        if (t != "undefined" && m !== null)
            return true;
        console.warn("DegreeNumberRe.exec(\"" + s + "\") match failed");
        return false;
    }).length;
}
if (totalCount == passCount)
    console.log("DegreeNumberRe: All " + totalCount + " tests passed");
else
    console.warn("DegreeNumberRe: " + passCount + " passed; " + (totalCount - passCount) + " failed");

var hsbTestValues = [];
var pctValues = [0, 25, (1/3), 50, (5/6), 100 ];
var pctStrings = pctValues.map(function(n) { return n.toString(); });
pctValues.forEach(function(i) {
    var h = (i * 0.36).toString();
    pctStrings.forEach(function(s) {
        pctStrings.forEach(function(b) {
            hsbTestValues.push({ expected: [h, s, b], text: "HSB(" + h + "," + s + "," + b + ")" });
            hsbTestValues.push({ expected: [h, s, b], text: "HSB(" + h + "\xb0," + s + "%," + b + "%)" });
            hsbTestValues.push({ expected: [h, s, b], text: "HSB(" + h + "&deg;," + s + "%," + b + "%)" });
            hsbTestValues.push({ expected: [h, s, b], text: "HSV(" + h + "," + s + "," + b + ")" });
            hsbTestValues.push({ expected: [h, s, b], text: "HSV(" + h + "\xb0," + s + "%," + b + "%)" });
            hsbTestValues.push({ expected: [h, s, b], text: "HSV(" + h + "&deg;," + s + "%," + b + "%)" });
        });
    });
});

totalCount = hsbTestValues.length;
passCount = hsbTestValues.filter(function(d) {
    var matchResult = HsbRe.exec(d.text);
    var t = typeof(matchResult);
    if (t == "undefined" || matchResult === null) {
        console.warn("HsbRe.exec(\"" + d.text + "\") match failed");
        return false;
    }
    var success = true;
    for (var i = 0; i < 3; i++) {
        var actual = matchResult[i+1];
        t = typeof(actual);
        if (t != "string")
            console.warn("HsbRe.exec(\"" + d.text + "\"): Type mismatch. Expected [" + i + "] string; actual: " + t);
        else if (actual != d.expected[i])
            console.warn("HsbRe.exec(\"" + d.text + "\"): Not equal. Expected [" + i + "] \"" + d.expected[i] + "\" string; actual: \"" + actual + "\"");
        else
            continue;
        success = false;
    }
    return success;
}).length;
if (totalCount == passCount)
    console.log("HsbRe: All " + totalCount + " tests passed");
else
    console.warn("HsbRe: " + passCount + " passed; " + (totalCount - passCount) + " failed");

var rgbPctTestValues = [];
var pctOptStrings = pctStrings.map(function(s) { return { noDecimal: s.indexOf(".") < 0, text: s }; });
pctOptStrings.forEach(function(r) {
    pctOptStrings.forEach(function(g) {
        pctOptStrings.forEach(function(b) {
            var expected = [undefined, undefined, undefined, undefined, undefined, undefined];
            if (r.noDecimal)
                expected[1] = r.text;
            else
                expected[0] = r.text;
            if (g.noDecimal)
                expected[3] = g.text;
            else
                expected[2] = g.text;
            if (b.noDecimal)
                expected[5] = b.text;
            else
                expected[4] = b.text;
            rgbPctTestValues.push({ expected: expected, text: "RGB(" + r.text + "%," + g.text + "%," + b.text + "%)" });
            if (r.noDecimal) {
                if (g.noDecimal) {
                    if (!b.noDecimal)
                        rgbPctTestValues.push({ expected: expected, text: "RGB(" + r.text + "%," + g.text + "%," + b.text + ")" });
                } else if (b.noDecimal)
                    rgbPctTestValues.push({ expected: expected, text: "RGB(" + r.text + "%," + g.text + "," + b.text + "%)" });
                else
                    rgbPctTestValues.push({ expected: expected, text: "RGB(" + r.text + "%," + g.text + "," + b.text + ")" });
            } else if (g.noDecimal) {
                if (b.noDecimal)
                    rgbPctTestValues.push({ expected: expected, text: "RGB(" + r.text + "," + g.text + "%," + b.text + "%)" });
                else
                    rgbPctTestValues.push({ expected: expected, text: "RGB(" + r.text + "," + g.text + "%," + b.text + ")" });
            } else if (b.noDecimal)
                rgbPctTestValues.push({ expected: expected, text: "RGB(" + r.text + "," + g.text + "," + b.text + "%)" });
            else
                rgbPctTestValues.push({ expected: expected, text: "RGB(" + r.text + "," + g.text + "," + b.text + ")" });
        });
    });
});
totalCount = rgbPctTestValues.length;
passCount = rgbPctTestValues.filter(function(d) {
    var matchResult = RgbPctRe.exec(d.text);
    var t = typeof(matchResult);
    if (t == "undefined" || matchResult === null) {
        console.warn("RgbPctRe.exec(\"" + d.text + "\") match failed");
        return false;
    }
    var success = true;
    for (var i = 0; i < 6; i++) {
        var actualValue = matchResult[i+1];
        var expectedValue = d.expected[i];
        actualType = typeof(actualValue);
        expectedType = typeof(expectedValue);
        if (expectedType != actualType) 
            console.warn("RgbPctRe.exec(\"" + d.text + "\"): Type mismatch. Expected [" + i + "] " + expectedType + "\"; actual: " + actualType);
        else if (expectedType !== "undefined" && actualValue != expectedValue)
            console.warn("RgbPctRe.exec(\"" + d.text + "\"): Not equal. Expected [" + i + "] \"" + expectedValue + "\" string; actual: \"" + actualValue + "\"");
        else
            continue;
        success = false;
    }
    return success;
}).length;
var rgbByteTestValues = [];
var byteValues = pctValues.map(function(n) { return Math.round(n * 2.55); });
var hexStrings = byteValues.map(function(n) {
    if (n < 16)
        return "0" + n.toString(16);
    return n.toString(16);
});
var byteStrings = byteValues.map(function(n) { return n.toString(); });
byteStrings.forEach(function(r) {
    byteStrings.forEach(function(g) {
        byteStrings.forEach(function(b) {
            rgbByteTestValues.push({ expected: [r, g, b], text: "RGB(" + r + "," + g + "," + b + ")" });
        });
    });
});
totalCount += rgbByteTestValues.length;
passCount += rgbByteTestValues.filter(function(d) {
    var matchResult = RgbPctRe.exec(d.text);
    if (typeof(matchResult) == "undefined" || matchResult === null)
        return true;
    console.warn("RgbPctRe.exec(\"" + d.text + "\") match did not fail");
    return false;
}).length;
if (totalCount == passCount)
    console.log("RgbPctRe: All " + totalCount + " tests passed");
else
    console.warn("RgbPctRe: " + passCount + " passed; " + (totalCount - passCount) + " failed");
    
totalCount += rgbByteTestValues.length;
passCount += rgbByteTestValues.filter(function(d) {
    var matchResult = RgbByteRe.exec(d.text);
    var t = typeof(matchResult);
    if (t == "undefined" || matchResult === null) {
        console.warn("RgbByteRe.exec(\"" + d.text + "\") match failed");
        return false;
    }
    var success = true;
    for (var i = 0; i < 3; i++) {
        var actual = matchResult[i+1];
        t = typeof(actual);
        if (t != "string")
            console.warn("RgbByteRe.exec(\"" + d.text + "\"): Type mismatch. Expected [" + i + "] string; actual: " + t);
        else if (actual != d.expected[i])
            console.warn("RgbByteRe.exec(\"" + d.text + "\"): Not equal. Expected [" + i + "] \"" + d.expected[i] + "\" string; actual: \"" + actual + "\"");
        else
            continue;
        success = false;
    }
    return success;
}).length;
if (totalCount == passCount)
    console.log("RgbByteRe: All " + totalCount + " tests passed");
else
    console.warn("RgbByteRe: " + passCount + " passed; " + (totalCount - passCount) + " failed");