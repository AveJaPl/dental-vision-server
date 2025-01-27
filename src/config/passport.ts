// src/config/passport.ts
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import AppleStrategy from 'passport-apple';

import bcrypt from 'bcrypt';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * LOCAL STRATEGY (email + password)
 * - Używamy jej do logowania istniejących użytkowników przez e-mail i hasło.
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',    // z req.body.email
      passwordField: 'password', // z req.body.password
      session: false,            // bo zakładamy JWT, a nie sesje
    },
    async (email: string, password: string, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        if(user.password === null) {
          return done(null, false, { message: 'User not found' });
        }
        // Sprawdzenie poprawności hasła
        const isPasswordValid = bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        // Jeśli OK, zwracamy usera
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

/**
 * GOOGLE STRATEGY (OAuth 2.0)
 * - clientID, clientSecret: pobierz z Google Cloud Console
 * - callbackURL: adres, pod który Google przekieruje użytkownika po zalogowaniu
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'GOOGLE_CLIENT_ID',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'GOOGLE_CLIENT_SECRET',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value || '';

        // Sprawdź, czy mamy usera w bazie z danym googleId
        let user = await prisma.user.findUnique({ where: { googleId } });
        if (!user) {
          // Można też sprawdzić, czy user istnieje po email, ale to zależy od Twojej logiki.
          user = await prisma.user.create({
            data: {
              googleId,
              email,
              name: profile.displayName || 'Unknown Google User',
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

/**
 * FACEBOOK STRATEGY
 * - clientID, clientSecret: pobierz z Facebook for Developers
 * - callbackURL: adres, pod który Facebook przekieruje użytkownika
 */
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID || 'FACEBOOK_CLIENT_ID',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || 'FACEBOOK_CLIENT_SECRET',
      callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3000/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const facebookId = profile.id;
        const email = profile.emails?.[0]?.value || '';

        let user = await prisma.user.findUnique({ where: { facebookId } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              facebookId,
              email,
              name: `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim(),
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

/**
 * APPLE STRATEGY -- commented out because of the lack of the Apple Developer account
 * - clientID: Twój Services ID (np. com.example.myapp) lub App ID
 * - teamID: 10-znakowy Team ID z Apple Developer
 * - keyID: ID klucza prywatnego (w Apple Developer > Keys)
 * - privateKey: treść klucza prywatnego w formacie PEM
 * - callbackURL: adres, pod który Apple przekierowuje usera
 */
// passport.use(
//   new AppleStrategy(
//     {
//       clientID: process.env.APPLE_CLIENT_ID || 'APPLE_CLIENT_ID',
//       teamID: process.env.APPLE_TEAM_ID || 'APPLE_TEAM_ID',
//       keyID: process.env.APPLE_KEY_ID || 'APPLE_KEY_ID',
//       privateKey: process.env.APPLE_PRIVATE_KEY || `-----BEGIN PRIVATE KEY-----
// MI...
// -----END PRIVATE KEY-----`,
//       callbackURL: process.env.APPLE_CALLBACK_URL || 'http://localhost:3000/auth/apple/callback',
//       scope: ['name', 'email'],
//     },
//     async (accessToken, refreshToken, idToken, profile, done) => {
//       try {
//         const appleId = profile.id;
//         const email = profile.email || '';

//         // Szukasz usera w bazie po appleId (upewnij się, że jest pole appleId w Prisma)
//         let user = await prisma.user.findUnique({ where: { appleId } });
//         if (!user) {
//           user = await prisma.user.create({
//             data: {
//               appleId, 
//               email,
//               name: profile.name || 'Apple User',
//             },
//           });
//         }

//         return done(null, user);
//       } catch (error) {
//         return done(error);
//       }
//     }
//   )
// );

// /**
//  * (Opcjonalnie) Jeśli używasz sesji, włącz serialize/deserialize
//  * - Przy JWT zwykle nie jest potrzebne
//  */
// passport.serializeUser((user: User, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id: string, done) => {
//   try {
//     const user = await prisma.user.findUnique({ where: { id } });
//     done(null, user);
//   } catch (error) {
//     done(error);
//   }
// });

export default passport;
