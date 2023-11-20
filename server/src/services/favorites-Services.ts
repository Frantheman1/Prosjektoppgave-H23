// favorites-Services.ts
//
// Author: Valentin Stoyanov
// Last updated: 20/11/2023 

import pool from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Answer } from './answers-Services';


export type Favorite = {
  favoriteId: number;
  answerId: number;
  userId: number;
}

class FavoriteService {
  /**
   * Get all favorite answers for a given user.
   */
  getFavorites(userId: number) {
    return new Promise<Answer[]>((resolve, reject) => {
      pool.query(
        'SELECT a.* FROM Answers a JOIN Favorites f ON a.answerId = f.answerId WHERE f.userId = ?', 
        [userId], (error, results: RowDataPacket[]) => {
        if (error) {
          return reject(error);
        }
        resolve(results as Answer[]);
      });
    });
  }

  /**
   * Add a new answer to the Favorites
   */
  addFavorite(userId: number, answerId: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'INSERT INTO Favorites (userId, answerId) VALUES (?, ?)',
        [userId, answerId],
        (error, results: ResultSetHeader) => {
          if (error) {
            // Handles duplicates
            if (error.code === 'ER_DUP_ENTRY') {
              return reject(new Error('Answer is already marked as favorite.'));
            }
            return reject(error);
          }
          resolve();
        },
      );
    });
  }

  /**
   * Removes the a answer from the favorite
   */
  removeFavorite(userId: number, answerId: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'DELETE FROM Favorites WHERE userId = ? AND answerId = ?',
        [userId, answerId],
        (error, results: ResultSetHeader) => {
          if (error) {
            return reject(error);
          }
          if (results.affectedRows === 0) {
            return reject(new Error('No favorite answer was removed.'));
          }
          resolve();
        },
      );
    });
  }
}

const favoriteService = new FavoriteService();
export default favoriteService;
