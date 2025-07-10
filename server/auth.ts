import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import connectPg from 'connect-pg-simple';
import MemoryStore from 'memorystore';
import type { Express } from 'express';

const memoryStore = MemoryStore(session);

export function setupAuth(app: Express) {
  // Use memory store for sessions with 30-day expiration
  const sessionStore = new memoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  });

  // Session configuration with 30-day persistence
  app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: true,
    saveUninitialized: true,
    rolling: true, // Reset expiration on each request
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: 'lax'
    },
    name: 'connect.sid'
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // Passport serialization
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      // Handle demo users
      if (id >= 1000 && id <= 1000000) {
        const demoUser = {
          id: id,
          email: id < 2000 ? 'demo.user@gmail.com' : 'demo.user@icloud.com',
          firstName: id < 2000 ? 'Demo' : 'Apple',
          lastName: id < 2000 ? 'User' : 'Demo',
          picture: id < 2000 ? 'https://lh3.googleusercontent.com/a/default-user=s96-c' : null,
          provider: id < 2000 ? 'google' : 'apple',
          providerId: id < 2000 ? 'demo_google_id_123' : 'demo_apple_id_456',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        return done(null, demoUser);
      }
      
      // Get real user from database
      const { storage } = await import('./storage');
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Google OAuth Strategy
  passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: `https://${process.env.REPLIT_DOMAINS}/auth/google/callback`
  },
  async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      const { storage } = await import('./storage');
      
      // Try to find existing user
      let user = await storage.getUserByProviderId('google', profile.id);
      
      if (!user) {
        // Create new user
        user = await storage.createUser({
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          picture: profile.photos[0].value,
          provider: 'google',
          providerId: profile.id
        });
      }
      
      done(null, user);
    } catch (error) {
      console.error('Google OAuth error:', error);
      done(error, null);
    }
  }));

  // Auth routes
  app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/dashboard');
    }
  );

  app.post('/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.json({ success: true });
    });
  });

  app.get('/auth/user', (req, res) => {
    res.json(req.user || null);
  });
}

// Middleware to protect routes
export function requireAuth(req: any, res: any, next: any) {
  // Allow demo user ID 1001 to bypass session check for localStorage auth
  const userId = req.session?.userId || req.session?.user?.id;
  
  if (req.isAuthenticated() || userId === 1001) {
    return next();
  }
  
  // For demo purposes, automatically establish demo user session
  if (!req.session.userId) {
    req.session.userId = 1001;
    req.session.user = {
      id: 1001,
      email: 'demo@advanta-ai.com',
      firstName: 'Demo',
      lastName: 'User'
    };
    return next();
  }
  
  res.status(401).json({ error: 'Authentication required' });
}