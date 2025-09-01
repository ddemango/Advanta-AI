// Environment variables with validation
export const env = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  BING_API_KEY: process.env.BING_API_KEY || '',
  BRAVE_API_KEY: process.env.BRAVE_API_KEY || '',
  SERPER_API_KEY: process.env.SERPER_API_KEY || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

// Validation helper
export function validateEnv(key: keyof typeof env): boolean {
  return !!env[key];
}

export function requireEnv(key: keyof typeof env): string {
  const value = env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}