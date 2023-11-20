// favoriteRouters.ts
//
// Author: Valentin Stoyanov
// Last updated: 20/11/2023 


import express from 'express';
import favoriteService from '../services/favorites-Services';

const routerFavorites = express.Router();

// Get all favorite answers for a given user
routerFavorites.get('/favorites/:userId', (request, response) => {
 const userId = Number(request.params.userId);

 favoriteService.getFavorites(userId)
   .then(favorites => favorites.length ? response.send(favorites) : response.status(404).send('No favorites found for this user'))
   .catch(error => response.status(500).send(error));
});

// Add a favorite answer for a user
routerFavorites.post('/favorites', (request, response) => {
 const { userId, answerId } = request.body;
 if (userId && answerId) {
   favoriteService.addFavorite(userId, answerId)
     .then(() => response.send('Favorite added successfully'))
     .catch(error => response.status(500).send(error.message));
 } else {
   response.status(400).send('Missing required fields: userId or answerId');
 }
});

// Remove a favorite answer for a user
routerFavorites.delete('/favorites', (request, response) => {
 const { userId, answerId } = request.body;
 if (userId && answerId) {
   favoriteService.removeFavorite(userId, answerId)
     .then(() => response.send('Favorite removed successfully'))
     .catch(error => response.status(500).send(error.message));
 } else {
   response.status(400).send('Missing required fields: userId or answerId');
 }
});



export default routerFavorites;