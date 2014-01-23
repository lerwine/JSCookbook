JsUnitTesting.AssertionError.prototype = new Error();
JsUnitTesting.AssertionError.prototype.constructor = JsUnitTesting.AssertionError;
JsUnitTesting.AssertionError.prototype.__testCollectionName__ = '';
JsUnitTesting.AssertionError.prototype.__unitTestName__ = '';
JsUnitTesting.AssertionError.prototype.__innerError__ = new Error();

/**
* Describe function
* @param {Object}	errObj (Optional) Describe parameter
* @param {String}	unitTestName (Optional) Describe parameter
* @param {String}	testCollectionName (Optional) Describe parameter
* @param {Object}	innerError (Optional) Describe parameter
* @return {JsUnitTesting.AssertionError}	Describe return value
*/
JsUnitTesting.AssertionError.createFromErrorObject = function (errObj, unitTestName, testCollectionName, innerError) {
    if (errObj === null || errObj === undefined)
        return new JsUnitTesting.AssertionError(undefined, undefined, unitTestName, testCollectionName, innerError);

    if (typeof (errObj) == 'object' && errObj instanceof Error)
        return new JsUnitTesting.AssertionError(errObj.number, errObj.message, unitTestName, testCollectionName, innerError);

    var message;
    try {
        message = JsUnitTesting.Utility.convertToString(errObj);
    } catch (err) {
        message = String(err);
    }
    return new JsUnitTesting.AssertionError(undefined, message, unitTestName, testCollectionName, innerError);
};

/**
* Describe function
* @return {Object}	Describe return value
*/
JsUnitTesting.AssertionError.prototype.getInnerError = function () { return this.__innerError__; };

/**
* Describe function
* @return {String}	Describe return value
*/
JsUnitTesting.AssertionError.prototype.getUnitTestName = function () { return this.__unitTestName__; };

/**
* Describe function
* @return {String}	Describe return value
*/
JsUnitTesting.AssertionError.prototype.getTestCollectionName = function () { return this.__testCollectionName__; };

/**
* Describe function
* @return {string}	Describe return value
*/
JsUnitTesting.AssertionError.prototype.getTableHtml = function () {
    var getRowHtml = function (headingHtml, value, valueIsHtml) {
        var result = '<tr><td';
        if (JsUnitTesting.TestResult.headingCellClassName !== undefined)
            result += ' class="' + JsUnitTesting.TestResult.headingCellClassName + '"';
        result += '>' + headingHtml + '</td><td';
        var cellClassName = JsUnitTesting.TestResult.specialContentCellClassName;
        var content;
        if (valueIsHtml)
            content = value;
        else {
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
        }


        if (cellClassName !== undefined)
            result += ' class="' + cellClassName + '"';

        return result + '>' + content + '</td></tr>';
    };

    var table = '<table';
    if (JsUnitTesting.TestResult.errorTableClassName !== undefined)
        table += ' class="' + JsUnitTesting.TestResult.errorTableClassName + '"';
    table += '>' + getRowHtml("Number:", this.number) + getRowHtml("Message:", this.message);
    if (this.stack !== undefined)
        table += getRowHtml("Stack Trace:", String(this.stack));
    var e = this.getInnerError();
    if (e !== null && e !== undefined) {
        if (typeof (e) == 'object') {
            if (e instanceof JsUnitTesting.AssertionError)
                table += getRowHtml("Inner Error:", e.getHtmlTable());
            else if (e instanceof Error) {
                var innerTable = '<table';
                if (JsUnitTesting.TestResult.errorTableClassName !== undefined)
                    innerTable += ' class="' + JsUnitTesting.TestResult.errorTableClassName + '"';
                innerTable += getRowHtml("Number:", e.number);
                innerTable += getRowHtml("Message:", e.message);
                if (e.stack !== undefined)
                    innerTable += getRowHtml("Stack Trace:", String(e.stack));
                table += getRowHtml("Inner Error:", innerTable, true);
            } else
                table += getRowHtml("Inner Error:", String(e));
        } else
            table += getRowHtml("Inner Error:", String(e));
    }

    return table + "</table>";
};
