JsUnitTesting.TestResult.prototype = new JsUnitTesting.TestResult();
JsUnitTesting.TestResult.prototype.constructor = JsUnitTesting.TestResult;
JsUnitTesting.TestResult.prototype.__unitTest__ = new JsUnitTesting.UnitTest();
JsUnitTesting.TestResult.prototype.__testCollectionName__ = '';
JsUnitTesting.TestResult.prototype.__started__ = new Date();
JsUnitTesting.TestResult.prototype.__completed__ = new Date();
JsUnitTesting.TestResult.prototype.__success__ = false;
JsUnitTesting.TestResult.prototype.__executionError__ = new JsUnitTesting.AssertionError();
JsUnitTesting.TestResult.prototype.__testOutput__ = {};

JsUnitTesting.UnitTest.prototype.__lastResult__ = new JsUnitTesting.TestResult();

/**
* Describe function
* @return {JsUnitTesting.UnitTest}	Describe return value
*/
JsUnitTesting.TestResult.prototype.getUnitTest = function () {
    return this.__unitTest__;
};

/**
* Describe function
* @return {String}	Describe return value
*/
JsUnitTesting.TestResult.prototype.getTestCollectionName = function () {
    return this.__testCollectionName__;
};

/**
* Describe function
* @return {Date}	Describe return value
*/
JsUnitTesting.TestResult.prototype.getStarted = function () {
    return this.__started__;
};

/**
* Describe function
* @return {Date}	Describe return value
*/
JsUnitTesting.TestResult.prototype.getCompleted = function () {
    return this.__completed__;
};

/**
* Describe function
* @return {Boolean}	Describe return value
*/
JsUnitTesting.TestResult.prototype.getSuccess = function () {
    return this.__success__;
};

/**
* Describe function
* @return {JsUnitTesting.AssertionError}	Describe return value
*/
JsUnitTesting.TestResult.prototype.getExecutionError = function () {
    return this.__executionError__;
};

/**
* Describe function
* @return {Object}	Describe return value
*/
JsUnitTesting.TestResult.prototype.getTestOutput = function () {
    return this.__testOutput__;
};

JsUnitTesting.TestResult.resultTableClassName = 'results';
JsUnitTesting.TestResult.errorTableClassName = 'error';
JsUnitTesting.TestResult.oddRowClassName = undefined;
JsUnitTesting.TestResult.evenRowClassName = 'altRow';
JsUnitTesting.TestResult.headingCellClassName = 'heading';
JsUnitTesting.TestResult.normalContentCellClassName = undefined;
JsUnitTesting.TestResult.specialContentCellClassName = 'special';
JsUnitTesting.TestResult.encodeHTML = function (value) {
    return JsUnitTesting.Utility.convertToString(value, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
};

/**
* Describe function
* @return {string}	Describe return value
*/
JsUnitTesting.TestResult.prototype.getRowHtml = function (rowNum) {
    var getCellHtml = function (value) {
        var cellClassName = JsUnitTesting.TestResult.specialContentCellClassName;
        var content;
        if (value === undefined)
            content = "(undefined)";
        else if (value === null)
            content = "(null)";
        else {
            try {
                var s = JsUnitTesting.Utility.convertToString(value, '');
                if (JsUnitTesting.Utility.trimString(s).length == 0)
                    content = "&nbsp;";
                else
                    content = JsUnitTesting.TestResult.encodeHTML(s);
                cellClassName = JsUnitTesting.TestResult.normalContentCellClassName;
            } catch (err) {
                content = "(could not be displayed)";
            }

            if (cellClassName !== undefined)
                htmlTableCellElement.className = cellClassName;
        }

        var result = '<td';
        if (cellClassName !== undefined)
            result += ' class="' + cellClassName + '"';

        return result + '>' + content + '</td>';
    };

    var result = '<tr';
    if ((rowNum % 2) == 1) {
        if (JsUnitTesting.TestResult.oddRowClassName !== undefined)
            result += ' class="' + JsUnitTesting.TestResult.oddRowClassName + '"';
    } else if (JsUnitTesting.TestResult.evenRowClassName !== undefined)
        result += ' class="' + JsUnitTesting.TestResult.evenRowClassName + '"';
    result += '>' + getCellHtml(this.__unitTest__.getName()) + getCellHtml((this.__success__) ? "Yes" : "No") + getCellHtml(this.__started__) + '<td';
    if (JsUnitTesting.TestResult.normalContentCellClassName !== undefined)
        result += ' class="' + JsUnitTesting.TestResult.normalContentCellClassName + '"';
    result += '>'
    if (this.__executionError__ !== undefined && this.__executionError__ !== null)
        result += this.__executionError__.getTableHtml();
    else
        result += "&nbsp;";

    return result + '</td>' + getCellHtml(this.__testOutput__) + '</tr>'; ;
};

/**
* Run tests
* @param {Array} resultsArray	(Required) Whether to run all tests.
* @return {string}	Returns test results
*/
JsUnitTesting.TestResult.getTestResultsTableHtml = function (resultsArray) {
    var table = '<table';
    if (JsUnitTesting.TestResult.resultTableClassName !== undefined)
        table += ' class="' + JsUnitTesting.TestResult.resultTableClassName + '"';
    table += '>';
    for (var i = 0; i < resultsArray.length; i++)
        table += resultsArray[i].getRowHtml(i + 1);

    return table + '</table>';
};
