import express from 'express';
import passport from 'passport';
import userService from '../services/users-Services';


const authRouter = express.Router();

// Register route
authRouter.post('/register', (req, res) => {
  const { username, password } = req.body;
  userService.registerUser(username, password)
    .then(userId => res.status(201).json({ id: userId }))
    .catch(error => res.status(500).send(error.message));
});

// Login route
authRouter.post('/login', passport.authenticate('local'), (req, res) => {
  // handle successful authentication
  res.json({ message: 'Logged in successfully' });
});

// Logout route
//authRouter.get('/logout', (req, res) => {
//  req.logout();
//  res.json({ message: 'Logged out successfully' });
//});



export default authRouter;