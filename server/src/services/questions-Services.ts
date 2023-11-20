// questions-Services.ts
//
// Author: Valentin Stoyanov
// Last updated: 20/11/2023 

import pool from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Question = {
  questionId: number;
  userId: number;
  title: string;
  content: string;
  createdAt: Date;
  modifiedAt: Date;
  viewCount: number;
};

class QuestionService {

  
  /**
   * Get question with given id.
   */
  get(id: number) {
    return new Promise<Question>((resolve, reject) => {
      pool.query(
        'SELECT * FROM Questions WHERE questionId = ?',
        [id],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);
          
          resolve(results[0] as Question);
        },
      );
    });
  }

  /**
   * Gets all questions
   */
  getAll() {
    return new Promise<Question[]>((resolve, reject) => {
      pool.query ('SELECT * FROM Questions' , (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as Question[])
      })
    })
  }

  /**
   * Create a new question.
   */
  create(title: string, content: string, userId: number)  {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        'INSERT INTO Questions (title, content, userId) VALUES (?, ?, ?)',
        [title, content, userId],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          resolve(results.insertId);
        },
      );
    });
  }

  /**
   * Update an existing question.
   */
  update(id: number, title: string, content: string) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'UPDATE Questions SET title = ?, content = ? WHERE questionId = ?',
        [title, content, id],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          if (results.affectedRows === 0) {
            return reject(new Error('No question was updated.'));
          }
          resolve();
        },
      );
    });
  }

  /**
   * Delete a question.
   */
  delete(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'DELETE FROM Questions WHERE questionId = ?',
        [id],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          if (results.affectedRows === 0) {
            return reject(new Error('No question was deleted.'));
          }
          resolve();
        },
      );
    });
  }

  /**
   * Updates the viewCount of a question
   */
  updateViewCount(questionId: number) {
    return new Promise<void>((resolve,reject) => {
      pool.query(
        'UPDATE Questions SET viewCount = viewCount + 1 WHERE questionId = ?',
        [questionId],
        (error,results: ResultSetHeader) => {
          if (error) return reject(error);
          if(results.affectedRows === 0) {
            return reject(new Error('No question view count was updated.'));
          }
          resolve()
        }
      )
    })
  }
}

const questionService = new QuestionService();
export default questionService;
