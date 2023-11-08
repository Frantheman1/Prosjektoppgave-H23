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
        'SELECT * FROM Questions WHERE QuestionID = ?',
        [id],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);
          
          resolve(results[0] as Question);
        },
      );
    });
  }

  /**
   * Create a new question.
   */
  create(title: string, content: string, userId: number)  {
    return new Promise<number>((resolve, reject) => {
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
  update(id: number, title: string, content: string) {
    return new Promise<void>((resolve, reject) => {
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
   * 
   * 
   */
  searchByText(searchTerm: string) {
    return new Promise<Array<Question & { matchIn?: 'title' | 'content' }>>((resolve, reject) => {
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
            resolve(results as Array<Question & { matchIn?: 'title' | 'content' }>);
            /**Example code results
             *  [
                  {
                    "id": 1,
                    "title": "Hvordan lage et søkefunksjon?",
                    "content": "Jeg lurer på det grunnleggende om å lage en søkefunksjon for en database.",
                    "createdAt": "2023-01-01T00:00:00.000Z",
                    "updatedAt": "2023-01-02T00:00:00.000Z",
                    "matchIn": "title"
                  },
                  {
                    "id": 2,
                    "title": "Spørsmål om database ytelse",
                    "content": "Er det noen som kan forklare hvordan man optimaliserer søk i store datamengder?",
                    "createdAt": "2023-01-05T00:00:00.000Z",
                    "updatedAt": "2023-01-06T00:00:00.000Z",
                    "matchIn": "content"
                  }
                ]
             */
          }
        },
      );
    });
  }

  /**
   * Get a list of questions sorted by a specified criterion.
   */
  getQuestionsSorted(sortBy: 'views' | 'answers' | 'date') {
    // Chooses one of the cases based on input
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
        Questions.*
        COUNT(Answers.AnswerID) AS AnswerCount
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

  getUnansweredQuestions() {
    return new Promise<Question[]>((resolve, reject) => {
      pool.query(
        `SELECT *
        FROM Questions
        WHERE NOT EXISTS (
          SELECT 1 FROM Answers WHERE Answers.QuestionID = Questions.QuestionID
        )`,
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);
          resolve(results as Question[]);
        },
      );
    });
  }
}

const questionService = new QuestionService();
export default questionService;
