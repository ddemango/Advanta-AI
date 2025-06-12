import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as AppleStrategy } from 'passport-apple';
import session from 'express-session';
import connectPg from 'connect-pg-simple';
import MemoryStore from 'memorystore';
import type { Express } from 'express';
import { db } from './db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

const pgStore = connectPg(session);
const memoryStore = MemoryStore(session);

export function setupAuth(app: Express) {
  // Use memory store for development to ensure sessions work
  const sessionStore = process.env.NODE_ENV === 'production' 
    ? new pgStore({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
        tableName: 'session'
      })
    : new memoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      });

  // Session configuration
  app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
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
      const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
      done(null, user[0] || null);
    } catch (error) {
      done(error, null);
    }
  });

  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        const existingUser = await db.select()
          .from(users)
          .where(eq(users.providerId, profile.id))
          .limit(1);

        if (existingUser.length > 0) {
          return done(null, existingUser[0]);
        }

        // Create new user
        const newUser = await db.insert(users).values({
          email: profile.emails?.[0]?.value || '',
          name: profile.displayName || '',
          picture: profile.photos?.[0]?.value || '',
          provider: 'google',
          providerId: profile.id,
        }).returning();

        done(null, newUser[0]);
      } catch (error) {
        done(error, null);
      }
    }));
  }

  // Apple OAuth Strategy
  if (process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID && process.env.APPLE_PRIVATE_KEY) {
    passport.use(new AppleStrategy({
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      keyID: process.env.APPLE_KEY_ID,
      privateKeyString: process.env.APPLE_PRIVATE_KEY,
      callbackURL: "/auth/apple/callback",
      scope: ['name', 'email']
    },
    async (accessToken, refreshToken, idToken, profile, done) => {
      try {
        // Check if user exists
        const existingUser = await db.select()
          .from(users)
          .where(eq(users.providerId, profile.id))
          .limit(1);

        if (existingUser.length > 0) {
          return done(null, existingUser[0]);
        }

        // Create new user
        const newUser = await db.insert(users).values({
          email: profile.email || '',
          name: profile.name?.firstName + ' ' + profile.name?.lastName || '',
          provider: 'apple',
          providerId: profile.id,
        }).returning();

        done(null, newUser[0]);
      } catch (error) {
        done(error, null);
      }
    }));
  }

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

  app.get('/auth/apple',
    passport.authenticate('apple')
  );

  app.get('/auth/apple/callback',
    passport.authenticate('apple', { failureRedirect: '/login' }),
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