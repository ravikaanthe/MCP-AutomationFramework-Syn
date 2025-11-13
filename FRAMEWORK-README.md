# Natural Language Test Automation Framework
## Playwright MCP + GitHub Copilot + TypeScript

### 🎯 Framework Overview

This is an **enterprise-grade, natural language-based test automation framework** designed for banking applications. It supports both **API and Web UI testing** with seamless variable sharing between steps.

---

## 🏗️ Framework Architecture

```
Framework/
├── src/
│   ├── core/
│   │   ├── TestContext.ts           # Central state management
│   │   └── PromptExecutor.ts        # Natural language prompt executor
│   ├── helpers/
│   │   ├── ApiHelper.ts             # API operations (GET, POST, PUT, DELETE)
│   │   └── UiHelper.ts              # UI operations (click, fill, verify)
│   └── fixtures/
│       └── test-fixtures.ts         # Playwright custom fixtures
├── config/
│   └── environment.ts               # Environment configurations
├── prompts/
│   └── UItoAPItoEndtoEnd/
│       ├── ParasoftEndtoEnd         # Natural language test prompt
│       └── create-contact.prompt    # Contact creation prompt
├── tests/
│   ├── parabank-e2e-generated.spec.ts      # Generated test script
│   └── parabank-prompt-driven.spec.ts      # Prompt-driven test
└── test-data/
    └── (test data files)
```

---

## 🚀 Key Features

### 1. **Natural Language Prompt Execution**
- Write tests in plain English
- No coding required for test creation
- Automatic parsing and execution

### 2. **Hybrid API + UI Testing**
- Seamless integration of API and UI steps
- Variable sharing across API and UI operations
- Single test flow for end-to-end scenarios

### 3. **Global Variable Management (TestContext)**
- Store and retrieve variables across steps
- Automatic variable substitution (e.g., `{{customerId}}`)
- Context persistence throughout test execution

### 4. **Intelligent Helpers**
- **ApiHelper**: REST API operations with XML/JSON parsing
- **UiHelper**: Web automation with smart element detection
- Automatic error handling and logging

### 5. **Enterprise-Ready**
- TypeScript for type safety
- Playwright Test framework
- HTML reports with screenshots
- Configurable environments

---

## 📝 How to Write Natural Language Prompts

### Example Prompt Structure:

```markdown
# Title: Test Name
# Description: What the test does

### Step 1: Login via API
- HTTP Method: GET
- Endpoint: https://api.example.com/login/username/password
- Store `customerId` from response into variable → **customerId**

### Step 2: Create Account via API
- HTTP Method: POST
- Endpoint: https://api.example.com/createAccount?customerId={{customerId}}
- Store `accountId` into variable → **newAccountId**

### Step 3: Launch Web Application
- Open URL: https://example.com

### Step 4: Login to Web UI
- Username: testuser
- Password: testpass

### Step 5: Validate Account in UI
- Click "Account Overview" link
- Check if **newAccountId** is displayed in the table

## VALIDATION RULES
- PASS: If newAccountId is found
- FAIL: If newAccountId is missing
```

---

## 🔧 Framework Components

### 1. TestContext (Global State Manager)

```typescript
import { testContext } from './src/core/TestContext';

// Store variable
testContext.set('customerId', '12345');

// Retrieve variable
const customerId = testContext.get('customerId');

// Check if exists
if (testContext.has('customerId')) { ... }

// Clear all
testContext.clear();

// Print all variables
testContext.printContext();
```

### 2. ApiHelper (API Operations)

```typescript
import { ApiHelper } from './src/helpers/ApiHelper';

const apiHelper = new ApiHelper();
await apiHelper.init('https://api.example.com');

// GET request
const result = await apiHelper.get('/endpoint');

// POST request
const createResult = await apiHelper.post('/create', { data });

// Extract from XML
const value = apiHelper.extractFromXML(xmlString, 'tagName');

// Replace placeholders
const url = apiHelper.replacePlaceholders('/customers/{{customerId}}/accounts');
```

### 3. UiHelper (Web Automation)

```typescript
import { UiHelper } from './src/helpers/UiHelper';

const uiHelper = new UiHelper(page);

// Navigate
await uiHelper.navigateTo('https://example.com');

// Fill form
await uiHelper.fill('input[name="username"]', 'user');

// Click
await uiHelper.clickButton('Submit');
await uiHelper.clickLink('Account Overview');

// Verify
await uiHelper.verifyTextPresent('Welcome');
await uiHelper.isValueInTable('table', 'accountId');

// Screenshot
await uiHelper.takeScreenshot('verification');
```

### 4. PromptExecutor (Natural Language)

```typescript
import { PromptExecutor } from './src/core/PromptExecutor';

const executor = new PromptExecutor(apiHelper, page);
await executor.loadPrompt('prompts/test.prompt');
await executor.execute();
```

---

## 🎮 Running Tests

### Option 1: Run Generated Test Scripts
```bash
# Run specific test
npx playwright test tests/parabank-e2e-generated.spec.ts

# Run with UI mode
npx playwright test tests/parabank-e2e-generated.spec.ts --ui

# Run in headed mode
npx playwright test tests/parabank-e2e-generated.spec.ts --headed
```

### Option 2: Run Prompt-Driven Tests
```bash
# Execute test from natural language prompt
npx playwright test tests/parabank-prompt-driven.spec.ts --headed
```

### Option 3: Using Package Scripts
```bash
# Run any test
npm test -- tests/parabank-e2e-generated.spec.ts

# View report
npm run show-report
```

---

## 📊 View Test Reports

```bash
# Open HTML report
npx playwright show-report

# Or use npm script
npm run show-report
```

Reports include:
- Step-by-step execution logs
- Screenshots
- API request/response details
- Context variable values

---

## 🏦 Use Cases for Banking Applications

### 1. Account Management
- Create account via API
- Verify account in UI
- Update account details
- Delete account

### 2. Transaction Processing
- Initiate transaction via API
- Verify transaction in UI
- Check balance updates
- Validate transaction history

### 3. Customer Onboarding
- Register customer via API
- Complete KYC via UI
- Verify customer profile
- Test approval workflow

### 4. Security & Authentication
- API authentication flow
- UI login validation
- Session management
- Token handling

---

## 🔐 Environment Configuration

```typescript
// config/environment.ts
export const environments = {
  parabank: {
    baseURL: 'https://parabank.parasoft.com/parabank',
    apiBaseURL: 'https://parabank.parasoft.com/parabank/services/bank',
    timeout: 30000,
    headless: false,
  },
  // Add more environments
};

// Use environment
const config = getConfig();
```

---

## 📈 Benefits for Leadership

### 1. **Faster Test Creation**
- Write tests in natural language
- No programming expertise required
- Reduce test creation time by 70%

### 2. **Better Collaboration**
- Business analysts can write test scenarios
- Developers can enhance framework
- QA can execute and maintain tests

### 3. **Comprehensive Coverage**
- API + UI in single test
- End-to-end validation
- Real-world user journeys

### 4. **Maintainability**
- Centralized variable management
- Reusable helpers
- Type-safe TypeScript code

### 5. **Enterprise-Ready**
- Detailed HTML reports
- Screenshot evidence
- CI/CD integration ready

---

## 🎯 Next Steps

1. **Create More Prompts**: Add natural language test scenarios in `prompts/` folder
2. **Generate Scripts**: Use Playwright MCP to convert prompts to executable tests
3. **Extend Helpers**: Add domain-specific helpers for your banking app
4. **Configure Environments**: Add staging/production configs
5. **Integrate CI/CD**: Add to Jenkins/Azure DevOps pipeline

---

## 📚 Example Workflow

```
1. Business Analyst writes test scenario in natural language (prompt file)
   ↓
2. Developer/QA uses Playwright MCP to execute prompt
   ↓
3. Framework automatically:
   - Executes API calls
   - Stores variables
   - Performs UI actions
   - Validates results
   ↓
4. HTML report generated with evidence
   ↓
5. Test can be converted to permanent test script for regression
```

---

## 🤝 Team Collaboration

- **Business Analysts**: Write test scenarios in `prompts/`
- **Developers**: Enhance framework in `src/`
- **QA Engineers**: Execute tests and review reports
- **DevOps**: Integrate into CI/CD pipelines

---

## 📞 Support

For questions or enhancements, contact your automation team lead.

**Framework Version**: 1.0.0  
**Last Updated**: November 2025
