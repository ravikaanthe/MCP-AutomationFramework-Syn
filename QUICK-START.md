# Quick Start Guide
## Natural Language Test Automation Framework

---

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies (if not already done)
```bash
npm install
```

### Step 2: Run Your First Test

#### Option A: Run Generated Test Script
```bash
npm run test:parabank
```

#### Option B: Run Prompt-Driven Test
```bash
npm run test:parabank-prompt
```

#### Option C: Run Any Test File
```bash
npm test -- tests/parabank-e2e-generated.spec.ts --headed
```

### Step 3: View Test Report
```bash
npm run report
```

---

## 🎮 Running Tests - Complete Guide

### Running All Tests in a Module
Run all tests in a specific module folder:
```bash
npm run test:account-management      # All account tests (headed)
npm run test:transaction-management  # All transaction tests (headed)
npm run test:customer-management     # All customer tests (headed)
```

### Running Specific Test Patterns
Use grep to run tests matching a pattern:
```bash
npm run test:selfhealing            # All self-healing tests (headed)
npm test -- --headed --grep "login" # All tests with "login" in name
```

### Running Individual Tests
**❌ DOES NOT WORK** (due to workspace folder name with special characters):
```bash
# These commands will fail with "No tests found":
npm test tests/account-management/my-test.spec.ts
npm test -- tests/account-management/my-test.spec.ts --headed
```

**✅ RECOMMENDED APPROACHES:**

**Option 1:** Use VS Code Test Explorer
- Open Testing panel (beaker icon)
- Click the play button next to any test

**Option 2:** Use `.only` modifier in the test file
```typescript
test.only('My specific test', async ({ ... }) => {
  // This test will run exclusively
});
```
Then run all tests in that module:
```bash
npm run test:account-management
```

**Option 3:** Use grep with unique test name
```bash
npm test -- --headed --grep "unique-test-name"
```

**Option 4:** Temporarily move other tests
- Move other test files out of the folder
- Run the module tests
- Move files back

### Running Tests with Options
```bash
# Headed mode (browser visible)
npm run test:account-management

# Headless mode (no browser UI)
npm run test:account-management:ci

# With 1 worker (no parallel execution)
node node_modules/@playwright/test/cli.js test tests/account-management --headed --workers=1

# Debug mode (step through)
npm run test:debug

# UI mode (interactive)
npm run test:ui
```

### Self-Healing Tests
Tests with `Self-Healing: YES` in the prompt file will automatically use self-healing:
```bash
npm run test:selfhealing           # Run all self-healing tests
npm run test:selfhealing:ci        # Run in CI mode
```

---

## 📝 Create Your First Test

### 1. Write a Natural Language Prompt

Create: `prompts/my-first-test.prompt`

```markdown
# Title: My Banking Test
# Description: Create account and verify

### Step 1: Login via API
- HTTP Method: GET
- Endpoint: https://parabank.parasoft.com/parabank/services/bank/login/FicusRoot/katalon
- Store `customerId` from response → **customerId**

### Step 2: Launch Web Application
- Open URL: https://parabank.parasoft.com/parabank/index.htm

### Step 3: Login to Web UI
- Username: FicusRoot
- Password: katalon

### Step 4: Verify Login
- Ensure the page displays "Account Overview" link
```

### 2. Execute the Prompt

Create: `tests/my-first-test.spec.ts`

```typescript
import { test } from '../src/fixtures/test-fixtures';
import { PromptExecutor } from '../src/core/PromptExecutor';

test('My first test', async ({ page, apiHelper }) => {
  const executor = new PromptExecutor(apiHelper, page);
  await executor.loadPrompt('prompts/my-first-test.prompt');
  await executor.execute();
});
```

### 3. Run Your Test
```bash
npx playwright test tests/my-first-test.spec.ts --headed
```

---

## 🎯 Common Test Patterns

### Pattern 1: API → Store Variable → UI Verify

```markdown
### Step 1: Create via API
- HTTP Method: POST
- Endpoint: https://api.example.com/create
- Store `id` → **resourceId**

### Step 2: Verify in UI
- Navigate to: https://app.example.com
- Check if **resourceId** is displayed
```

### Pattern 2: UI Input → API Verify

```typescript
// In test code
testContext.set('userId', '12345');

// Then API step can use {{userId}}
```

### Pattern 3: Multiple API Calls with Variable Chain

```markdown
### Step 1: Login
- Store `token` → **authToken**

### Step 2: Get User
- Endpoint: https://api.example.com/user
- Headers: Authorization: Bearer {{authToken}}
- Store `userId` → **userId**

### Step 3: Create Resource
- Endpoint: https://api.example.com/resource?user={{userId}}
```

---

## 🛠️ Using Framework Helpers Directly

### TestContext Example

```typescript
import { testContext } from './src/core/TestContext';

test('Store and retrieve variables', async () => {
  // Store
  testContext.set('accountId', '12345');
  
  // Retrieve
  const accountId = testContext.get('accountId');
  console.log(accountId); // 12345
  
  // Print all
  testContext.printContext();
});
```

### ApiHelper Example

```typescript
import { ApiHelper } from './src/helpers/ApiHelper';

test('Make API calls', async () => {
  const api = new ApiHelper();
  await api.init('https://api.example.com');
  
  // GET request
  const result = await api.get('/endpoint');
  console.log(result.status, result.body);
  
  // POST request
  const createResult = await api.post('/create', { name: 'Test' });
  
  // Extract from XML
  const id = api.extractFromXML(result.body, 'id');
  
  // Replace placeholders
  api.storeVariable('userId', '123');
  const url = api.replacePlaceholders('/user/{{userId}}/profile');
  console.log(url); // /user/123/profile
});
```

### UiHelper Example

```typescript
import { UiHelper } from './src/helpers/UiHelper';

test('UI automation', async ({ page }) => {
  const ui = new UiHelper(page);
  
  // Navigate
  await ui.navigateTo('https://example.com');
  
  // Fill form
  await ui.fill('input[name="username"]', 'testuser');
  await ui.fill('input[name="password"]', 'testpass');
  
  // Click
  await ui.clickButton('Submit');
  
  // Verify
  await ui.verifyTextPresent('Welcome');
  
  // Check table
  const found = await ui.isValueInTable('table', '12345');
  console.log('Value found:', found);
  
  // Screenshot
  await ui.takeScreenshot('evidence');
});
```

---

## 📊 Test Execution Commands

### Run Tests

```bash
# All tests
npm test

# Specific test
npm test -- tests/parabank-e2e-generated.spec.ts

# Headed mode (see browser)
npm test -- tests/parabank-e2e-generated.spec.ts --headed

# Debug mode
npm test -- tests/parabank-e2e-generated.spec.ts --debug

# UI mode (interactive)
npm test -- tests/parabank-e2e-generated.spec.ts --ui

# Run by tag
npm test -- --grep @smoke

# Run E2E tests only
npm run test:e2e

# Run API tests only
npm run test:api
```

### View Reports

```bash
# Open HTML report
npm run report

# Or directly
npx playwright show-report
```

---

## 🔍 Debugging Tips

### 1. Print Context Variables

```typescript
testContext.printContext();
// Output:
// === Test Context Data ===
// customerId: 12345
// accountId: 67890
// ========================
```

### 2. Debug Mode

```bash
npx playwright test tests/my-test.spec.ts --debug
```

This opens Playwright Inspector where you can:
- Step through test line by line
- Inspect page elements
- View console logs
- See network requests

### 3. Headed Mode

```bash
npx playwright test tests/my-test.spec.ts --headed --slow-mo=1000
```

See the browser and slow down actions.

### 4. Console Logs

All helpers have built-in logging:
```
[API GET] /endpoint
[API Response] Status: 200
[UI] Clicking: Submit button
[TestContext] Set customerId = 12345
```

---

## 📁 Project Structure Reference

```
Framework/
├── src/
│   ├── core/
│   │   ├── TestContext.ts          ← Store/retrieve variables
│   │   └── PromptExecutor.ts       ← Execute natural language prompts
│   ├── helpers/
│   │   ├── ApiHelper.ts            ← API operations
│   │   └── UiHelper.ts             ← UI operations
│   └── fixtures/
│       └── test-fixtures.ts        ← Playwright fixtures
├── config/
│   └── environment.ts              ← Environment configs
├── prompts/
│   └── UItoAPItoEndtoEnd/
│       └── ParasoftEndtoEnd        ← Natural language prompts
├── tests/
│   ├── parabank-e2e-generated.spec.ts       ← Generated test
│   └── parabank-prompt-driven.spec.ts       ← Prompt-driven test
├── test-results/                   ← Screenshots, traces
├── playwright-report/              ← HTML reports
├── FRAMEWORK-README.md             ← Complete documentation
├── ARCHITECTURE.md                 ← Architecture details
└── QUICK-START.md                  ← This file
```

---

## 🎬 Example: Complete End-to-End Test

### Prompt File: `prompts/account-creation.prompt`

```markdown
# Title: Account Creation E2E Test
# Description: Create account via API and verify in UI

### Step 1: Login via API
- HTTP Method: GET
- Endpoint: https://parabank.parasoft.com/parabank/services/bank/login/FicusRoot/katalon
- Store `customerId` from response → **customerId**

### Step 2: Get Existing Accounts
- HTTP Method: GET
- Endpoint: https://parabank.parasoft.com/parabank/services/bank/customers/{{customerId}}/accounts
- Store first account `id` → **firstAccountId**

### Step 3: Create New Account
- HTTP Method: POST
- Endpoint: https://parabank.parasoft.com/parabank/services/bank/createAccount?customerId={{customerId}}&newAccountType=1&fromAccountId={{firstAccountId}}
- Store `id` → **newAccountId**

### Step 4: Launch Web Application
- Open URL: https://parabank.parasoft.com/parabank/index.htm

### Step 5: Login to UI
- Username: FicusRoot
- Password: katalon

### Step 6: Verify Account
- Click "Accounts Overview"
- Check if **newAccountId** is displayed in table
```

### Test File: `tests/account-creation.spec.ts`

```typescript
import { test } from '../src/fixtures/test-fixtures';
import { PromptExecutor } from '../src/core/PromptExecutor';

test('Account creation E2E', async ({ page, apiHelper }) => {
  const executor = new PromptExecutor(apiHelper, page);
  await executor.loadPrompt('prompts/account-creation.prompt');
  await executor.execute();
});
```

### Run:

```bash
npx playwright test tests/account-creation.spec.ts --headed
```

---

## 🚀 Next Steps

1. ✅ Run the demo test: `npm run test:parabank`
2. ✅ View the report: `npm run report`
3. ✅ Create your own prompt file
4. ✅ Execute and iterate
5. ✅ Share with your team!

---

## 💡 Pro Tips

### Tip 1: Use Variable Placeholders
```
Store as: **customerId**
Use as: {{customerId}}
```

### Tip 2: Chain Variables
```
Step 1: Store **token**
Step 2: Use {{token}} to get **userId**
Step 3: Use {{userId}} to create **resource**
```

### Tip 3: Verify After Every Action
```
Create → Verify Created
Update → Verify Updated
Delete → Verify Deleted
```

### Tip 4: Take Screenshots
```typescript
await uiHelper.takeScreenshot('before-action');
// ... perform action
await uiHelper.takeScreenshot('after-action');
```

---

## 📞 Need Help?

- Check `FRAMEWORK-README.md` for detailed documentation
- Check `ARCHITECTURE.md` for technical details
- Review example tests in `tests/` folder
- Review example prompts in `prompts/` folder

**Happy Testing!** 🎉
