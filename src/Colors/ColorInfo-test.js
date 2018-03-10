var FS = require("fs");
var PATH = require("path");

eval.apply(global, [FS.readFileSync(PATH.join(__dirname, "ColorInfo.js")).toString()]);

var testData = [
    { name: "Transparent", red: 255, green: 255, blue: 255,
        hue: 0, saturation: 0, brightness: 100 },
    { name: "AliceBlue", red: 240, green: 248, blue: 255,
        hue: 208, saturation: 100, brightness: 97.0588207244873 },
    { name: "AntiqueWhite", red: 250, green: 235, blue: 215,
        hue: 34.28572, saturation: 77.7778029441834, brightness: 91.1764740943909 },
    { name: "Aqua", red: 0, green: 255, blue: 255,
        hue: 180, saturation: 100, brightness: 50 },
    { name: "Aquamarine", red: 127, green: 255, blue: 212,
        hue: 159.8438, saturation: 100, brightness: 74.9019622802734 },
    { name: "Azure", red: 240, green: 255, blue: 255,
        hue: 180, saturation: 100, brightness: 97.0588207244873 },
    { name: "Beige", red: 245, green: 245, blue: 220,
        hue: 60, saturation: 55.5555582046509, brightness: 91.1764740943909 },
    { name: "Bisque", red: 255, green: 228, blue: 196,
        hue: 32.54237, saturation: 100, brightness: 88.4313702583313 },
    { name: "Black", red: 0, green: 0, blue: 0,
        hue: 0, saturation: 0, brightness: 0 },
    { name: "BlanchedAlmond", red: 255, green: 235, blue: 205,
        hue: 36, saturation: 100, brightness: 90.1960790157318 },
    { name: "Blue", red: 0, green: 0, blue: 255,
        hue: 240, saturation: 100, brightness: 50 },
    { name: "BlueViolet", red: 138, green: 43, blue: 226,
        hue: 271.1476, saturation: 75.9336173534393, brightness: 52.7450978755951 },
    { name: "Brown", red: 165, green: 42, blue: 42,
        hue: 0, saturation: 59.4202935695648, brightness: 40.5882358551025 },
    { name: "BurlyWood", red: 222, green: 184, blue: 135,
        hue: 33.79311, saturation: 56.8627536296844, brightness: 70.0000047683716 },
    { name: "CadetBlue", red: 95, green: 158, blue: 160,
        hue: 181.8462, saturation: 25.4901975393295, brightness: 50 },
    { name: "Chartreuse", red: 127, green: 255, blue: 0,
        hue: 90.11765, saturation: 100, brightness: 50 },
    { name: "Chocolate", red: 210, green: 105, blue: 30,
        hue: 25, saturation: 75, brightness: 47.0588237047195 },
    { name: "Coral", red: 255, green: 127, blue: 80,
        hue: 16.11428, saturation: 100, brightness: 65.6862735748291 },
    { name: "CornflowerBlue", red: 100, green: 149, blue: 237,
        hue: 218.5401, saturation: 79.1907548904419, brightness: 66.0784304141998 },
    { name: "Cornsilk", red: 255, green: 248, blue: 220,
        hue: 48, saturation: 100, brightness: 93.13725233078 },
    { name: "Crimson", red: 220, green: 20, blue: 60,
        hue: 348, saturation: 83.3333373069763, brightness: 47.0588237047195 },
    { name: "Cyan", red: 0, green: 255, blue: 255,
        hue: 180, saturation: 100, brightness: 50 },
    { name: "DarkBlue", red: 0, green: 0, blue: 139,
        hue: 240, saturation: 100, brightness: 27.2549033164978 },
    { name: "DarkCyan", red: 0, green: 139, blue: 139,
        hue: 180, saturation: 100, brightness: 27.2549033164978 },
    { name: "DarkGoldenrod", red: 184, green: 134, blue: 11,
        hue: 42.65896, saturation: 88.7179493904114, brightness: 38.2352948188782 },
    { name: "DarkGray", red: 169, green: 169, blue: 169,
        hue: 0, saturation: 0, brightness: 66.2745118141174 },
    { name: "DarkGreen", red: 0, green: 100, blue: 0,
        hue: 120, saturation: 100, brightness: 19.6078434586525 },
    { name: "DarkKhaki", red: 189, green: 183, blue: 107,
        hue: 55.60976, saturation: 38.3177608251572, brightness: 58.0392181873322 },
    { name: "DarkMagenta", red: 139, green: 0, blue: 139,
        hue: 300, saturation: 100, brightness: 27.2549033164978 },
    { name: "DarkOliveGreen", red: 85, green: 107, blue: 47,
        hue: 81.99999, saturation: 38.9610379934311, brightness: 30.1960796117783 },
    { name: "DarkOrange", red: 255, green: 140, blue: 0,
        hue: 32.94118, saturation: 100, brightness: 50 },
    { name: "DarkOrchid", red: 153, green: 50, blue: 204,
        hue: 280.1299, saturation: 60.6299221515656, brightness: 49.8039215803146 },
    { name: "DarkRed", red: 139, green: 0, blue: 0,
        hue: 0, saturation: 100, brightness: 27.2549033164978 },
    { name: "DarkSalmon", red: 233, green: 150, blue: 122,
        hue: 15.13514, saturation: 71.6129004955292, brightness: 69.6078419685364 },
    { name: "DarkSeaGreen", red: 143, green: 188, blue: 139,
        hue: 115.102, saturation: 26.7759531736374, brightness: 64.1176462173462 },
    { name: "DarkSlateBlue", red: 72, green: 61, blue: 139,
        hue: 248.4615, saturation: 39.000004529953, brightness: 39.215686917305 },
    { name: "DarkSlateGray", red: 47, green: 79, blue: 79,
        hue: 180, saturation: 25.3968238830566, brightness: 24.7058838605881 },
    { name: "DarkTurquoise", red: 0, green: 206, blue: 209,
        hue: 180.8612, saturation: 100, brightness: 40.9803926944733 },
    { name: "DarkViolet", red: 148, green: 0, blue: 211,
        hue: 282.0853, saturation: 100, brightness: 41.372549533844 },
    { name: "DeepPink", red: 255, green: 20, blue: 147,
        hue: 327.5745, saturation: 100, brightness: 53.9215683937073 },
    { name: "DeepSkyBlue", red: 0, green: 191, blue: 255,
        hue: 195.0588, saturation: 100, brightness: 50 },
    { name: "DimGray", red: 105, green: 105, blue: 105,
        hue: 0, saturation: 0, brightness: 41.1764711141586 },
    { name: "DodgerBlue", red: 30, green: 144, blue: 255,
        hue: 209.6, saturation: 100, brightness: 55.8823525905609 },
    { name: "Firebrick", red: 178, green: 34, blue: 34,
        hue: 0, saturation: 67.9245293140411, brightness: 41.5686279535294 },
    { name: "FloralWhite", red: 255, green: 250, blue: 240,
        hue: 40, saturation: 100, brightness: 97.0588207244873 },
    { name: "ForestGreen", red: 34, green: 139, blue: 34,
        hue: 120, saturation: 60.6936454772949, brightness: 33.9215695858002 },
    { name: "Fuchsia", red: 255, green: 0, blue: 255,
        hue: 300, saturation: 100, brightness: 50 },
    { name: "Gainsboro", red: 220, green: 220, blue: 220,
        hue: 0, saturation: 0, brightness: 86.2745106220245 },
    { name: "GhostWhite", red: 248, green: 248, blue: 255,
        hue: 240, saturation: 100, brightness: 98.6274480819702 },
    { name: "Gold", red: 255, green: 215, blue: 0,
        hue: 50.58823, saturation: 100, brightness: 50 },
    { name: "Goldenrod", red: 218, green: 165, blue: 32,
        hue: 42.90323, saturation: 74.4000017642975, brightness: 49.0196079015732 },
    { name: "Gray", red: 128, green: 128, blue: 128,
        hue: 0, saturation: 0, brightness: 50.1960813999176 },
    { name: "Green", red: 0, green: 128, blue: 0,
        hue: 120, saturation: 100, brightness: 25.0980406999588 },
    { name: "GreenYellow", red: 173, green: 255, blue: 47,
        hue: 83.65385, saturation: 100, brightness: 59.2156887054443 },
    { name: "Honeydew", red: 240, green: 255, blue: 240,
        hue: 120, saturation: 100, brightness: 97.0588207244873 },
    { name: "HotPink", red: 255, green: 105, blue: 180,
        hue: 330, saturation: 100, brightness: 70.5882370471954 },
    { name: "IndianRed", red: 205, green: 92, blue: 92,
        hue: 0, saturation: 53.0516445636749, brightness: 58.2352936267853 },
    { name: "Indigo", red: 75, green: 0, blue: 130,
        hue: 274.6154, saturation: 100, brightness: 25.4901975393295 },
    { name: "Ivory", red: 255, green: 255, blue: 240,
        hue: 60, saturation: 100, brightness: 97.0588207244873 },
    { name: "Khaki", red: 240, green: 230, blue: 140,
        hue: 54, saturation: 76.9230663776398, brightness: 74.5098054409027 },
    { name: "Lavender", red: 230, green: 230, blue: 250,
        hue: 240, saturation: 66.6666984558105, brightness: 94.1176474094391 },
    { name: "LavenderBlush", red: 255, green: 240, blue: 245,
        hue: 340, saturation: 100, brightness: 97.0588207244873 },
    { name: "LawnGreen", red: 124, green: 252, blue: 0,
        hue: 90.47619, saturation: 100, brightness: 49.4117647409439 },
    { name: "LemonChiffon", red: 255, green: 250, blue: 205,
        hue: 54, saturation: 100, brightness: 90.1960790157318 },
    { name: "LightBlue", red: 173, green: 216, blue: 230,
        hue: 194.7368, saturation: 53.2710373401642, brightness: 79.0196061134338 },
    { name: "LightCoral", red: 240, green: 128, blue: 128,
        hue: 0, saturation: 78.8732290267944, brightness: 72.1568644046783 },
    { name: "LightCyan", red: 224, green: 255, blue: 255,
        hue: 180, saturation: 100, brightness: 93.9215660095215 },
    { name: "LightGoldenrodYellow", red: 250, green: 250, blue: 210,
        hue: 60, saturation: 80.0000250339508, brightness: 90.1960790157318 },
    { name: "LightGreen", red: 144, green: 238, blue: 144,
        hue: 120, saturation: 73.4375059604645, brightness: 74.9019622802734 },
    { name: "LightGray", red: 211, green: 211, blue: 211,
        hue: 0, saturation: 0, brightness: 82.745099067688 },
    { name: "LightPink", red: 255, green: 182, blue: 193,
        hue: 350.9589, saturation: 100, brightness: 85.6862783432007 },
    { name: "LightSalmon", red: 255, green: 160, blue: 122,
        hue: 17.14286, saturation: 100, brightness: 73.9215672016144 },
    { name: "LightSeaGreen", red: 32, green: 178, blue: 170,
        hue: 176.7123, saturation: 69.523811340332, brightness: 41.1764711141586 },
    { name: "LightSkyBlue", red: 135, green: 206, blue: 250,
        hue: 202.9565, saturation: 92.000013589859, brightness: 75.4902005195618 },
    { name: "LightSlateGray", red: 119, green: 136, blue: 153,
        hue: 210, saturation: 14.2857179045677, brightness: 53.3333361148834 },
    { name: "LightSteelBlue", red: 176, green: 196, blue: 222,
        hue: 213.9131, saturation: 41.0714328289032, brightness: 78.0392169952393 },
    { name: "LightYellow", red: 255, green: 255, blue: 224,
        hue: 60, saturation: 100, brightness: 93.9215660095215 },
    { name: "Lime", red: 0, green: 255, blue: 0,
        hue: 120, saturation: 100, brightness: 50 },
    { name: "LimeGreen", red: 50, green: 205, blue: 50,
        hue: 120, saturation: 60.7843160629272, brightness: 50 },
    { name: "Linen", red: 250, green: 240, blue: 230,
        hue: 30, saturation: 66.6666984558105, brightness: 94.1176474094391 },
    { name: "Magenta", red: 255, green: 0, blue: 255,
        hue: 300, saturation: 100, brightness: 50 },
    { name: "Maroon", red: 128, green: 0, blue: 0,
        hue: 0, saturation: 100, brightness: 25.0980406999588 },
    { name: "MediumAquamarine", red: 102, green: 205, blue: 170,
        hue: 159.6116, saturation: 50.7389187812805, brightness: 60.1960778236389 },
    { name: "MediumBlue", red: 0, green: 0, blue: 205,
        hue: 240, saturation: 100, brightness: 40.1960790157318 },
    { name: "MediumOrchid", red: 186, green: 85, blue: 211,
        hue: 288.0952, saturation: 58.8785111904144, brightness: 58.0392181873322 },
    { name: "MediumPurple", red: 147, green: 112, blue: 219,
        hue: 259.6262, saturation: 59.7765326499939, brightness: 64.9019598960876 },
    { name: "MediumSeaGreen", red: 60, green: 179, blue: 113,
        hue: 146.7227, saturation: 49.7907996177673, brightness: 46.8627452850342 },
    { name: "MediumSlateBlue", red: 123, green: 104, blue: 238,
        hue: 248.5074, saturation: 79.7619044780731, brightness: 67.0588254928589 },
    { name: "MediumSpringGreen", red: 0, green: 250, blue: 154,
        hue: 156.96, saturation: 100, brightness: 49.0196079015732 },
    { name: "MediumTurquoise", red: 72, green: 209, blue: 204,
        hue: 177.8102, saturation: 59.8253309726715, brightness: 55.0980389118195 },
    { name: "MediumVioletRed", red: 199, green: 21, blue: 133,
        hue: 322.2472, saturation: 80.9090912342072, brightness: 43.1372553110123 },
    { name: "MidnightBlue", red: 25, green: 25, blue: 112,
        hue: 240, saturation: 63.5036468505859, brightness: 26.8627464771271 },
    { name: "MintCream", red: 245, green: 255, blue: 250,
        hue: 150, saturation: 100, brightness: 98.0392158031464 },
    { name: "MistyRose", red: 255, green: 228, blue: 225,
        hue: 6, saturation: 100, brightness: 94.1176474094391 },
    { name: "Moccasin", red: 255, green: 228, blue: 181,
        hue: 38.10811, saturation: 100, brightness: 85.4901969432831 },
    { name: "NavajoWhite", red: 255, green: 222, blue: 173,
        hue: 35.85366, saturation: 100, brightness: 83.9215695858002 },
    { name: "Navy", red: 0, green: 0, blue: 128,
        hue: 240, saturation: 100, brightness: 25.0980406999588 },
    { name: "OldLace", red: 253, green: 245, blue: 230,
        hue: 39.13044, saturation: 85.1851880550385, brightness: 94.7058796882629 },
    { name: "Olive", red: 128, green: 128, blue: 0,
        hue: 60, saturation: 100, brightness: 25.0980406999588 },
    { name: "OliveDrab", red: 107, green: 142, blue: 35,
        hue: 79.62617, saturation: 60.4519784450531, brightness: 34.7058832645416 },
    { name: "Orange", red: 255, green: 165, blue: 0,
        hue: 38.82353, saturation: 100, brightness: 50 },
    { name: "OrangeRed", red: 255, green: 69, blue: 0,
        hue: 16.23529, saturation: 100, brightness: 50 },
    { name: "Orchid", red: 218, green: 112, blue: 214,
        hue: 302.2642, saturation: 58.8888943195343, brightness: 64.7058844566345 },
    { name: "PaleGoldenrod", red: 238, green: 232, blue: 170,
        hue: 54.70588, saturation: 66.6666746139526, brightness: 80.0000011920929 },
    { name: "PaleGreen", red: 152, green: 251, blue: 152,
        hue: 120, saturation: 92.5233662128448, brightness: 79.0196061134338 },
    { name: "PaleTurquoise", red: 175, green: 238, blue: 238,
        hue: 180, saturation: 64.9484634399414, brightness: 80.980396270752 },
    { name: "PaleVioletRed", red: 219, green: 112, blue: 147,
        hue: 340.3738, saturation: 59.7765326499939, brightness: 64.9019598960876 },
    { name: "PapayaWhip", red: 255, green: 239, blue: 213,
        hue: 37.14286, saturation: 100, brightness: 91.7647063732147 },
    { name: "PeachPuff", red: 255, green: 218, blue: 185,
        hue: 28.28572, saturation: 100, brightness: 86.2745106220245 },
    { name: "Peru", red: 205, green: 133, blue: 63,
        hue: 29.57747, saturation: 58.6776912212372, brightness: 52.549022436142 },
    { name: "Pink", red: 255, green: 192, blue: 203,
        hue: 349.5238, saturation: 100, brightness: 87.6470565795898 },
    { name: "Plum", red: 221, green: 160, blue: 221,
        hue: 300, saturation: 47.2868204116821, brightness: 74.7058868408203 },
    { name: "PowderBlue", red: 176, green: 224, blue: 230,
        hue: 186.6667, saturation: 51.9230842590332, brightness: 79.6078443527222 },
    { name: "Purple", red: 128, green: 0, blue: 128,
        hue: 300, saturation: 100, brightness: 25.0980406999588 },
    { name: "Red", red: 255, green: 0, blue: 0,
        hue: 0, saturation: 100, brightness: 50 },
    { name: "RosyBrown", red: 188, green: 143, blue: 143,
        hue: 0, saturation: 25.1396626234055, brightness: 64.9019598960876 },
    { name: "RoyalBlue", red: 65, green: 105, blue: 225,
        hue: 225, saturation: 72.7272748947144, brightness: 56.86274766922 },
    { name: "SaddleBrown", red: 139, green: 69, blue: 19,
        hue: 25, saturation: 75.9493708610535, brightness: 30.9803932905197 },
    { name: "Salmon", red: 250, green: 128, blue: 114,
        hue: 6.176474, saturation: 93.1506872177124, brightness: 71.3725507259369 },
    { name: "SandyBrown", red: 244, green: 164, blue: 96,
        hue: 27.56757, saturation: 87.0588064193726, brightness: 66.6666686534882 },
    { name: "SeaGreen", red: 46, green: 139, blue: 87,
        hue: 146.4516, saturation: 50.270277261734, brightness: 36.2745106220245 },
    { name: "SeaShell", red: 255, green: 245, blue: 238,
        hue: 24.70588, saturation: 100, brightness: 96.6666698455811 },
    { name: "Sienna", red: 160, green: 82, blue: 45,
        hue: 19.30435, saturation: 56.0975670814514, brightness: 40.1960790157318 },
    { name: "Silver", red: 192, green: 192, blue: 192,
        hue: 0, saturation: 0, brightness: 75.2941191196442 },
    { name: "SkyBlue", red: 135, green: 206, blue: 235,
        hue: 197.4, saturation: 71.4285731315613, brightness: 72.5490212440491 },
    { name: "SlateBlue", red: 106, green: 90, blue: 205,
        hue: 248.3478, saturation: 53.4883737564087, brightness: 57.8431367874146 },
    { name: "SlateGray", red: 112, green: 128, blue: 144,
        hue: 210, saturation: 12.5984266400337, brightness: 50.1960813999176 },
    { name: "Snow", red: 255, green: 250, blue: 250,
        hue: 0, saturation: 100, brightness: 99.0196108818054 },
    { name: "SpringGreen", red: 0, green: 255, blue: 127,
        hue: 149.8824, saturation: 100, brightness: 50 },
    { name: "SteelBlue", red: 70, green: 130, blue: 180,
        hue: 207.2727, saturation: 43.9999967813492, brightness: 49.0196108818054 },
    { name: "Tan", red: 210, green: 180, blue: 140,
        hue: 34.28572, saturation: 43.7500029802322, brightness: 68.6274528503418 },
    { name: "Teal", red: 0, green: 128, blue: 128,
        hue: 180, saturation: 100, brightness: 25.0980406999588 },
    { name: "Thistle", red: 216, green: 191, blue: 216,
        hue: 300, saturation: 24.2718413472176, brightness: 79.8039197921753 },
    { name: "Tomato", red: 255, green: 99, blue: 71,
        hue: 9.130434, saturation: 100, brightness: 63.9215707778931 },
    { name: "Turquoise", red: 64, green: 224, blue: 208,
        hue: 174, saturation: 72.0720648765564, brightness: 56.4705908298492 },
    { name: "Violet", red: 238, green: 130, blue: 238,
        hue: 300, saturation: 76.0563433170319, brightness: 72.1568644046783 },
    { name: "Wheat", red: 245, green: 222, blue: 179,
        hue: 39.09091, saturation: 76.7441868782043, brightness: 83.1372559070587 },
    { name: "White", red: 255, green: 255, blue: 255,
        hue: 0, saturation: 0, brightness: 100 },
    { name: "WhiteSmoke", red: 245, green: 245, blue: 245,
        hue: 0, saturation: 0, brightness: 96.0784316062927 },
    { name: "Yellow", red: 255, green: 255, blue: 0,
        hue: 60, saturation: 100, brightness: 50 },
    { name: "YellowGreen", red: 154, green: 205, blue: 50,
        hue: 79.74193, saturation: 60.7843160629272, brightness: 50 }
].map(function(d) {
    return { name: d.name,
        red8Bit: d.red, green8Bit: d.green, blue8Bit: d.blue,
        hue8Bit: d.hue, saturation8Bit: Math.round(d.saturation * 2.55), brightness8Bit: d.brightness,
        hue: d.hue, saturation: d.saturation, brightness: d.brightness,
        red: d.red / 2.55, green: d.green / 2.55, blue: d.blue / 2.55,

        hex: [d.red, d.green, d.blue].map(function(v) {
            if (v < 16)
                return "0" + v.toString(16);
            return v.toString(16);
        }).join("")
    };
});

var innerMethods = ColorInfo.getInnerMethods();
var results = testData.map(function(testValues) {
    var messages = [];
    try {
        var rgb = innerMethods.parseHexString(testValues.hex);
        var t = (rgb === null) ? "null" : typeof(rgb);
        if (t !== "object")
            messages.push("Result is " + t);
        else {
            t = (rgb.red === null) ? "null" : typeof(rgb.red);
            if (t !== "number")
                messages.push("Red value is " + t);
            else if (rgb.red != testValues.red8Bit)
                messages.push("Expected Red: " + testValues.red8Bit + "; actual: " + rgb.red);
            t = (rgb.green === null) ? "null" : typeof(rgb.green);
            if (t !== "number")
                messages.push("Green value is " + t);
            else if (rgb.green != testValues.green8Bit)
                messages.push("Expected Green: " + testValues.green8Bit + "; actual: " + rgb.green);
            t = (rgb.blue === null) ? "null" : typeof(rgb.blue);
            if (t !== "number")
                messages.push("Blue value is " + t);
            else if (rgb.blue != testValues.blue8Bit)
                messages.push("Expected Blue: " + testValues.blue8Bit + "; actual: " + rgb.blue);
        }
    } catch (e) {
        messages.push(e);
    }
    return {
        color: testValues.name,
        id: "innerMethods.parseHexString(\"" + testValues.hex + "\")",
        messages: messages
    };
});
function notInRange(x, y) {
    return ((x < y) ? y - x : x - y) > 0.0001;
}
results = results.concat(testData.map(function(testValues) {
    var messages = [];
    try {
        var hsb = innerMethods.rgbToHsb(testValues.red, testValues.green, testValues.blue);
        var t = (hsb === null) ? "null" : typeof(hsb);
        if (t !== "object")
            messages.push("Result is " + t);
        else {
            t = (hsb.hue === null) ? "null" : typeof(hsb.hue);
            if (t !== "number")
                messages.push("Hue value is " + t);
            else if (notInRange(hsb.hue, testValues.hue))
                messages.push("Expected Hue: " + testValues.hue + "; actual: " + hsb.hue);
            t = (hsb.saturation === null) ? "null" : typeof(hsb.saturation);
            if (t !== "number")
                messages.push("Saturation value is " + t);
            else if (notInRange(hsb.saturation, testValues.saturation))
                messages.push("Expected Saturation: " + testValues.saturation + "; actual: " + hsb.saturation);
            t = (hsb.brightness === null) ? "null" : typeof(hsb.brightness);
            if (t !== "number")
                messages.push("Brightness value is " + t);
            else if (notInRange(hsb.brightness, testValues.brightness))
                messages.push("Expected Brightness: " + testValues.brightness + "; actual: " + hsb.brightness);
        }
    } catch (e) {
        messages.push(e);
    }
    return {
        color: testValues.name,
        id: "innerMethods.rgbToHsb(" + testValues.red + ", " + testValues.green + ", " + testValues.blue +")",
        messages: messages
    };
}));
results = results.concat(testData.map(function(testValues) {
    var messages = [];
    try {
        var rgb = innerMethods.hsbToRgb(testValues.hue, testValues.saturation, testValues.brightness);
        var t = (rgb === null) ? "null" : typeof(rgb);
        if (t !== "object")
            messages.push("Result is " + t);
        else {
            t = (rgb.red === null) ? "null" : typeof(rgb.red);
            if (t !== "number")
                messages.push("red value is " + t);
            else if (notInRange(rgb.red, testValues.red))
                messages.push("Expected red: " + testValues.red + "; actual: " + rgb.red);
            t = (rgb.green === null) ? "null" : typeof(rgb.green);
            if (t !== "number")
                messages.push("green value is " + t);
            else if (notInRange(rgb.green, testValues.green))
                messages.push("Expected green: " + testValues.green + "; actual: " + rgb.green);
            t = (rgb.blue === null) ? "null" : typeof(rgb.blue);
            if (t !== "number")
                messages.push("blue value is " + t);
            else if (notInRange(rgb.blue, testValues.blue))
                messages.push("Expected blue: " + testValues.blue + "; actual: " + rgb.blue);
        }
    } catch (e) {
        messages.push(e);
    }
    return {
        color: testValues.name,
        id: "innerMethods.hsbToRgb(" + testValues.hue + ", " + testValues.saturation + ", " + testValues.brightness +")",
        messages: messages
    };
}));
results = results.concat(testData.map(function(testValues) {
    var messages = [];
    try {
        var rgb = new ColorInfo.RgbPercentColorValues(testValues.red, testValues.green, testValues.blue);
        t = (rgb.red === null) ? "null" : typeof(rgb.red);
        if (t !== "number")
            messages.push("Red value is " + t);
        else if (notInRange(rgb.red, testValues.red))
            messages.push("Expected red: " + testValues.red + "; actual: " + rgb.red);
        t = (rgb.green === null) ? "null" : typeof(rgb.green);
        if (t !== "number")
            messages.push("Green value is " + t);
        else if (notInRange(rgb.green, testValues.green))
            messages.push("Expected green: " + testValues.green + "; actual: " + rgb.green);
        t = (rgb.blue === null) ? "null" : typeof(rgb.blue);
        if (t !== "number")
            messages.push("Blue value is " + t);
        else if (notInRange(rgb.blue, testValues.blue))
            messages.push("Expected blue: " + testValues.blue + "; actual: " + rgb.blue);
        var m = rgb.getErrorMessages();
        t = (m === null) ? "null" : typeof(m);
        if (t != "object" || !Array.isArray(m))
            messages.push("getErrorMessages returned " + t);
        if (m.length > 0)
            messages.push("Expected no messages from getErrorMessages; actual" + messages.length + " messages:\n\t" + messages.join("\n\t"));
    } catch (e) {
        messages.push(e);
    }
    return {
        color: testValues.name,
        id: "new ColorInfo.RgbPercentColorValues(" + testValues.red + ", " + testValues.green + ", " + testValues.blue  + ")",
        messages: messages
    };
}));
results = results.concat(testData.map(function(testValues) {
    var messages = [];
    try {
        var rgb = new ColorInfo.Rgb8BitColorValues(testValues.red8Bit, testValues.green8Bit, testValues.blue8Bit);
        t = (rgb.red === null) ? "null" : typeof(rgb.red);
        if (t !== "number")
            messages.push("Red value is " + t);
        else if (notInRange(rgb.red, testValues.red8Bit))
            messages.push("Expected red: " + testValues.red8Bit + "; actual: " + rgb.red);
        t = (rgb.green === null) ? "null" : typeof(rgb.green);
        if (t !== "number")
            messages.push("Green value is " + t);
        else if (notInRange(rgb.green, testValues.green8Bit))
            messages.push("Expected green: " + testValues.green8Bit + "; actual: " + rgb.green);
        t = (rgb.blue === null) ? "null" : typeof(rgb.blue);
        if (t !== "number")
            messages.push("Blue value is " + t);
        else if (notInRange(rgb.blue, testValues.blue8Bit))
            messages.push("Expected blue: " + testValues.blue8Bit + "; actual: " + rgb.blue);
        var m = rgb.getErrorMessages();
        t = (m === null) ? "null" : typeof(m);
        if (t != "object" || !Array.isArray(m))
            messages.push("getErrorMessages returned " + t);
        if (m.length > 0)
            messages.push("Expected no messages from getErrorMessages; actual" + m.length + " messages:\n\t" + mgh'o                                                         ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''opppppppppppppppppppppppc xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxerwwwwwwwwwwwwwwwwwwwwwwwwwwwww.join("\n\t"));
    } catch (e) {
        messages.push(e);
    }
    return {
        color: testValues.name,
        id: "new ColorInfo.Rgb8BitColorValues(" + testValues.red8Bit + ", " + testValues.green8Bit + ", " + testValues.blue8Bit  + ")",
        messages: messages
    };
}));
results = results.concat(testData.map(function(testValues) {
    var messages = [];
    try {
        var hsb = new ColorInfo.HsbPercentColorValues(testValues.hue, testValues.saturation, testValues.brightness);
        t = (hsb.hue === null) ? "null" : typeof(hsb.hue);
        if (t !== "number")
            messages.push("Hue value is " + t);
        else if (notInRange(hsb.hue, testValues.hue))
            messages.push("Expected hue: " + testValues.hue + "; actual: " + hsb.hue);
        t = (hsb.saturation === null) ? "null" : typeof(hsb.saturation);
        if (t !== "number")
            messages.push("Saturation value is " + t);
        else if (notInRange(hsb.saturation, testValues.saturation))
            messages.push("Expected saturation: " + testValues.saturation + "; actual: " + hsb.saturation);
        t = (hsb.brightness === null) ? "null" : typeof(hsb.brightness);
        if (t !== "number")
            messages.push("Brightness value is " + t);
        else if (notInRange(hsb.brightness, testValues.brightness))
            messages.push("Expected brightness: " + testValues.brightness + "; actual: " + hsb.brightness);
        var m = hsb.getErrorMessages();
        t = (m === null) ? "null" : typeof(m);
        if (t != "object" || !Array.isArray(m))
            messages.push("getErrorMessages returned " + t);
        else if (m.length > 0)
            messages.push("Expected no messages from getErrorMessages; actual" + m.length + " messages:\n\t" + m.join("\n\t"));
    } catch (e) {
        messages.push(e);
    }
    return {
        color: testValues.name,
        id: "new ColorInfo.HsbPercentColorValues(" + testValues.hue + ", " + testValues.saturation + ", " + testValues.brightness  + ")",
        messages: messages
    };
}));
results = results.concat(testData.map(function(testValues) {
    var messages = [];
    try {
        var hsb = new ColorInfo.Hsb8BitColorValues(testValues.hue8Bit, testValues.saturation8Bit, testValues.brightness8Bit);
        t = (hsb.hue === null) ? "null" : typeof(hsb.hue);
        if (t !== "number")
            messages.push("Hue value is " + t);
        else if (hsb.hue != testValues.hue8Bit)
            messages.push("Expected hue: " + testValues.hue8Bit + "; actual: " + hsb.hue);
        t = (hsb.saturation === null) ? "null" : typeof(hsb.saturation);
        if (t !== "number")
            messages.push("Saturation value is " + t);
        else if (hsb.saturation != testValues.saturation8Bit)
            messages.push("Expected saturation: " + testValues.saturation8Bit + "; actual: " + hsb.saturation);
        t = (hsb.brightness === null) ? "null" : typeof(hsb.brightness);
        if (t !== "number")
            messages.push("Brightness value is " + t);
        else if (notInRange(hsb.brightness, testValues.brightness8Bit))
            messages.push("Expected brightness: " + testValues.brightness8Bit + "; actual: " + hsb.brightness);
        var m = hsb.getErrorMessages();
        t = (m === null) ? "null" : typeof(m);
        if (t != "object" || !Array.isArray(m))
            messages.push("getErrorMessages returned " + t);
        else if (m.length > 0)
            messages.push("Expected no messages from getErrorMessages; actual " + m.length + " messages:\n\t" + m.join("\n\t"));
    } catch (e) {
        messages.push(e);
    }
    return {
        color: testValues.name,
        id: "new ColorInfo.Hsb8BitColorValues(" + testValues.hue8Bit + ", " + testValues.saturation8Bit + ", " + testValues.brightness8Bit  + ")",
        messages: messages
    };
}));
var failed = results.filter(function(r) { return r.messages.length > 0; });
failed.forEach(function(r) {
    r.messages.forEach(function(m) {
        if (typeof(m) == "string")
            console.error(r.id + " [" + r.color + "]: " + m);
        else {
            console.error("Begin " + r.id + " [" + r.color + "] Unexpected Error");
            console.error(m);
            console.error("End " + r.id + " [" + r.color + "] Unexpected Error");
        }
    });
});
console.log((results.length - failed.length) + " passed,1 " + failed.length + " failed.");