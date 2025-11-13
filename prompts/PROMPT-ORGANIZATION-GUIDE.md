# Prompt File Organization Guide
## Natural Language Test Prompts for Banking Modules

---

## 📁 Folder Structure

```
prompts/
├── AccountManagement/
│   ├── create-account-e2e.prompt
│   ├── close-account-e2e.prompt
│   ├── update-account-details-e2e.prompt
│   └── account-balance-verification-e2e.prompt
│
├── TransactionManagement/
│   ├── fund-transfer-e2e.prompt
│   ├── deposit-e2e.prompt
│   ├── withdrawal-e2e.prompt
│   └── transaction-history-e2e.prompt
│
├── CustomerManagement/
│   ├── customer-registration-e2e.prompt
│   ├── customer-kyc-e2e.prompt
│   ├── customer-profile-update-e2e.prompt
│   └── customer-deactivation-e2e.prompt
│
├── LoanManagement/
│   ├── loan-application-e2e.prompt
│   ├── loan-approval-e2e.prompt
│   ├── loan-payment-e2e.prompt
│   └── loan-closure-e2e.prompt
│
├── PaymentManagement/
│   ├── bill-payment-e2e.prompt
│   ├── recurring-payment-e2e.prompt
│   ├── payment-cancellation-e2e.prompt
│   └── payment-verification-e2e.prompt
│
├── SecurityAndAuth/
│   ├── login-authentication-e2e.prompt
│   ├── session-management-e2e.prompt
│   ├── password-reset-e2e.prompt
│   └── multi-factor-auth-e2e.prompt
│
└── UItoAPItoEndtoEnd/
    ├── ParasoftEndtoEnd
    └── create-contact.prompt
```

---

## 📝 Naming Convention

### Prompt File Naming
```
<action>-<entity>-e2e.prompt

Examples:
- create-account-e2e.prompt
- fund-transfer-e2e.prompt
- customer-registration-e2e.prompt
```

### Test File Naming
```
tests/<module>/<action>-<entity>-e2e.spec.ts

Examples:
- tests/account-management/create-account-e2e.spec.ts
- tests/transaction-management/fund-transfer-e2e.spec.ts
- tests/customer-management/customer-registration-e2e.spec.ts
```

---

## 🎯 Module Descriptions

### 1. **AccountManagement**
**Purpose**: Account lifecycle operations
- Account creation (API + UI verification)
- Account closure
- Account details update
- Balance inquiries
- Account status changes

**Example Scenarios**:
- Create savings account via API, verify in UI
- Close account via API, verify it's not visible in UI
- Update account details in UI, verify via API

---

### 2. **TransactionManagement**
**Purpose**: Transaction processing and validation
- Fund transfers (internal/external)
- Deposits
- Withdrawals
- Transaction history validation

**Example Scenarios**:
- Transfer funds via API, verify transaction in UI
- Deposit money via UI, verify balance via API
- Withdrawal via API, check transaction history in UI

---

### 3. **CustomerManagement**
**Purpose**: Customer lifecycle and profile management
- Customer registration
- KYC verification
- Profile updates
- Customer deactivation

**Example Scenarios**:
- Register customer via API, complete KYC in UI
- Update customer profile in UI, verify via API
- Deactivate customer via API, verify login fails in UI

---

### 4. **LoanManagement**
**Purpose**: Loan application and servicing
- Loan applications
- Loan approval workflow
- Loan payments
- Loan closure

**Example Scenarios**:
- Apply for loan in UI, approve via API, verify in UI
- Make loan payment via API, verify balance in UI
- Close loan via API, verify status in UI

---

### 5. **PaymentManagement**
**Purpose**: Bill payments and recurring payments
- Bill payments
- Recurring payment setup
- Payment cancellation
- Payment verification

**Example Scenarios**:
- Set up bill payment in UI, verify via API
- Cancel payment via API, verify in UI
- Process recurring payment via API, verify in UI

---

### 6. **SecurityAndAuth**
**Purpose**: Authentication and security flows
- Login/logout
- Session management
- Password reset
- Multi-factor authentication

**Example Scenarios**:
- Login via API, verify session in UI
- Reset password via UI, verify via API login
- Enable MFA in UI, verify login requires MFA

---

## 🔧 How to Use

### Step 1: Create Prompt File
Choose the appropriate module folder and create your prompt file:

```
prompts/AccountManagement/create-savings-account-e2e.prompt
```

### Step 2: Write Natural Language Steps
```markdown
# Title: Create Savings Account E2E
# Description: Create savings account via API and verify in UI

### Step 1: Login via API
- HTTP Method: GET
- Endpoint: https://api.bank.com/login/user/pass
- Store `customerId` → **customerId**

### Step 2: Create Savings Account
- HTTP Method: POST
- Endpoint: https://api.bank.com/accounts/create?customerId={{customerId}}&type=SAVINGS
- Store `accountId` → **newAccountId**

### Step 3: Verify in UI
- Open URL: https://bank.com
- Login with username/password
- Click "My Accounts"
- Check if **newAccountId** is displayed
```

### Step 3: Create Test File
Create corresponding test file in `tests/` folder:

```typescript
// tests/account-management/create-savings-account-e2e.spec.ts
import { test } from '../../src/fixtures/test-fixtures';
import { PromptExecutor } from '../../src/core/PromptExecutor';

test('Create savings account E2E', async ({ page, apiHelper }) => {
  const executor = new PromptExecutor(apiHelper, page);
  await executor.loadPrompt('prompts/AccountManagement/create-savings-account-e2e.prompt');
  await executor.execute();
});
```

### Step 4: Run Test
```bash
npx playwright test tests/account-management/create-savings-account-e2e.spec.ts --headed
```

---

## 📋 Prompt Template

Use this template for all new prompts:

```markdown
# Title: [Test Name]
# Module: [Module Name]
# Description: [What this test validates]
# Priority: [High/Medium/Low]
# Test ID: [TC-XXX]

---

## GOAL
[Describe the end-to-end goal]

---

## PRE-REQUISITES
- [Any setup required]
- [Test data needed]

---

## TEST STEPS

### Step 1: [Action Description]
- HTTP Method: [GET/POST/PUT/DELETE]
- Endpoint: [API endpoint]
- Request Body (if POST/PUT):
  ```json
  {
    "field": "value"
  }
  ```
- Store `fieldName` from response → **variableName**

### Step 2: [Next Action]
- [Details...]

[Continue for all steps...]

---

## VALIDATION RULES
- **PASS**: [Success criteria]
- **FAIL**: [Failure criteria]

---

## CLEANUP (Optional)
### Cleanup Step: Delete Test Data
- HTTP Method: DELETE
- Endpoint: https://api.bank.com/cleanup/{{resourceId}}
```

---

## 🎯 Best Practices

### 1. **One Prompt = One User Journey**
Each prompt should represent a complete end-to-end user journey.

✅ Good: `create-account-and-verify-e2e.prompt`
❌ Bad: `all-account-operations.prompt`

### 2. **Use Descriptive Variable Names**
```
✅ Good: **customerId**, **newAccountId**, **transactionId**
❌ Bad: **id1**, **x**, **temp**
```

### 3. **Include Cleanup Steps**
Always include cleanup steps to delete test data:
```markdown
### Cleanup: Delete Account
- HTTP Method: DELETE
- Endpoint: https://api.bank.com/accounts/{{newAccountId}}
```

### 4. **Add Verification After Each Critical Step**
```markdown
### Step 2: Create Account
- [Create via API]
- Store **accountId**

### Step 3: Verify Account Created
- HTTP Method: GET
- Endpoint: /accounts/{{accountId}}
- Verify status code 200
```

### 5. **Use Module-Specific Folders**
Keep prompts organized by banking module for easy maintenance.

---

## 📊 Example: Complete Prompt File

**File**: `prompts/TransactionManagement/fund-transfer-e2e.prompt`

```markdown
# Title: Fund Transfer E2E Validation
# Module: TransactionManagement
# Description: Transfer funds between accounts and verify in UI
# Priority: High
# Test ID: TC-TXN-001

---

## GOAL
Validate that funds transferred via API are reflected in:
1. Source account balance (reduced)
2. Target account balance (increased)
3. Transaction history in UI

---

## PRE-REQUISITES
- Active bank accounts with sufficient balance
- Valid customer credentials

---

## TEST STEPS

### Step 1: Login via API
- HTTP Method: GET
- Endpoint: https://parabank.parasoft.com/parabank/services/bank/login/FicusRoot/katalon
- Store `customerId` → **customerId**

### Step 2: Get Source Account Balance
- HTTP Method: GET
- Endpoint: https://parabank.parasoft.com/parabank/services/bank/accounts/{{sourceAccountId}}
- Store `balance` → **initialBalance**

### Step 3: Transfer Funds
- HTTP Method: POST
- Endpoint: https://parabank.parasoft.com/parabank/services/bank/transfer?fromAccountId={{sourceAccountId}}&toAccountId={{targetAccountId}}&amount=100
- Store `transactionId` → **transactionId**

### Step 4: Verify Transaction via API
- HTTP Method: GET
- Endpoint: https://parabank.parasoft.com/parabank/services/bank/transactions/{{transactionId}}
- Verify status = "COMPLETED"

### Step 5: Launch Web Application
- Open URL: https://parabank.parasoft.com/parabank/index.htm

### Step 6: Login to UI
- Username: FicusRoot
- Password: katalon

### Step 7: Verify Transaction in UI
- Click "Accounts Overview"
- Click on source account
- Check if **transactionId** is displayed in transaction history

---

## VALIDATION RULES
- **PASS**: Transaction ID found in UI, balance updated correctly
- **FAIL**: Transaction ID missing or balance incorrect

---

## CLEANUP
### Cleanup Step: Reverse Transaction (Optional)
- HTTP Method: POST
- Endpoint: /bank/transfer?fromAccountId={{targetAccountId}}&toAccountId={{sourceAccountId}}&amount=100
```

---

## 🚀 Quick Commands

### Create New Module Folder
```bash
mkdir prompts/YourModuleName
```

### List All Prompts
```bash
dir prompts\* /s /b | findstr .prompt
```

### Run All Tests in a Module
```bash
npm test -- tests/account-management --headed
```

---

## 📞 Support

For questions about prompt organization:
1. Check this guide
2. Review example prompts
3. Contact QA lead

**Last Updated**: November 2025
