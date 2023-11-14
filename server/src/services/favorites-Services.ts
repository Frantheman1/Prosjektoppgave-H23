import pool from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

class FavoriteService {
  /**
   * Legg til et svar som favoritt for en gitt bruker.
   */
  addFavorite(userId: number, answerId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO FavoriteAnswers (userId, answerId) VALUES (?, ?)',
        [userId, answerId],
        (error, results: ResultSetHeader) => {
          if (error) {
            // Håndterer duplikat nøkkel-feil, som betyr at favoritten allerede eksisterer
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
   * Fjern et svar fra favorittlisten til en gitt bruker.
   */
  removeFavorite(userId: number, answerId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      pool.query(
        'DELETE FROM FavoriteAnswers WHERE userId = ? AND answerId = ?',
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
