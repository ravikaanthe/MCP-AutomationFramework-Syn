# 🎯 Complete Framework Guide
**Comprehensive documentation of the Playwright MCP Automation Framework**

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Directory Structure](#directory-structure)
3. [Core Components](#core-components)
4. [Helper Classes](#helper-classes)
5. [Test Organization](#test-organization)
6. [Prompt System](#prompt-system)
7. [Configuration Files](#configuration-files)
8. [How It All Works Together](#how-it-all-works-together)
9. [Testing Workflow](#testing-workflow)
10. [Key Concepts](#key-concepts)

---

## 🎯 Project Overview

**Purpose:** An enterprise-grade test automation framework that enables anyone (Business Analysts, QA, Developers) to write test scenarios in natural language prompts, which GitHub Copilot converts into executable Playwright test scripts.

**Key Innovation:** Bridge the gap between natural language test requirements and executable code through AI-powered code generation using GitHub Copilot with Model Context Protocol (MCP).

**Technology Stack:**
- **Runtime:** Node.js with TypeScript
- **Testing Framework:** Microsoft Playwright
- **Code Generation:** GitHub Copilot with MCP
- **API Testing:** Built-in ApiHelper with axios
- **UI Testing:** Built-in UiHelper wrapping Playwright Page APIs
- **Test Application:** Parabank (Banking Demo Application)

---

## 📁 Directory Structure

```
playwright-mcp-automation/
│
├── src/                                    # Source code (framework core)
│   ├── core/                              # Core framework utilities
│   │   └── TestContext.ts                # Shared state management
│   │
│   ├── fixtures/                          # Test fixtures (dependency injection)
│   │   └── test-fixtures.ts              # Custom Playwright fixtures
│   │
│   └── helpers/                           # Helper classes (reusable utilities)
│       ├── ApiHelper.ts                   # REST/SOAP API testing
│       └── UiHelper.ts                    # UI automation wrapper
│
├── tests/                                  # Test scripts organized by module
│   ├── account-management/                # Account module tests
│   ├── customer-management/               # Customer module tests
│   ├── loan-management/                   # Loan module tests
│   ├── payment-management/                # Payment module tests
│   ├── security-and-auth/                 # Security tests
│   └── transaction-management/            # Transaction tests
│
├── prompts/                                # Natural language prompts
│   ├── AccountManagement/                 # Account prompts
│   ├── CustomerManagement/                # Customer prompts
│   ├── FRAMEWORK-GUIDELINES.md            # Code generation patterns
│   └── _FRAMEWORK_TEMPLATE.txt            # Prompt template
│
├── test-data/                             # Test data files
│   └── loginData.csv                      # CSV data for data-driven tests
│
├── test-results/                          # Test execution artifacts
│   └── screenshots/                       # Screenshots from test runs
│
├── playwright-report/                     # HTML test reports
│   └── index.html                         # Report dashboard
│
├── playwright.config.ts                   # Playwright configuration
├── tsconfig.json                          # TypeScript configuration
├── package.json                           # Dependencies and scripts
│
└── Documentation/                         # Project documentation
    ├── README.md                          # Main project readme
    ├── ARCHITECTURE.md                    # Architecture deep dive
    ├── QUICK-START.md                     # Getting started guide
    ├── LEADERSHIP-DEMO.md                 # Demo presentation guide
    └── CI-CD-GUIDE.md                     # CI/CD integration guide
```

---

## 🔧 Core Components

### **1. TestContext.ts** (`src/core/TestContext.ts`)

**Purpose:** Centralized state management for sharing data between test steps.

**What It Does:**
- Stores variables that need to be shared across test steps
- Acts as a key-value store for test data
- Automatically prints context at the end of each test for debugging
- Clears context before each test to prevent data leakage

**Key Methods:**
```typescript
testContext.set(key: string, value: any)    // Store a value
testContext.get(key: string): any           // Retrieve a value
testContext.clear()                         // Clear all stored values
testContext.printContext()                  // Print all values to console
```

**Example Usage:**
```typescript
// Step 1: Store customer ID from API response
testContext.set('customerId', 12345);

// Step 2: Retrieve customer ID in another step
const customerId = testContext.get('customerId');
```

**Why It's Important:**
- Enables end-to-end tests where API creates data, UI verifies it
- Eliminates need for global variables
- Makes tests more readable (clear intent of data sharing)

---

### **2. test-fixtures.ts** (`src/fixtures/test-fixtures.ts`)

**Purpose:** Dependency injection system that provides pre-configured helpers to every test.

**What It Does:**
- Extends Playwright's base test with custom fixtures
- Automatically initializes ApiHelper, UiHelper, and TestContext
- Provides clean instances for each test (prevents state pollution)
- Handles cleanup after tests complete

**Architecture:**
```typescript
type CustomFixtures = {
  apiHelper: ApiHelper;      // For API testing
  uiHelper: UiHelper;        // For UI automation
  testContext: typeof testContext;  // For state management
};

export const test = base.extend<CustomFixtures>({ ... });
```

**How Tests Use It:**
```typescript
import { test, expect } from '../../src/fixtures/test-fixtures';

test('My test', async ({ apiHelper, uiHelper, testContext }) => {
  // apiHelper, uiHelper, testContext are automatically available
});
```

**Benefits:**
- No need to manually create helper instances
- Consistent setup across all tests
- Automatic cleanup (dispose of resources)
- Easy to add new fixtures without modifying tests

---

## 🛠️ Helper Classes

### **3. ApiHelper.ts** (`src/helpers/ApiHelper.ts`)

**Purpose:** Simplifies API testing (REST and SOAP) with built-in request handling.

**Core Functionality:**

#### **Initialization:**
```typescript
await apiHelper.init('https://parabank.parasoft.com');
```
- Sets base URL for all API calls
- Creates axios instance with default configuration
- Enables request/response logging

#### **HTTP Methods:**
```typescript
// GET request
const response = await apiHelper.get('/parabank/services/bank/customers/12345');

// POST request (query params)
const response = await apiHelper.post('/parabank/services/bank/createAccount?customerId=123&type=1');

// POST request (JSON body)
const response = await apiHelper.postWithBody('/api/endpoint', { name: 'John' });

// PUT request
const response = await apiHelper.put('/api/endpoint', { data });

// DELETE request
const response = await apiHelper.delete('/api/endpoint/123');
```

#### **Response Structure:**
```typescript
{
  status: 200,                    // HTTP status code
  body: { id: 123, name: '...' }, // Parsed response data
  response: AxiosResponse         // Full axios response object
}
```

**⚠️ CRITICAL:** Always access data via `response.body`:
```typescript
const customerId = response.body.id;  // ✅ CORRECT
const customerId = response.id;       // ❌ WRONG
```

#### **Error Handling:**
```typescript
// Automatically logs errors
// Throws exceptions for failed requests
// Provides detailed error messages
```

**Why It's Important:**
- Abstracts away axios complexity
- Consistent error handling
- Built-in logging for debugging
- Simplified response parsing (XML to JSON for SOAP)

---

### **4. UiHelper.ts** (`src/helpers/UiHelper.ts`)

**Purpose:** Wrapper around Playwright's Page API with commonly used UI operations.

**Core Functionality:**

#### **Navigation:**
```typescript
await uiHelper.navigateTo('https://parabank.parasoft.com');
```

#### **Form Interactions:**
```typescript
// Fill input field
await uiHelper.fill('input[name="username"]', 'john_doe');

// Click element
await uiHelper.click('button[type="submit"]');

// Select dropdown option
await uiHelper.selectOption('select#accountType', 'CHECKING');
```

#### **Waits and Visibility:**
```typescript
// Wait for element to be visible
await uiHelper.waitForElement('div.welcome-message', 10000);

// Check if element is visible
const isVisible = await uiHelper.isVisible('a.logout-link');
```

#### **Element Property Extraction:**
```typescript
// Get element text
const text = await uiHelper.getText('h1.page-title');

// Get attribute value
const href = await uiHelper.getAttribute('a.link', 'href');

// Get CSS property
const color = await uiHelper.getCssProperty('button', 'background-color');

// Get input value
const value = await uiHelper.getInputValue('input#username');

// Check if element is enabled
const enabled = await uiHelper.isEnabled('button.submit');

// Check if checkbox is checked
const checked = await uiHelper.isChecked('input[type="checkbox"]');

// Get element bounding box
const box = await uiHelper.getElementBoundingBox('div.container');

// Get all properties of element
const props = await uiHelper.getAllProperties('input#email');
```

#### **Advanced Features:**
```typescript
// Get underlying Playwright page for advanced operations
const page = uiHelper.getPage();
await page.waitForLoadState('networkidle');
```

#### **Screenshot:**
```typescript
await uiHelper.screenshot('test-results/verification.png');
```

**Why It's Important:**
- Simplifies common UI operations
- Consistent API across all tests
- Built-in waits and error handling
- Easy to extend with new methods
- Provides both simple methods and access to full Playwright API

---

## 📝 Test Organization

### **Test Structure:**

Every test follows this pattern:
```typescript
import { test, expect } from '../../src/fixtures/test-fixtures';

test.describe('Test Suite Name', () => {
  test('Test case description', async ({ apiHelper, uiHelper, testContext }) => {
    // Test implementation
  });
});
```

### **Module-Based Organization:**

Tests are organized by banking modules:

1. **Account Management** (`tests/account-management/`)
   - Account creation
   - Account listing
   - Account verification

2. **Customer Management** (`tests/customer-management/`)
   - Customer registration
   - Customer profile updates
   - Customer search

3. **Transaction Management** (`tests/transaction-management/`)
   - Funds transfer
   - Bill payments
   - Transaction history

4. **Loan Management** (`tests/loan-management/`)
   - Loan application
   - Loan approval
   - Loan payments

5. **Payment Management** (`tests/payment-management/`)
   - Payment processing
   - Payment scheduling
   - Payment history

6. **Security & Auth** (`tests/security-and-auth/`)
   - Login/logout
   - Password reset
   - Session management

### **Naming Convention:**
- Test files: `feature-description.spec.ts`
- Test suites: Descriptive business functionality
- Test cases: Action-oriented descriptions

---

## 📜 Prompt System

### **Purpose of Prompts:**

Prompts are natural language descriptions of test scenarios that GitHub Copilot converts into executable Playwright code.

### **Prompt Structure:**

**Location:** `prompts/[Module]/feature-name.prompt`

**Template:**
```plaintext
# Title: Test Scenario Name
# Framework: Playwright MCP + GitHub Copilot
# Description: Brief description
# Framework Guidelines: See prompts/FRAMEWORK-GUIDELINES.md

## GOAL
High-level objective of the test

## TEST STEPS

### Step 1: Action Description
- HTTP Method: GET/POST
- Endpoint: /path/to/endpoint
- Store response value into variable → **variableName**

### Step 2: Another Action
- Username: value
- Password: value

## VALIDATION RULES
- PASS: Condition for success
- FAIL: Condition for failure
```

### **Key Files:**

#### **FRAMEWORK-GUIDELINES.md** (`prompts/FRAMEWORK-GUIDELINES.md`)

**Purpose:** Single source of truth for code generation patterns.

**Contents:**
- Test structure templates
- API Helper usage patterns
- UI Helper usage patterns
- Test Context usage
- Parabank API endpoint reference
- Best practices checklist
- Common pitfalls to avoid

**Why It's Important:**
- Ensures consistency across all generated tests
- Eliminates duplication (no need to repeat patterns in each prompt)
- Easy to update framework patterns in one place
- Helps Copilot generate correct code

#### **_FRAMEWORK_TEMPLATE.txt** (`prompts/_FRAMEWORK_TEMPLATE.txt`)

**Purpose:** Starting point for creating new prompt files.

**Contents:**
- Header template
- Test steps structure
- Validation rules template
- Reference to FRAMEWORK-GUIDELINES.md

### **How to Create Tests from Prompts:**

1. **Write Prompt File** (or copy template)
2. **Ask GitHub Copilot:**
   ```
   Execute this prompt file using Playwright MCP and generate the test script:
   prompts/AccountManagement/create-account-api-to-ui-e2e.prompt
   ```
3. **Copilot Generates TypeScript Test** automatically
4. **Run Test** to validate

---

## ⚙️ Configuration Files

### **playwright.config.ts**

**Purpose:** Playwright test runner configuration.

**Key Settings:**
```typescript
{
  testDir: './tests',                    // Where tests are located
  timeout: 60000,                        // Max test duration
  retries: 1,                            // Retry failed tests once
  use: {
    headless: false,                     // Show browser (for demos)
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',       // Capture failures
    video: 'retain-on-failure',          // Record failures
  },
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],  // HTML reports
    ['list']                             // Console output
  ]
}
```

### **tsconfig.json**

**Purpose:** TypeScript compiler configuration.

**Key Settings:**
```json
{
  "compilerOptions": {
    "target": "ES2020",                  // Modern JavaScript
    "module": "commonjs",                // Node.js module system
    "strict": true,                      // Type safety
    "esModuleInterop": true,             // Module compatibility
    "skipLibCheck": true,                // Faster compilation
    "resolveJsonModule": true            // Import JSON files
  }
}
```

### **package.json**

**Purpose:** Project dependencies and scripts.

**Key Dependencies:**
```json
{
  "@playwright/test": "^1.40.0",        // Playwright framework
  "axios": "^1.6.0",                    // HTTP client
  "xml2js": "^0.6.2"                    // XML parsing for SOAP
}
```

**Key Scripts:**
```json
{
  "test:account-management": "playwright test tests/account-management --headed",
  "test:account-management:ci": "playwright test tests/account-management",
  "test:all-modules": "playwright test",
  "report": "playwright show-report"
}
```

**Dynamic Script System:**
- Scripts automatically find ALL `.spec.ts` files in target folder
- No need to update package.json when adding new tests
- Same command works for any number of tests

---

## 🔄 How It All Works Together

### **End-to-End Flow:**

```
1. WRITE PROMPT
   └─> Natural language test scenario
       └─> prompts/[Module]/test-name.prompt

2. GENERATE CODE (GitHub Copilot)
   └─> Copilot reads prompt + FRAMEWORK-GUIDELINES.md
       └─> Generates TypeScript test code
           └─> tests/[module]/test-name.spec.ts

3. EXECUTE TEST
   └─> Playwright Test Runner starts
       └─> test-fixtures.ts initializes helpers
           ├─> ApiHelper (for API calls)
           ├─> UiHelper (for UI automation)
           └─> TestContext (for shared state)

4. TEST RUNS
   API Steps:
   └─> apiHelper.get() → Calls REST endpoint
       └─> Store response in testContext
           └─> testContext.set('customerId', response.body.id)

   UI Steps:
   └─> uiHelper.navigateTo() → Opens browser
       └─> uiHelper.fill() → Enters form data
           └─> uiHelper.click() → Submits form
               └─> Verify results using testContext.get()

5. REPORTING
   └─> Playwright generates HTML report
       └─> playwright-report/index.html
           ├─> Screenshots
           ├─> Videos
           ├─> Logs
           └─> Timings
```

---

## 🧪 Testing Workflow

### **Typical Test Pattern:**

```typescript
import { test, expect } from '../../src/fixtures/test-fixtures';

test.describe('Account Creation E2E', () => {
  test('Create account via API and verify in UI', async ({ 
    apiHelper,     // Injected by fixtures
    uiHelper,      // Injected by fixtures
    testContext    // Injected by fixtures
  }) => {
    
    // STEP 1: API Setup - Initialize base URL
    await apiHelper.init('https://parabank.parasoft.com');
    
    // STEP 2: API Call - Login
    const loginResponse = await apiHelper.get(
      '/parabank/services/bank/login/ficusroot/katalon'
    );
    const customerId = loginResponse.body.id;
    testContext.set('customerId', customerId);
    console.log(`Customer ID: ${customerId}`);
    
    // STEP 3: API Call - Get Accounts
    const accountsResponse = await apiHelper.get(
      `/parabank/services/bank/customers/${customerId}/accounts`
    );
    const accounts = Array.isArray(accountsResponse.body) 
      ? accountsResponse.body 
      : [accountsResponse.body];
    const firstAccountId = accounts[0].id;
    testContext.set('firstAccountId', firstAccountId);
    
    // STEP 4: API Call - Create New Account
    const newAccountResponse = await apiHelper.post(
      `/parabank/services/bank/createAccount?customerId=${customerId}&newAccountType=1&fromAccountId=${firstAccountId}`
    );
    const newAccountId = newAccountResponse.body.id;
    testContext.set('newAccountId', newAccountId);
    console.log(`New Account ID: ${newAccountId}`);
    
    // STEP 5: UI Automation - Navigate to application
    await uiHelper.navigateTo('https://parabank.parasoft.com/parabank/index.htm');
    
    // STEP 6: UI Automation - Login
    await uiHelper.fill('input[name="username"]', 'ficusroot');
    await uiHelper.fill('input[name="password"]', 'katalon');
    await uiHelper.click('input[type="submit"]');
    
    // STEP 7: UI Verification - Check account appears
    const page = uiHelper.getPage();
    await page.waitForLoadState('networkidle');
    
    const accountOverviewLink = page.locator('a:has-text("Accounts Overview")');
    await expect(accountOverviewLink).toBeVisible({ timeout: 15000 });
    
    await accountOverviewLink.click();
    await page.waitForLoadState('networkidle');
    
    const accountLink = page.locator(`a:has-text("${newAccountId}")`);
    await expect(accountLink).toBeVisible({ timeout: 15000 });
    
    // STEP 8: Capture evidence
    await page.screenshot({ 
      path: `test-results/account-verification-${newAccountId}.png` 
    });
    
    console.log('✓ Test completed successfully');
  });
});
```

---

## 💡 Key Concepts

### **1. Separation of Concerns**

- **Helpers** = Reusable operations (API calls, UI actions)
- **Fixtures** = Dependency injection (provide helpers to tests)
- **TestContext** = State management (share data between steps)
- **Tests** = Business logic (what to test)
- **Prompts** = Test requirements (natural language)

### **2. Test Independence**

- Each test gets fresh instances of helpers
- TestContext clears before each test
- No shared state between tests
- Tests can run in parallel safely

### **3. Maintainability**

- Change helper implementation → All tests benefit
- Update FRAMEWORK-GUIDELINES.md → All new generated tests benefit
- Centralized configuration → Easy to modify
- Module-based organization → Easy to find tests

### **4. Scalability**

- Add new modules by creating folder in `tests/`
- Add new helper methods without touching existing code
- Package.json scripts automatically include new tests
- No code changes needed for new test files

### **5. AI-Powered Code Generation**

- Write tests in natural language (prompts)
- GitHub Copilot generates executable code
- Framework guidelines ensure consistency
- Reduces test creation time by 75%
- Enables non-developers to write tests

---

## 🎯 Benefits of This Architecture

### **For Developers:**
✅ Consistent helper APIs across all tests  
✅ Easy to add new functionality  
✅ Type safety with TypeScript  
✅ Reduced boilerplate code  

### **For QA Engineers:**
✅ Simple test creation process  
✅ Clear separation of concerns  
✅ Built-in debugging (TestContext prints)  
✅ Comprehensive test reports  

### **For Business Analysts:**
✅ Can write test scenarios in natural language  
✅ No coding required (prompts → generated code)  
✅ Clear test structure (prompts are readable)  
✅ Direct involvement in test creation  

### **For Leadership:**
✅ Faster test creation (75% time savings)  
✅ Lower costs (less developer time)  
✅ Better quality (more test coverage)  
✅ Team collaboration (BA + QA + Dev)  
✅ Enterprise-ready (TypeScript + Playwright)  

---

## 🚀 Quick Reference

### **Creating a New Test:**

1. Copy prompt template: `prompts/_FRAMEWORK_TEMPLATE.txt`
2. Write test steps in natural language
3. Ask Copilot to generate code from prompt
4. Run test: `npm run test:account-management`
5. View report: `npm run report`

### **Adding New Helper Method:**

1. Add method to `ApiHelper.ts` or `UiHelper.ts`
2. All tests automatically have access to it
3. Update FRAMEWORK-GUIDELINES.md with usage example
4. Future generated tests will use the new method

### **Debugging Tests:**

1. Check console output (step-by-step logs)
2. Review TestContext printout (shared state)
3. Check screenshots in `test-results/`
4. View HTML report: `playwright-report/index.html`
5. Enable video recording in `playwright.config.ts`

---

## 📚 Related Documentation

- **README.md** - Project overview and setup
- **QUICK-START.md** - 5-minute getting started guide
- **ARCHITECTURE.md** - Deep dive into framework design
- **LEADERSHIP-DEMO.md** - Complete demo presentation guide
- **CI-CD-GUIDE.md** - Continuous integration setup
- **prompts/FRAMEWORK-GUIDELINES.md** - Code generation patterns

---

**Last Updated:** November 19, 2025

**Framework Version:** 1.0.0

**Maintained By:** Automation Team
