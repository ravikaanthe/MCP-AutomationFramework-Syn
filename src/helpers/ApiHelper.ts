/**
 * ApiHelper - Utility class for API operations
 * Handles REST API calls with proper error handling and logging
 */

import { APIRequestContext, request } from '@playwright/test';
import { testContext } from '../core/TestContext';

export class ApiHelper {
  private apiContext: APIRequestContext | null = null;
  private baseURL: string;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  /**
   * Initialize API context
   */
  async init(baseURL?: string): Promise<void> {
    if (baseURL) this.baseURL = baseURL;
    this.apiContext = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: {
        'Accept': 'application/json, application/xml, text/xml, */*',
      },
    });
    console.log(`[ApiHelper] Initialized with baseURL: ${this.baseURL}`);
  }

  /**
   * GET request
   * @param endpoint - API endpoint
   * @param options - Request options
   */
  async get(endpoint: string, options: any = {}): Promise<any> {
    if (!this.apiContext) await this.init();
    
    console.log(`[API GET] ${this.baseURL}${endpoint}`);
    const response = await this.apiContext!.get(endpoint, options);
    
    const status = response.status();
    console.log(`[API Response] Status: ${status}`);
    
    const contentType = response.headers()['content-type'] || '';
    let body;
    
    if (contentType.includes('application/json')) {
      body = await response.json();
    } else if (contentType.includes('xml')) {
      body = await response.text();
    } else {
      body = await response.text();
    }
    
    return { status, body, response };
  }

  /**
   * POST request
   * @param endpoint - API endpoint
   * @param data - Request body
   * @param options - Request options
   */
  async post(endpoint: string, data?: any, options: any = {}): Promise<any> {
    if (!this.apiContext) await this.init();
    
    console.log(`[API POST] ${this.baseURL}${endpoint}`);
    console.log(`[API POST Body] ${JSON.stringify(data)}`);
    
    const response = await this.apiContext!.post(endpoint, {
      data,
      ...options,
    });
    
    const status = response.status();
    console.log(`[API Response] Status: ${status}`);
    
    const contentType = response.headers()['content-type'] || '';
    let body;
    
    if (contentType.includes('application/json')) {
      body = await response.json();
    } else if (contentType.includes('xml')) {
      body = await response.text();
    } else {
      body = await response.text();
    }
    
    return { status, body, response };
  }

  /**
   * PUT request
   * @param endpoint - API endpoint
   * @param data - Request body
   * @param options - Request options
   */
  async put(endpoint: string, data?: any, options: any = {}): Promise<any> {
    if (!this.apiContext) await this.init();
    
    console.log(`[API PUT] ${this.baseURL}${endpoint}`);
    const response = await this.apiContext!.put(endpoint, {
      data,
      ...options,
    });
    
    const status = response.status();
    const body = await this.getResponseBody(response);
    
    return { status, body, response };
  }

  /**
   * DELETE request
   * @param endpoint - API endpoint
   * @param options - Request options
   */
  async delete(endpoint: string, options: any = {}): Promise<any> {
    if (!this.apiContext) await this.init();
    
    console.log(`[API DELETE] ${this.baseURL}${endpoint}`);
    const response = await this.apiContext!.delete(endpoint, options);
    
    const status = response.status();
    const body = await this.getResponseBody(response);
    
    return { status, body, response };
  }

  /**
   * Extract value from XML response
   * @param xmlString - XML response string
   * @param tagName - Tag name to extract
   */
  extractFromXML(xmlString: string, tagName: string): string | null {
    const regex = new RegExp(`<${tagName}>\\s*([^<]+)\\s*</${tagName}>`, 'i');
    const match = xmlString.match(regex);
    return match ? match[1].trim() : null;
  }

  /**
   * Store variable in test context
   * @param key - Variable name
   * @param value - Variable value
   */
  storeVariable(key: string, value: any): void {
    testContext.set(key, value);
  }

  /**
   * Get variable from test context
   * @param key - Variable name
   */
  getVariable(key: string): any {
    return testContext.get(key);
  }

  /**
   * Replace placeholders in URL with context variables
   * @param url - URL with placeholders like {{variableName}}
   */
  replacePlaceholders(url: string): string {
    return url.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const value = testContext.get(key);
      if (value === undefined) {
        throw new Error(`Variable ${key} not found in test context`);
      }
      return value;
    });
  }

  /**
   * Get response body based on content type
   */
  private async getResponseBody(response: any): Promise<any> {
    const contentType = response.headers()['content-type'] || '';
    
    if (contentType.includes('application/json')) {
      return await response.json();
    } else if (contentType.includes('xml')) {
      return await response.text();
    } else {
      return await response.text();
    }
  }

  /**
   * Dispose API context
   */
  async dispose(): Promise<void> {
    if (this.apiContext) {
      await this.apiContext.dispose();
      console.log('[ApiHelper] Disposed API context');
    }
  }
}
