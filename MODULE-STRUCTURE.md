# Project Structure - Module Organization Complete
## Parasoft Banking Framework

**Date**: November 12, 2025  
**Status**: ✅ Organized by Banking Modules

---

## 📁 **New Project Structure**

```
Playwright MCP_Script & API/
│
├── 📂 prompts/                                  ← Natural Language Prompts
│   ├── 📄 PROMPT-ORGANIZATION-GUIDE.md
│   │
│   ├── 📁 AccountManagement/
│   │   ├── create-account-api-to-ui-e2e.prompt ✅ (Moved from UItoAPItoEndtoEnd)
│   │   └── create-checking-account-e2e.prompt
│   │
│   ├── 📁 TransactionManagement/
│   │   └── fund-transfer-e2e.prompt
│   │
│   ├── 📁 CustomerManagement/
│   │   └── customer-profile-update-e2e.prompt
│   │
│   ├── 📁 LoanManagement/
│   │   └── loan-application-e2e.prompt
│   │
│   ├── 📁 PaymentManagement/
│   │   └── bill-payment-e2e.prompt
│   │
│   └── 📁 SecurityAndAuth/
│       └── login-authentication-e2e.prompt
│
├── 📂 tests/                                    ← Test Scripts (Module Aligned)
│   │
│   ├── 📁 account-management/
│   │   ├── create-account-api-to-ui-e2e.spec.ts ✅ (Main test)
│   │   └── create-account-prompt-driven.spec.ts ✅ (Prompt executor)
│   │
│   ├── 📁 transaction-management/              ← Ready for future tests
│   │
│   ├── 📁 customer-management/                 ← Ready for future tests
│   │
│   ├── 📁 loan-management/                     ← Ready for future tests
│   │
│   ├── 📁 payment-management/                  ← Ready for future tests
│   │
│   └── 📁 security-and-auth/                   ← Ready for future tests
│
├── 📂 src/                                      ← Framework Core
│   ├── core/
│   │   ├── TestContext.ts
│   │   └── PromptExecutor.ts
│   ├── helpers/
│   │   ├── ApiHelper.ts
│   │   └── UiHelper.ts
│   └── fixtures/
│       └── test-fixtures.ts
│
├── 📂 config/
│   └── environment.ts
│
└── 📄 Documentation Files
    ├── README.md
    ├── FRAMEWORK-README.md
    ├── ARCHITECTURE.md
    ├── QUICK-START.md
    ├── PROMPT-STORAGE-STRUCTURE.md
    ├── LEADERSHIP-SUMMARY.md
    └── PROJECT-STATUS.md
```

---

## ✅ **Changes Made**

### 1. **Moved Prompt File**
```
FROM: prompts/UItoAPItoEndtoEnd/ParasoftEndtoEnd
TO:   prompts/AccountManagement/create-account-api-to-ui-e2e.prompt
```

### 2. **Removed Empty Folder**
```
REMOVED: prompts/UItoAPItoEndtoEnd/
```

### 3. **Created Test Module Folders (6)**
```
✅ tests/account-management/
✅ tests/transaction-management/
✅ tests/customer-management/
✅ tests/loan-management/
✅ tests/payment-management/
✅ tests/security-and-auth/
```

### 4. **Moved Test Files**
```
FROM: tests/parabank-e2e-generated.spec.ts
TO:   tests/account-management/create-account-api-to-ui-e2e.spec.ts

FROM: tests/parabank-prompt-driven.spec.ts
TO:   tests/account-management/create-account-prompt-driven.spec.ts
```

### 5. **Updated Test File References**
- ✅ Updated import paths (../ to ../../)
- ✅ Updated prompt file path
- ✅ Updated test descriptions
- ✅ Updated module references

### 6. **Updated package.json Scripts**
```json
"test:parabank": "... tests/account-management/create-account-api-to-ui-e2e.spec.ts ..."
"test:parabank-prompt": "... tests/account-management/create-account-prompt-driven.spec.ts ..."
"test:account-mgmt": "... tests/account-management --headed"
```

---

## 🎯 **Module Alignment**

### Prompts ↔ Tests Mapping

| Module | Prompt Folder | Test Folder | Status |
|--------|--------------|-------------|--------|
| **Account Management** | `prompts/AccountManagement/` | `tests/account-management/` | ✅ Active (2 tests) |
| **Transaction Management** | `prompts/TransactionManagement/` | `tests/transaction-management/` | ✅ Ready |
| **Customer Management** | `prompts/CustomerManagement/` | `tests/customer-management/` | ✅ Ready |
| **Loan Management** | `prompts/LoanManagement/` | `tests/loan-management/` | ✅ Ready |
| **Payment Management** | `prompts/PaymentManagement/` | `tests/payment-management/` | ✅ Ready |
| **Security & Auth** | `prompts/SecurityAndAuth/` | `tests/security-and-auth/` | ✅ Ready |

---

## 🚀 **How to Use**

### **Run Account Management Tests**
```bash
# Run all account management tests
npm run test:account-mgmt

# Run specific account creation test
npm run test:parabank

# Run prompt-driven test
npm run test:parabank-prompt
```

### **Run All E2E Tests**
```bash
npm run test:e2e
```

### **View Reports**
```bash
npm run report
```

---

## 📝 **Naming Convention**

### Prompt Files
```
prompts/[Module]/[action]-[entity]-e2e.prompt

Example:
prompts/AccountManagement/create-account-api-to-ui-e2e.prompt
```

### Test Files
```
tests/[module-folder]/[action]-[entity]-e2e.spec.ts

Example:
tests/account-management/create-account-api-to-ui-e2e.spec.ts
```

### Folder Naming
```
Prompts:  PascalCase (AccountManagement)
Tests:    kebab-case (account-management)
```

---

## 🎯 **Benefits of This Structure**

### ✅ **Clarity**
- Easy to find related prompts and tests
- Clear module ownership

### ✅ **Scalability**
- Add new tests to appropriate module folder
- No mixing of different module types

### ✅ **Maintainability**
- Organized by banking domain
- Easy to manage large test suites

### ✅ **Team Collaboration**
- Module-based ownership
- Clear separation of concerns

---

## 📊 **Current File Count**

| Category | Count | Location |
|----------|-------|----------|
| **Prompt Files** | 7 | `prompts/*/` |
| **Test Files** | 2 | `tests/account-management/` |
| **Framework Files** | 5 | `src/` |
| **Module Folders (Prompts)** | 6 | `prompts/` |
| **Module Folders (Tests)** | 6 | `tests/` |
| **Documentation** | 8 | Root |

---

## 🔄 **Adding New Tests**

### Step 1: Create Prompt
```
prompts/[Module]/new-test.prompt
```

### Step 2: Create Test Script
```
tests/[module-folder]/new-test.spec.ts
```

### Step 3: Run Test
```bash
npm test -- tests/[module-folder]/new-test.spec.ts --headed
```

---

## ✨ **Summary**

Your framework now has:
- ✅ **Consistent structure** across prompts and tests
- ✅ **Module-based organization** for banking domains
- ✅ **Clear naming conventions**
- ✅ **Scalable architecture** for growth
- ✅ **Ready for production use**

**All files are now organized by banking modules!** 🎉

---

## 🎓 **Quick Reference**

### Main Test (Account Creation)
```bash
# Prompt file
prompts/AccountManagement/create-account-api-to-ui-e2e.prompt

# Test script
tests/account-management/create-account-api-to-ui-e2e.spec.ts

# Run test
npm run test:parabank
```

### Add New Account Management Test
```bash
# 1. Create prompt
prompts/AccountManagement/new-test.prompt

# 2. Create test
tests/account-management/new-test.spec.ts

# 3. Run test
npm test -- tests/account-management/new-test.spec.ts --headed
```

---

**Framework Status**: ✅ **Fully Organized & Production Ready**  
**Module Structure**: ✅ **Complete**  
**Date**: November 12, 2025
