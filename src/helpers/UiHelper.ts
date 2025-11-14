/**
 * UiHelper - Utility class for UI operations
 * Handles web interactions with proper waits and error handling
 */

import { Page, Locator, expect } from '@playwright/test';
import { testContext } from '../core/TestContext';

export class UiHelper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to URL
   * @param url - URL to navigate to
   */
  async navigateTo(url: string): Promise<void> {
    console.log(`[UI] Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Fill input field
   * @param locator - Element locator (CSS, XPath, or text)
   * @param value - Value to fill
   */
  async fill(locator: string, value: string): Promise<void> {
    console.log(`[UI] Filling ${locator} with: ${value}`);
    const element = await this.getElement(locator);
    await element.fill(value);
  }

  /**
   * Click on element
   * @param locator - Element locator
   */
  async click(locator: string): Promise<void> {
    console.log(`[UI] Clicking: ${locator}`);
    const element = await this.getElement(locator);
    await element.click();
  }

  /**
   * Click button by text
   * @param buttonText - Button text
   */
  async clickButton(buttonText: string): Promise<void> {
    console.log(`[UI] Clicking button: ${buttonText}`);
    await this.page.getByRole('button', { name: buttonText }).click();
  }

  /**
   * Click link by text
   * @param linkText - Link text
   */
  async clickLink(linkText: string): Promise<void> {
    console.log(`[UI] Clicking link: ${linkText}`);
    await this.page.getByRole('link', { name: linkText }).click();
  }

  /**
   * Get text from element
   * @param locator - Element locator
   */
  async getText(locator: string): Promise<string> {
    const element = await this.getElement(locator);
    const text = await element.textContent();
    console.log(`[UI] Got text from ${locator}: ${text}`);
    return text || '';
  }

  /**
   * Check if element is visible
   * @param locator - Element locator
   */
  async isVisible(locator: string): Promise<boolean> {
    try {
      const element = await this.getElement(locator);
      const visible = await element.isVisible();
      console.log(`[UI] ${locator} is visible: ${visible}`);
      return visible;
    } catch (error) {
      return false;
    }
  }

  /**
   * Wait for element to be visible
   * @param locator - Element locator
   * @param timeout - Timeout in milliseconds
   */
  async waitForElement(locator: string, timeout: number = 30000): Promise<void> {
    console.log(`[UI] Waiting for element: ${locator}`);
    const element = await this.getElement(locator);
    await element.waitFor({ state: 'visible', timeout });
  }

  /**
   * Verify element contains text
   * @param locator - Element locator
   * @param expectedText - Expected text
   */
  async verifyElementContainsText(locator: string, expectedText: string): Promise<void> {
    console.log(`[UI] Verifying ${locator} contains: ${expectedText}`);
    const element = await this.getElement(locator);
    await expect(element).toContainText(expectedText);
  }

  /**
   * Verify element is visible
   * @param locator - Element locator
   */
  async verifyElementVisible(locator: string): Promise<void> {
    console.log(`[UI] Verifying ${locator} is visible`);
    const element = await this.getElement(locator);
    await expect(element).toBeVisible();
  }

  /**
   * Check if text exists on page
   * @param text - Text to search for
   */
  async isTextPresent(text: string): Promise<boolean> {
    console.log(`[UI] Checking if text is present: ${text}`);
    try {
      const element = this.page.getByText(text, { exact: false });
      return await element.isVisible();
    } catch (error) {
      return false;
    }
  }

  /**
   * Verify text is present on page
   * @param text - Text to verify
   */
  async verifyTextPresent(text: string): Promise<void> {
    console.log(`[UI] Verifying text is present: ${text}`);
    const element = this.page.getByText(text, { exact: false });
    await expect(element).toBeVisible();
  }

  /**
   * Get all table rows
   * @param tableLocator - Table locator
   */
  async getTableRows(tableLocator: string): Promise<Locator[]> {
    console.log(`[UI] Getting table rows from: ${tableLocator}`);
    const table = await this.getElement(tableLocator);
    return await table.locator('tr').all();
  }

  /**
   * Check if value exists in table
   * @param tableLocator - Table locator
   * @param value - Value to search for
   */
  async isValueInTable(tableLocator: string, value: string): Promise<boolean> {
    console.log(`[UI] Checking if ${value} exists in table`);
    const rows = await this.getTableRows(tableLocator);
    
    for (const row of rows) {
      const text = await row.textContent();
      if (text && text.includes(value)) {
        console.log(`[UI] Found ${value} in table`);
        return true;
      }
    }
    
    console.log(`[UI] ${value} not found in table`);
    return false;
  }

  /**
   * Store UI value in test context
   * @param key - Variable name
   * @param locator - Element locator
   */
  async storeValue(key: string, locator: string): Promise<void> {
    const value = await this.getText(locator);
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
   * Take screenshot
   * @param name - Screenshot name
   */
  async takeScreenshot(name: string): Promise<void> {
    console.log(`[UI] Taking screenshot: ${name}`);
    await this.page.screenshot({ 
      path: `test-results/${name}.png`,
      fullPage: true 
    });
  }

  /**
   * Get HTML attribute value
   * @param locator - Element locator
   * @param attributeName - Attribute name (e.g., 'id', 'class', 'href', 'data-test')
   */
  async getAttribute(locator: string, attributeName: string): Promise<string | null> {
    console.log(`[UI] Getting attribute '${attributeName}' from: ${locator}`);
    const element = await this.getElement(locator);
    const value = await element.getAttribute(attributeName);
    console.log(`[UI] Attribute '${attributeName}' value: ${value}`);
    return value;
  }

  /**
   * Get CSS property value
   * @param locator - Element locator
   * @param propertyName - CSS property name (e.g., 'color', 'font-size', 'display')
   */
  async getCssProperty(locator: string, propertyName: string): Promise<string> {
    console.log(`[UI] Getting CSS property '${propertyName}' from: ${locator}`);
    const element = await this.getElement(locator);
    const value = await element.evaluate((el: any, prop: string) => {
      const win = globalThis as any;
      return win.getComputedStyle(el).getPropertyValue(prop);
    }, propertyName);
    console.log(`[UI] CSS property '${propertyName}' value: ${value}`);
    return value;
  }

  /**
   * Get input field value
   * @param locator - Input field locator
   */
  async getInputValue(locator: string): Promise<string> {
    console.log(`[UI] Getting input value from: ${locator}`);
    const element = await this.getElement(locator);
    const value = await element.inputValue();
    console.log(`[UI] Input value: ${value}`);
    return value;
  }

  /**
   * Check if element is enabled
   * @param locator - Element locator
   */
  async isEnabled(locator: string): Promise<boolean> {
    console.log(`[UI] Checking if ${locator} is enabled`);
    const element = await this.getElement(locator);
    const enabled = await element.isEnabled();
    console.log(`[UI] ${locator} is enabled: ${enabled}`);
    return enabled;
  }

  /**
   * Check if checkbox/radio is checked
   * @param locator - Checkbox/radio locator
   */
  async isChecked(locator: string): Promise<boolean> {
    console.log(`[UI] Checking if ${locator} is checked`);
    const element = await this.getElement(locator);
    const checked = await element.isChecked();
    console.log(`[UI] ${locator} is checked: ${checked}`);
    return checked;
  }

  /**
   * Get element bounding box (position and size)
   * @param locator - Element locator
   */
  async getElementBoundingBox(locator: string): Promise<{ x: number; y: number; width: number; height: number } | null> {
    console.log(`[UI] Getting bounding box for: ${locator}`);
    const element = await this.getElement(locator);
    const box = await element.boundingBox();
    console.log(`[UI] Bounding box:`, box);
    return box;
  }

  /**
   * Get all properties of an element (comprehensive extraction)
   * @param locator - Element locator
   */
  async getAllProperties(locator: string): Promise<any> {
    console.log(`[UI] Getting all properties from: ${locator}`);
    const element = await this.getElement(locator);
    
    const properties = await element.evaluate((el: any) => {
      const win = globalThis as any;
      const computedStyle = win.getComputedStyle(el);
      
      return {
        // Basic properties
        tagName: el.tagName,
        id: el.id,
        className: el.className,
        textContent: el.textContent?.trim(),
        innerText: el.innerText?.trim(),
        innerHTML: el.innerHTML,
        
        // Attributes
        attributes: Array.from(el.attributes).reduce((acc: any, attr: any) => {
          acc[attr.name] = attr.value;
          return acc;
        }, {} as Record<string, string>),
        
        // Form-specific
        value: el.value || null,
        checked: el.checked || null,
        disabled: el.disabled || null,
        readonly: el.readOnly || null,
        selected: el.selected || null,
        
        // Visibility & State
        isVisible: el.offsetParent !== null,
        offsetWidth: el.offsetWidth,
        offsetHeight: el.offsetHeight,
        
        // Computed styles (key properties)
        styles: {
          display: computedStyle.display,
          visibility: computedStyle.visibility,
          opacity: computedStyle.opacity,
          color: computedStyle.color,
          backgroundColor: computedStyle.backgroundColor,
          fontSize: computedStyle.fontSize,
          fontWeight: computedStyle.fontWeight,
          border: computedStyle.border,
          padding: computedStyle.padding,
          margin: computedStyle.margin
        }
      };
    });
    
    console.log(`[UI] All properties:`, JSON.stringify(properties, null, 2));
    return properties;
  }

  /**
   * Get element using multiple strategies
   * @param locator - Element locator (CSS, XPath, text, role)
   */
  private async getElement(locator: string): Promise<Locator> {
    // XPath
    if (locator.startsWith('//') || locator.startsWith('(//')) {
      return this.page.locator(locator);
    }
    
    // CSS or other selectors
    if (locator.includes('#') || locator.includes('.') || locator.includes('[')) {
      return this.page.locator(locator);
    }
    
    // Try as text
    try {
      return this.page.getByText(locator, { exact: false });
    } catch {
      return this.page.locator(locator);
    }
  }

  /**
   * Get page instance
   */
  getPage(): Page {
    return this.page;
  }
}
