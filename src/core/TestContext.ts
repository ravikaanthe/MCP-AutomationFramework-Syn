/**
 * TestContext - Central state management for API and UI test data
 * Stores variables across test steps for end-to-end scenarios
 */

export class TestContext {
  private static instance: TestContext;
  private contextData: Map<string, any> = new Map();
  private testStartTime: number;

  private constructor() {
    this.testStartTime = Date.now();
  }

  /**
   * Get singleton instance of TestContext
   */
  static getInstance(): TestContext {
    if (!TestContext.instance) {
      TestContext.instance = new TestContext();
    }
    return TestContext.instance;
  }

  /**
   * Store a variable in the test context
   * @param key - Variable name
   * @param value - Variable value
   */
  set(key: string, value: any): void {
    this.contextData.set(key, value);
    console.log(`[TestContext] Set ${key} = ${JSON.stringify(value)}`);
  }

  /**
   * Retrieve a variable from the test context
   * @param key - Variable name
   * @returns Variable value or undefined
   */
  get(key: string): any {
    const value = this.contextData.get(key);
    console.log(`[TestContext] Get ${key} = ${JSON.stringify(value)}`);
    return value;
  }

  /**
   * Check if a variable exists in the context
   * @param key - Variable name
   * @returns boolean
   */
  has(key: string): boolean {
    return this.contextData.has(key);
  }

  /**
   * Get all variables in the context
   * @returns Object with all key-value pairs
   */
  getAll(): Record<string, any> {
    const allData: Record<string, any> = {};
    this.contextData.forEach((value, key) => {
      allData[key] = value;
    });
    return allData;
  }

  /**
   * Clear all variables from the context
   */
  clear(): void {
    console.log('[TestContext] Clearing all context data');
    this.contextData.clear();
  }

  /**
   * Clear specific variable from the context
   * @param key - Variable name
   */
  remove(key: string): void {
    console.log(`[TestContext] Removing ${key}`);
    this.contextData.delete(key);
  }

  /**
   * Get test execution time
   */
  getExecutionTime(): number {
    return Date.now() - this.testStartTime;
  }

  /**
   * Print all context data for debugging
   */
  printContext(): void {
    console.log('\n=== Test Context Data ===');
    this.contextData.forEach((value, key) => {
      console.log(`${key}: ${JSON.stringify(value)}`);
    });
    console.log('========================\n');
  }
}

// Export singleton instance
export const testContext = TestContext.getInstance();
