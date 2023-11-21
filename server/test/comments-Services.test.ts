import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import { TestDatabaseManager } from './utils/testSetup';

const testComments = TestDatabaseManager.testComments;

axios.defaults.baseURL = 'http://localhost:3001/api/v1';

let webServer: any;
beforeAll(async () => {
  try {
    // Use a separate port for testing
    webServer = app.listen(3001);
  } catch (error) {
    throw error;
  }
});

beforeEach(async () => {
  try {
    await TestDatabaseManager.setupDatabase();
  } catch (error) {
    console.error(error);
  }
});

afterAll(async () => {
  // Close the web server and clean up resources
  if (webServer) {
    await new Promise((resolve) => webServer.close(resolve));
  }
});

// Stop web server and close connection to MySQL server
afterAll(() => {
  if (!webServer) return;
  webServer.close(() => pool.end());
});

describe('Fetch comments (GET)', () => {
  test('Fetch all comments (200 OK)', async () => {
    const response = await axios.get('/comments');
    expect(response.status).toEqual(200);
    expect(response.data).toEqual(testComments);
  });

  test('Fetch comment (200 OK)', () => {
    axios.get('/comments/1').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testComments[0]);
    });
  });

  test('Fetch comment (404 Not Found)', async () => {
    // axios
    //   .get('/comments/5')
    //   .then((_response) => done(new Error()))
    //   .catch((error) => {
    //     expect(error.message).toEqual('Request failed with status code 404');
    //     done();
    //   });
    expect.assertions(1);
    try {
      const res = await axios.get('/comments/5');
    } catch (e: any) {
      expect(e.message).toEqual('Request failed with status code 404');
    }
  });
});

describe('Create new comment (POST)', () => {
  test('Create new comment (201 OK)', (done) => {
    axios
      .post('/comments', {
        userId: 1,
        questionId: 1,
        content: 'Some question comment3',
      })
      .then((response) => {
        expect(response.status).toEqual(201);
        expect(response.data).toEqual({ id: 5 });
        done();
      });
  });

  test('Create new comment (400)', (done) => {
    axios.post('/comments', { content: 'New comment' }).catch((error) => {
      expect(error.message).toEqual('Request failed with status code 400');
      done();
    });
  });
});

describe('Update comment (UPDATE)', () => {
  test('Update comment (200 OK)', (done) => {
    const newComment = {
      commentId: 4,
      content: 'Some question comment3',
    };
    axios.put('/comments/', newComment).then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });

  test('Update comment fail (400 OK)', (done) => {
    const newComment = {
      commentId: 3,
      content: 'very wrong comment',
    };
    axios.put('/comments/', newComment).catch((error) => {
      expect(error.message).toEqual('Request failed with status code 400');
      done();
    });
  });
  test('Update comment fail (404 OK)', (done) => {
    const newComment = {
      commentId: 6,
      content: 'Some question comment3',
    };
    axios.put('/comments/' + newComment.commentId, newComment).catch((error) => {
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
