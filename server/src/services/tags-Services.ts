import pool from "../mysql-pool";
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Tag = {
  tagId: number;
  name: string;
};

class TagService {
  /**
   * Get all tags.
   */
  getAllTags(): Promise<Tag[]> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM Tags', (error, results: RowDataPacket[]) => {
        if (error) return reject(error);
        resolve(results as Tag[]);
      });
    });
  }

  /**
   * Get tags for a specific question.
   */
  getTagsForQuestion(questionId: number): Promise<Tag[]> {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT Tags.* FROM Tags JOIN Question_Tags ON Tags.tagId = Question_Tags.TagID WHERE Question_Tags.QuestionID = ?',
        [questionId],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);
          resolve(results as Tag[]);
        }
      );
    });
  }

  /**
   * Add a tag to a question.
   */
  addTagToQuestion(tagId: number, questionId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO Question_Tags (QuestionID, TagID) VALUES (?, ?)',
        [questionId, tagId],
        (error, results) => {
          if (error) return reject(error);
          resolve();
        }
      );
    });
  }

}

export default new TagService();