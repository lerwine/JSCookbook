namespace JSUnitTesting {
    export enum ResultStatus {
        /** Test results were inconclusive. */
        Inconclusive = -2,
        /** Test was not evaluated. */
        NotEvaluated = -1,
        /** Test result object contains debug information and does not indicate result status. */
        Debug = 0,
        /** Test result object is informational and does not indicate result status. */
        Info = 1,
        /** Test result object is for a test that has passed. */
        Pass = 2,
        /** Test result object is for a test that has passed with a warning message. */
        Warning = 3,
        /** Test result object is for a test that has failed.  */
        Fail = 4,
        /** Test result object is for a test that has failed due to an exception being thrown. */
        Error = 5
    }
}