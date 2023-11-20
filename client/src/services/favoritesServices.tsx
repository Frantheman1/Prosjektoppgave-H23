// favoritesServices.ts
//
// Author: Valentin Stoyanov
// Last updated: 20/11/2023 

import axios from 'axios';
import { Answer } from './answersServices';

axios.defaults.baseURL = 'http://localhost:3000/api/v1';


class FavoriteService {
 /**
  * Get all favorite answers for a given user.
  */
 getFavorites(userId: number) {
   return axios.get<Answer[]>(`/favorites/${userId}`).then(response => response.data);
 }

 /**
  * Add a favorite answer for a user.
  */
 addFavorite(userId: number, answerId: number) {
   return axios
     .post<void>('/favorites', { userId, answerId })
     .then(response => response.data);
 }

 /**
  * Remove a favorite answer for a user.
  */
 removeFavorite(userId: number, answerId: number) {
   return axios
     .delete<void>('/favorites', { data: { userId, answerId } }) // Axios DELETE with body requires using 'data' field
     .then(response => response.data);
 }
}
const favoriteService = new FavoriteService();
export default favoriteService;