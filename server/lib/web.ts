export function getBaseUrl() {
  const fromEnv = process.env.PUBLIC_BASE_URL;
  const fromReplit = process.env.REPLIT_DOMAINS?.split(',')[0];
  if (fromEnv) return fromEnv.replace(/\/+$/, '');
  if (fromReplit) return `https://${fromReplit}`.replace(/\/+$/, '');
  return 'https://advanta-ai.com';
}