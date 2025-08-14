import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Security middleware as per checklist requirements

// Rate limiting per IP and tenant
export const createRateLimit = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// API rate limits
export const apiRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // requests per window
  'Too many API requests from this IP'
);

export const workflowGenerationRateLimit = createRateLimit(
  60 * 1000, // 1 minute
  5, // requests per window
  'Too many workflow generation requests from this IP'
);

// CORS configuration
export const corsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [
      'http://localhost:5000',
      'https://localhost:5000',
      process.env.FRONTEND_URL,
      // Add your production domains here
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

// Tenant resolution middleware
export const resolveTenant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const host = req.get('host');
    if (!host) {
      return res.status(400).json({ error: 'Missing host header' });
    }

    // Extract subdomain for tenant resolution
    const subdomain = host.split('.')[0];
    
    // For development, use a default tenant
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      req.tenant = { slug: 'default', id: 1 };
      return next();
    }

    // TODO: Implement actual tenant lookup from database
    // const tenant = await db.select().from(tenants).where(eq(tenants.slug, subdomain)).limit(1);
    
    // For now, set a default tenant
    req.tenant = { slug: subdomain, id: 1 };
    next();
  } catch (error) {
    console.error('Error resolving tenant:', error);
    res.status(500).json({ error: 'Failed to resolve tenant' });
  }
};

// Request ID middleware for tracing
export const requestId = (req: Request, res: Response, next: NextFunction) => {
  req.id = req.get('X-Request-Id') || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  res.setHeader('X-Request-Id', req.id);
  next();
};

// Security headers
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
};

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      tenant?: { slug: string; id: number };
      id?: string;
    }
  }
}