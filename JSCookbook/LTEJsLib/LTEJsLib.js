var LTEJsLib = { };

LTEJsLib.convertToString = function(value) {
	if (value === undefined || value === null)
		return '';
	
	if (typeof value === 'string')
		return value;
	
	var result = value.toString();
	
	if (value === undefined || value === null || typeof value !== string)
		return '';
	
	return value;
};
	
LTEJsLib.convertToBoolean = function(value) {
	if (value === undefined || value === null)
		return false;
	
	if (typeof value === 'boolean')
		return value;
		
	return !((typeof value === 'string') ? value : value.toString()).match(/^\s*(false.*|0+(\D.*|\s*)?)$/i);
};
