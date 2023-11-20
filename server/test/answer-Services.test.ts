import answerService, { Answer } from '../src/services/answers-Services';
import pool from '../src/mysql-pool';

jest.mock('../src/mysql-pool', () => ({
  query: jest.fn(),
}));

describe('AnswerService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches answers for a given question', async () => {
    const questionId = 1;
    const mockedAnswers: Answer[] = [
      { answerId: 1, questionId: 1, userId: 1, content: 'Answer 1', isAccepted: false, createdAt: new Date(), modifiedAt: new Date(), score: 0 },
      // Add more mocked answers as needed
    ];

    // Mocking the response for getAnswersForQuestion query
    const mockGetAnswersForQuestionQuery = jest.fn((query, params, callback) => {
      // Simulate successful query execution
      callback(null, mockedAnswers);
    });

    // Mock pool.query to resolve with mockedAnswers
    (pool.query as jest.Mock).mockImplementation(mockGetAnswersForQuestionQuery);

    // Call the getAnswersForQuestion method from the service
    const answers = await answerService.getAnswersForQuestion(questionId);

    // Verify the service method behavior
    expect(pool.query).toHaveBeenCalled();
    expect(answers).toEqual(mockedAnswers);

    // Verify the correct SQL query was executed
    expect(mockGetAnswersForQuestionQuery.mock.calls[0][0]).toBe('SELECT * FROM Answers WHERE QuestionID = ?');
    expect(mockGetAnswersForQuestionQuery.mock.calls[0][1]).toEqual([questionId]);
  });

  it('adds a new answer to a question', async () => {
    const questionId = 1;
    const userId = 1;
    const content = 'New answer content';
    const mockedInsertedId = 123;

    // Mocking the response for addAnswer query
    const mockAddAnswerQuery = jest.fn((query, params, callback) => {
      // Simulate successful insertion
      callback(null, { insertId: mockedInsertedId });
    });

    // Mock pool.query to resolve with successful insertion
    (pool.query as jest.Mock).mockImplementation(mockAddAnswerQuery);

    // Call the addAnswer method from the service
    const insertedId = await answerService.addAnswer(questionId, userId, content);

    // Verify the service method behavior
    expect(pool.query).toHaveBeenCalled();
    expect(insertedId).toEqual(mockedInsertedId);

    // Verify the correct SQL query was executed
    expect(mockAddAnswerQuery.mock.calls[0][0]).toBe('INSERT INTO Answers (QuestionID, UserID, Content) VALUES (?, ?, ?)');
    expect(mockAddAnswerQuery.mock.calls[0][1]).toEqual([questionId, userId, content]);
  });

  // Add tests for other methods like updateAnswer, deleteAnswer, markAnswerAsAccepted, getFavoritesByUser, getAnswersSorted, and updateAnswerScore.
});
