/**
 * PromptExecutor - Executes natural language test prompts
 * Parses prompt files and executes steps using API and UI helpers
 */

import { Page } from '@playwright/test';
import { ApiHelper } from '../helpers/ApiHelper';
import { UiHelper } from '../helpers/UiHelper';
import { SelfHealingHelper } from '../helpers/SelfHealingHelper';
import { testContext } from '../core/TestContext';
import * as fs from 'fs';
import * as path from 'path';

export interface PromptStep {
  stepNumber: number;
  description: string;
  action: string;
  details: any;
}

export class PromptExecutor {
  private apiHelper: ApiHelper;
  private uiHelper: UiHelper | null = null;
  private steps: PromptStep[] = [];
  private selfHealingEnabled: boolean = false;

  constructor(apiHelper: ApiHelper, page?: Page, enableSelfHealing: boolean = false) {
    this.apiHelper = apiHelper;
    this.selfHealingEnabled = enableSelfHealing;
    if (page) {
      if (enableSelfHealing) {
        const selfHealingHelper = new SelfHealingHelper(page);
        this.uiHelper = new UiHelper(page, selfHealingHelper);
        console.log('[PromptExecutor] Self-healing ENABLED');
      } else {
        this.uiHelper = new UiHelper(page);
        console.log('[PromptExecutor] Self-healing DISABLED');
      }
    }
  }

  /**
   * Load and parse prompt file
   * @param promptFilePath - Path to prompt file
   */
  async loadPrompt(promptFilePath: string): Promise<void> {
    console.log(`[PromptExecutor] Loading prompt: ${promptFilePath}`);
    
    const content = fs.readFileSync(promptFilePath, 'utf-8');
    
    // Check if self-healing is enabled in prompt
    const selfHealingMatch = content.match(/^#?\s*Self-Healing:\s*(YES|NO)/im);
    if (selfHealingMatch && selfHealingMatch[1].toUpperCase() === 'YES') {
      this.selfHealingEnabled = true;
      console.log('[PromptExecutor] Self-Healing detected in prompt: ENABLED');
    }
    
    this.steps = this.parsePrompt(content);
    
    console.log(`[PromptExecutor] Parsed ${this.steps.length} steps`);
  }

  /**
   * Parse prompt content into structured steps
   * @param content - Prompt file content
   */
  private parsePrompt(content: string): PromptStep[] {
    const steps: PromptStep[] = [];
    const lines = content.split('\n');
    
    let currentStep: PromptStep | null = null;
    let stepDetails: string[] = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Match step headers like "### Step 1:" or "1."
      const stepMatch = trimmedLine.match(/^#{1,3}\s*Step\s*(\d+)[:.]?\s*(.*)/i) || 
                       trimmedLine.match(/^(\d+)\.\s*(.*)/);
      
      if (stepMatch) {
        // Save previous step if exists
        if (currentStep) {
          currentStep.details = this.parseStepDetails(stepDetails.join('\n'));
          steps.push(currentStep);
        }
        
        // Start new step
        currentStep = {
          stepNumber: parseInt(stepMatch[1]),
          description: stepMatch[2] || '',
          action: this.determineAction(stepMatch[2] || ''),
          details: {}
        };
        stepDetails = [];
      } else if (currentStep && trimmedLine && !trimmedLine.startsWith('#') && !trimmedLine.startsWith('---')) {
        stepDetails.push(trimmedLine);
      }
    }
    
    // Add last step
    if (currentStep) {
      currentStep.details = this.parseStepDetails(stepDetails.join('\n'));
      steps.push(currentStep);
    }
    
    return steps;
  }

  /**
   * Determine action type from step description
   */
  private determineAction(description: string): string {
    const lowerDesc = description.toLowerCase();
    
    if (lowerDesc.includes('login') && lowerDesc.includes('api')) return 'API_LOGIN';
    if (lowerDesc.includes('create') && lowerDesc.includes('api')) return 'API_CREATE';
    if (lowerDesc.includes('retrieve') && lowerDesc.includes('api')) return 'API_GET';
    if (lowerDesc.includes('delete') && lowerDesc.includes('api')) return 'API_DELETE';
    if (lowerDesc.includes('launch') || lowerDesc.includes('open') || lowerDesc.includes('navigate')) return 'UI_NAVIGATE';
    if (lowerDesc.includes('login') && lowerDesc.includes('ui')) return 'UI_LOGIN';
    if (lowerDesc.includes('click')) return 'UI_CLICK';
    if (lowerDesc.includes('verify') || lowerDesc.includes('validate') || lowerDesc.includes('check')) return 'UI_VERIFY';
    
    return 'UNKNOWN';
  }

  /**
   * Parse step details into structured data
   */
  private parseStepDetails(detailsText: string): any {
    const details: any = {};
    
    // Extract HTTP method
    const methodMatch = detailsText.match(/HTTP\s+Method:\s*(\w+)/i);
    if (methodMatch) details.method = methodMatch[1].toUpperCase();
    
    // Extract endpoint/URL
    const endpointMatch = detailsText.match(/(?:Endpoint|URL):\s*([^\s]+)/i);
    if (endpointMatch) details.endpoint = endpointMatch[1].trim();
    
    // Extract username
    const usernameMatch = detailsText.match(/Username:\s*([^\s]+)/i);
    if (usernameMatch) details.username = usernameMatch[1].trim();
    
    // Extract password
    const passwordMatch = detailsText.match(/Password:\s*([^\s]+)/i);
    if (passwordMatch) details.password = passwordMatch[1].trim();
    
    // Extract variable storage instructions
    const storeMatch = detailsText.match(/Store.*?(?:into\s+variable|in\s+a?\s+(?:global\s+)?variable\s+called?)\s*[→\-]*\s*[`"]?(\w+)[`"]?/i);
    if (storeMatch) details.storeAs = storeMatch[1];
    
    // Extract validation text
    const validateMatch = detailsText.match(/(?:Check|Verify|Validate|Ensure).*?["`']([^"`']+)["`']/i);
    if (validateMatch) details.validateText = validateMatch[1];
    
    details.rawText = detailsText;
    
    return details;
  }

  /**
   * Execute all steps in the prompt
   */
  async execute(): Promise<void> {
    console.log(`\n=== Starting Prompt Execution ===\n`);
    
    for (const step of this.steps) {
      await this.executeStep(step);
    }
    
    console.log(`\n=== Prompt Execution Complete ===\n`);
    testContext.printContext();
  }

  /**
   * Execute a single step
   */
  async executeStep(step: PromptStep): Promise<void> {
    console.log(`\n[Step ${step.stepNumber}] ${step.description}`);
    console.log(`[Action] ${step.action}`);
    
    try {
      switch (step.action) {
        case 'API_LOGIN':
        case 'API_GET':
          await this.executeApiGet(step);
          break;
          
        case 'API_CREATE':
        case 'API_POST':
          await this.executeApiPost(step);
          break;
          
        case 'API_DELETE':
          await this.executeApiDelete(step);
          break;
          
        case 'UI_NAVIGATE':
          await this.executeUiNavigate(step);
          break;
          
        case 'UI_LOGIN':
          await this.executeUiLogin(step);
          break;
          
        case 'UI_CLICK':
          await this.executeUiClick(step);
          break;
          
        case 'UI_VERIFY':
          await this.executeUiVerify(step);
          break;
          
        default:
          console.log(`[Warning] Unknown action type: ${step.action}`);
      }
      
      console.log(`[Step ${step.stepNumber}] ✓ Completed`);
    } catch (error) {
      console.error(`[Step ${step.stepNumber}] ✗ Failed:`, error);
      throw error;
    }
  }

  /**
   * Execute API GET request
   */
  private async executeApiGet(step: PromptStep): Promise<void> {
    const { endpoint, storeAs } = step.details;
    
    if (!endpoint) {
      throw new Error('No endpoint specified for API GET');
    }
    
    // Replace placeholders with context variables
    const resolvedEndpoint = this.apiHelper.replacePlaceholders(endpoint);
    
    // Extract base URL and path
    const url = new URL(resolvedEndpoint);
    await this.apiHelper.init(url.origin);
    
    const result = await this.apiHelper.get(url.pathname);
    
    // Store response data
    if (storeAs) {
      // Check if it's XML response
      if (typeof result.body === 'string' && result.body.includes('<')) {
        // Extract from XML
        const value = this.apiHelper.extractFromXML(result.body, storeAs);
        if (value) {
          testContext.set(storeAs, value);
        } else {
          // Try to extract id
          const id = this.apiHelper.extractFromXML(result.body, 'id');
          if (id) testContext.set(storeAs, id);
        }
      } else if (typeof result.body === 'object') {
        // JSON response
        if (result.body[storeAs]) {
          testContext.set(storeAs, result.body[storeAs]);
        } else if (result.body.id) {
          testContext.set(storeAs, result.body.id);
        }
      }
    }
  }

  /**
   * Execute API POST request
   */
  private async executeApiPost(step: PromptStep): Promise<void> {
    const { endpoint, storeAs } = step.details;
    
    if (!endpoint) {
      throw new Error('No endpoint specified for API POST');
    }
    
    // Replace placeholders
    const resolvedEndpoint = this.apiHelper.replacePlaceholders(endpoint);
    
    // Extract base URL and path
    const url = new URL(resolvedEndpoint);
    await this.apiHelper.init(url.origin);
    
    const result = await this.apiHelper.post(url.pathname + url.search);
    
    // Store response data
    if (storeAs) {
      if (typeof result.body === 'string' && result.body.includes('<')) {
        const value = this.apiHelper.extractFromXML(result.body, storeAs) ||
                     this.apiHelper.extractFromXML(result.body, 'id');
        if (value) testContext.set(storeAs, value);
      } else if (typeof result.body === 'object') {
        const value = result.body[storeAs] || result.body.id || result.body;
        testContext.set(storeAs, value);
      }
    }
  }

  /**
   * Execute API DELETE request
   */
  private async executeApiDelete(step: PromptStep): Promise<void> {
    const { endpoint } = step.details;
    
    if (!endpoint) {
      throw new Error('No endpoint specified for API DELETE');
    }
    
    const resolvedEndpoint = this.apiHelper.replacePlaceholders(endpoint);
    const url = new URL(resolvedEndpoint);
    await this.apiHelper.init(url.origin);
    
    await this.apiHelper.delete(url.pathname);
  }

  /**
   * Execute UI navigation
   */
  private async executeUiNavigate(step: PromptStep): Promise<void> {
    if (!this.uiHelper) {
      throw new Error('UI Helper not initialized');
    }
    
    const { endpoint, rawText } = step.details;
    const url = endpoint || rawText.match(/https?:\/\/[^\s]+/)?.[0];
    
    if (!url) {
      throw new Error('No URL specified for navigation');
    }
    
    await this.uiHelper.navigateTo(url);
  }

  /**
   * Execute UI login
   */
  private async executeUiLogin(step: PromptStep): Promise<void> {
    if (!this.uiHelper) {
      throw new Error('UI Helper not initialized');
    }
    
    const { username, password } = step.details;
    
    if (!username || !password) {
      throw new Error('Username or password not specified');
    }
    
    // Try common username field selectors
    await this.uiHelper.fill('input[name="username"]', username);
    await this.uiHelper.fill('input[name="password"]', password);
    
    // Try to find and click submit button
    try {
      await this.uiHelper.clickButton('Submit');
    } catch {
      try {
        await this.uiHelper.clickButton('Log In');
      } catch {
        await this.uiHelper.click('button[type="submit"]');
      }
    }
  }

  /**
   * Execute UI click
   */
  private async executeUiClick(step: PromptStep): Promise<void> {
    if (!this.uiHelper) {
      throw new Error('UI Helper not initialized');
    }
    
    const { rawText } = step.details;
    
    // Extract link/button text
    const clickMatch = rawText.match(/Click\s+["`']([^"`']+)["`']/i);
    if (clickMatch) {
      const text = clickMatch[1];
      try {
        await this.uiHelper.clickLink(text);
      } catch {
        await this.uiHelper.clickButton(text);
      }
    }
  }

  /**
   * Execute UI verification
   */
  private async executeUiVerify(step: PromptStep): Promise<void> {
    if (!this.uiHelper) {
      throw new Error('UI Helper not initialized');
    }
    
    const { validateText, rawText, storeAs } = step.details;
    
    // Check if we need to verify a variable from context
    const variableMatch = rawText.match(/\*\*(\w+)\*\*/);
    if (variableMatch) {
      const variableName = variableMatch[1];
      const value = testContext.get(variableName);
      
      if (value) {
        // Check if value exists in table or page
        const inTable = await this.uiHelper.isValueInTable('table', value.toString());
        if (!inTable) {
          const onPage = await this.uiHelper.isTextPresent(value.toString());
          if (!onPage) {
            throw new Error(`Value ${value} from variable ${variableName} not found on page`);
          }
        }
        console.log(`[Verification] ✓ ${variableName} = ${value} found on page`);
      }
    } else if (validateText) {
      await this.uiHelper.verifyTextPresent(validateText);
    }
  }
}
