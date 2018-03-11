var JsUnitTesting = JsUnitTesting || {};

JsUnitTesting.Utility = function(Utility) {
    Utility = Utility || {};
    Utility.isNil = function(value) {
        return typeof value === "undefined" || value === null;
    };
    Utility.toArray = function(value) {
        if (typeof value === "undefined") return [];
        if (value !== null && value instanceof Array) return value;
        return [ value ];
    };
    Utility.mapArray = function(array, callback, thisArg) {
        var result = [];
        array = Utility.toArray();
        var invokeCb;
        if (!Utility.isNil(callback)) {
            if (typeof callback !== "function") throw "callback must be a callback if it is defined";
            invokeCb = function(i) {
                return callback.call(thisArg, array[i], i, array);
            };
        } else invokeCb = function(i) {
            return callback(array[i], i, array);
        };
        if (array.length == 0) return result;
        for (var i = 0; i < array.length; i++) result.push(invokeCb(i));
        return result;
    };
    Utility.filterArray = function(array, callback, thisArg) {
        var result = [];
        array = Utility.toArray();
        var invokeCb;
        if (!Utility.isNil(callback)) {
            if (typeof callback !== "function") throw "callback must be a callback if it is defined";
            invokeCb = function(i) {
                return callback.call(thisArg, array[i], i, array);
            };
        } else invokeCb = function(i) {
            return callback(array[i], i, array);
        };
        if (array.length == 0) return result;
        for (var i = 0; i < array.length; i++) {
            if (invokeCb(i)) result.push(array[i]);
        }
        return result;
    };
    Utility.reduceArray = function(array, callback, initialValue, thisArg) {
        array = Utility.toArray();
        var invokeCb;
        if (!Utility.isNil(callback)) {
            if (typeof callback !== "function") throw "callback must be a callback if it is defined";
            invokeCb = function(i, p) {
                return callback.call(thisArg, p, array[i], i, array);
            };
        } else invokeCb = function(i, p) {
            return callback(p, array[i], i, array);
        };
        var result = initialValue;
        if (array.length == 0) return result;
        if (typeof result === null) result = array[array.length - 1];
        for (var i = 0; i < array.length; i++) result = invokeCb(result, i);
        return result;
    };
    Utility.convertToString = function(value, defaultValue) {
        if (Utility.isNil(value)) {
            if (typeof defaultValue === "undefined") return value;
            return defaultValue === null ? defaultValue : Utility.convertToString(defaultValue);
        }
        switch (typeof value) {
          case "string":
            return value;

          case "number":
          case "boolean":
            return value.toString();
        }
        return JSON.stringify(value);
    };
    Utility.convertToNumber = function(value, defaultValue) {
        if (Utility.isNil(value)) {
            if (typeof defaultValue === "undefined") return value;
            return defaultValue === null ? defaultValue : Utility.convertToNumber(defaultValue);
        }
        switch (typeof value) {
          case "number":
            if (!isNaN(value)) return value;
            break;

          case "boolean":
            return value ? 1 : 0;

          default:
            if (value instanceof Date) return value.valueOf();
            var s = Utility.convertToString(value, "").trim();
            if (s.length > 0) {
                try {
                    var i = parseInt(s);
                    try {
                        var f = parseFloat(s);
                        if (isNaN(i)) value = f; else if (isNaN(f) || !Number.isFinite(f)) value = i; else if (!Number.isFinite(i)) value = f; else value = i == f ? i : f;
                    } catch (e) {
                        value = i;
                    }
                } catch (e) {
                    value = Number.NaN;
                }
            } else value = Number.NaN;
            if (!isNaN(value)) return value;
            break;
        }
        if (typeof defaultValue === "undefined") return value;
        if (defaultValue === null) return defaultValue;
        return Utility.convertToNumber(defaultValue);
    };
    Utility.getFunctionName = function(func) {
        if (typeof func !== "undefined" && func !== null) {
            if (typeof func === "function" && typeof func.name === "string" && func.name.length > 0) return func.name;
            if (typeof func.constructor === "function" && typeof func.constructor.name === "string" && func.constructor.name.length > 0) return func.constructor.name;
            var proto;
            if (typeof func.prototype !== "undefined" && func.prototype !== null && typeof func.prototype.constructor === "function") proto = func.prototype; else {
                var p = Object.getPrototypeOf(func);
                if (typeof p !== "undefined" && p !== null && typeof p.constructor === "function") proto = p;
            }
            if (typeof proto !== "undefined" && proto !== null && typeof proto.constructor.name === "string" && proto.constructor.name.length > 0) return proto.constructor.name;
            var re = /^function\s+([^(]+)/i;
            var r = re.exec(func.toString());
            if (r != null) return r[1];
        }
        return "";
    };
    return Utility;
}(JsUnitTesting.Utility);

JsUnitTesting.TypeSpec = function(Utility) {
    function TypeSpec(value) {
        this.prototypeChain = [];
        this.is = function(other) {
            if (typeof other === "undefined" || other === null || !(other instanceof TypeSpec)) return this.is(new TypeSpec(other));
            if (this.prototypeChain.length < other.prototypeChain.length) return false;
            if (this.type != other.type) {
                if (this.prototypeChain.length > 0) return false;
                if (this.type === "(nil)") return other.type === "(null)" || other.type === "undefined";
                if (other.type === "(nil)") return this.type === "(null)" || this.type === "undefined";
                return false;
            }
            var offset = this.prototypeChain.length - other.prototypeChain.length;
            for (var i = 0; i < other.prototypeChain.length; i++) {
                if (this.prototypeChain[i + offset] != other.prototypeChain[i]) return false;
            }
            return true;
        };
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
        if (this.type == "undefined" || this.type == "(null)") return;
        var p = Object.getPrototypeOf(value);
        if (Utility.isNil(p)) p = value.prototype;
        while (!Utility.isNil(p)) {
            var t = TypeSpec.getTypeName(p);
            if (t !== "object" && t !== "function") this.prototypeChain.push(t);
            p = Object.getPrototypeOf(p);
            if (Utility.isNil(p)) p = p.prototype;
        }
    }
    TypeSpec.getTypeName = function(value) {
        var name = typeof value;
        var s;
        if (name === "function") {
            if (typeof value.name === "string" && value.name.length > 0) return value.name;
            s = Utility.getFunctionName(value);
            if (!Utility.isNil(s)) return s;
        } else if (name !== "object") return name; else if (value === null) return "(null)";
        if (typeof value.constructor === "function") {
            s = TypeSpec.getTypeName(value.constructor);
            if (s !== "function" && s !== "object") return s;
        }
        if (!Utility.isNil(value.prototype)) {
            s = TypeSpec.getTypeName(value.prototype);
            if (s !== "function" && s !== "object") return s;
        }
        var p = Object.getPrototypeOf(value);
        if (!Utility.isNil(p)) {
            s = TypeSpec.getTypeName(p);
            if (s !== "function") return s;
        }
        return name;
    };
    TypeSpec.is = function(actual, expected) {
        return new TypeSpec(actual).is(new TypeSpec(expected));
    };
    return TypeSpec;
}(JsUnitTesting.Utility);

JsUnitTesting.TestResult = function(Utility, TypeSpec, ResultStatus) {
    function TestResult(evaluator, assertion, unitTest, testCollection, testId, stateInfo) {
        this.status = ResultStatus.NotEvaluated;
        this.error = null;
        this.unitTestId = null;
        this.unitTestName = null;
        this.testCollectionId = null;
        this.testCollectionName = null;
        this.message = thisObj.message;
        var cb = function(evaluator, args) {
            var assert = new Assert(unitTest, testCollection);
            return evaluator.apply(assert, args);
        };
        var thisObj = {
            stateInfo: stateInfo,
            unitTestId: Utility.isNil(testId) ? Utility.isNil(unitTest.id) ? null : unitTest.id : testId,
            unitTestName: unitTest.name,
            testCollectionId: Utility.isNil(testCollection) ? null : testCollection.id,
            testCollectionName: Utility.isNil(testCollection) ? null : testCollection.name,
            status: ResultStatus.Inconclusive
        };
        try {
            this.result = new TypeSpec(cb.call(this, evaluator, unitTest.args));
            if (typeof assertion === "function") {
                var ar = cb.call(this, assertion, [ result.value ]);
                if (typeof ar === "boolean") this.success = ar; else {
                    var m = Utility.convertToString(ar, "").trim();
                    if (m.length > 0) {
                        var s = Utility.convertToString(thisObj.message, "").trim();
                        if (s.length > 0) thisObj.message += "\n\n" + m; else thisObj.message = m;
                    }
                    this.success = true;
                }
            } else {
                if (typeof thisObj.success === "undefined") {
                    this.success = typeof thisObj.error === "undefined" || thisObj.error === null;
                    if (!this.success) this.error = thisObj.error;
                } else {
                    if (typeof thisObj.error === "undefined" || thisObj.error === null) this.error = thisObj.error;
                    this.success = thisObj.success && true;
                }
            }
            this.uncaughtExceptionOcurred = false;
        } catch (e) {
            this.uncaughtExceptionOcurred = true;
            if (typeof this.evaluationFinished === "undefined") {
                this.evaluationFinished = false;
                this.result = new TypeSpec();
            }
            this.success = false;
            this.error = e;
        }
        if (typeof thisObj.message !== "string") thisObj.message = Utility.convertToString(thisObj.message, "").trim();
        if (thisObj.message.length == 0) {
            thisObj.message = this.success ? "Success" : "Fail";
            if (!Utility.isNil(this.error)) thisObj.message = Utility.convertToString(this.error, thisObj.message).trim();
        }
        this.unitTestId = Utility.isNil(testId) ? Utility.isNil(unitTest.id) ? null : unitTest.id : testId;
        this.unitTestName = unitTest.name;
        this.testCollectionId = Utility.isNil(testCollection) ? null : testCollection.id;
        this.testCollectionName = Utility.isNil(testCollection) ? null : testCollection.name;
        this.message = thisObj.message;
    }
    return TestResult;
}(JsUnitTesting.Utility, JsUnitTesting.TypeSpec, JsUnitTesting.ResultStatus);

JsUnitTesting.UnitTest = function(Utility, TestResult, ResultStatus) {
    function UnitTest(evaluator, args, name, description, id, assertion) {
        if (typeof evaluator !== "function") {
            if (typeof evaluator === "undefined") throw "testFunc must be defined";
            if (evaluator === null) throw "testFunc cannot be null";
            throw "evaluator must be a function";
        }
        if (typeof assertion !== "function" && assertion !== null) throw "assertion must be a function if it is defined";
        id = JsUnitTesting.Utility.convertToNumber(id);
        if (typeof id !== "undefined" && id != null && !isNaN(id)) this.id = id;
        name = JsUnitTesting.Utility.convertToString(name, "");
        if (name.trim().length > 0) this.name = name; else {
            name = JsUnitTesting.Utility.getFunctionName(evaluator);
            if (typeof this.id !== "undefined") name = name.length == 0 ? this.id.toString() : name + " [" + this.id + "]";
        }
        this.name = name;
        this.description = JsUnitTesting.Utility.convertToString(description, "");
        this.toString = function() {
            return this.toJSON();
        };
        this.toJSON = function() {
            JSON.stringify({
                args: this.args,
                name: this.name,
                description: this.description,
                id: this.id
            });
        };
        this.valueOf = function() {
            return typeof this.id === "undefined" ? Number.NaN : this.id;
        };
        this.exec = function(testCollection, testId, stateInfo) {
            return new TestResult(evaluator, assertion, this, testCollection, testId, stateInfo);
        };
    }
    return UnitTest;
}(JsUnitTesting.Utility, JsUnitTesting.TestResult, JsUnitTesting.ResultStatus);

JsUnitTesting.TestCollection = function(Utility, UnitTest) {
    function _add() {
        for (var a = 0; a < arguments.length; a++) {
            var arr = Utility.toArray(arguments[a]);
            for (var i = 0; i < arr.length; i++) {
                if (typeof arr[i] !== "undefined" && arr[i] !== null && arr[i] instanceof UnitTest) this.notRun.push(arr[i]);
            }
        }
    }
    function _clear() {
        this.notRun = [];
        this.resultInfo = [];
    }
    function _run() {
        var passCount = 0;
        var totalCount = 0;
        var completedIds = Utility.mapArray(this.resultInfo, function(r) {
            return r.result.testId;
        });
        var state = {};
        var currentResults = [];
        while (this.notRun.length > 0) {
            var unitTest = this.notRun.pop();
            if (Utility.nil(unitTest)) return null;
            totalCount++;
            var id = unitTest.id;
            if (typeof id !== "number" || isNaN(id) || !Number.isFinite(id)) id = 0;
            var canUseId = true;
            for (var i = 0; i < completedIds.length; i++) {
                if (completedIds[i] == n) {
                    canUseId = false;
                    break;
                }
            }
            if (!canUseId) {
                var hasId = function(n) {
                    for (var i = 0; i < this.completed.length; i++) {
                        var x = this.completed[i].id;
                        if (typeof x === "number" && !isNaN(x) && Number.isFinite(x) && x == n) return true;
                    }
                    for (var i = 0; i < this.notRun.length; i++) {
                        var x = this.notRun[i].id;
                        if (typeof x === "number" && !isNaN(x) && Number.isFinite(x) && x == n) return true;
                    }
                    return false;
                };
                do {
                    id++;
                } while (hasId(id));
            }
            completedIds.push(id);
            var result = unitTest.exec(this, id, state);
            this.resultInfo.push({
                test: unitTest,
                result: result
            });
            currentResults.push(result);
            if (result.passed) passCount++;
        }
        return {
            passed: passCount,
            failed: totalCount - passed,
            results: currentResults
        };
    }
    function _runAll() {
        var passCount = 0;
        var toAdd = Utility.mapArray(this.resultInfo, function(r) {
            return r.test;
        });
        for (var i = 0; i < toAdd.length; i++) this.notRun.push(toAdd[i]);
        this.resultInfo = [];
        var completedIds = [];
        var state = {};
        while (this.notRun.length > 0) {
            var unitTest = this.notRun.pop();
            if (Utility.nil(unitTest)) return null;
            var id = unitTest.id;
            if (typeof id !== "number" || isNaN(id) || !Number.isFinite(id)) id = 0;
            var canUseId = true;
            for (var i = 0; i < completedIds.length; i++) {
                if (completedIds[i] == n) {
                    canUseId = false;
                    break;
                }
            }
            if (!canUseId) {
                var hasId = function(n) {
                    for (var i = 0; i < this.completed.length; i++) {
                        var x = this.completed[i].id;
                        if (typeof x === "number" && !isNaN(x) && Number.isFinite(x) && x == n) return true;
                    }
                    for (var i = 0; i < this.notRun.length; i++) {
                        var x = this.notRun[i].id;
                        if (typeof x === "number" && !isNaN(x) && Number.isFinite(x) && x == n) return true;
                    }
                    return false;
                };
                do {
                    id++;
                } while (hasId(id));
            }
            completedIds.push(id);
            var result = unitTest.exec(this, id, state);
            this.resultInfo.push({
                test: unitTest,
                result: result
            });
            if (result.passed) passCount++;
        }
        return {
            passed: passCount,
            failed: this.resultInfo.count - passCount,
            results: this.getResults()
        };
    }
    function TestCollection(tests, name, id) {
        var innerData = {
            name: Utility.convertToString(name),
            id: Utility.convertToNumber(id),
            notRun: [],
            resultInfo: []
        };
        this.name = innerData.name;
        this.id = innerData.id;
        this.add = function() {
            _add.apply(innerData, arguments);
        };
        this.clear = function() {
            _clear.call(innerData);
        };
        this.getPassedTests = function() {
            return Utility.mapArray(Utility.filterArray(innerData.resultInfo, function(r) {
                return r.result.passed;
            }), function(r) {
                return r.test;
            });
        };
        this.getFailedTests = function() {
            return Utility.mapArray(Utility.filterArray(innerData.resultInfo, function(r) {
                return !r.result.passed;
            }), function(r) {
                return r.test;
            });
        };
        this.getResults = function() {
            return Utility.mapArray(innerData.resultInfo, function(r) {
                return !r.result.passed;
            });
        };
        this.allPassed = function() {
            for (var i = 0; i < innerData.resultInfo.length; i++) {
                if (!innerData.resultInfo[i].result.passed) return false;
            }
            return true;
        };
        this.anyPassed = function() {
            for (var i = 0; i < innerData.resultInfo.length; i++) {
                if (innerData.resultInfo[i].result.passed) return true;
            }
            return false;
        };
        this.run = function() {
            return _run.call(innerData);
        };
        this.runAll = function() {
            return _runAll.call(innerData);
        };
        this.runFailed = function() {
            var passCount = 0;
            var totalCount = 0;
            var toAdd = Utility.mapArray(Utility.filterArray(innerData.resultInfo, function(r) {
                return !r.result.passed;
            }), function(r) {
                return r.test;
            });
            for (var i = 0; i < this.notRun.length; i++) toAdd.push(this.notRun[i]);
            this.notRun = toAdd;
            innerData.resultInfo = Utility.filterArray(innerData.resultInfo, function(r) {
                return r.result.passed;
            });
            var completedIds = Utility.mapArray(innerData.resultInfo, function(r) {
                return r.result.testId;
            });
            var state = {};
            var currentResults = [];
            while (this.notRun.length > 0) {
                var unitTest = this.notRun.pop();
                if (Utility.nil(unitTest)) return null;
                totalCount++;
                var id = unitTest.id;
                if (typeof id !== "number" || isNaN(id) || !Number.isFinite(id)) id = 0;
                var canUseId = true;
                for (var i = 0; i < completedIds.length; i++) {
                    if (completedIds[i] == n) {
                        canUseId = false;
                        break;
                    }
                }
                if (!canUseId) {
                    var hasId = function(n) {
                        for (var i = 0; i < this.completed.length; i++) {
                            var x = this.completed[i].id;
                            if (typeof x === "number" && !isNaN(x) && Number.isFinite(x) && x == n) return true;
                        }
                        for (var i = 0; i < this.notRun.length; i++) {
                            var x = this.notRun[i].id;
                            if (typeof x === "number" && !isNaN(x) && Number.isFinite(x) && x == n) return true;
                        }
                        return false;
                    };
                    do {
                        id++;
                    } while (hasId(id));
                }
                completedIds.push(id);
                var result = unitTest.exec(this, id, state);
                innerData.resultInfo.push({
                    test: unitTest,
                    result: result
                });
                currentResults.push(result);
                if (result.passed) passCount++;
            }
            return {
                passCount: passCount,
                failed: totalCount - passCount,
                results: currentResults
            };
        };
        this.add(tests);
    }
    return TestCollection;
}(JsUnitTesting.Utility, JsUnitTesting.UnitTest);

JsUnitTesting.AssertionError = function(Utility, UnitTest, TypeSpec) {
    function AssertionError(number, message, unitTest, testCollection, innerError, expected, actual, condition) {
        message = Utility.convertToString(message);
        number = Utility.convertToNumber(number, null);
        if (number !== null && Number.isFinite(number)) {
            this.errorNumber = number;
            if (message.length == 0) message = "Error " + number; else message = "Error " + number + ": " + message;
        } else if (message.length == 0) message = "Unexpected Error";
        Error.prototype.constructor.call(this, message);
        if (!Utility.isNil(innerError)) this.innerError = innerError; else this.innerError = "";
        if (!Utility.isNil(unitTest)) {
            if (!Utility.isNil(unitTest.id)) this.unitTestId = unitTest.id; else this.unitTestId = "";
            if (!Utility.isNil(unitTest.name)) this.unitTestName = unitTest.name; else this.unitTestName = "";
        } else {
            this.unitTestId = "";
            this.unitTestName = "";
        }
        if (!Utility.isNil(testCollection)) {
            if (!Utility.isNil(testCollection.id)) this.testCollectionId = testCollection.id; else this.testCollectionId = "";
            if (!Utility.isNil(testCollection.name)) this.testCollectionName = testCollection.name; else this.testCollectionName = "";
        } else {
            this.testCollectionId = "";
            this.testCollectionName = "";
        }
        condition = Utility.convertToString(condition, "");
        this.condition = condition.length == 0 ? "equal to" : condition;
        if (!Utility.isNil(expected)) this.expected = expected instanceof TypeSpec ? expected : new TypeSpec(expected); else this.expected = {};
        if (Utility.isNil(actual)) this.actual = {}; else this.actual = actual instanceof TypeSpec ? actual : new TypeSpec(actual);
    }
    AssertionError.prototype = Error.prototype;
    AssertionError.prototype.constructor = AssertionError;
    return AssertionError;
}(JsUnitTesting.Utility, JsUnitTesting.UnitTest, JsUnitTesting.TypeSpec);

JsUnitTesting.Assert = function(Utility, AssertionError, TypeSpec) {
    function Assert(unitTest, testCollection) {
        if (Utility.isNil(unitTest)) throw "JsUnitTesting.UnitTest object must be provided...";
        if (!(unitTest instanceof JsUnitTesting.UnitTest)) throw "The unit test object must be an instance of JsUnitTesting.UnitTest";
        if (!Utility.isNil(testCollection)) {
            if (!(testCollection instanceof JsUnitTesting.TestCollection)) throw "If test collection is provided, it must be an instance of JsUnitTesting.TestCollection";
        }
        this.fail = function(message, number, innerError) {
            throw new AssertionError(number, message, this.unitTest, this.testCollection, innerError, undefined, undefined, "fail");
        };
        this.isNil = function(value, message, number) {
            if (!Utility.isNil(value)) throw new AssertionError(number, message, this.unitTest, this.testCollection, innerError, new TypeSpec(), new TypeSpec(value), "is nil");
        };
        this.notNil = function(value, message, number) {
            if (Utility.isNil(value)) throw new AssertionError(number, message, this.unitTest, this.testCollection, innerError, new TypeSpec(), new TypeSpec(value), "not nil");
        };
        this.is = function(expected, actual, message, number) {
            if (!TypeSpec.is(actual, expected)) throw new AssertionError(number, message, this.unitTest, this.testCollection, innerError, new TypeSpec(expected), new TypeSpec(actual));
        };
        this.isNot = function(expected, actual, message, number) {
            if (TypeSpec.is(actual, expected)) throw new AssertionError(number, message, this.unitTest, this.testCollection, innerError, new TypeSpec(expected), new TypeSpec(actual), "is not");
        };
        this.areEqual = function(expected, actual, message, number) {
            var t = typeof expected;
            if (t !== typeof actual || t !== "undefined" && expected !== null && expected !== actual) throw new AssertionError(number, message, this.unitTest, this.testCollection, innerError, new TypeSpec(expected), new TypeSpec(actual), "strictly equal to");
        };
        this.areNotEqual = function(expected, actual, message, number) {
            var t = typeof expected;
            if (t === typeof actual && (t === "undefined" || expected === null || expected === actual)) throw new AssertionError(number, message, this.unitTest, this.testCollection, innerError, new TypeSpec(expected), new TypeSpec(actual), "not strictly equal to");
        };
        this.areLike = function(expected, actual, message, number) {
            if (Utility.isNil(expected)) {
                if (Utility.isNil(actual)) return;
            } else if (!Utility.isNil(actual) && expected == actual) return;
            throw new AssertionError(number, message, this.unitTest, this.testCollection, innerError, new TypeSpec(expected), new TypeSpec(actual));
        };
        this.areNotLike = function(expected, actual, message, number) {
            if (Utility.isNil(expected)) {
                if (!Utility.isNil(actual)) return;
            } else if (Utility.isNil(actual) || expected != actual) return;
            throw new AssertionError(number, message, this.unitTest, this.testCollection, innerError, new TypeSpec(expected), new TypeSpec(actual), "not equal to");
        };
        this.isLessThan = function(expected, actual, message, number) {
            if (!Utility.isNil(expected) && (Utility.isNil(actual) || actual < expected)) return;
            throw new AssertionError(number, message, this.unitTest, this.testCollection, innerError, new TypeSpec(expected), new TypeSpec(actual), "is less than");
        };
        this.notLessThan = function(expected, actual, message, number) {
            if (Utility.isNil(expected) || !Utility.isNil(actual) && actual >= expected) return;
            throw new AssertionError(number, message, this.unitTest, this.testCollection, innerError, new TypeSpec(expected), new TypeSpec(actual), "is not less than");
        };
        this.isGreaterThan = function(expected, actual, message, number) {
            if (!Utility.isNil(actual) && (Utility.isNil(expected) || actual > expected)) return;
            throw new AssertionError(number, message, this.unitTest, this.testCollection, innerError, new TypeSpec(expected), new TypeSpec(actual), "is greater than");
        };
        this.notGreaterThan = function(expected, actual, message, number) {
            if (Utility.isNil(actual) || !Utility.isNil(expected) && actual <= expected) return;
            throw new AssertionError(number, message, this.unitTest, this.testCollection, innerError, new TypeSpec(expected), new TypeSpec(actual), "is not greater than");
        };
        this.isTrue = function(actual, message, number) {
            return this.areLike(true, actual, message, number);
        };
        this.isFalse = function(actual, message, number) {
            return this.areLike(false, actual, message, number);
        };
    }
    return Assert;
}(JsUnitTesting.Utility, JsUnitTesting.AssertionError, JsUnitTesting.TypeSpec);