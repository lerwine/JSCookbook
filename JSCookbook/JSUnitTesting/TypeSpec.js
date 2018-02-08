var JsUnitTesting = JsUnitTesting || {};
JsUnitTesting.TypeSpec = (function(Utility) {
	function TypeSpec(value) {
        this.prototypeChain = [];
        this.is = function(other) {
            if (typeof(other) === "undefined" || other === null || !(other instanceof TypeSpec))
                return this.is(new TypeSpec(other));
            if (this.prototypeChain.length < other.prototypeChain.length)
                return false;
            if (this.type != other.type) {
                if (this.prototypeChain.length > 0)
                    return false;
                if (this.type === "(nil)")
                    return (other.type === "(null)" || other.type === "undefined");
                if (other.type === "(nil)")
                    return (this.type === "(null)" || this.type === "undefined");
                return false;
            }
            
            var offset = this.prototypeChain.length - other.prototypeChain.length;
            for (var i = 0; i < other.prototypeChain.length; i++) {
                if (this.prototypeChain[i + offset] != other.prototypeChain[i])
                    return false;
            }
            return true;
        }
        if (arguments.length == 0) {
            this.value = null;
            this.type = "(nil)";
            return;
        }
        this.value = value;
        if (arguments.length == 2) {
            this.type = Utility.convertToString(arguments[1], TypeSpec.getTypeName(value));
            return;
        }
        this.type = TypeSpec.getTypeName(value);
        if (this.type == "undefined" || this.type == "(null)")
            return;
        
        var p = Object.getPrototypeOf(value);
        if (Utility.isNil(p))
            p = value.prototype;
        while (!Utility.isNil(p)) {
            var t = TypeSpec.getTypeName(p);
            if (t !== "object" && t !== "function")
                this.prototypeChain.push(t);
            p = Object.getPrototypeOf(p);
            if (Utility.isNil(p))
                p = p.prototype;
        }
    };
    TypeSpec.getTypeName = function(value) {
        var name = typeof(value);
        var s;
        if (name === "function") {
            if (typeof(value.name) === "string" && value.name.length > 0)
                return value.name;
            s = Utility.getFunctionName(value);
            if (!Utility.isNil(s))
                return s;
        } else if (name !== "object")
            return name;
        else if (value === null)
            return "(null)";
        if (typeof(value.constructor) === "function") {
            s = TypeSpec.getTypeName(value.constructor);
            if (s !== "function" && s !== "object")
                return s;
        }
        if (!Utility.isNil(value.prototype)) {
            s = TypeSpec.getTypeName(value.prototype);
            if (s !== "function" && s !== "object")
                return s;
        }

        var p = Object.getPrototypeOf(value);
        if (!Utility.isNil(p)) {
            s = TypeSpec.getTypeName(p);
            if (s !== "function")
                return s;
        }

        return name;
    };
	
    TypeSpec.is = function(actual, expected) { return (new TypeSpec(actual)).is(new TypeSpec(expected)); };

	return TypeSpec;
})(JsUnitTesting.Utility);