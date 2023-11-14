import pool from '../mysql-pool';
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
  addTagToQuestion(tagId: number, questionId: number): Promise<void> {
    return new Promise((resolve, reject) => {
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

  /**
   * Get a list of all unique tags, including the count of questions for each tag.
   * The list can be optionally filtered by tag name and/or sorted by popularity (i.e., question count).
   */
  getTags(filterByName: string = '', sortByPopularity: boolean = false) {
    const queryParams = filterByName ? [`%${filterByName}%`] : [];
    const whereClause = filterByName ? 'WHERE t.Name LIKE ?' : '';
    const orderByClause = sortByPopularity ? 'ORDER BY questionCount DESC' : 'ORDER BY t.Name';

    return new Promise<Array<Tag & { questionCount: number }>>((resolve, reject) => {
      pool.query(
        `SELECT t.tagId, t.Name, COUNT(qt.questionId) AS questionCount
        FROM Tags t
        LEFT JOIN Question_Tags qt ON t.tagId = qt.tagId
        ${whereClause}
        GROUP BY t.tagId
        ${orderByClause}
        `,
        queryParams,
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);
          resolve(results as Array<Tag & { questionCount: number }>);
        },
      );
    });
  }
}

const tagService = new TagService();
export default tagService;
