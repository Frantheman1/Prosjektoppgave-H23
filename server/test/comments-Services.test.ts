// import commentService, { Comment } from '../src/services/comments-Services';
// import pool from '../src/mysql-pool';

// jest.mock('../src/mysql-pool', () => ({
//   query: jest.fn(),
// }));

// describe('CommentService', () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('fetches comments by question ID', async () => {
//     const questionId = 1;
//     const mockedComments: Comment[] = [
//       { commentId: 1, userId: 1, questionId: 1, content: 'Comment 1', createdAt: new Date(), modifiedAt: new Date() },
//       // Add more mocked comments as needed
//     ];

//     // Mocking the response for getCommentsByQuestion query
//     const mockGetCommentsByQuestionQuery = jest.fn((query, params, callback) => {
//       // Simulate successful query execution
//       callback(null, mockedComments);
//     });

//     // Mock pool.query to resolve with mockedComments
//     (pool.query as jest.Mock).mockImplementation(mockGetCommentsByQuestionQuery);

//     // Call the getCommentsByQuestion method from the service
//     const comments = await commentService.getCommentsByQuestion(questionId);

//     // Verify the service method behavior
//     expect(pool.query).toHaveBeenCalled();
//     expect(comments).toEqual(mockedComments);

//     // Verify the correct SQL query was executed
//     expect(mockGetCommentsByQuestionQuery.mock.calls[0][0]).toBe('SELECT * FROM Comments WHERE QuestionID = ? ORDER BY CreatedAt');
//     expect(mockGetCommentsByQuestionQuery.mock.calls[0][1]).toEqual([questionId]);
//   });

//   it('adds a new comment to a question or answer', async () => {
//     const userId = 1;
//     const questionId = 1;
//     const content = 'New comment content';
//     const mockedInsertedId = 123;

//     // Mocking the response for addComment query
//     const mockAddCommentQuery = jest.fn((query, params, callback) => {
//       // Simulate successful insertion
//       callback(null, { insertId: mockedInsertedId });
//     });

//     // Mock pool.query to resolve with successful insertion
//     (pool.query as jest.Mock).mockImplementation(mockAddCommentQuery);

//     // Call the addComment method from the service
//     const insertedId = await commentService.addComment(userId, questionId, null, content);

//     // Verify the service method behavior
//     expect(pool.query).toHaveBeenCalled();
//     expect(insertedId).toEqual(mockedInsertedId);

//     // Verify the correct SQL query was executed
//     expect(mockAddCommentQuery.mock.calls[0][0]).toBe('INSERT INTO Comments (UserID, QuestionID, Content) VALUES (?, ?, ?)');
//     expect(mockAddCommentQuery.mock.calls[0][1]).toEqual([userId, questionId, content]);
//   });
// });


import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import commentService, { Comment } from '../src/services/comments-Services';
import { TestDatabaseManager } from './utils/testSetup';

const testComments: Comment[] = [
  { commentId: 1,
    userId: 1,
    questionId: 1,
    answerId: 0,
    content: "Some question comment1",
    createdAt: new Date(2023-11-14),
    modifiedAt: new Date(2023-11-14), },
  { commentId: 2,
    userId: 1,
    questionId: 2,
    answerId: 0,
    content: "Some question comment2",
    createdAt: new Date(2023-11-14),
    modifiedAt: new Date(2023-11-14), },
  { commentId: 3,
    userId: 1,
    questionId: 0,
    answerId: 1,
    content: "Some answer comment1",
    createdAt: new Date(2023-11-14),
    modifiedAt: new Date(2023-11-14), },
  { commentId: 4,
    userId: 1,
    questionId: 0,
    answerId: 2,
    content: "Some answer comment2",
    createdAt: new Date(2023-11-14),
    modifiedAt: new Date(2023-11-14), },
];

// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3001/api/v2';

let webServer: any;
beforeAll(async () => {
  try {
    await TestDatabaseManager.setupDatabase();
    // Use a separate port for testing
    webServer = app.listen(3001);
  } catch (error) {
    throw error;
  }
});

beforeEach(async () => {
  try {
    await TestDatabaseManager.setupDatabase();

    // Create testComments sequentially to set the correct id
    await commentService.addComment(testComments[0].userId, testComments[1].questionId, testComments[0].answerId, testComments[0].content);
    await commentService.addComment(testComments[1].userId, testComments[1].questionId, testComments[1].answerId, testComments[1].content); // Create testComment[1] after testComment[0] has been created
    await commentService.addComment(testComments[2].userId, testComments[2].questionId, testComments[2].answerId, testComments[2].content); // Create testComment[2] after testComment[1] has been created
    await commentService.addComment(testComments[3].userId, testComments[3].questionId, testComments[3].answerId, testComments[3].content); // Create testComment[3] after testComment[2] has been created
  } catch (error) {
    throw error;
  }
});

afterAll(async () => {
  // Close the web server and clean up resources
  if (webServer) {
    await new Promise((resolve) => webServer.close(resolve));
  }

  if(pool){
    await pool.end();
  }
});

describe('Fetch comments (GET)', () => {
  test('Fetch all comments (200 OK)', (done) => {
    axios.get('/comments').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testComments);
      done();
    });
  });

  test('Fetch comment (200 OK)', (done) => {
    axios.get('/comments/1').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testComments[0]);
      done();
    });
  });

  test('Fetch comment (404 Not Found)', (done) => {
    axios
      .get('/comments/5')
      .then((_response) => done(new Error()))
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 404');
        done();
      });
  });
});

describe('Create new comment (POST)', () => {
  test('Create new comment (200 OK)', (done) => {
    axios.post('/comments', { 
      userId: 1,
      questionId: 1,
      content: "Some question comment3", }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual({ commentId: 4 });
      done();
    });
  });

  test('Create new comment (400)', (done) => {
    axios.post('/comments', { content: 'New comment' })
    .catch((error) => {
      expect(error.message).toEqual('Request failed with status code 400');
      done();
    });
  });
});

describe('Update comment (UPDATE)', () => {
  test('Update comment (200 OK)', (done) => {
    const newComment = { 
      commentId: 4,
      content: "Some question comment3" }
    axios.put('/comments/', newComment).then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });


  test('Update comment fail (400 OK)', (done) => {
    const newComment = { 
      commentId: 6,
      content: "very wrong comment", }
    axios.put('/comments/', newComment)
    .catch((error) => {
      expect(error.message).toEqual('Request failed with status code 400');
      done();
    });
    });
    test('Update comment fail (404 OK)', (done) => {
      const newComment = { 
        commentId: 6,
        content: "Some question comment3", }
      axios.put('/comments/'+ newComment.commentId , newComment)
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 404');
        done();
      });
      });


});


describe('Delete comment (DELETE)', () => {
  test('Delete comment (200 OK)', (done) => {
    axios.delete('/comments/2').then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });
});
