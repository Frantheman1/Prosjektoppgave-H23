import voteService from '../src/services/votes-Services';
import pool from '../src/mysql-pool';

jest.mock('../src/mysql-pool', () => ({
  query: jest.fn(),
}));

describe('VoteService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('casts a vote on an answer', async () => {
    // Mocking the response for the initial SELECT query
    const mockSelectQuery = jest.fn((query, params, callback) => {
      // Simulate that the user hasn't voted yet
      callback(null, []);
    });

    // Mocking the response for the subsequent INSERT query
    const mockInsertQuery = jest.fn((query, params, callback) => {
      // Simulate successful insertion
      callback(null, { affectedRows: 1 });
    });

    // Mock pool.query to simulate SELECT and INSERT queries
    (pool.query as jest.Mock)
      .mockImplementationOnce(mockSelectQuery)
      .mockImplementationOnce(mockInsertQuery);

    // Call the vote method from the service
    await voteService.vote(1, 123, true); // Assuming answerId is 1, userId is 123, and voteType is true

    // Verify the service method behavior
    expect(pool.query).toHaveBeenCalledTimes(2);

    // Verify the SELECT query was called with the expected parameters
    expect(mockSelectQuery.mock.calls[0][0]).toBe('SELECT VoteID FROM Votes WHERE AnswerID = ? AND UserID = ?');
    expect(mockSelectQuery.mock.calls[0][1]).toEqual([1, 123]);

    // Verify the INSERT query was called with the expected parameters
    expect(mockInsertQuery.mock.calls[0][0]).toBe('INSERT INTO Votes (AnswerID, UserID, VoteType) VALUES (?, ?, ?)');
    expect(mockInsertQuery.mock.calls[0][1]).toEqual([1, 123, 1]); // Assuming the vote type is true, mapped to 1
  });
});
