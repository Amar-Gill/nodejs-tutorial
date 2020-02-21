Testing

Test code is as important as production code!

Tests should neither be to specific nor too general.

Unit tests for algorithms with no or minimal external resources.  Avoid creating too many mocks.

Unit Test
-test a unit of application without external dependencies
-quick and dirty
-less info

Integration test
-test application with external dependencies
-take longer to run
-give more confidence on app performances

End to End Test
-Drives an application through its UI
-most confidence
-but take long and are very brittle

General Advice:
-favor unit tests over e2e tests
-covert unit test gaps with integration tests
-use e2e tests sparingly

Test Driven Development
1) Write failing test
2) Write simplest code to make test pass
3) Refactor if necessary