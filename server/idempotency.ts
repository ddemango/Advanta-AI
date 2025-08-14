// Idempotency service for workflow deployments

import crypto from 'crypto';
import { redis } from './queue-service';

// Generate idempotency key for deployment jobs
export function generateIdempotencyKey(tenantId: number, workflowJson: any): string {
  const workflowHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(workflowJson))
    .digest('hex')
    .substring(0, 16);
  
  return `deploy_${tenantId}_${workflowHash}`;
}

// Check if operation is duplicate
export async function isDuplicateOperation(key: string): Promise<boolean> {
  if (!redis) {
    // Fallback: use in-memory cache for development
    return false;
  }
  
  try {
    const exists = await redis.exists(`idempotency:${key}`);
    return exists === 1;
  } catch (error) {
    console.error('Error checking idempotency:', error);
    return false;
  }
}

// Mark operation as started
export async function markOperationStarted(key: string, ttlSeconds: number = 3600): Promise<void> {
  if (!redis) {
    return;
  }
  
  try {
    await redis.setex(`idempotency:${key}`, ttlSeconds, JSON.stringify({
      status: 'started',
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error marking operation started:', error);
  }
}

// Mark operation as completed
export async function markOperationCompleted(key: string, result: any): Promise<void> {
  if (!redis) {
    return;
  }
  
  try {
    await redis.setex(`idempotency:${key}`, 86400, JSON.stringify({
      status: 'completed',
      result,
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error marking operation completed:', error);
  }
}

// Get operation result if completed
export async function getOperationResult(key: string): Promise<any | null> {
  if (!redis) {
    return null;
  }
  
  try {
    const data = await redis.get(`idempotency:${key}`);
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    return parsed.status === 'completed' ? parsed.result : null;
  } catch (error) {
    console.error('Error getting operation result:', error);
    return null;
  }
}