import pool from '../mysql-pool'; // Or wherever your connection pool is exported from
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Answer = {
  answerId: number;
  questionId: number;
  userId: number;
  content: string;
  isAccepted: boolean;
  createdAt: Date;
  modifiedAt: Date;
  score: number;
};

class AnswerService {
  /**
   * Get all answers for a given question.
   */
  getAnswersForQuestion(questionId: number): Promise<Answer[]> {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT * FROM Answers WHERE QuestionID = ?',
        [questionId],
        (error, results: RowDataPacket[]) => {
          if (error) reject(error);
          else resolve(results as Answer[]);
        },
      );
    });
  }

  /**
   * Add a new answer to a question.
   */
  addAnswer(questionId: number, userId: number, content: string): Promise<number> {
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO Answers (QuestionID, UserID, Content) VALUES (?, ?, ?)',
        [questionId, userId, content],
        (error, results: ResultSetHeader) => {
          if (error) reject(error);
          else resolve(results.insertId); // Return the ID of the newly added answer
        },
      );
    });
  }

  /**
   * Update an existing answer.
   */
  updateAnswer(answerId: number, content: string): Promise<void> {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE Answers SET Content = ? WHERE AnswerID = ?',
        [content, answerId],
        (error, results: ResultSetHeader) => {
          if (error) reject(error);
          else if (results.affectedRows === 0) reject(new Error('No answer was updated.'));
          else resolve();
        },
      );
    });
  }

  /**
   * Delete an answer.
   */
  deleteAnswer(answerId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      pool.query(
        'DELETE FROM Answers WHERE AnswerID = ?',
        [answerId],
        (error, results: ResultSetHeader) => {
          if (error) reject(error);
          else if (results.affectedRows === 0) reject(new Error('No answer was deleted.'));
          else resolve();
        },
      );
    });
  }

  /**
   * Toggles the accepted state of an answer.
   */
  markAnswerAsAccepted(answerId: number, isAccepted: number): Promise<void> {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE Answers SET IsAccepted = ? WHERE AnswerID = ?',
        [isAccepted, answerId],
        (error, results: ResultSetHeader) => {
          if (error) {
            return reject(error);
          }
          if (results.affectedRows === 0) {
            return reject(new Error('No answer was marked as accepted.'));
          }
          resolve();
        },
      );
    });
  }

  getFavoritesByUser(userId: number): Promise<Answer[]> {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT Answers.* FROM Answers JOIN FavoriteAnswers ON Answers.AnswerID = FavoriteAnswers.AnswerID WHERE FavoriteAnswers.UserID = ?',
        [userId],
        (error, results: RowDataPacket[]) => {
          if (error) {
            return reject(error);
          }
          resolve(results as Answer[]);
        },
      );
    });
  }

  /**
   * Get a list of answers for a given question sorted by a specified criterion.
   */
  getAnswersSorted(questionId: number, sortBy: 'score' | 'modified'): Promise<Answer[]> {
    let orderBy: string;
    switch (sortBy) {
      case 'score':
        orderBy = 'Answers.Score DESC, Answers.CreatedAt DESC';
        break;
      case 'modified':
        orderBy = 'Answers.ModifiedAt DESC, Answers.Score DESC';
        break;
      default:
        orderBy = 'Answers.CreatedAt DESC'; // Default sorting order, if needed
    }

    return new Promise<Answer[]>((resolve, reject) => {
      pool.query(
        `SELECT 
        Answers.*
      FROM 
        Answers
      WHERE 
        Answers.QuestionID = ?
      ORDER BY 
        ${orderBy}`,
        [questionId],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);
          resolve(results as Answer[]);
        },
      );
    });
  }

  updateAnswerScore(answerId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `
      UPDATE Answers a
      SET a.Score = GREATEST(0, (
        SELECT SUM(CASE WHEN v.VoteType = 1 THEN 1 ELSE -1 END) FROM Votes v WHERE v.AnswerID = a.AnswerID
      ))
      WHERE a.AnswerID = ?
    `;
      pool.query(query, [answerId], (error, results: ResultSetHeader) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }
}

const answerService = new AnswerService();
export default answerService;
