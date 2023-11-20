import commentService, { Comment } from '../src/services/comments-Services';
import pool from '../src/mysql-pool';

jest.mock('../src/mysql-pool', () => ({
  query: jest.fn(),
}));

describe('CommentService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches comments by question ID', async () => {
    const questionId = 1;
    const mockedComments: Comment[] = [
      { commentId: 1, userId: 1, questionId: 1, content: 'Comment 1', createdAt: new Date(), modifiedAt: new Date() },
      // Add more mocked comments as needed
    ];

    // Mocking the response for getCommentsByQuestion query
    const mockGetCommentsByQuestionQuery = jest.fn((query, params, callback) => {
      // Simulate successful query execution
      callback(null, mockedComments);
    });

    // Mock pool.query to resolve with mockedComments
    (pool.query as jest.Mock).mockImplementation(mockGetCommentsByQuestionQuery);

    // Call the getCommentsByQuestion method from the service
    const comments = await commentService.getCommentsByQuestion(questionId);

    // Verify the service method behavior
    expect(pool.query).toHaveBeenCalled();
    expect(comments).toEqual(mockedComments);

    // Verify the correct SQL query was executed
    expect(mockGetCommentsByQuestionQuery.mock.calls[0][0]).toBe('SELECT * FROM Comments WHERE QuestionID = ? ORDER BY CreatedAt');
    expect(mockGetCommentsByQuestionQuery.mock.calls[0][1]).toEqual([questionId]);
  });

  it('adds a new comment to a question or answer', async () => {
    const userId = 1;
    const questionId = 1;
    const content = 'New comment content';
    const mockedInsertedId = 123;

    // Mocking the response for addComment query
    const mockAddCommentQuery = jest.fn((query, params, callback) => {
      // Simulate successful insertion
      callback(null, { insertId: mockedInsertedId });
    });

    // Mock pool.query to resolve with successful insertion
    (pool.query as jest.Mock).mockImplementation(mockAddCommentQuery);

    // Call the addComment method from the service
    const insertedId = await commentService.addComment(userId, questionId, null, content);

    // Verify the service method behavior
    expect(pool.query).toHaveBeenCalled();
    expect(insertedId).toEqual(mockedInsertedId);

    // Verify the correct SQL query was executed
    expect(mockAddCommentQuery.mock.calls[0][0]).toBe('INSERT INTO Comments (UserID, QuestionID, Content) VALUES (?, ?, ?)');
    expect(mockAddCommentQuery.mock.calls[0][1]).toEqual([userId, questionId, content]);
  });
});
