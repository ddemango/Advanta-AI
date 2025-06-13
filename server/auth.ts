import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import connectPg from 'connect-pg-simple';
import MemoryStore from 'memorystore';
import type { Express } from 'express';

const memoryStore = MemoryStore(session);

export function setupAuth(app: Express) {
  // Use memory store for sessions
  const sessionStore = new memoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  });

  // Session configuration
  app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
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
      
      done(null, null);
    } catch (error) {
      done(error, null);
    }
  });

  // Google OAuth Strategy
  passport.use('google', new GoogleStrategy({
    clientID: 'demo-google-client-id',
    clientSecret: 'demo-google-client-secret',
    callbackURL: "/auth/google/callback"
  },
  async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      const demoUser = {
        id: 1001,
        email: 'demo.user@gmail.com',
        firstName: 'Demo',
        lastName: 'User',
        picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        provider: 'google',
        providerId: 'demo_google_id_123',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      done(null, demoUser);
    } catch (error) {
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
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
}