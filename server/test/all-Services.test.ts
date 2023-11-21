import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import { TestDatabaseManager } from './utils/testSetup';
import { Answer } from '../src/services/answers-Services';

// Data sets for testing
const testComments = TestDatabaseManager.testComments;
const testAnswer = TestDatabaseManager.testAnswers

axios.defaults.baseURL = 'http://localhost:3001/api/v1';

let webServer: any;
beforeAll((done) => {
  try {
    // Use a separate port for testing
    webServer = app.listen(3001, () => done());
  } catch (error) {
    throw error;
  }
});

beforeEach(async () => {
  // Implemented a whole setupdDatabase func 
  // For easier building the database because 
  // of Foreign keys
  try {
    await TestDatabaseManager.setupDatabase();
  } catch (error) {
    console.error(error);
  }
});

// Stop web server and close connection to MySQL server
afterAll(() => {
  if (!webServer) return;
  webServer.close(() => pool.end());
});

//////////////////
/// Questions ////
/////////////////

// Tests for fetching questions
describe('Fetch questions (GET)', () => {
  // Test to fetch all questions
  test('Fetch all questions (200 OK)', (done) => {
    axios.get('/questions').then((response) => {
      // Makes sure the status code will be 200 OK
      expect(response.status).toEqual(200);
      const responseData = response.data;
      done();
    }).catch(error => done(error));
  });

  // Test to fetch a specific question by ID
  test('Fetch specific question (200 OK)', (done) => {
    axios.get('/questions/1').then((response) => {
      // Makes sure the status code will be 200 OK
      expect(response.status).toEqual(200);
      done();
    }).catch(error => done(error));
  });

  // Test to fetch a question that doesn't exist
  test('Fetch non-existent question (404 Not Found)', (done) => {
    axios.get('/questions/9999')
      .then(() => done(new Error('Expected request to fail with 404, but it succeeded')))
      .catch((error) => {
        // Makes sure the status code will be 404 Not Found
        expect(error.response.status).toEqual(404);
        done();
      });
  });
})

// Tests for creating questions
describe(' Create question (POST)', () => {
  // Test to add a new question
  test('Add a new question (200 OK)', (done) => {
    const newQuestion = { title: 'New question', content: 'Question content', userId: 1 };
    axios.post('/questions', newQuestion).then((response) => {
      // Makes sure the status code will be 200 OK
      expect(response.status).toEqual(200);
      done();
    }).catch(error => done(error));
  });
  // Test to add a new question without having the data that's needed
  test('Add a new question without required fields (400 Bad Request)', (done) => {
    const newQuestion = { content: 'Question content' }; // Missing title and userId
    axios.post('/questions', newQuestion)
      .catch((error) => {
        // Makes sure the status code will be 400 Bad Request
        expect(error.response.status).toEqual(400);
        done();
      });
  });
})

// Tests for updating questions
describe('Update a question', () => {
  // Test to update a question specific question
  test('Update a question (200 OK)', (done) => {
    const updatedQuestion = { title: 'Updated title', content: 'Updated content' };
    axios.put('/questions/1', updatedQuestion).then((response) => {
      // Makes sure the status code will be 200 OK
      expect(response.status).toEqual(200);
      done();
    }).catch(error => done(error));
  });

  // Test to update a question with invalid input
  test('Update with invalid input (400 Bad Request)', (done) => {
    const updatedQuestion = { title: '', content: '' };
    axios.put('/questions/1', updatedQuestion)
      .catch((error) => {
        expect(error.response.status).toEqual(400);
        done();
      });
  });
})

// Tests for question viewcount requests
describe('Question ViewCount requests', () => {
  // Test to update view count
  test('Update view count (200 OK)', (done) => {
    axios.put('/updateViewCount', { questionId: 1 }).then((response) => {
      // Makes sure the status code will be 200 OK
      expect(response.status).toEqual(200);
      done();
    }).catch(error => done(error));
  });

  // Test to update view count with missing questionId
  test('Update view count with missing questionId (400 Bad Request)', (done) => {
    axios.put('/updateViewCount', {}) // Missing questionId
      .catch((error) => {
        // Makes sure the status code will be 400 Bad Request
        expect(error.response.status).toEqual(400);
        done();
      });
  });
})

// Tests for deleting questions
describe('Delete a question', () => {
  // Test to delete a question
  test('Delete a question (200 OK)', (done) => {
    axios.delete('/questions/1').then((response) => {
      // Makes sure the status code will be 200 OK
      expect(response.status).toEqual(200);
      done();
    }).catch(error => done(error));
  });

  // Test to delete a question that doesn't exist
  test('Delete a non-existent question (500 Server Error)', (done) => {
    axios.delete('/questions/9999')
      .catch((error) => {
        // Makes sure the status code will be 500 Server Error
        expect(error.response.status).toEqual(500);
        done();
      });
  });

})

//////////////////
// Answer Tests //
//////////////////

// Tests for fetching answers
describe('Fetch answers (GET)', () => {
  // Test for fetching all answers for a question
  test('Fetch all answers for a question (200 OK)', (done) => {
    const expectedAnswer = testAnswer.filter(answer => answer.questionId === 1)

    axios.get('/answers/question/1').then((response) => {
      // Makes sure the status code will be 200 OK
      expect(response.status).toEqual(200);

      const responseData = response.data;
      expect(responseData).toHaveLength(expectedAnswer.length);

      // Since the date and score can vary we check explicitly the type
      // And not compare the values because of a delay 
      responseData.forEach((answer: Answer, index: number) => {
        expect(answer.answerId).toEqual(expectedAnswer[index].answerId);
        expect(answer.content).toEqual(expectedAnswer[index].content);
        expect(answer.isAccepted).toEqual(expectedAnswer[index].isAccepted);
        expect(answer.questionId).toEqual(expectedAnswer[index].questionId);
        expect(answer.userId).toEqual(expectedAnswer[index].userId);

        // Check if dates are valid and score is a number
        expect(new Date(answer.createdAt)).toBeInstanceOf(Date);
        expect(new Date(answer.modifiedAt)).toBeInstanceOf(Date);
        expect(answer.score).toEqual(expect.any(Number));
      });
      done();
    }).catch(error => done(error));
  });

  // Test for fetching a specific answer by ID
  test('Fetch answer (200 OK)', (done) => {
    axios.get('/answers/1').then((response) => {
      // Makes sure the status code will be 200 OK 
      expect(response.status).toEqual(200);
      const responseData = response.data;

      // Since the there is a delay between response and mock data
      // we modify the dates abit and then test
      responseData.createdAt = new Date(responseData.createdAt.split('T')[0]);
      responseData.modifiedAt = new Date(responseData.modifiedAt.split('T')[0]);
      const expectedData = testAnswer[0];
      expectedData.createdAt = new Date(expectedData.createdAt.toISOString().split('T')[0]);
      expectedData.modifiedAt = new Date(expectedData.modifiedAt.toISOString().split('T')[0]);

      expect(response.data).toEqual(expectedData);
      done();
    });
  });

  // Test for fetching an answer that doesn't exist
  test('Fetch answer (404 Not Found)', (done) => {
    axios.get('/answers/9999')
      .then(() => {
        done(new Error('Expected request to fail with 404, but it succeeded'));
      })
      .catch((error) => {
        // Makes sure the status code will be 404 Not Found
        expect(error.response.status).toEqual(404);
        expect(error.message).toEqual('Request failed with status code 404')
        done();
      });
  });

  test('Fetch answers with invalid question ID format (400 Bad Request)', (done) => {
    axios.get('/answers/question/abc')
      .then(() => {
        done(new Error('Expected request to fail with 400, but it succeeded'));
      })
      .catch((error) => {
        expect(error.response.status).toEqual(400);
        done();
      });
  });
})

describe('Create answer', () => {
  test('Add a new answer (201 OK)', (done) => {
    const newAnswer = { questionId: 1, userId: 1, content: 'New answer content' };
    axios.post('/answers', newAnswer).then((response) => {
      expect(response.status).toEqual(201);
      expect(response.data).toEqual({ id: 4 });
      done();
    })

  });

  test('Add a new answer without required fields (400 Bad Request)', (done) => {
    const newAnswer = { userId: 1, content: 'New answer content' }; // Missing questionId
    axios.post('/answers', newAnswer)
      .catch((error) => {
        expect(error.response.status).toEqual(400);
        done()
      })
  });
})

describe('Delete answer', () => {
  test('Delete an answer (200 OK)', async () => {
    const response = await axios.delete('/answers/1');
    expect(response.status).toEqual(200);
  });
})

// Toggle accepted and getCount
describe('Miscellanious functions for answers', () => {
  test('Toggle the accepted state of an answer (200 OK)', (done) => {
    const toggleAccepted = { isAccepted: true };
    axios.put('/answers/1/accept', toggleAccepted).then((response) => {
      expect(response.status).toEqual(200);
      done();
    })

  });

  test('Toggle the accepted state of a non-existent answer (404 Not Found)', (done) => {
    const toggleAccepted = { isAccepted: true };
    axios.put('/answers/9999/accept', toggleAccepted)
      .catch((error) => {
        expect(error.response.status).toEqual(404)
        done();
      })

  });

  test('Toggle the accepted state with a wrong value (400 Invalid input )', (done) => {
    const toggleAccepted = { isAccepted: "something" };
    axios.put('/answers/9999/accept', toggleAccepted)
      .catch((error) => {
        expect(error.response.status).toEqual(400)
        done();
      })

  });

  test('Get answer counts per question (200 OK)', (done) => {
    axios.get('/answerCounts').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toBeInstanceOf(Array);
      done()
    })
  });
})

///////////////////
// Comment Tests //
///////////////////
describe('Fetch comments (GET)', () => {
  test('Fetch all comments (200 OK)', (done) => {
    axios.get('/comments').then((response) => {
      expect(response.status).toEqual(200);
      const responseData = response.data;
      expect(responseData).toBeInstanceOf(Array);
      // Additional assertions can be made based on your mock data
      done();
    }).catch(error => done(error));
  });

  test('Fetch specific comment (200 OK)', (done) => {
    axios.get('/comments/1').then((response) => {
      expect(response.status).toEqual(200);
      const responseData = response.data;
      expect(responseData).toBeInstanceOf(Object);
      done();
    }).catch(error => done(error));
  });

  test('Fetch non-existent comment (404 Not Found)', (done) => {
    axios.get('/comments/9999')
      .then(() => done(new Error('Expected request to fail with 404, but it succeeded')))
      .catch((error) => {
        expect(error.response.status).toEqual(404);
        done();
      });
  });
});


describe('Create comment (POST)', () => {
  test('Add a new comment (201 OK)', (done) => {
    const newComment = { userId: 1, questionId: 1, content: 'New comment' };
    axios.post('/comments', newComment).then((response) => {
      expect(response.status).toEqual(201);
      done();
    }).catch(error => done(error));
  });

  test('Add a new comment without required fields (400 Bad Request)', (done) => {
    const newComment = { userId: 1 }; // Missing questionId and content
    axios.post('/comments', newComment)
      .catch((error) => {
        expect(error.response.status).toEqual(400);
        done();
      });
  });
});


describe('Update comment', () => {
  test('Update a comment (200 OK)', (done) => {
    const updatedComment = { content: 'Updated comment' };
    axios.put('/comments/1', updatedComment).then((response) => {
      expect(response.status).toEqual(200);
      done();
    }).catch(error => done(error));
  });

  test('Update with invalid input (400 Bad Request)', (done) => {
    const updatedComment = { content: '' }; // Empty content
    axios.put('/comments/1', updatedComment)
      .catch((error) => {
        expect(error.response.status).toEqual(400);
        done();
      });
  });
});


describe('Delete comment', () => {
  test('Delete a comment (200 OK)', (done) => {
    axios.delete('/comments/1').then((response) => {
      console.log(response)
      expect(response.status).toEqual(200);
      done();
    }).catch(error => done(error));
  });

  test('Delete a non-existent comment (500 Server Error)', (done) => {
    axios.delete('/comments/9999')
      .catch((error) => {
        expect(error.response.status).toEqual(500);
        done();
      });
  });
});


///////////
// Tags ///
//////////

describe('Fetch tags (GET)', () => {
  test('Fetch tags for a question (200 OK)', (done) => {

    axios.get('/tags/question/1').then((response) => {
      expect(response.status).toEqual(200);
      const responseData = response.data;
      expect(responseData).toBeInstanceOf(Array);
      done();
    }).catch(error => done(error));
  });

});

describe('Create tag (POST)', () => {
  test('Add a new tag to a question (201 OK)', (done) => {
    const newTag = { tagId: 1, questionId: 3 };
    axios.post('/tags/question', newTag).then((response) => {
      expect(response.status).toEqual(201);
      expect(response.data).toEqual('Tag added to question successfully');
      done();
    }).catch(error => done(error));
  });

  test('Add a tag with invalid fields (400 Bad Request)', (done) => {
    const newTag = { tagId: 'invalid', questionId: 1 }; // Invalid tagId
    axios.post('/tags/question', newTag)
      .catch((error) => {
        expect(error.response.status).toEqual(400);
        done();
      });
  });

  test('Add a new tag (201 Created)', (done) => {
    const newTag = { name: 'New Tag' };
    axios.post('/tags', newTag).then((response) => {
      expect(response.status).toEqual(201);
      const responseData = response.data;
      expect(responseData).toHaveProperty('tagId');
      // You can add more assertions here based on the expected structure of responseData
      done();
    }).catch(error => done(error));
  });

  test('Add a new tag without a name (400 Bad Request)', (done) => {
    const newTag = {}; // Missing name
    axios.post('/tags', newTag)
      .catch((error) => {
        expect(error.response.status).toEqual(400);
        done();
      });
  });

  test('Add a new tag with invalid name type (400 Bad Request)', (done) => {
    const newTag = { name: 123 }; // Invalid name type (number instead of string)
    axios.post('/tags', newTag)
      .catch((error) => {
        expect(error.response.status).toEqual(400);
        done();
      });
  });
});


describe('Question count of Tags', () => {
  test('Get all tags with question count (200 OK)', (done) => {
    axios.get('/tags/count').then((response) => {
      expect(response.status).toEqual(200);
      const responseData = response.data;
      expect(responseData).toBeInstanceOf(Array);
      // Further assertions can be done based on your mock data
      done();
    }).catch(error => done(error));
  });
})


/////////////
// Votes ////
/////////////

describe('Vote on Answer', () => {
  test('Vote on an answer (200 OK)', (done) => {
    const voteData = { userId: 1, voteType: 1 }; // voteType: 1 or 0
    axios.post('/votes/1', voteData).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(`Vote updated for answer 1`);
      done()
    })

  });

  test('Vote on an answer with invalid request (400 Bad Request)', (done) => {
    const voteData = { userId: 1, voteType: 'invalid' }; // Invalid voteType
    axios.post('/votes/1', voteData)
      .catch((error) => {
        expect(error.response.status).toEqual(400);
        done()
      })
  });

  test('Vote on a non-existent answer (500 Server Error)', (done) => {
    const voteData = { userId: 1, voteType: 1 };
    axios.post('/votes/9999', voteData)
      .catch((error) => {
        expect(error.response.status).toEqual(500);
        done()
      })
  });
});

///////////////
// Favorites //
//////////////
describe('Fetch favorites (GET)', () => {
  test('Fetch all favorite answers for a user (200 OK)', (done) => {
    axios.get('/favorites/1').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toBeInstanceOf(Array);
      done();
    })
  });

  test('Fetch favorites for a user with no favorites (404 Not Found)', (done) => {
    axios.get('/favorites/9999')
      .catch((error) => {
        expect(error.response.status).toEqual(404);
        done();
      }
      )
  });
});

describe('Add favorite (POST)', () => {
  test('Add a favorite answer for a user (200 OK)', (done) => {
    const newFavorite = { userId: 1, answerId: 2 }; // Example data
    axios.post('/favorites', newFavorite).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual('Favorite added successfully');
      done();
    })

  });

  test('Add a favorite with missing required fields (400 Bad Request)', (done) => {
    const newFavorite = { userId: 1 }; // Missing answerId
    axios.post('/favorites', newFavorite).catch((error) => {
      expect(error.response.status).toEqual(400);
      done();
    })
  });
});


describe('Remove favorite (DELETE)', () => {
  test('Remove a favorite answer for a user (200 OK)', (done) => {
    const favoriteToRemove = { userId: 1, answerId: 1 }; // Example data
    axios.delete('/favorites', { data: favoriteToRemove })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual('Favorite removed successfully');
        done();
      })

  });

  test('Remove a favorite with missing required fields (400 Bad Request)', (done) => {
    const favoriteToRemove = { userId: 1 }; // Missing answerId
    axios.delete('/favorites', { data: favoriteToRemove })
      .catch((error) => {
        expect(error.response.status).toEqual(400);
        done();
      })
  });
});
