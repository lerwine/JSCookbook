var JsUnitTesting = JsUnitTesting || {};

var JsUnitTesting.HtmlOutput = function() {};
JsUnitTesting.HtmlOutput.encodeHTML = function(obj) {
	if (obj === undefined || obj === null)
		return '';
	
	if (typeof(obj) == 'object' && obj instanceof HtmlOutput)
		return obj.toString();
	
	var result;
	
	try {
		result = JsUnitTesting.Utility.convertToString(obj, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/\r\n/g, '<br />').replace(/[\r\n]/g, '<br />');
	} catch (e) {
		throw 'Error converting value to HTML: " + JsUnitTesting.Utility.convertToString(e);
	}
	
	return result;
};
JsUnitTesting.HtmlOutput.prototype =  new JsUnitTesting.HtmlOutput();
JsUnitTesting.HtmlOutput.prototype.constructor =  JsUnitTesting.HtmlOutput;
JsUnitTesting.HtmlOutput.prototype.toString = function() { return ''; }

JsUnitTesting.HtmlOutput.Literal = function(text, encode) {
	this.setText(text);
	if (encode === undefined && typeof(text) == 'object' && text instanceof JsUnitTesting.HtmlOutput)
		this.setEncode(false);
	else
		this.setEncode(encode);
};
JsUnitTesting.HtmlOutput.Literal.prototype =  new JsUnitTesting.HtmlOutput();
JsUnitTesting.HtmlOutput.Literal.prototype.constructor =  JsUnitTesting.HtmlOutput.Literal;
JsUnitTesting.HtmlOutput.Literal.prototype.getEncode() { return this.__encode__; }
JsUnitTesting.HtmlOutput.Literal.prototype.setEncode(encode) { this.__encode__ = (encode) ? true : false; }
JsUnitTesting.HtmlOutput.Literal.prototype.getText() { return this.__text__; }
JsUnitTesting.HtmlOutput.Literal.prototype.setText(text) { this.__text__ = JsUnitTesting.Utility.convertToString(text, ''); }
JsUnitTesting.HtmlOutput.Literal.prototype.toString = function() { return ((this.getEncode()) ? JsUnitTesting.HtmlOutput.encodeHTML(this.getText()) : this.getText); }

JsUnitTesting.HtmlOutput.Element = function(tagName) {
	var tn = JsUnitTesting.Utility.convertToString(tagName, 'span');
	if (!JsUnitTesting.HtmlOutput.Element.isValidName(tn))
		throw 'Invalid tag name';
	
	JsUnitTesting.HtmlOutput.call(this);
	this.__tagName__ = tn;
	this.__attributes__ = {};
};
JsUnitTesting.HtmlOutput.Element.isValidName = function(name) { return (typeof(name) == 'string' && name.match(/^[a-z][a-z.0-9]+/i)); };
JsUnitTesting.HtmlOutput.Element.parseStyleAttributeText = function(value) {
	var getDelimiterIndex = function(s) {
		var singleQuote = s.indexOf("'");
		var doubleQuote = s.indexOf('"');
		var openParenth = s.indexOf("(");
		if (singleQuote < 0) {
			if (doubleQuote < 0)
				return openParenth;
			
			return (openParenth < 0 || doubleQuote < openParenth) ? doubleQuote : openParenth;
		}
		
		if (doubleQuote < 0)
			return (openParenth < 0 || singleQuote < openParenth) ? singleQuote : openParenth;
		
		if (openParenth < 0)
			return (singleQuote < doubleQuote) ? singleQuote : doubleQuote;
		
		return (singleQuote < doubleQuote) ? (singleQuote < openParenth) ? singleQuote : openParenth : (doubleQuote < openParenth) ? doubleQuote : openParenth;
	}
	
	var escapeString = function(s) {
		return s.replace(/~/g, "~t");
	};
	
	var unEscapeString = function(s) {
		return s.replace(/~t/g, '~');
	};
	
	var escapeDelimiters = function(s) {
		return s.replace(/"/g, '~Q').replace(/'/g, '~q').replace(/\(/g, '~P').replace(/\)/g, '~p').replace(/\:/g, '~C').replace(/;/g, '~c');
	};
	
	var unEscapeDelimiters = function(s) {
		return s.replace(/~Q/g, '"').replace(/~q/g, "'").replace(/~P/g, '(').replace(/~p/g, ')').replace(/~C/g, ':').replace(/~c/g, ';');
	};
	
	var encodedText = escapeString(value);
	
	var idx = getDelimiterIndex(encodedText);
	while (idx >= 0) {
		var beforeDelimiter = encodedText.substr(0, idx);
		var openingDelimiter = encodedText.substr(idx, 1);
		var closingDelimiter = (openingDelimiter == '(') ? ')' : openingDelimiter;
		var afterDelimiter = encodedText.substr(idx + 1);
		var closingDelimiterIndex = afterDelimiter.indexOf(closingDelimiter);
		var delimitedText;
		if (closingDelimiterIndex < 0) {
			delimitedText = afterDelimiter;
			afterDelimiter = '';
		} else {
			delimitedText = afterDelimiter.substr(0, closingDelimiterIndex);
			afterDelimiter = afterDelimiter.substr(closingDelimiterIndex + 1);
		}
		encodedText = beforeDelimiter + escapeDelimiters(openingDelimiter + delimitedText + closingDelimiter) + afterDelimiter;
		idx = getDelimiterIndex(encodedText);
	}
	
	alert(encodedText);
	
	re = /^.*?\s*(?:~.)?(?:([\w-]*?)\s*:\s*([^;]+)\s*)?(?:;(.*)|$)/;
	var rr = re.exec(encodedText);
	var result = { };
	while (rr && encodedText.length > 0) {
		if (rr[1].length > 0)
			result[unEscapeDelimiters(rr[1])] = unEscapeDelimiters(rr[2]);
		encodedText = rr[3];
		rr = re.exec(encodedText);
	}
	
	return result;
};
JsUnitTesting.HtmlOutput.Element.prototype =  new JsUnitTesting.HtmlOutput();
JsUnitTesting.HtmlOutput.Element.prototype.constructor =  JsUnitTesting.HtmlOutput.Element;
JsUnitTesting.HtmlOutput.Element.prototype.getAttribute = function(attributeName) {
	var n = JsUnitTesting.Utility.convertToString(attributeName, '');
	if (n == 'style')
		return this.getStyleHTML();
		
	return this.__attributes__[n];
};
JsUnitTesting.HtmlOutput.Element.prototype.getAttributeNames = function() {
	var result = new Array();
	for (var pn in this.__attributes__) {
		if (pn !== undefined && pn !== null)
			result.push(pn);
	}
	
	if (this.getStyleNames().length > 0)
		result.push("style");
	
	return result;
};
JsUnitTesting.HtmlOutput.Element.prototype.setAttribute = function(attributeName, attributeValue) {
	var n = JsUnitTesting.Utility.convertToString(attributeName, '');
	if (!this.isValidName(n))
		throw 'Invalid attribute name';
	
	if (n != 'style') {
		this.__attributes__[n] = JsUnitTesting.Utility.convertToString(attributeValue, undefined);
		return;
	}
	
	if (attributeValue === null || attributeValue === undefined)
		this.__style__ = {};
	else if (typeof(attributeValue) == 'object' && !(attributeValue instanceof Array))
		this.__style__ = attributeValue;
	else {
		var s = JsUnitTesting.Utility.trimString(JsUnitTesting.Utility.convertToString(attributeValue, undefined));
		if (s === undefined || s.length == 0)
			this.__style__ = {};
		else
			this.__style__ = JsUnitTesting.HtmlOutput.Element.parseStyleAttributeText(s);
	}
};
JsUnitTesting.HtmlOutput.Element.prototype.getStyle = function(styleName) { return this.__style__[JsUnitTesting.Utility.convertToString(styleName, '')]; };
JsUnitTesting.HtmlOutput.Element.prototype.getStyleNames = function() {
	var result = new Array();
	for (var pn in this.__style__) {
		if (pn !== undefined && pn !== null)
			result.push(pn);
	}
	
	return result;
};
JsUnitTesting.HtmlOutput.Element.prototype.setStyle = function(styleName, attributeValue) {
	var n = JsUnitTesting.Utility.convertToString(styleName, '');
	if (!this.isValidName(n))
		throw 'Invalid style name';
	
	if (n != 'style') {
		this.__style__[n] = JsUnitTesting.Utility.convertToString(attributeValue, undefined);
		return;
	}
	
	if (attributeValue === null || attributeValue === undefined)
		this.__style__ = {};
	else if (typeof(attributeValue) == 'object' && !(attributeValue instanceof Array))
		this.__style__ = attributeValue;
	else {
		var s = JsUnitTesting.Utility.trimString(JsUnitTesting.Utility.convertToString(attributeValue, undefined));
		if (s === undefined || s.length == 0)
			this.__style__ = {};
		else
			this.__style__ = JsUnitTesting.HtmlOutput.Element.parseStyleAttributeText(s);
	}
};
JsUnitTesting.HtmlOutput.Element.prototype.getStyleHTML = function() {
	var result = JsUnitTesting.Utility.reduceObject(this.__style__, function(previousValue, currentValue, propertyName) {
		previousValue += propertyName + ':';
		if (currentValue.match(/^\s*$/))
			return previousValue + "'" + currentValue + "';";
		
		if (currentValue.match(/^[^\s:;"']+(\s*\([^\s:;"']*\))?$/))
			return previousValue + currentValue + ";";
		
		var escapeChars = function(s) { return s.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\(/g, "\\(").replace(/\)/g, "\\)"); };
		
		var m = currentValue.match(/^([^\s:;"']+)\s*\((.*)\)$/)
		if (m)
			return previousValue + escapeChars(m[1]) + '(' + escapeChars(m[2]) + ');';
		
		return previousValue + "'" + escapeChars(currentValue) + "';";
	}, '');

	return (result.length == 0) ? undefined : result;
};
JsUnitTesting.HtmlOutput.Element.prototype.getTagName = function() {
	return this.__tagName__;
};
JsUnitTesting.HtmlOutput.Element.prototype.getAttributesHTML = function() {
	var result = '';
	
	for (var pn in this.getAttributeNames())
		result += ' ' + pn + '="' + JsUnitTesting.HtmlOutput.encodeHTML(this.getAttribute(pn)) + '"';
};
JsUnitTesting.HtmlOutput.Element.prototype.openHtmlTag = function() {
	return '<' + this.getTagName(); + this.getAttributesHTML();
};
JsUnitTesting.HtmlOutput.Element.prototype.getTagContents = function(bRenderingTag) {
	return '';
};
JsUnitTesting.HtmlOutput.Element.prototype.getCloseTag = function() {
	return ' />';
};
JsUnitTesting.HtmlOutput.Element.prototype.toString = function() {
	return this.openHtmlTag(); + this.getTagContents(true); + JsUnitTesting.HtmlOutput.prototype.toString.call(this) + this.getCloseTag();
};

JsUnitTesting.HtmlOutput.ContainerElement = function(tagName) {
	JsUnitTesting.HtmlOutput.Element.call(this, tagName);
	this.__contents__ = new Array();
};
JsUnitTesting.HtmlOutput.ContainerElement.prototype =  new JsUnitTesting.HtmlOutput.Element();
JsUnitTesting.HtmlOutput.ContainerElement.prototype.constructor =  JsUnitTesting.HtmlOutput.ContainerElement;
JsUnitTesting.HtmlOutput.ContainerElement.prototype.__ensureItemType__ = function(itemObj) {
	JsUnitTesting.Utility.ensureInstanceOf(unitTestObj, JsUnitTesting.UnitTest, false, function(itemObj, errorObj) {
		JsUnitTesting.Assert.Fail = function("Only items of type 'JsUnitTesting.HtmlOutput' can be added to a 'JsUnitTesting.HtmlOutput.ContainerElement' object.", undefined, this, errorObj);
	});
};
JsUnitTesting.HtmlOutput.ContainerElement.prototype.getTagContents = function(bRenderingTag) {
	var result = JsUnitTesting.Utility.reduceArray(this.__contents__, function(previousValue, currentValue) {
			// TODO: Finish this
		}, '');
	
	if (bRenderingTag)
		return '>' + result;
	
	return result;
};
JsUnitTesting.HtmlOutput.ContainerElement.prototype.getCloseTag = function() {
	return '</' + this.getTagName() + '>';
};

/**
 * Get number of controls contained
 * @return {Number}	Returns number of child controls
 */
JsUnitTesting.HtmlOutput.ContainerElement.prototype.getLength = function() {
	return this.__contents__.length;
};

/**
 * Remove and return the last content from content collection 
 * @return {JsUnitTesting.HtmlOutput}	Returns the content object at the end of the array
 */
JsUnitTesting.HtmlOutput.ContainerElement.prototype.pop = function() {
	return this.__contents__.pop();
};

/**
 * Pull content off of a stack whose access is FILO from the start rather than the end 
 * @return {JsUnitTesting.HtmlOutput}	Returns the content object at the start of the array
 */
JsUnitTesting.HtmlOutput.ContainerElement.prototype.shift = function() {
	return this.__contents__.shift();
};

/**
 * Pushes content onto the end of the content collection like a FILO stack
 * @param {JsUnitTesting.HtmlOutput} htmlContent	Object add to end of collection
 */
JsUnitTesting.HtmlOutput.ContainerElement.prototype.push = function(htmlContent) {
	this.__ensureItemType__(htmlContent);
	return this.__contents__.push(htmlContent);
};

/**
 * Push content onto a stack whose access is FILO from the start rather than the end
 * @param {JsUnitTesting.HtmlOutput} htmlContent	Object to remove from the start of collection
 */
JsUnitTesting.HtmlOutput.ContainerElement.prototype.unshift = function(htmlContent) {
	this.__ensureItemType__(htmlContent);
	return this.__contents__.unshift(htmlContent);
};

/**
 * Get item by name or index
 * @return {JsUnitTesting.HtmlOutput}	Returns the content at the given index or with the given name
 */
JsUnitTesting.HtmlOutput.ContainerElement.prototype.item = function(indexOrName) {
	if (indexOrName === undefined || indexOrName === null)
		throw "Invalid index or name";
		
	if (typeof(indexOrName) === 'number') {
		if (indexOrName > -1 && indexOrName < this.__contents__.length)
			return this.__contents__[indexOrName];
	}
	
	if (typeof(indexOrName) != 'string')
		return this.item(String(indexOrName), (typeof(indexOrName) === 'number');
	
	for (var i = 0; i < this.__contents__.length; i++) {
		if (this.__contents__[i].getName() == s)
			return this.__contents__[i];
	}
	
	if (isNaN(indexOrName) || arguments[1])
		return undefined;
	
	return this.item(parseInt(indexOrName), true);
};

JsUnitTesting.HtmlOutput.HtmlTable = function(parameterObj) {
	if (parameterObj === undefined || parameterObj === null)
		return;
};
