// comments-Services.ts
//
// Author: Valentin Stoyanov
// Co-author: Kine Alte Weiseth
// Last updated: 20/11/2023 

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
   * Get all comments
   */
  getComments(){
    return new Promise<Comment[]>((resolve, reject) =>
    {
      pool.query(
        'SELECT * FROM Comments',
        (error, results: RowDataPacket[]) => {
          if (error) reject(error);
          else resolve(results as Comment[]);
        }
      )
    })
  }

  /**
   * Get a comment
   */
  getComment(commentId: number) {
    return new Promise<Comment>((resolve,reject) =>
    {
      pool.query(
        'SELECT * FROM Comments WHERE commentId = ?',
        [commentId],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);
          
          resolve(results[0] as Comment);
        },
      )
    })
  }
 
  /**
   * Add a new comment to a question or answer.
   */
  addComment(
    userId: number,
    questionId: number | null,
    answerId: number | null,
    content: string,
  )  {
    return new Promise<number>((resolve, reject) => {
      // Chooses between answerId of questionId
      const fields = questionId ? 'userId, questionId, content' : 'userId, answerId, content';
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
        'UPDATE Comments SET content = ?, modifiedAt = NOW() WHERE commentId = ?',
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
        'DELETE FROM Comments WHERE commentId = ?'
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

const commentService = new CommentService();
export default commentService;