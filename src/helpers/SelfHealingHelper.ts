/**
 * SelfHealingHelper - Automatic element locator healing
 * Provides fallback strategies when primary selectors fail
 */

import { Page, Locator, test } from '@playwright/test';

export class SelfHealingHelper {
  private page: Page;
  private healingLog: Array<{ original: string; healed: string; timestamp: Date }> = [];

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Find element with self-healing capability
   * Tries multiple fallback strategies if primary selector fails
   * @param page - Playwright page object
   * @param primarySelector - Original selector to try first
   * @param elementDescription - Human-readable description for logging
   * @returns Located element
   */
  async findElementWithSelfHealing(
    page: Page,
    primarySelector: string,
    elementDescription: string
  ): Promise<Locator> {
    console.log(`[Self-Healing] Attempting to locate: ${elementDescription}`);
    console.log(`[Self-Healing] Primary selector: ${primarySelector}`);

    // Try primary selector first (WITHOUT test.step - no need to clutter report)
    try {
      const element = page.locator(primarySelector);
      const count = await element.count();
      
      if (count > 0) {
        console.log(`[Self-Healing] ✓ Primary selector worked: ${primarySelector}`);
        return element.first();
      }
    } catch (error) {
      console.log(`[Self-Healing] ✗ Primary selector failed: ${primarySelector}`);
    }

    // Primary selector FAILED - NOW show self-healing in report
    console.log(`[Self-Healing] Attempting fallback strategies...`);
    
    return await test.step(`� Self-Healing: "${elementDescription}" (Primary selector failed: ${primarySelector})`, async () => {
      const healedElement = await this.tryFallbackStrategies(page, primarySelector, elementDescription);

      if (healedElement) {
        return healedElement;
      }

      // All strategies failed
      throw new Error(
        `[Self-Healing] Failed to locate element: "${elementDescription}" using selector: "${primarySelector}" and all fallback strategies`
      );
    });
  }

  /**
   * Try multiple fallback strategies to locate element
   */
  private async tryFallbackStrategies(
    page: Page,
    originalSelector: string,
    description: string
  ): Promise<Locator | null> {
    const strategies = [
      { 
        name: 'CSS Variations', 
        description: 'Try different CSS selector formats (#id, [id="..."], [id*="..."])',
        fn: async () => await this.tryCssVariations(page, originalSelector) 
      },
      { 
        name: 'Text-Based Selectors', 
        description: 'Search by visible text, aria-label, placeholder',
        fn: async () => await this.tryTextBasedSelectors(page, description) 
      },
      { 
        name: 'Role-Based Selectors', 
        description: 'Use ARIA roles (button, link, textbox)',
        fn: async () => await this.tryRoleBasedSelectors(page, description) 
      },
      { 
        name: 'Partial Attribute Matching', 
        description: 'Match partial attribute values ([name*="..."])',
        fn: async () => await this.tryPartialAttributeMatch(page, originalSelector) 
      },
      { 
        name: 'Parent-Child Relationships', 
        description: 'Simplify selectors by removing parent paths',
        fn: async () => await this.tryParentChildRelationship(page, originalSelector) 
      },
    ];

    for (let i = 0; i < strategies.length; i++) {
      const strategy = strategies[i];
      
      const result = await test.step(`Strategy ${i + 1}: ${strategy.name} - ${strategy.description}`, async () => {
        try {
          console.log(`[Self-Healing] Trying ${strategy.name}...`);
          const element = await strategy.fn();
          
          if (element) {
            const count = await element.count();
            if (count > 0) {
              const healedSelector = await this.getElementSelector(element);
              this.logHealedSelector(originalSelector, healedSelector);
              console.log(`[Self-Healing] ✓ ${strategy.name} succeeded!`);
              console.log(`[Self-Healing] Healed selector: ${healedSelector}`);
              return { success: true, element: element.first() };
            }
          }
          console.log(`[Self-Healing] ✗ ${strategy.name} failed`);
          return { success: false, element: null };
        } catch (error) {
          console.log(`[Self-Healing] ✗ ${strategy.name} failed with error`);
          return { success: false, element: null };
        }
      });

      if (result.success && result.element) {
        return result.element;
      }
    }

    return null;
  }

  /**
   * Strategy 1: Try CSS variations of the original selector
   */
  private async tryCssVariations(page: Page, selector: string): Promise<Locator | null> {
    const variations: string[] = [];

    // Extract ID, class, and tag from selector
    const idMatch = selector.match(/#([\w-]+)/);
    const classMatch = selector.match(/\.([\w-]+)/);
    const tagMatch = selector.match(/^(\w+)/);

    if (idMatch) {
      const id = idMatch[1];
      variations.push(`#${id}`);
      variations.push(`[id="${id}"]`);
      variations.push(`[id*="${id}"]`);
    }

    if (classMatch) {
      const className = classMatch[1];
      variations.push(`.${className}`);
      variations.push(`[class*="${className}"]`);
    }

    if (tagMatch) {
      const tag = tagMatch[1];
      if (idMatch) variations.push(`${tag}#${idMatch[1]}`);
      if (classMatch) variations.push(`${tag}.${classMatch[1]}`);
    }

    // If no variations found, log that this strategy is not applicable
    if (variations.length === 0) {
      await test.step('No CSS patterns found - strategy not applicable', async () => {
        console.log(`[Self-Healing] Strategy 1 not applicable for selector: ${selector}`);
      });
      return null;
    }

    // Try each variation with individual test steps
    for (const variation of variations) {
      const result = await test.step(`Try selector: ${variation}`, async () => {
        try {
          const element = page.locator(variation);
          const count = await element.count();
          if (count > 0) {
            console.log(`[Self-Healing] ✓ CSS variation worked: ${variation}`);
            return { success: true, element };
          }
          console.log(`[Self-Healing] ✗ CSS variation failed: ${variation}`);
          return { success: false, element: null };
        } catch (error) {
          console.log(`[Self-Healing] ✗ CSS variation error: ${variation}`);
          return { success: false, element: null };
        }
      });

      if (result.success && result.element) {
        return result.element;
      }
    }

    return null;
  }

  /**
   * Strategy 2: Try text-based selectors
   */
  private async tryTextBasedSelectors(page: Page, description: string): Promise<Locator | null> {
    // Extract potential text from description
    const textPatterns = [
      description,
      description.replace(/element|button|link|field|input/gi, '').trim(),
    ];

    for (const text of textPatterns) {
      if (!text || text.length < 2) continue;

      const textSelectors = [
        `text=${text}`,
        `text="${text}"`,
        `:has-text("${text}")`,
        `button:has-text("${text}")`,
        `a:has-text("${text}")`,
        `[aria-label="${text}"]`,
        `[title="${text}"]`,
        `[placeholder="${text}"]`,
      ];

      for (const selector of textSelectors) {
        const result = await test.step(`Try selector: ${selector}`, async () => {
          try {
            const element = page.locator(selector);
            const count = await element.count();
            if (count > 0) {
              console.log(`[Self-Healing] ✓ Text-based selector worked: ${selector}`);
              return { success: true, element };
            }
            console.log(`[Self-Healing] ✗ Text-based selector failed: ${selector}`);
            return { success: false, element: null };
          } catch (error) {
            console.log(`[Self-Healing] ✗ Text-based selector error: ${selector}`);
            return { success: false, element: null };
          }
        });

        if (result.success && result.element) {
          return result.element;
        }
      }
    }

    return null;
  }

  /**
   * Strategy 3: Try role-based selectors
   */
  private async tryRoleBasedSelectors(page: Page, description: string): Promise<Locator | null> {
    const descLower = description.toLowerCase();
    
    // Map common keywords to roles
    const roleMapping: { [key: string]: string[] } = {
      button: ['button'],
      link: ['link'],
      input: ['textbox'],
      checkbox: ['checkbox'],
      radio: ['radio'],
      select: ['combobox'],
      heading: ['heading'],
    };

    let foundKeyword = false;
    for (const [keyword, roles] of Object.entries(roleMapping)) {
      if (descLower.includes(keyword)) {
        foundKeyword = true;
        for (const role of roles) {
          const result = await test.step(`Try role: ${role}`, async () => {
            try {
              const element = page.getByRole(role as any);
              const count = await element.count();
              if (count > 0) {
                console.log(`[Self-Healing] ✓ Role-based selector worked: role=${role}`);
                return { success: true, element };
              }
              console.log(`[Self-Healing] ✗ Role-based selector failed: role=${role}`);
              return { success: false, element: null };
            } catch (error) {
              console.log(`[Self-Healing] ✗ Role-based selector error: role=${role}`);
              return { success: false, element: null };
            }
          });

          if (result.success && result.element) {
            return result.element;
          }
        }
      }
    }

    // If no role keywords found, log that this strategy is not applicable
    if (!foundKeyword) {
      await test.step('No role keywords found - strategy not applicable', async () => {
        console.log(`[Self-Healing] Strategy 3 not applicable for description: ${description}`);
      });
    }

    return null;
  }

  /**
   * Strategy 4: Try partial attribute matching
   */
  private async tryPartialAttributeMatch(page: Page, selector: string): Promise<Locator | null> {
    // Extract attribute patterns from selector
    const attrMatch = selector.match(/\[(\w+)="([^"]+)"\]/);
    const nameMatch = selector.match(/name="([^"]+)"/);
    const typeMatch = selector.match(/type="([^"]+)"/);

    const partialSelectors: string[] = [];

    if (attrMatch) {
      const [, attr, value] = attrMatch;
      partialSelectors.push(`[${attr}*="${value}"]`);
      partialSelectors.push(`[${attr}^="${value}"]`);
    }

    if (nameMatch) {
      partialSelectors.push(`[name*="${nameMatch[1]}"]`);
    }

    if (typeMatch) {
      partialSelectors.push(`[type="${typeMatch[1]}"]`);
    }

    // If no partial selectors found, log that this strategy is not applicable
    if (partialSelectors.length === 0) {
      await test.step('No attributes found - strategy not applicable', async () => {
        console.log(`[Self-Healing] Strategy 4 not applicable for selector: ${selector}`);
      });
      return null;
    }

    for (const partial of partialSelectors) {
      const result = await test.step(`Try selector: ${partial}`, async () => {
        try {
          const element = page.locator(partial);
          const count = await element.count();
          if (count > 0 && count <= 5) { // Avoid too generic selectors
            console.log(`[Self-Healing] ✓ Partial attribute match worked: ${partial} (found ${count} elements)`);
            return { success: true, element };
          }
          console.log(`[Self-Healing] ✗ Partial attribute match failed: ${partial} (found ${count} elements - too generic or none)`);
          return { success: false, element: null };
        } catch (error) {
          console.log(`[Self-Healing] ✗ Partial attribute match error: ${partial}`);
          return { success: false, element: null };
        }
      });

      if (result.success && result.element) {
        return result.element;
      }
    }

    return null;
  }

  /**
   * Strategy 5: Try parent-child relationships
   */
  private async tryParentChildRelationship(page: Page, selector: string): Promise<Locator | null> {
    // Look for common parent-child patterns
    const patterns = [
      selector.replace('>', ' '),
      selector.split('>')[0]?.trim(),
      selector.split(' ')[0]?.trim(),
    ].filter((pattern) => pattern && pattern !== selector);

    // If no valid patterns found, log that this strategy is not applicable
    if (patterns.length === 0) {
      await test.step('No parent-child patterns found - strategy not applicable', async () => {
        console.log(`[Self-Healing] Strategy 5 not applicable for selector: ${selector}`);
      });
      return null;
    }

    for (const pattern of patterns) {
      
      const result = await test.step(`Try selector: ${pattern}`, async () => {
        try {
          const element = page.locator(pattern);
          const count = await element.count();
          if (count > 0 && count <= 10) {
            console.log(`[Self-Healing] ✓ Parent-child pattern worked: ${pattern} (found ${count} elements)`);
            return { success: true, element };
          }
          console.log(`[Self-Healing] ✗ Parent-child pattern failed: ${pattern} (found ${count} elements - too generic or none)`);
          return { success: false, element: null };
        } catch (error) {
          console.log(`[Self-Healing] ✗ Parent-child pattern error: ${pattern}`);
          return { success: false, element: null };
        }
      });

      if (result.success && result.element) {
        return result.element;
      }
    }

    return null;
  }

  /**
   * Get a readable selector from a located element
   */
  private async getElementSelector(element: Locator): Promise<string> {
    try {
      // Try to get a meaningful selector representation
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase());
      const id = await element.evaluate((el) => el.id);
      const className = await element.evaluate((el) => el.className);

      if (id) return `#${id}`;
      if (className && typeof className === 'string') {
        const firstClass = className.split(' ')[0];
        return `.${firstClass}`;
      }
      return tagName;
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * Log healed selector for reporting
   */
  private logHealedSelector(original: string, healed: string): void {
    const entry = {
      original,
      healed,
      timestamp: new Date(),
    };
    this.healingLog.push(entry);
    
    console.log(`[Self-Healing] ✓ HEALED SELECTOR:`);
    console.log(`  Original: ${original}`);
    console.log(`  Healed:   ${healed}`);
    console.log(`  Time:     ${entry.timestamp.toISOString()}`);
  }

  /**
   * Get all healing logs for reporting
   */
  getHealingLog(): Array<{ original: string; healed: string; timestamp: Date }> {
    return this.healingLog;
  }

  /**
   * Print healing summary
   */
  printHealingSummary(): void {
    if (this.healingLog.length === 0) {
      console.log('[Self-Healing] No selector healing occurred in this test');
      return;
    }

    console.log('\n[Self-Healing] ========== HEALING SUMMARY ==========');
    console.log(`[Self-Healing] Total healed selectors: ${this.healingLog.length}`);
    
    this.healingLog.forEach((entry, index) => {
      console.log(`\n[Self-Healing] Healing #${index + 1}:`);
      console.log(`  Original: ${entry.original}`);
      console.log(`  Healed:   ${entry.healed}`);
      console.log(`  Time:     ${entry.timestamp.toISOString()}`);
    });
    
    console.log('[Self-Healing] =====================================\n');
  }

  /**
   * Clear healing log
   */
  clearLog(): void {
    this.healingLog = [];
  }
}
