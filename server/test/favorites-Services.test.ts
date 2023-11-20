import favoriteService from '../src/services/favorites-Services';
import pool from '../src/mysql-pool';

jest.mock('../src/mysql-pool', () => ({
  query: jest.fn(),
}));

describe('FavoriteService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('adds a favorite answer for a user', async () => {
    const userId = 1;
    const answerId = 2;

    // Mocking the response for addFavorite query
    const mockAddFavoriteQuery = jest.fn((query, params, callback) => {
      // Simulate successful insertion
      callback(null, { affectedRows: 1 });
    });

    // Mock pool.query to resolve with successful insertion
    (pool.query as jest.Mock).mockImplementation(mockAddFavoriteQuery);

    // Call the addFavorite method from the service
    await favoriteService.addFavorite(userId, answerId);

    // Verify the service method behavior
    expect(pool.query).toHaveBeenCalled();

    // Verify the correct SQL query was executed
    expect(mockAddFavoriteQuery.mock.calls[0][0]).toBe('INSERT INTO FavoriteAnswers (UserID, AnswerID) VALUES (?, ?)');
    expect(mockAddFavoriteQuery.mock.calls[0][1]).toEqual([userId, answerId]);
  });

  it('removes a favorite answer for a user', async () => {
    const userId = 1;
    const answerId = 2;

    // Mocking the response for removeFavorite query
    const mockRemoveFavoriteQuery = jest.fn((query, params, callback) => {
      // Simulate successful deletion
      callback(null, { affectedRows: 1 });
    });

    // Mock pool.query to resolve with successful deletion
    (pool.query as jest.Mock).mockImplementation(mockRemoveFavoriteQuery);

    // Call the removeFavorite method from the service
    await favoriteService.removeFavorite(userId, answerId);

    // Verify the service method behavior
    expect(pool.query).toHaveBeenCalled();

    // Verify the correct SQL query was executed
    expect(mockRemoveFavoriteQuery.mock.calls[0][0]).toBe('DELETE FROM FavoriteAnswers WHERE UserID = ? AND AnswerID = ?');
    expect(mockRemoveFavoriteQuery.mock.calls[0][1]).toEqual([userId, answerId]);
  });
});
