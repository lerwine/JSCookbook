if (Array.prototype.map === undefined) {
	Array.prototype.map = function(callback, thisArg) {
		var result = new Array();
		
		for (var i = 0; i < this.length; i++) {
			if (thisArg !== undefined)
				result.push(callback.call(thisArg, this[i]));
			else
				result.push(callback(this[i]));
		}
		
		return result;
	};
}

if (Array.prototype.filter === undefined) {
	Array.prototype.filter = function(callback, thisArg) {
		var result = new Array();
		
		for (var i = 0; i < this.length; i++) {
			if ((thisArg === undefined) ? callback(this[i]) : callback.call(thisArg, this[i]))
				result.push(this[i]);
		}
		
		return result;
	};
}

if (Array.prototype.reduce === undefined) {
	Array.prototype.reduce = function(callback, initialValue) {
		var result = new Array();
		var previousValue = initialValue;
		for (var i = 0; i < this.length; i++)
			previousValue = callback(previousValue, this[i] /* currentValue */, i /* index */, this /* array */);
		
		return previousValue;
	};
}

if (Array.prototype.reduceRight === undefined) {
	Array.prototype.reduceRight = function(callback, initialValue) {
		var result = new Array();
		var previousValue = initialValue;
		for (var i = this.length - 1; i > -1; i--)
			previousValue = callback(previousValue, this[i] /* currentValue */, i /* index */, this /* array */);
		
		return previousValue;
	};
}