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
   * Retrieves all questions. Used to populate question lists where no filtering based on tags, 
   * popularity, or search criteria is needed.
   */

  getAll(id: number) {
    return new Promise<Question[]>((resolve, reject) => {
      pool.query(
        'SELECT * FROM Questions',
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results as Question[]);
        },
      );
    });
  }

  /**
   * Get question with given id.
   */

  get(id: number) {
    return new Promise<Question | undefined>((resolve, reject) => {
      pool.query(
        'SELECT * FROM Questions WHERE QuestionID = ?',
        [id],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);
          // Since an ID should be unique, we expect 0 or 1 result.
          // Therefore, results[0] will either be the Question or undefined.
          resolve(results[0] as Question | undefined);
        },
      );
    });
  }

  /**
   * Create a new question.
   */
  create(title: string, content: string, userId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO Questions (Title, Content, UserID) VALUES (?, ?, ?)',
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
  update(id: number, title: string, content: string): Promise<void> {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE Questions SET Title = ?, Content = ? WHERE QuestionID = ?',
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
        'DELETE FROM Questions WHERE QuestionID = ?',
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
   * Search for questions by text.
   */
  searchByText(
    searchTerm: string,
  ): Promise<Array<Question & { matchIn?: 'title' | 'content' }>> {
    return new Promise((resolve, reject) => {
      const searchQuery = `%${searchTerm}%`;

      pool.query(
        `SELECT Questions.*, 
        CASE 
          WHEN Title LIKE ? THEN 'title'
          WHEN Content LIKE ? THEN 'content'
        END AS matchIn 
      FROM Questions 
      WHERE Title LIKE ? OR Content LIKE ?`,
        [searchQuery, searchQuery, searchQuery, searchQuery],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          // If the array is empty, no matches were found
          if (results.length === 0) {
            // Handle no matches found
            resolve([]);
          } else {
            // Otherwise, resolve with the matched questions
            resolve(
              results as Array<Question & { matchIn?: 'title' | 'content' }>,
            );
          }
        },
      );
    });
  }

  /**
   * Get a list of questions sorted by a specified criterion.
   */
  getQuestionsSorted(
    sortBy: 'views' | 'answers' | 'date',
  ) {
    let orderBy: string;
    switch (sortBy) {
      case 'views':
        orderBy = 'Questions.ViewCount DESC, AnswerCount DESC';
        break;
      case 'answers':
        orderBy = 'AnswerCount DESC, Questions.ViewCount DESC';
        break;
      case 'date':
        orderBy = 'Questions.CreatedAt DESC, Questions.ViewCount DESC';
        break;
      //can add more sorting orders here
      default:
        orderBy = 'Questions.CreatedAt DESC'; // default sorting order
    }

    return new Promise<Question[]>((resolve, reject) => {
      pool.query(
        `SELECT 
        Questions.QuestionID,
        Questions.Title,
        Questions.Content,
        Questions.ViewCount,
        COUNT(Answers.AnswerID) AS AnswerCount,
        Questions.CreatedAt,
        Questions.ModifiedAt
      FROM 
        Questions
      LEFT JOIN 
        Answers ON Questions.QuestionID = Answers.QuestionID
      GROUP BY 
        Questions.QuestionID
      ORDER BY 
        ${orderBy}`,
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);
          resolve(results as Question[]);
        },
      );
    });
  }

  getUnansweredQuestions(): Promise<Question[]> {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT *
        FROM Questions
        WHERE NOT EXISTS (
          SELECT 1 FROM Answers WHERE Answers.QuestionID = Questions.QuestionID
        )`,
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);
          resolve(results as Question[]);
        }
      );
    });
  }
}

const questionService = new QuestionService();
export default questionService;
