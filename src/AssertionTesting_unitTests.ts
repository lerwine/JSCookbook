import { AssertionTesting as assert } from "./AssertionTesting";
import { TypeUtil } from "./TypeUtil";

let tests: assert.TestDefinition[] = [
    new assert.TestDefinition("TypeUtil.defined", function(args, invocationInfo) {
        assert.areEqual(invocationInfo.iteration.metaData.expected, TypeUtil.defined(args[0]));
    }, [
        { args: [], description: "no args", metaData: { expected: false } },
        { args: [undefined], description: "undefined", metaData: { expected: false } },
        { args: [null], description: "null", metaData: { expected: false } },
        { args: [false], description: "false", metaData: { expected: false } },
        { args: [0], description: "zero", metaData: { expected: false } },
        { args: [NaN], description: "NaN", metaData: { expected: false } },
        { args: [[]], description: "[]", metaData: { expected: false } }
    ])
];