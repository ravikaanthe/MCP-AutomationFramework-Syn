@echo off
REM Generic Playwright Report Viewer Script
REM This script opens the HTML test report in your default browser
REM Usage: playwright-report.bat

echo Opening Playwright HTML Report...
if exist "playwright-report\index.html" (
    echo Report found, opening...
    node "node_modules/@playwright/test/cli.js" show-report
) else (
    echo No report found. Run tests first with: npm run test:reporter
    echo Or use: playwright-test.bat --reporter=html
)
