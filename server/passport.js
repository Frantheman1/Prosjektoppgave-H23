import { use, serializeUser, deserializeUser } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { compareSync } from 'bcrypt';
import { findOne, findById } from './models/user'; // Importer din brukermodell

use(new LocalStrategy(
  (username, password, done) => {
    findOne({ username: username }, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Feil brukernavn' });
      if (!compareSync(password, user.password)) {
        return done(null, false, { message: 'Feil passord' });
      }
      return done(null, user);
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