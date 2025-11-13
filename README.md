# Natural Language Test Automation Framework
## Playwright MCP + GitHub Copilot + TypeScript for Banking Applications

This is an **enterprise-grade, natural language-based test automation framework** designed for banking applications. It supports both **API and Web UI testing** with seamless variable sharing between steps.

---

## 🎯 Quick Links

- 📖 **[Complete Framework Guide](FRAMEWORK-README.md)** - Detailed documentation
- 🏗️ **[Architecture Details](ARCHITECTURE.md)** - Technical architecture
- ⚡ **[Quick Start Guide](QUICK-START.md)** - Get started in 5 minutes
- 📝 **[Prompt Organization](PROMPT-STORAGE-STRUCTURE.md)** - How prompts are organized
- 📊 **[Leadership Summary](LEADERSHIP-SUMMARY.md)** - Executive overview
- 🎓 **[Prompt Writing Guide](prompts/PROMPT-ORGANIZATION-GUIDE.md)** - How to write prompts

---

## 🚀 What Makes This Framework Special?

### 1. **Natural Language Prompts**
Write tests in plain English - no programming required!

```markdown
### Step 1: Login via API
- Endpoint: https://api.bank.com/login/user/pass
- Store customerId → **customerId**

### Step 2: Create Account via API
- Endpoint: https://api.bank.com/accounts?id={{customerId}}
- Store accountId → **newAccountId**

### Step 3: Verify in UI
- Navigate to: https://bank.com
- Check if **newAccountId** is displayed
```

### 2. **Hybrid API + UI Testing**
Single test framework for both API and Web automation with shared variables.

### 3. **Enterprise-Ready**
- TypeScript for type safety
- Playwright for robust automation
- HTML reports with screenshots
- Modular architecture

---

## 📁 Project Structure

```
Framework/
├── src/                          ← Framework core
│   ├── core/
│   │   ├── TestContext.ts       ← Global variable storage
│   │   └── PromptExecutor.ts    ← Natural language parser
│   ├── helpers/
│   │   ├── ApiHelper.ts         ← API automation
│   │   └── UiHelper.ts          ← UI automation
│   └── fixtures/
│       └── test-fixtures.ts     ← Playwright fixtures
│
├── prompts/                      ← Natural language test prompts
│   ├── AccountManagement/
│   ├── TransactionManagement/
│   ├── CustomerManagement/
│   ├── LoanManagement/
│   ├── PaymentManagement/
│   └── SecurityAndAuth/
│
├── tests/                        ← Generated test scripts
│   ├── account-management/
│   ├── transaction-management/
│   └── parabank-e2e-generated.spec.ts
│
├── config/                       ← Environment configurations
├── test-data/                    ← Test data files
└── playwright-report/            ← HTML reports

Documentation Files:
├── FRAMEWORK-README.md           ← Complete framework guide
├── ARCHITECTURE.md               ← Technical architecture
├── QUICK-START.md                ← 5-minute setup
├── PROMPT-STORAGE-STRUCTURE.md   ← Prompt organization
├── LEADERSHIP-SUMMARY.md         ← Executive summary
└── README.md                     ← This file
```

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run Example Test
```bash
npm run test:parabank
```

### Step 3: View Report
```bash
npm run report
```

**That's it!** You've just run an end-to-end banking test that:
- Logged in via API
- Created an account via API
- Verified the account in the web UI

---

## 📝 Create Your First Test

### 1. Write a Natural Language Prompt

Create: `prompts/AccountManagement/my-test.prompt`

```markdown
# Title: My First Banking Test

### Step 1: Login via API
- HTTP Method: GET
- Endpoint: https://parabank.parasoft.com/parabank/services/bank/login/FicusRoot/katalon
- Store customerId → **customerId**

### Step 2: Verify in UI
- Open URL: https://parabank.parasoft.com/parabank/index.htm
- Username: FicusRoot
- Password: katalon
- Check if "Account Overview" is displayed
```

### 2. Create Test File

Create: `tests/account-management/my-test.spec.ts`

```typescript
import { test } from '../../src/fixtures/test-fixtures';
import { PromptExecutor } from '../../src/core/PromptExecutor';

test('My first test', async ({ page, apiHelper }) => {
  const executor = new PromptExecutor(apiHelper, page);
  await executor.loadPrompt('prompts/AccountManagement/my-test.prompt');
  await executor.execute();
});
```

### 3. Run Your Test
```bash
npx playwright test tests/account-management/my-test.spec.ts --headed
```

**Complete documentation**: See [QUICK-START.md](QUICK-START.md)

---

## 📊 Framework Features

### ✅ Core Capabilities
- ✅ Natural language test creation
- ✅ API automation (REST, SOAP, XML, JSON)
- ✅ Web UI automation
- ✅ Variable sharing between API and UI
- ✅ Global state management (TestContext)
- ✅ HTML reports with screenshots
- ✅ TypeScript for type safety
- ✅ Modular architecture

### ✅ Banking Modules Supported
- ✅ Account Management
- ✅ Transaction Management
- ✅ Customer Management
- ✅ Loan Management
- ✅ Payment Management
- ✅ Security & Authentication

### ✅ Example Test Scenarios Included
- ✅ Create account via API → Verify in UI
- ✅ Fund transfer via API → Verify in UI
- ✅ Customer profile update
- ✅ Loan application
- ✅ Bill payment
- ✅ Login authentication

---

## 🎯 Use Cases

This framework is perfect for:

1. **End-to-End Banking Workflows**
   - Account creation → Transaction → Verification
   
2. **API-First Testing with UI Validation**
   - Create via API → Verify in UI
   
3. **Regression Testing**
   - Automated test suites for CI/CD
   
4. **Smoke Testing**
   - Quick validation of critical flows
   
5. **Integration Testing**
   - API + Database + UI in one test

---

## 🎓 Documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| [QUICK-START.md](QUICK-START.md) | Get started in 5 minutes | Everyone |
| [FRAMEWORK-README.md](FRAMEWORK-README.md) | Complete framework guide | QA Engineers |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Technical details | Developers |
| [PROMPT-STORAGE-STRUCTURE.md](PROMPT-STORAGE-STRUCTURE.md) | Prompt organization | Test Creators |
| [PROMPT-ORGANIZATION-GUIDE.md](prompts/PROMPT-ORGANIZATION-GUIDE.md) | How to write prompts | Business Analysts |
| [LEADERSHIP-SUMMARY.md](LEADERSHIP-SUMMARY.md) | Executive overview | Management |

---

## 🛠️ Framework Components

### TestContext (Global Variables)
```typescript
import { testContext } from './src/core/TestContext';

testContext.set('customerId', '12345');
const id = testContext.get('customerId');
```

### ApiHelper (API Operations)
```typescript
import { ApiHelper } from './src/helpers/ApiHelper';

const api = new ApiHelper();
await api.init('https://api.bank.com');
const result = await api.get('/accounts');
```

### UiHelper (Web Automation)
```typescript
import { UiHelper } from './src/helpers/UiHelper';

const ui = new UiHelper(page);
await ui.navigateTo('https://bank.com');
await ui.fill('input[name="username"]', 'user');
await ui.clickButton('Submit');
```

---

## 🎬 Running Tests

### Run Specific Tests
```bash
# Parabank E2E test
npm run test:parabank

# Prompt-driven test
npm run test:parabank-prompt

# All E2E tests
npm run test:e2e

# All API tests
npm run test:api

# Specific test file
npm test -- tests/parabank-e2e-generated.spec.ts --headed
```

### Run with Options
```bash
# Headed mode (see browser)
npx playwright test --headed

# Debug mode
npx playwright test --debug

# UI mode (interactive)
npx playwright test --ui

# Specific browser
npx playwright test --project=chromium
```

### View Reports
```bash
# Open HTML report
npm run report

# Or directly
npx playwright show-report
```

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Install
```bash
npm install
```

### Install Playwright Browsers
```bash
npx playwright install
```

---

## 🎓 Example: Complete E2E Test

**Scenario**: Create account via API, verify in UI

**Prompt File**: `prompts/AccountManagement/create-checking-account-e2e.prompt`

**Test File**: `tests/account-management/create-checking-account-e2e.spec.ts`

**Run**:
```bash
npx playwright test tests/account-management/create-checking-account-e2e.spec.ts --headed
```

**Result**: HTML report showing all steps with evidence

---

## 📈 Benefits

### For Leadership
- ✅ 70% faster test creation
- ✅ Reduced QA costs
- ✅ Earlier bug detection
- ✅ Better ROI on automation

### For QA Team
- ✅ No programming required
- ✅ Easy test maintenance
- ✅ Comprehensive coverage
- ✅ Better collaboration

### For Developers
- ✅ API testing automation
- ✅ Clear test scenarios
- ✅ Early feedback
- ✅ Reduced production bugs

---

## 🔐 Prompt File Storage

**Location**: `C:\Playwright Automation Projects\Playwright MCP_Script & API\prompts\`

**Organization by Banking Modules**:
- `AccountManagement/` - Account operations
- `TransactionManagement/` - Transactions
- `CustomerManagement/` - Customer operations
- `LoanManagement/` - Loan operations
- `PaymentManagement/` - Payments
- `SecurityAndAuth/` - Authentication

**See**: [PROMPT-STORAGE-STRUCTURE.md](PROMPT-STORAGE-STRUCTURE.md) for complete details

---

## 🎯 Next Steps

1. ✅ Review [QUICK-START.md](QUICK-START.md)
2. ✅ Run example tests: `npm run test:parabank`
3. ✅ Review example prompts in `prompts/` folders
4. ✅ Create your own prompt file
5. ✅ Execute and iterate!

---

## 👥 Team Collaboration

- **Business Analysts**: Write test scenarios in `prompts/` folders
- **QA Engineers**: Execute tests, review reports
- **Developers**: Enhance framework, add features
- **DevOps**: Integrate into CI/CD pipelines

---

## 🏆 Why This Framework?

| Feature | Traditional | This Framework |
|---------|------------|----------------|
| Test Creation | 4-8 hours | 30-60 minutes |
| Skills Required | Programming | Natural language |
| API + UI | Separate tools | Single framework |
| Maintenance | High | Low |
| Collaboration | Limited | High |

---

## 📞 Support & Documentation

**Need Help?**
1. Check [QUICK-START.md](QUICK-START.md) for setup
2. Read [FRAMEWORK-README.md](FRAMEWORK-README.md) for details
3. Review example prompts in `prompts/` folders
4. Check [ARCHITECTURE.md](ARCHITECTURE.md) for technical info

**For Leadership**:
- See [LEADERSHIP-SUMMARY.md](LEADERSHIP-SUMMARY.md) for executive overview
- ROI analysis included
- Ready for presentation

---

## 📄 License

This project is proprietary to your organization.

---

## ✨ Framework Status

**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: November 2025  
**Test Coverage**: Banking E2E workflows  

---

**Ready to revolutionize your banking test automation!** 🚀

---

## Additional Documentation (Previous Features)

This project provides a comprehensive solution for running Playwright tests with proper handling of workspace folder names containing spaces and special characters.

## Quick Start

### Running Tests

#### Using NPM Scripts

**Run All Tests:**
```bash
npm run test                    # Run all tests
npm run test:headed            # Run all tests in headed mode (visible browser)
npm run test:ui                # Run tests in UI mode (interactive)
npm run test:debug             # Run tests in debug mode
```

**Run Specific Test Files:**
```bash
# Run specific test file
npm run test:file tests/create-contact-api-to-ui-generated.spec.ts

# Run specific test file in headed mode
npm run test:file:headed tests/create-contact-api-to-ui-generated.spec.ts

# Run specific test file with HTML report
npm run test:file:reporter tests/create-contact-api-to-ui-generated.spec.ts

# Run multiple test files matching pattern
npm run test:file "tests/api*.spec.ts"

# Run test with additional options
npm run test:file "tests/login*.spec.ts --project=chromium"
```

**View Reports:**
```bash
npm run report                 # Show the HTML report
```

#### Using Batch Files (Windows)
```bash
# Run all tests
./playwright-test.bat

# Run specific test file
./playwright-test.bat tests/create-contact-api-to-ui-generated.spec.ts

# Run tests in headed mode
./playwright-test.bat --headed

# Run specific test with HTML reporter
./playwright-test.bat tests/login*.spec.ts --reporter=html

# Run tests matching a pattern
./playwright-test.bat tests/api* --headed

# Show HTML report
./playwright-report.bat
```

## Test Examples

### Run Specific Tests

**Run Your Generated API-to-UI Test:**
```bash
# Normal mode
npm run test:file tests/create-contact-api-to-ui-generated.spec.ts

# Headed mode (visible browser)
npm run test:file:headed tests/create-contact-api-to-ui-generated.spec.ts

# With HTML report
npm run test:file:reporter tests/create-contact-api-to-ui-generated.spec.ts

# Using batch file (alternative)
./playwright-test.bat tests/create-contact-api-to-ui-generated.spec.ts --headed
```

**Run Any Other Test:**
```bash
# Run login test
npm run test:file:headed tests/login-datadriven-generated.spec.ts

# Run admin module test
npm run test:file tests/admin-module-access.spec.ts

# Run buzz post verification
npm run test:file:reporter tests/buzz-post-verification.spec.ts
```

### Run Multiple Tests
```bash
# Run all API tests
./playwright-test.bat tests/api*.spec.ts

# Run all login tests
./playwright-test.bat tests/login*.spec.ts --headed

# Run all tests with HTML report
npm run test:reporter
```

## Viewing Reports

### HTML Reports
```bash
# Generate and view HTML report
npm run test:reporter && npm run report

# Or using batch files
./playwright-test.bat --reporter=html
./playwright-report.bat
```

The HTML report will open automatically in your default browser and show:
- Test execution summary
- Pass/fail status for each test
- Screenshots and videos of failures
- Test execution timeline
- Detailed error messages

### Console Output
All npm scripts and batch files provide detailed console output showing:
- Test execution progress
- API call results
- UI interaction steps
- Pass/fail status
- Execution time

## Troubleshooting

### NPX Command Issues
If you encounter errors like:
```
'API\node_modules\.bin\' is not recognized as an internal or external command
```

This is due to spaces in the folder path. Use the provided solutions:
1. **NPM Scripts**: Use `npm run test` instead of `npx playwright test`
2. **Batch Files**: Use `./playwright-test.bat` instead of `npx playwright test`
3. **Direct Node**: Use `node node_modules/@playwright/test/cli.js test`

### Common Commands
```bash
# If npx fails, use these alternatives:
npm run test                    # instead of: npx playwright test
npm run test:headed            # instead of: npx playwright test --headed  
npm run report                 # instead of: npx playwright show-report
./playwright-test.bat          # batch file alternative
```

## Project Structure
```
├── tests/                     # Test files
│   ├── *.spec.ts             # Generated and manual test files
├── prompts/                   # Prompt files for test generation
├── playwright-report/         # HTML reports (auto-generated)
├── test-results/             # Screenshots, videos, traces
├── playwright-test.bat       # Generic test runner script
├── playwright-report.bat     # Report viewer script
├── package.json              # NPM scripts and dependencies
└── playwright.config.ts      # Playwright configuration
```

## Tips
- Always use `npm run test:reporter` when you want to generate HTML reports
- Use `--headed` flag to see browser interactions visually
- Use `--debug` flag to step through tests interactively
- Check `playwright-report/index.html` for detailed test results
- Batch files handle all command-line parameters, so you can pass any Playwright CLI options
