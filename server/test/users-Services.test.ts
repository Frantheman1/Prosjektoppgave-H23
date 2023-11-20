import User from '../src/services/users-Services';
import pool from '../src/mysql-pool';

jest.mock('../src/mysql-pool', () => ({
  query: jest.fn(),
}));

describe('User Services', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('finds a user by username', async () => {
    const username = 'testuser';
    const mockedUser = { id: 1, username: 'testuser', /* Other user properties */ };

    // Mocking the response for findOne query
    const mockFindOneQuery = jest.fn((query, params, callback) => {
      // Simulate successful user retrieval
      callback(null, [mockedUser]);
    });

    // Mock pool.query to resolve with the mocked user
    (pool.query as jest.Mock).mockImplementation(mockFindOneQuery);

    // Call the findOne method from the User class
    User.findOne({ username }, (err, user) => {
      // Verify the service method behavior
      expect(pool.query).toHaveBeenCalled();
      expect(user).toEqual(mockedUser);
    });

    // Verify the correct SQL query was executed
    expect(mockFindOneQuery.mock.calls[0][0]).toBe('SELECT * FROM users WHERE username = ?');
    expect(mockFindOneQuery.mock.calls[0][1]).toEqual([username]);
  });

  it('finds a user by ID', async () => {
    const userId = 1;
    const mockedUser = { id: 1, username: 'testuser', /* Other user properties */ };

    // Mocking the response for findById query
    const mockFindByIdQuery = jest.fn((query, params, callback) => {
      // Simulate successful user retrieval
      callback(null, [mockedUser]);
    });

    // Mock pool.query to resolve with the mocked user
    (pool.query as jest.Mock).mockImplementation(mockFindByIdQuery);

    // Call the findById method from the User class
    User.findById(userId, (err, user) => {
      // Verify the service method behavior
      expect(pool.query).toHaveBeenCalled();
      expect(user).toEqual(mockedUser);
    });

    // Verify the correct SQL query was executed
    expect(mockFindByIdQuery.mock.calls[0][0]).toBe('SELECT * FROM users WHERE id = ?');
    expect(mockFindByIdQuery.mock.calls[0][1]).toEqual([userId]);
  });
});
