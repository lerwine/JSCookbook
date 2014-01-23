function inline() {
	Date.prototype.toHourAndMinuteString = function() {
		var h = this.getHours();
		if (h < 9)
			h = "0" + h;
		var m = this.getMinutes();
		if (m < 9)
			m = "0" + m;
		return h + ":" + m;
	}
	Element.prototype.hourAndMinuteAsContent = function(context) {
		var baseTextDirection = context.options._metadata.baseTextDirection && context.options._metadata.baseTextDirection.get("value") ? context.options._metadata.baseTextDirection.get("value") : utilities.BiDi.BASE_TEXT_DIRECTION._default;
		var generalPrefTextDirection = context.bpm.system.baseTextDirection;
		var text;
		try {
			var d = context.binding.get("value");
			try {
				text = context.htmlEscape(d.toHourAndMinuteString());
			} catch (e) {
				text = context.htmlEscape(d);
			}
		} catch (ee) {
			text = '';
		}
		
		this.innerHTML = text;
		if (text.length != 0)
			utilities.BiDi.applyTextDir(span, span.innerHTML, baseTextDirection, generalPrefTextDirection);
		
		return text;
	}
}

function load() {
	var baseTextDirection = this.context.options._metadata.baseTextDirection && this.context.options._metadata.baseTextDirection.get("value") ? this.context.options._metadata.baseTextDirection.get("value") : utilities.BiDi.BASE_TEXT_DIRECTION._default;
	var generalPrefTextDirection = this.context.bpm.system.baseTextDirection;

	var span = this.context.element.getElementsByTagName("span")[0];
	var txt = span.hourAndMinuteAsContent(this.context);
	if (txt.length > 0)
		utilities.BiDi.applyTextDir(span, span.innerHTML, baseTextDirection, generalPrefTextDirection);

	if (this.context.options._metadata.label && this.context.options._metadata.label.get("value") != "") {
		var label = this.context.element.querySelector(".outputTextLabel > label");
		label.innerHTML = this.context.htmlEscape(this.context.options._metadata.label.get("value"));
		utilities.BiDi.applyTextDir(label, label.innerHTML, baseTextDirection, generalPrefTextDirection);
	}
	if (this.context.options._metadata.helpText && this.context.options._metadata.helpText.get("value") != "") {
		var label = this.context.element.querySelector(".outputTextLabel > label");
		label.title = this.context.options._metadata.helpText.get("value");
	}
}

function view() {
	var labelDiv = this.context.element.querySelector(".outputTextLabel");

	if (this.context.options._metadata.label == undefined ||
		this.context.options._metadata.label.get("value") == "" ||
		(this.context.options._metadata.labelVisibility != undefined &&
		 (this.context.options._metadata.labelVisibility.get("value") == "HIDE" ||
		  this.context.options._metadata.labelVisibility.get("value") == "NONE"))) {
		// hide the label div
		this.context.setDisplay(false, labelDiv);
	} else {
		// show the label div
		this.context.setDisplay(true, labelDiv);
	}

	var visibility = utilities.handleVisibility(this.context);
}

function change() {
	if (event.type == "config") {
		this.context.log("change", ["config change: ", event.property, event.newVal]);
		if (event.property == "_metadata.label") {
			var labelElement = this.context.element.querySelector(".outputTextLabel > label");
			labelElement.innerHTML = this.context.htmlEscape(event.newVal);
			var baseTextDirection = this.context.options._metadata.baseTextDirection && this.context.options._metadata.baseTextDirection.get("value") ? this.context.options._metadata.baseTextDirection.get("value") : utilities.BiDi.BASE_TEXT_DIRECTION._default;
			var generalPrefTextDirection = this.context.bpm.system.baseTextDirection;
			utilities.BiDi.applyTextDir(labelElement, labelElement.innerHTML, baseTextDirection, generalPrefTextDirection);
		} else if (event.property == "_metadata.helpText") {
			var label = this.context.element.querySelector(".outputTextLabel > label");
			label.title = event.newVal;
		}
	} else {
		this.context.log("change", ["change: ", event.property, event.newVal]);
		var newData;
		if (event.newVal != undefined) {
			newData = event.newVal;
		} else {
			newData = "";
		}
		var span = this.context.element.getElementsByTagName("span")[0];
		var txt = span.hourAndMinuteAsContent(this.context);
		if (txt.length > 0) {
			span.innerHTML = this.context.htmlEscape(newData);
			var baseTextDirection = this.context.options._metadata.baseTextDirection && this.context.options._metadata.baseTextDirection.get("value") ? this.context.options._metadata.baseTextDirection.get("value") : utilities.BiDi.BASE_TEXT_DIRECTION._default;
			var generalPrefTextDirection = this.context.bpm.system.baseTextDirection;
			utilities.BiDi.applyTextDir(span, span.innerHTML, baseTextDirection, generalPrefTextDirection);
		}
	}

	this.view();
}
