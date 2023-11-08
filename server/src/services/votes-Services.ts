import pool from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

class VoteService {
  /**
   * Cast a vote on an answer.
   */
  vote(answerId: number, userId: number, voteType: boolean) {
    const voteValue = voteType ? 1 : 0;
    return new Promise<void>((resolve, reject) => {
      // Check if the user has already voted on this answer
      pool.query(
        'SELECT VoteID FROM Votes WHERE AnswerID = ? AND UserID = ?',
        [answerId, userId],
        (error, results: RowDataPacket[]) => {
          if (error) {
            return reject(error);
          }
          if (results.length > 0) {
            const voteId = results[0].VoteID;
            pool.query(
              'UPDATE Votes SET VoteType = ? WHERE VoteID = ?',
              [voteValue, voteId],
              (error, updateResults: ResultSetHeader) => {
                if (error) return reject(error);
                if (updateResults.affectedRows === 0) {
                  return reject(new Error('Vote could not be updated.'));
                }
                resolve();
              },
            );
          } else {
            // If not, insert a new vote
            pool.query(
              'INSERT INTO Votes (AnswerID, UserID, VoteType) VALUES (?, ?, ?)',
              [answerId, userId, voteValue],
              (error, insertResults: ResultSetHeader) => {
                if (error) return reject(error);
                resolve();
              },
            );
          }
        },
      );
    });
  }
}

const voteServices = new VoteService();
export default voteServices;