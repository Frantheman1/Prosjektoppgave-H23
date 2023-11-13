import express from 'express';
import { initialize, session as _session, use, serializeUser, deserializeUser } from 'passport';
import session from 'express-session';
import { Strategy as LocalStrategy } from 'passport-local';
import { compare } from 'bcrypt';
import { findOne, findById } from './models/user'; // User model

const app = express();

// Configure express-session
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));

// Initialize Passport
app.use(initialize());
app.use(_session());

// Configure LocalStrategy for Passport
use(new LocalStrategy(
  (username, password, done) => {
    findOne({ username: username }, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Incorrect username' });

      // Compare the provided password with the stored hashed password
      compare(password, user.passwordHash, (compareErr, isMatch) => {
        if (compareErr) return done(compareErr);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
      });
    });
  }
));

serializeUser((user, done) => {
  done(null, user.id);
});

deserializeUser((id, done) => {
  findById(id, (err, user) => {
    done(err, user);
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});