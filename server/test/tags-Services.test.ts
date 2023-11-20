import tagService, { Tag } from '../src/services/tags-Services';
import pool from '../src/mysql-pool';

jest.mock('../src/mysql-pool', () => ({
  query: jest.fn(),
}));

describe('TagService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches all tags', async () => {
    const mockedTags: Tag[] = [
      { tagId: 1, name: 'Tag1' },
      { tagId: 2, name: 'Tag2' },
    ];

    // Mocking the response for getAllTags query
    const mockGetAllTagsQuery = jest.fn((query, callback) => {
      // Simulate successful query execution
      callback(null, mockedTags);
    });

    // Mock pool.query to resolve with mockedTags
    (pool.query as jest.Mock).mockImplementation(mockGetAllTagsQuery);

    // Call the getAllTags method from the service
    const tags = await tagService.getAllTags();

    // Verify the service method behavior
    expect(pool.query).toHaveBeenCalled();
    expect(tags).toEqual(mockedTags);

    // Verify the correct SQL query was executed
    expect(mockGetAllTagsQuery.mock.calls[0][0]).toBe('SELECT * FROM Tags');
  });

  it('fetches tags for a specific question', async () => {
    const questionId = 1;
    const mockedTags: Tag[] = [
      { tagId: 1, name: 'Tag1' },
      { tagId: 2, name: 'Tag2' },
    ];

    // Mocking the response for getTagsForQuestion query
    const mockGetTagsForQuestionQuery = jest.fn((query, params, callback) => {
      // Simulate successful query execution
      callback(null, mockedTags);
    });

    // Mock pool.query to resolve with mockedTags
    (pool.query as jest.Mock).mockImplementation(mockGetTagsForQuestionQuery);

    // Call the getTagsForQuestion method from the service
    const tags = await tagService.getTagsForQuestion(questionId);

    // Verify the service method behavior
    expect(pool.query).toHaveBeenCalled();
    expect(tags).toEqual(mockedTags);

    // Verify the correct SQL query was executed
    expect(mockGetTagsForQuestionQuery.mock.calls[0][0]).toBe(
      'SELECT Tags.* FROM Tags JOIN Question_Tags ON Tags.tagId = Question_Tags.TagID WHERE Question_Tags.QuestionID = ?'
    );
    expect(mockGetTagsForQuestionQuery.mock.calls[0][1]).toEqual([questionId]);
  });
});
