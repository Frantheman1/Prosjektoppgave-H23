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
        }
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
        }
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
        }
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
        }
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
     }
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
     }
   );
 });
}
}

const answerService = new AnswerService();
export default answerService;