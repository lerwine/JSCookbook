JsUnitTesting.TestCollection = (function(Utility, UnitTest) {
	/**
	 * @classDescription	A collection of unit tests to be performed.
	 * @param {Array=} tests -	Tests to initialy add.
	 * @param {string=} name -	Name of unit test collection.
	 * @param {number=} id -	Unique ID of unit test collection.
	 * @constructor
	 */
	function TestCollection(tests, name, id) {
		this.notRun = [];
		this.__resultInfo = [];
		this.name = Utility.convertToString(name);
		this.id = Utility.convertToNumber(id);
		this.add = function() {
			for (var a = 0; a < arguments.length; a++) {
				var arr = Utility.toArray(arguments[a]);
				for (var i = 0; i < arr.length; i++) {
					if (typeof(arr[i]) !== "undefined" && arr[i] !== null && (arr[i] instanceof UnitTest))
						this.notRun.push(arr[i]);
				}
			}
		};
		this.clear = function() {
			this.notRun = [];
			this.__resultInfo = [];
		};
		this.getPassedTests = function() {
			return Utility.mapArray(Utility.filterArray(this.__resultInfo, function(r) { return r.result.passed; }),
				function(r) { return r.test; }); };
		this.getFailedTests = function() {
			return Utility.mapArray(Utility.filterArray(this.__resultInfo, function(r) { return !r.result.passed; }),
				function(r) { return r.test; }); };
		this.getResults = function() { return Utility.mapArray(this.__resultInfo, function(r) { return !r.result.passed; }); };
		this.allPassed = function() {
			for (var i = 0; i < this.__resultInfo.length; i++) {
				if (!this.__resultInfo[i].result.passed)
					return false;
			}
			return true;
		};
		this.anyPassed = function() {
			for (var i = 0; i < this.__resultInfo.length; i++) {
				if (this.__resultInfo[i].result.passed)
					return true;
			}
			return false;
		};
		this.run = function() {
			var passCount = 0;
			var totalCount = 0;
			var completedIds = Utility.mapArray(this.__resultInfo, function(r) { return r.result.testId; });
			var state = {};
			var currentResults = [];
			while (this.notRun.length > 0) {
				var unitTest = this.notRun.pop();
				if (Utility.nil(unitTest))
					return null;
				totalCount++;
				var id = unitTest.id;
				if (typeof(id) !== "number" || isNaN(id) || !Number.isFinite(id))
					id = 0;
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
							if (typeof(x) === "number" && !isNaN(x) && Number.isFinite(x) && x == n)
								return true;
						}
						for (var i = 0; i < this.notRun.length; i++) {
							var x = this.notRun[i].id;
							if (typeof(x) === "number" && !isNaN(x) && Number.isFinite(x) && x == n)
								return true;
						}
						return false;
					};
					do {
						id++;
					} while (hasId(id));
				}
				completedIds.push(id);
				var result = unitTest.exec(this, id, state);
				this.__resultInfo.push({
					test: unitTest,
					result: result
				});
				currentResults.push(result);
				if (result.passed)
					passCount++;
			}
			return {
				passed: passCount,
				failed: totalCount - passed,
				results: currentResults
			};
		};
		this.runAll = function() {
			var passCount = 0;
			var toAdd = Utility.mapArray(this.__resultInfo, function(r) { return r.test; });
			for (var i = 0; i < toAdd.length; i++)
				this.notRun.push(toAdd[i]);
			this.__resultInfo = [];
			var completedIds = [];
			var state = {};
			
			while (this.notRun.length > 0) {
				var unitTest = this.notRun.pop();
				if (Utility.nil(unitTest))
					return null;
				var id = unitTest.id;
				if (typeof(id) !== "number" || isNaN(id) || !Number.isFinite(id))
					id = 0;
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
							if (typeof(x) === "number" && !isNaN(x) && Number.isFinite(x) && x == n)
								return true;
						}
						for (var i = 0; i < this.notRun.length; i++) {
							var x = this.notRun[i].id;
							if (typeof(x) === "number" && !isNaN(x) && Number.isFinite(x) && x == n)
								return true;
						}
						return false;
					};
					do {
						id++;
					} while (hasId(id));
				}
				completedIds.push(id);
				var result = unitTest.exec(this, id, state);
				this.__resultInfo.push({
					test: unitTest,
					result: result
				});
				if (result.passed)
					passCount++;
			}
			return {
				passed: passCount,
				failed: this.__resultInfo.count - passCount,
				results: this.getResults()
			};
		};
		this.runFailed = function() {
			var passCount = 0;
			var totalCount = 0;
			var toAdd = Utility.mapArray(Utility.filterArray(this.__resultInfo, function(r) { return !r.result.passed; }), function(r) { return r.test; });
			for (var i = 0; i < this.notRun.length; i++)
				toAdd.push(this.notRun[i]);
			this.notRun = toAdd;
			this.__resultInfo= Utility.filterArray(this.__resultInfo, function(r) { return r.result.passed; });
			var completedIds = Utility.mapArray(this.__resultInfo, function(r) { return r.result.testId; });
			var state = {};
			var currentResults = [];
			while (this.notRun.length > 0) {
				var unitTest = this.notRun.pop();
				if (Utility.nil(unitTest))
					return null;
				totalCount++;
				var id = unitTest.id;
				if (typeof(id) !== "number" || isNaN(id) || !Number.isFinite(id))
					id = 0;
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
							if (typeof(x) === "number" && !isNaN(x) && Number.isFinite(x) && x == n)
								return true;
						}
						for (var i = 0; i < this.notRun.length; i++) {
							var x = this.notRun[i].id;
							if (typeof(x) === "number" && !isNaN(x) && Number.isFinite(x) && x == n)
								return true;
						}
						return false;
					};
					do {
						id++;
					} while (hasId(id));
				}
				completedIds.push(id);
				var result = unitTest.exec(this, id, state);
				this.__resultInfo.push({
					test: unitTest,
					result: result
				});
				currentResults.push(result);
				if (result.passed)
					passCount++;
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
})(JsUnitTesting.Utility, JsUnitTesting.UnitTest);