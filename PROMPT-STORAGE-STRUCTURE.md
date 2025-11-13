# Prompt File Storage Structure
## Complete Organization for Banking E2E Test Cases

---

## 📍 Current Prompt File Storage Location

```
C:\Playwright Automation Projects\Playwright MCP_Script & API\prompts\
```

---

## 📁 Complete Folder Structure

```
prompts/
│
├── PROMPT-ORGANIZATION-GUIDE.md       ← Complete guide for organizing prompts
│
├── AccountManagement/                 ← Account lifecycle tests
│   └── create-checking-account-e2e.prompt
│
├── TransactionManagement/             ← Transaction processing tests
│   └── fund-transfer-e2e.prompt
│
├── CustomerManagement/                ← Customer operations tests
│   └── customer-profile-update-e2e.prompt
│
├── LoanManagement/                    ← Loan operations tests
│   └── loan-application-e2e.prompt
│
├── PaymentManagement/                 ← Payment processing tests
│   └── bill-payment-e2e.prompt
│
├── SecurityAndAuth/                   ← Authentication & security tests
│   └── login-authentication-e2e.prompt
│
└── UItoAPItoEndtoEnd/                 ← Your existing prompts
    ├── ParasoftEndtoEnd
    └── create-contact.prompt
```

---

## 🎯 Module Breakdown

### 1. **AccountManagement** 
**Path**: `prompts/AccountManagement/`
**Purpose**: Account creation, closure, updates, balance inquiries

**Sample Prompt Files**:
- `create-checking-account-e2e.prompt` ✅ Created
- `create-savings-account-e2e.prompt`
- `close-account-e2e.prompt`
- `update-account-details-e2e.prompt`
- `account-balance-verification-e2e.prompt`
- `account-type-conversion-e2e.prompt`

---

### 2. **TransactionManagement**
**Path**: `prompts/TransactionManagement/`
**Purpose**: Fund transfers, deposits, withdrawals, transaction history

**Sample Prompt Files**:
- `fund-transfer-e2e.prompt` ✅ Created
- `deposit-funds-e2e.prompt`
- `withdrawal-funds-e2e.prompt`
- `transaction-history-verification-e2e.prompt`
- `failed-transaction-handling-e2e.prompt`
- `transaction-reversal-e2e.prompt`

---

### 3. **CustomerManagement**
**Path**: `prompts/CustomerManagement/`
**Purpose**: Customer registration, KYC, profile updates, deactivation

**Sample Prompt Files**:
- `customer-profile-update-e2e.prompt` ✅ Created
- `customer-registration-e2e.prompt`
- `customer-kyc-verification-e2e.prompt`
- `customer-address-update-e2e.prompt`
- `customer-deactivation-e2e.prompt`
- `customer-reactivation-e2e.prompt`

---

### 4. **LoanManagement**
**Path**: `prompts/LoanManagement/`
**Purpose**: Loan applications, approvals, payments, closure

**Sample Prompt Files**:
- `loan-application-e2e.prompt` ✅ Created
- `loan-approval-workflow-e2e.prompt`
- `loan-payment-e2e.prompt`
- `loan-prepayment-e2e.prompt`
- `loan-closure-e2e.prompt`
- `loan-status-check-e2e.prompt`

---

### 5. **PaymentManagement**
**Path**: `prompts/PaymentManagement/`
**Purpose**: Bill payments, recurring payments, payment verification

**Sample Prompt Files**:
- `bill-payment-e2e.prompt` ✅ Created
- `recurring-payment-setup-e2e.prompt`
- `payment-cancellation-e2e.prompt`
- `payment-failure-handling-e2e.prompt`
- `scheduled-payment-e2e.prompt`
- `payment-confirmation-e2e.prompt`

---

### 6. **SecurityAndAuth**
**Path**: `prompts/SecurityAndAuth/`
**Purpose**: Authentication, authorization, session management, security

**Sample Prompt Files**:
- `login-authentication-e2e.prompt` ✅ Created
- `logout-e2e.prompt`
- `session-timeout-e2e.prompt`
- `password-reset-e2e.prompt`
- `multi-factor-authentication-e2e.prompt`
- `invalid-login-attempts-e2e.prompt`

---

## 🗂️ How to Add New Prompt Files

### Step 1: Choose the Right Module
Identify which banking module your test case belongs to:
- Account operations → `AccountManagement/`
- Transactions → `TransactionManagement/`
- Customer operations → `CustomerManagement/`
- Loans → `LoanManagement/`
- Payments → `PaymentManagement/`
- Security → `SecurityAndAuth/`

### Step 2: Create the Prompt File
```
prompts/[ModuleName]/[action]-[entity]-e2e.prompt
```

**Example**:
```
prompts/AccountManagement/transfer-account-ownership-e2e.prompt
```

### Step 3: Follow the Template
Use the template from `PROMPT-ORGANIZATION-GUIDE.md`:

```markdown
# Title: [Test Name]
# Module: [Module Name]
# Description: [What this test validates]
# Priority: [High/Medium/Low]
# Test ID: [TC-XXX]

## TEST STEPS

### Step 1: [Action]
- HTTP Method: GET/POST
- Endpoint: [URL]
- Store `field` → **variableName**

[Continue...]

## VALIDATION RULES
- PASS: [Criteria]
- FAIL: [Criteria]
```

---

## 📊 Corresponding Test Files Structure

For each prompt file, create a corresponding test file:

```
tests/
├── account-management/
│   └── create-checking-account-e2e.spec.ts
│
├── transaction-management/
│   └── fund-transfer-e2e.spec.ts
│
├── customer-management/
│   └── customer-profile-update-e2e.spec.ts
│
├── loan-management/
│   └── loan-application-e2e.spec.ts
│
├── payment-management/
│   └── bill-payment-e2e.spec.ts
│
└── security-and-auth/
    └── login-authentication-e2e.spec.ts
```

---

## 🎯 Naming Conventions

### Prompt Files
```
[action]-[entity]-e2e.prompt

Examples:
✅ create-account-e2e.prompt
✅ fund-transfer-e2e.prompt
✅ customer-registration-e2e.prompt
✅ loan-payment-e2e.prompt
```

### Test Files
```
[action]-[entity]-e2e.spec.ts

Examples:
✅ create-account-e2e.spec.ts
✅ fund-transfer-e2e.spec.ts
✅ customer-registration-e2e.spec.ts
✅ loan-payment-e2e.spec.ts
```

---

## 🚀 Quick Reference Commands

### View All Prompt Files
```powershell
Get-ChildItem -Path "prompts" -Recurse -Filter "*.prompt" | Select-Object FullName
```

### Count Prompt Files by Module
```powershell
Get-ChildItem -Path "prompts" -Directory | ForEach-Object {
    $count = (Get-ChildItem -Path $_.FullName -Filter "*.prompt").Count
    "$($_.Name): $count files"
}
```

### Create New Module Folder
```powershell
New-Item -Path "prompts/NewModule" -ItemType Directory
```

### List All Modules
```powershell
Get-ChildItem -Path "prompts" -Directory | Select-Object Name
```

---

## 📋 Current Status

### ✅ Created Modules (6)
1. AccountManagement
2. TransactionManagement
3. CustomerManagement
4. LoanManagement
5. PaymentManagement
6. SecurityAndAuth

### ✅ Example Prompts Created (6)
1. `AccountManagement/create-checking-account-e2e.prompt`
2. `TransactionManagement/fund-transfer-e2e.prompt`
3. `CustomerManagement/customer-profile-update-e2e.prompt`
4. `LoanManagement/loan-application-e2e.prompt`
5. `PaymentManagement/bill-payment-e2e.prompt`
6. `SecurityAndAuth/login-authentication-e2e.prompt`

### ✅ Documentation Created (1)
1. `prompts/PROMPT-ORGANIZATION-GUIDE.md`

---

## 🎓 Best Practices

### 1. **One Test Case = One Prompt File**
Each prompt file should represent a single, complete end-to-end test scenario.

### 2. **Use Descriptive Names**
File names should clearly indicate what the test does.

### 3. **Keep Modules Organized**
Don't mix different module types in the same folder.

### 4. **Include Test Metadata**
Always include Title, Module, Description, Priority, and Test ID in prompts.

### 5. **Use Variable Substitution**
Store values and reuse them: `Store → **variable**` then use `{{variable}}`

### 6. **Add Validation Steps**
Always include verification steps after critical actions.

---

## 💡 Pro Tips for Your Team

### For Business Analysts
- Write test scenarios in the appropriate module folder
- Use natural language - no coding required
- Follow the template in PROMPT-ORGANIZATION-GUIDE.md
- Review example prompts for reference

### For QA Engineers
- Execute prompts using Playwright MCP
- Convert successful prompts to permanent test scripts
- Maintain the prompt files as requirements change
- Add new modules as needed

### For Developers
- Enhance framework helpers as needed
- Add support for new action types
- Review prompts for technical accuracy
- Help optimize complex scenarios

---

## 📞 Support

**Documentation Location**:
- Organization Guide: `prompts/PROMPT-ORGANIZATION-GUIDE.md`
- Framework README: `FRAMEWORK-README.md`
- Architecture Guide: `ARCHITECTURE.md`
- Quick Start: `QUICK-START.md`

**Example Prompts**: Check each module folder for working examples

**Questions?** Contact your QA automation lead

---

## 🎯 Summary

**Your prompt files are stored in**:
```
C:\Playwright Automation Projects\Playwright MCP_Script & API\prompts\
```

**Organized by banking modules**:
- AccountManagement
- TransactionManagement
- CustomerManagement
- LoanManagement
- PaymentManagement
- SecurityAndAuth
- UItoAPItoEndtoEnd (your existing folder)

**You can now**:
1. ✅ Create new prompt files in the appropriate module folder
2. ✅ Follow the naming convention: `[action]-[entity]-e2e.prompt`
3. ✅ Use the template from PROMPT-ORGANIZATION-GUIDE.md
4. ✅ Execute prompts using Playwright MCP
5. ✅ Generate test scripts automatically

**Ready to create your E2E test cases!** 🚀
