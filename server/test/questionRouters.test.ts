import QuestionService, { Question } from '../src/services/questions-Services'; 
import pool from '../src/mysql-pool';

jest.mock('../src/mysql-pool', () => ({
  query: jest.fn(),
}));

const mockQuery = pool.query as jest.Mock;

describe('QuestionService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new question', async () => {
      const mockTitle = 'Mock Title';
      const mockContent = 'Mock Content';
      const mockUserId = 123;

      const mockInsertId = 1; // Mocking the insert ID returned from the database

      mockQuery.mockImplementationOnce((_query, _params, callback) => {
        callback(null, { insertId: mockInsertId });
      });

      const newQuestionId = await QuestionService.create(mockTitle, mockContent, mockUserId);

      expect(newQuestionId).toEqual(mockInsertId);
      expect(mockQuery).toHaveBeenCalledWith(
        'INSERT INTO Questions (Title, Content, UserID) VALUES (?, ?, ?)',
        [mockTitle, mockContent, mockUserId],
        expect.any(Function)
      );
    });

    it('should handle error during question creation', async () => {
      const mockTitle = 'Mock Title';
      const mockContent = 'Mock Content';
      const mockUserId = 123;

      const mockError = new Error('Database error');

      mockQuery.mockImplementationOnce((_query, _params, callback) => {
        callback(mockError, null);
      });

      await expect(QuestionService.create(mockTitle, mockContent, mockUserId)).rejects.toThrow(
        mockError
      );

      expect(mockQuery).toHaveBeenCalledWith(
        'INSERT INTO Questions (Title, Content, UserID) VALUES (?, ?, ?)',
        [mockTitle, mockContent, mockUserId],
        expect.any(Function)
      );
    });
  });

  describe('update', () => {
    it('should update an existing question', async () => {
      const mockId = 1;
      const mockTitle = 'Updated Title';
      const mockContent = 'Updated Content';

      const mockAffectedRows = 1; // Mocking the affected rows from the update operation

      mockQuery.mockImplementationOnce((_query, _params, callback) => {
        callback(null, { affectedRows: mockAffectedRows });
      });

      await QuestionService.update(mockId, mockTitle, mockContent);

      expect(mockQuery).toHaveBeenCalledWith(
        'UPDATE Questions SET Title = ?, Content = ? WHERE QuestionID = ?',
        [mockTitle, mockContent, mockId],
        expect.any(Function)
      );
    });

    it('should handle error during question update', async () => {
      const mockId = 1;
      const mockTitle = 'Updated Title';
      const mockContent = 'Updated Content';

      const mockError = new Error('Database error');

      mockQuery.mockImplementationOnce((_query, _params, callback) => {
        callback(mockError, null);
      });

      await expect(QuestionService.update(mockId, mockTitle, mockContent)).rejects.toThrow(
        mockError
      );

      expect(mockQuery).toHaveBeenCalledWith(
        'UPDATE Questions SET Title = ?, Content = ? WHERE QuestionID = ?',
        [mockTitle, mockContent, mockId],
        expect.any(Function)
      );
    });
  });

  describe('delete', () => {
    it('should delete an existing question', async () => {
      const mockId = 1;

      const mockAffectedRows = 1; // Mocking the affected rows from the delete operation

      mockQuery.mockImplementationOnce((_query, _params, callback) => {
        callback(null, { affectedRows: mockAffectedRows });
      });

      await QuestionService.delete(mockId);

      expect(mockQuery).toHaveBeenCalledWith(
        'DELETE FROM Questions WHERE QuestionID = ?',
        [mockId],
        expect.any(Function)
      );
    });

    it('should handle error during question deletion', async () => {
      const mockId = 1;

      const mockError = new Error('Database error');

      mockQuery.mockImplementationOnce((_query, _params, callback) => {
        callback(mockError, null);
      });

      await expect(QuestionService.delete(mockId)).rejects.toThrow(mockError);

      expect(mockQuery).toHaveBeenCalledWith(
        'DELETE FROM Questions WHERE QuestionID = ?',
        [mockId],
        expect.any(Function)
      );
    });
  });

});
