@echo off
REM Generic Playwright Test Runner Script
REM Usage: playwright-test.bat [test-file-pattern] [options]
REM Examples:
REM   playwright-test.bat                           (run all tests)
REM   playwright-test.bat --headed                  (run all tests in headed mode)
REM   playwright-test.bat tests/login*.spec.ts     (run specific test pattern)
REM   playwright-test.bat tests/api*.spec.ts --reporter=html (run with HTML reporter)

echo Running Playwright Tests...
if "%1"=="" (
    echo No specific test file provided, running all tests...
    node "node_modules/@playwright/test/cli.js" test
) else (
    echo Running tests with parameters: %*
    node "node_modules/@playwright/test/cli.js" test %*
)
