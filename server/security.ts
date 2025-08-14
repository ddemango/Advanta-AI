// Security configurations and utilities

import crypto from 'crypto';

// Environment secrets validation
const requiredSecrets = [
  'DATABASE_URL',
  'SESSION_SECRET',
] as const;

export function validateEnvironment() {
  const missing = requiredSecrets.filter(secret => !process.env[secret]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
  }
  
  return {
    valid: missing.length === 0,
    missing
  };
}

// JWT utilities for service-to-service communication
export function generateJWT(payload: any, secret?: string): string {
  const jwtSecret = secret || process.env.JWT_SECRET || 'fallback-secret-for-dev';
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', jwtSecret)
    .update(`${header}.${body}`)
    .digest('base64url');
  
  return `${header}.${body}.${signature}`;
}

export function verifyJWT(token: string, secret?: string): any {
  try {
    const jwtSecret = secret || process.env.JWT_SECRET || 'fallback-secret-for-dev';
    const [header, body, signature] = token.split('.');
    
    const expectedSignature = crypto
      .createHmac('sha256', jwtSecret)
      .update(`${header}.${body}`)
      .digest('base64url');
    
    if (signature !== expectedSignature) {
      throw new Error('Invalid signature');
    }
    
    return JSON.parse(Buffer.from(body, 'base64url').toString());
  } catch (error) {
    throw new Error('Invalid JWT token');
  }
}

// Outbound HTTP allowlist for workflow nodes
const DEFAULT_ALLOWED_HOSTS = [
  'api.openai.com',
  'hooks.slack.com',
  'api.github.com',
  'api.notion.com',
  'gmail.googleapis.com',
  'graph.microsoft.com',
  'api.airtable.com',
  'api.trello.com',
  'api.asana.com'
];

export function getAllowedHosts(): string[] {
  const envHosts = process.env.ALLOWED_OUTBOUND_HOSTS;
  if (envHosts) {
    return envHosts.split(',').map(host => host.trim());
  }
  return DEFAULT_ALLOWED_HOSTS;
}

export function isHostAllowed(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const allowedHosts = getAllowedHosts();
    return allowedHosts.includes(urlObj.hostname);
  } catch {
    return false;
  }
}

// Encryption utilities for API keys
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';

export function encryptSecret(secret: string, key?: string): string {
  const encryptionKey = key || process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(ENCRYPTION_ALGORITHM, encryptionKey);
  
  let encrypted = cipher.update(secret, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
}

export function decryptSecret(encryptedSecret: string, key?: string): string {
  const encryptionKey = key || process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
  const [ivHex, encrypted, authTagHex] = encryptedSecret.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipher(ENCRYPTION_ALGORITHM, encryptionKey);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// Request validation and sanitization
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return input.replace(/<script[^>]*>.*?<\/script>/gi, '').trim();
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}

// Audit logging
export interface AuditLog {
  timestamp: Date;
  userId?: number;
  tenantId?: number;
  action: string;
  resource: string;
  details: any;
  ip?: string;
  userAgent?: string;
}

export function createAuditLog(log: Omit<AuditLog, 'timestamp'>): AuditLog {
  return {
    ...log,
    timestamp: new Date()
  };
}

// Log levels configuration
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export function getLogLevel(): LogLevel {
  const level = process.env.LOG_LEVEL?.toLowerCase();
  switch (level) {
    case 'error': return LogLevel.ERROR;
    case 'warn': return LogLevel.WARN;
    case 'info': return LogLevel.INFO;
    case 'debug': return LogLevel.DEBUG;
    default: return LogLevel.INFO;
  }
}

export function shouldLog(level: LogLevel): boolean {
  return level <= getLogLevel();
}