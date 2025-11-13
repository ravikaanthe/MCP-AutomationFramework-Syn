# 🚀 CI/CD Integration Guide

## Overview

This framework is fully CI/CD ready with support for:
- ✅ **GitHub Actions**
- ✅ **Azure Pipelines**
- ✅ **Jenkins**
- ✅ **GitLab CI**
- ✅ **Any CI/CD platform**

---

## 📋 Quick Start

### **Key Difference: Headed vs Headless**

```bash
# LOCAL (shows browser) - for demos and development
npm run test:account-management

# CI/CD (headless) - for automated pipelines
npm run test:account-management:ci
```

**Headless mode = no browser window = works in CI/CD environments**

---

## 🔧 Available CI/CD Commands

All tests can run in **headless mode** for CI/CD:

```bash
npm run test:account-management:ci      # Account management tests
npm run test:transaction-management:ci  # Transaction tests
npm run test:customer-management:ci     # Customer management tests
npm run test:loan-management:ci         # Loan tests
npm run test:payment-management:ci      # Payment tests
npm run test:security-and-auth:ci       # Security & authentication tests
npm run test:all-modules:ci             # ALL tests across ALL modules
```

---

## 🐙 GitHub Actions Setup

### **Step 1: Copy the workflow file**

The workflow file is already created at:
```
.github/workflows/playwright-tests.yml
```

### **Step 2: Push to GitHub**

```bash
git add .
git commit -m "Add Playwright CI/CD pipeline"
git push origin main
```

### **Step 3: Watch it run!**

1. Go to your GitHub repository
2. Click **Actions** tab
3. See tests running automatically on every push/PR

### **What It Does:**

✅ Runs on every push to `main` or `develop`  
✅ Runs on pull requests  
✅ Scheduled daily at 2 AM UTC  
✅ Installs dependencies automatically  
✅ Installs Chromium browser  
✅ Runs all test suites  
✅ Uploads test reports as artifacts  
✅ Reports available for 30 days  

### **Viewing Reports:**

1. Go to **Actions** → Select your workflow run
2. Scroll to **Artifacts**
3. Download `playwright-report`
4. Open `index.html` in your browser

---

## ☁️ Azure Pipelines Setup

### **Step 1: The pipeline file is ready**

Located at:
```
azure-pipelines.yml
```

### **Step 2: Connect to Azure DevOps**

1. Go to **Azure DevOps** → Your project
2. Click **Pipelines** → **New Pipeline**
3. Select **Azure Repos Git** (or your source)
4. Select your repository
5. Choose **Existing Azure Pipelines YAML file**
6. Select `/azure-pipelines.yml`
7. Click **Run**

### **What It Does:**

✅ Runs on push to `main` or `develop`  
✅ Runs on pull requests  
✅ Scheduled daily at 2 AM UTC  
✅ Parallel execution (Account Management first, then all modules)  
✅ Publishes test results in Azure format  
✅ Uploads HTML reports as pipeline artifacts  
✅ Continues even if some tests fail (configurable)  

### **Viewing Reports:**

1. Go to your pipeline run
2. Click **Published** tab
3. Download `playwright-report-account-management` or `playwright-report-all-modules`
4. Extract and open `index.html`

---

## 🔨 Jenkins Setup

### **Step 1: Create Jenkinsfile**

Create `Jenkinsfile` in your project root:

```groovy
pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS 20'
    }
    
    triggers {
        // Run daily at 2 AM
        cron('0 2 * * *')
    }
    
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install --with-deps chromium'
            }
        }
        
        stage('Account Management Tests') {
            steps {
                sh 'npm run test:account-management:ci'
            }
        }
        
        stage('All Module Tests') {
            steps {
                sh 'npm run test:all-modules:ci'
            }
        }
    }
    
    post {
        always {
            publishHTML([
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Test Report',
                keepAll: true,
                alwaysLinkToLastBuild: true
            ])
            
            archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
            archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
        }
    }
}
```

### **Step 2: Configure Jenkins**

1. Install **HTML Publisher Plugin** in Jenkins
2. Create new Pipeline job
3. Point to your repository
4. Select `Jenkinsfile`
5. Save and run

### **Viewing Reports:**

Reports appear as **Playwright Test Report** link in Jenkins build page.

---

## 🦊 GitLab CI Setup

### **Create `.gitlab-ci.yml`:**

```yaml
image: mcr.microsoft.com/playwright:v1.56.1-noble

stages:
  - test
  - report

variables:
  NODE_VERSION: "20"

before_script:
  - npm ci

test:account-management:
  stage: test
  script:
    - npm run test:account-management:ci
  artifacts:
    when: always
    paths:
      - playwright-report/
      - test-results/
    expire_in: 30 days
  only:
    - main
    - develop
    - merge_requests

test:all-modules:
  stage: test
  script:
    - npm run test:all-modules:ci
  allow_failure: true
  artifacts:
    when: always
    paths:
      - playwright-report/
      - test-results/
    expire_in: 30 days
  only:
    - main
    - develop
    - merge_requests

pages:
  stage: report
  dependencies:
    - test:all-modules
  script:
    - mkdir -p public
    - cp -r playwright-report/* public/
  artifacts:
    paths:
      - public
  only:
    - main
```

### **Viewing Reports:**

1. Go to **CI/CD** → **Jobs**
2. Click on job → **Browse** button
3. Download `playwright-report`
4. Or view in GitLab Pages (if enabled)

---

## 📊 Test Results & Reports

### **What Gets Generated:**

1. **HTML Report** (`playwright-report/index.html`)
   - Visual dashboard
   - Step-by-step execution
   - Screenshots
   - Timing data

2. **JUnit XML** (for CI integration)
   - `test-results/*.xml`
   - Integrates with CI test result viewers

3. **Trace Files** (on failure)
   - Full execution replay
   - Network requests
   - Console logs

### **Accessing in CI/CD:**

**GitHub Actions:**
- Actions tab → Workflow run → Artifacts

**Azure Pipelines:**
- Pipeline run → Published artifacts

**Jenkins:**
- Build page → Artifacts / HTML Report

**GitLab CI:**
- Jobs → Browse artifacts

---

## ⚙️ Configuration Options

### **Playwright Config for CI/CD:**

In `playwright.config.ts`, CI detection is automatic:

```typescript
use: {
  // Automatically uses headless in CI environments
  headless: !!process.env.CI,
  
  // Shorter timeouts for CI
  actionTimeout: process.env.CI ? 10000 : 30000,
  
  // Only 1 retry in local, 2 in CI
  retries: process.env.CI ? 2 : 1,
}
```

### **Parallel Execution:**

```bash
# Run tests in parallel (faster CI builds)
npm run test:all-modules:ci -- --workers=4
```

### **Specific Browser:**

```bash
# Run only on Chromium (default)
npm run test:account-management:ci -- --project=chromium

# Run on multiple browsers (slower)
npm run test:account-management:ci -- --project=chromium --project=firefox
```

---

## 🔍 Debugging CI Failures

### **1. Check the logs:**

All CI platforms show console output. Look for:
- API response errors (404, 500, etc.)
- Timeout errors
- Assertion failures

### **2. Download artifacts:**

Get the `playwright-report` artifact and open `index.html` to see:
- Screenshots at failure point
- Step-by-step execution
- Network requests

### **3. Enable trace on failure:**

In `playwright.config.ts`:

```typescript
use: {
  trace: 'on-first-retry', // Captures full trace on retry
}
```

Download trace files from artifacts and view at: https://trace.playwright.dev/

### **4. Run locally in headless mode:**

```bash
# Reproduce CI environment locally
npm run test:account-management:ci
```

---

## 📈 Best Practices

### **✅ DO:**

- Use `:ci` commands in pipelines (headless)
- Set up scheduled runs (nightly tests)
- Archive reports as artifacts
- Configure email notifications on failures
- Run critical tests first (fail fast)
- Use parallel execution for speed
- Keep test data independent (no shared state)

### **❌ DON'T:**

- Use `--headed` in CI (will fail)
- Forget to install Playwright browsers (`npx playwright install`)
- Skip `npm ci` (use it instead of `npm install` for reproducibility)
- Ignore flaky tests (fix or disable them)
- Run all tests on every commit (use stages/filters)

---

## 🎯 Example: Daily Regression Suite

### **Strategy:**

```yaml
# Run on every commit (fast)
- Account Management tests only
- ~5 minutes

# Run nightly (comprehensive)
- All module tests
- ~30 minutes
- Email report to QA team
```

### **GitHub Actions Implementation:**

Already configured in `.github/workflows/playwright-tests.yml`:
- Push/PR: Account Management only
- Schedule (2 AM daily): All modules

---

## 📞 Troubleshooting

### **Error: "Browser not found"**

**Solution:**
```bash
npx playwright install --with-deps chromium
```

### **Error: "Tests timing out in CI"**

**Solution:** Increase timeout in `playwright.config.ts`:
```typescript
timeout: 60000, // 60 seconds
```

### **Error: "Cannot connect to test site"**

**Solution:** Check firewall/network policies in CI environment

### **Tests pass locally but fail in CI**

**Solution:**
1. Run locally in headless: `npm run test:account-management:ci`
2. Check if test data is hardcoded (use dynamic data)
3. Verify API endpoints are accessible from CI

---

## 🚀 Next Steps

1. ✅ Push code to GitHub/Azure Repos
2. ✅ Set up pipeline (GitHub Actions or Azure Pipelines file included)
3. ✅ Run first CI build
4. ✅ Configure notifications
5. ✅ Set up scheduled runs
6. ✅ Share report links with team

---

## 📝 Summary

**Commands to remember:**

```bash
# Local development
npm run test:account-management        # Shows browser

# CI/CD pipelines
npm run test:account-management:ci     # Headless mode

# View reports
npm run report
```

**Pipeline files included:**
- `.github/workflows/playwright-tests.yml` (GitHub Actions)
- `azure-pipelines.yml` (Azure Pipelines)

**You're ready for CI/CD! 🎉**
