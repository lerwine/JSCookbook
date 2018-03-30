var PreTestCheckResults = function() {
    if (typeof(sessionStorage.preTestCheckResults) == "string") {
        var data = JSON.parse(sessionStorage.preTestCheckResults);
        this.executed = data.executed;
        this.message = data.message;
        this.passed = data.passed;
    } else {
        this.executed = false;
        this.message = "Pre-check ";
        this.passed = false;
    }
};
var jscookbookApp = angular.module("jscookbook", []);