/**
 * Environment Configuration
 * Manages environment-specific settings
 */

export interface EnvironmentConfig {
  baseURL: string;
  apiBaseURL: string;
  timeout: number;
  headless: boolean;
  slowMo: number;
  screenshot: 'on' | 'off' | 'only-on-failure';
  video: 'on' | 'off' | 'retain-on-failure';
  trace: 'on' | 'off' | 'retain-on-failure';
}

const environments: Record<string, EnvironmentConfig> = {
  parabank: {
    baseURL: 'https://parabank.parasoft.com/parabank',
    apiBaseURL: 'https://parabank.parasoft.com/parabank/services/bank',
    timeout: 30000,
    headless: false,
    slowMo: 500,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  contactlist: {
    baseURL: 'https://thinking-tester-contact-list.herokuapp.com',
    apiBaseURL: 'https://thinking-tester-contact-list.herokuapp.com',
    timeout: 30000,
    headless: false,
    slowMo: 500,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
};

/**
 * Get environment configuration
 * @param envName - Environment name (default: 'parabank')
 */
export function getEnvironmentConfig(envName: string = 'parabank'): EnvironmentConfig {
  return environments[envName] || environments.parabank;
}

/**
 * Get environment from process.env or default
 */
export function getCurrentEnvironment(): string {
  return process.env.TEST_ENV || 'parabank';
}

/**
 * Get current environment configuration
 */
export function getConfig(): EnvironmentConfig {
  return getEnvironmentConfig(getCurrentEnvironment());
}
