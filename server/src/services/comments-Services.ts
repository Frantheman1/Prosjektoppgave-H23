// CommentService.ts
import pool from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Comment = {
  commentId: number;
  userId: number;
  questionId?: number;
  answerId?: number;
  content: string;
  createdAt: Date;
  modifiedAt: Date;
};

class CommentService {
  /**
   * Get comments by question ID.
   */
  getCommentsByQuestion(questionId: number): Promise<Comment[]> {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT * FROM Comments WHERE QuestionID = ? ORDER BY CreatedAt',
        [questionId],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);
          resolve(results as Comment[]);
        },
      );
    });
  }

  /**
   * Get comments by answer ID.
   */
  getCommentsByAnswer(answerId: number): Promise<Comment[]> {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT * FROM Comments WHERE AnswerID = ? ORDER BY CreatedAt',
        [answerId],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);
          resolve(results as Comment[]);
        },
      );
    });
  }

  /**
   * Add a new comment to a question or answer.
   */
  addComment(userId: number, questionId: number | null, answerId: number | null, content: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const fields = questionId ? 'UserID, QuestionID, Content' : 'UserID, AnswerID, Content';
      const values = questionId ? [userId, questionId, content] : [userId, answerId, content];
      pool.query(
        `INSERT INTO Comments (${fields}) VALUES (?, ?, ?)`,
        values,
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          resolve(results.insertId);
        },
      );
    });
  }

  /**
   * Update an existing comment.
   */
  updateComment(commentId: number, content: string): Promise<void> {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE Comments SET Content = ?, ModifiedAt = NOW() WHERE CommentID = ?',
        [content, commentId],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          if (results.affectedRows === 0) return reject(new Error('No comment was updated.'));
          resolve();
        },
      );
    });
  }

  /**
   * Delete a comment.
   */
  deleteComment(commentId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      pool.query(
        'DELETE FROM Comments WHERE CommentID = ?',
        [commentId],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          if (results.affectedRows === 0) return reject(new Error('No comment was deleted.'));
          resolve();
        },
      );
    });
  }
}

export default new CommentService();