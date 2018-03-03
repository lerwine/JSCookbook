function TestData() {
    function getStoredObject(key, defaultValue) {
        var obj = sessionStorage.getItem(key);
        if (typeof(obj) == "undefined") {
            obj = defaultValue;
            if (typeof(obj) == "function")
                obj = obj();
            if (typeof(obj) != "undefined")
                sessionStorage.setItem(key, (obj === null) ? null : JSON.stringify(obj));
        } else if (obj !== null)
            return JSON.parse(obj);
        return obj;
    }
    function setStoredObject(key, obj) {
        if (typeof(obj) == "undefined")
            sessionStorage.removeItem(key);
        else
            sessionStorage.setItem(key, (obj === null) ? null : JSON.stringify(obj));
    }

    this.preTestResult = getStoredObject("preTestResult", function() {
        return { success: null, message: "Pre-test not executed." };
    });

    this.applyResult = function(content_jquery) {
        content_jquery.empty().removeClass("success warning danger alert-dark");
        if (this.preTestResult.success) {
            content_jquery.addClass("alert-success").text("Success: " + this.preTestResult.message);
            $("#unitTestsMenuItem").show();
        } else if (this.preTestResult.success === null)
            content_jquery.addClass("alert-warning").text("Not Invoked: " + this.preTestResult.message);
        else
            content_jquery.addClass("alert-danger").text("Failed: " + this.preTestResult.message);
    };

    this.runPreTests = function() {

    };
}