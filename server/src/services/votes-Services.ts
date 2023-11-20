// questions-Services.ts
//
// Author: Valentin Stoyanov
// Last updated: 20/11/2023 

import pool from '../mysql-pool';
import type { ResultSetHeader } from 'mysql2';

class VoteService {
  /**
   * Cast a vote on an answer by updating score.
   */
  voteOnAnswer(answerId: number, userId: number, voteType: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'INSERT INTO Votes (userId, answerId, voteType) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE voteType = VALUES(voteType)',//ON DUPLICATE KEY UPDATE handles duplicates
        [userId, answerId, voteType],
        (error) => {
          if (error) {
            return reject(error);
          }
          /**
           * Updates the answer score
           */
          pool.query(
            'UPDATE Answers SET score = (SELECT SUM(CASE WHEN voteType = 1 THEN 1 ELSE -1 END) FROM Votes WHERE answerId = ?) WHERE answerId = ?',
            [answerId, answerId],
            (error, results: ResultSetHeader) => {
              if (error) {
                return reject(error);
              }
              if (results.affectedRows === 0) {
                return reject(new Error('No answer score was updated.'));
              }
              resolve();
            }
          );
        }
      );
    });
  }
}

const voteServices = new VoteService();
export default voteServices;
