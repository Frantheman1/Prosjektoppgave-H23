// tags-Services.ts
//
// Author: Valentin Stoyanov
// Last updated: 20/11/2023 

import pool from '../mysql-pool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Tag = {
  tagId: number;
  name: string;
};

class TagService {
   /**
   * Get tags for a specific question.
   */
  getTagsForQuestion(questionId: number) {
    return new Promise<Tag[]>((resolve, reject) => {
      pool.query(
        'SELECT T.* FROM Tags T JOIN Question_Tags Q ON T.tagId = Q.tagId WHERE Q.questionId = ?',
        [questionId],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);
          resolve(results as Tag[]);
        },
      );
    });
  }

  /**
   * Add a tag to a question.
   */
  addTagToQuestion(tagId: number, questionId: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'INSERT INTO Question_Tags (questionId, tagId) VALUES (?, ?)',
        [questionId, tagId],
        (error, results) => {
          if (error) return reject(error);
          resolve();
        },
      );
    });
  }

  createTag(name: string) {
    return new Promise<number>((resolve,reject) => {
      pool.query(
        'INSERT INTO Tags (name) VALUES (?)',
        [name],
        (error,results: ResultSetHeader) => {
          if (error) return reject(error);
          resolve(results.insertId)
        }
      )
    })
  }


  getAllTagsWithQuestionCount() {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT Tags.name, COUNT(Question_Tags.questionId) as questionCount ' +
        'FROM Tags ' +
        'LEFT JOIN Question_Tags ON Tags.tagId = Question_Tags.tagId ' +
        'GROUP BY Tags.name',
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });
  }
}

const tagService = new TagService();
export default tagService;
