// import answerService, { Answer } from '../src/services/answers-Services';
// import pool from '../src/mysql-pool';

// jest.mock('../src/mysql-pool', () => ({
//   query: jest.fn(),
// }));

// describe('AnswerService', () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('fetches answers for a given question', async () => {
//     const questionId = 1;
//     const mockedAnswers: Answer[] = [
//       { answerId: 1, questionId: 1, userId: 1, content: 'Answer 1', isAccepted: false, createdAt: new Date(), modifiedAt: new Date(), score: 0 },
//       // Add more mocked answers as needed
//     ];

//     // Mocking the response for getAnswersForQuestion query
//     const mockGetAnswersForQuestionQuery = jest.fn((query, params, callback) => {
//       // Simulate successful query execution
//       callback(null, mockedAnswers);
//     });

//     // Mock pool.query to resolve with mockedAnswers
//     (pool.query as jest.Mock).mockImplementation(mockGetAnswersForQuestionQuery);

//     // Call the getAnswersForQuestion method from the service
//     const answers = await answerService.getAnswersForQuestion(questionId);

//     // Verify the service method behavior
//     expect(pool.query).toHaveBeenCalled();
//     expect(answers).toEqual(mockedAnswers);

//     // Verify the correct SQL query was executed
//     expect(mockGetAnswersForQuestionQuery.mock.calls[0][0]).toBe('SELECT * FROM Answers WHERE QuestionID = ?');
//     expect(mockGetAnswersForQuestionQuery.mock.calls[0][1]).toEqual([questionId]);
//   });

//   it('adds a new answer to a question', async () => {
//     const questionId = 1;
//     const userId = 1;
//     const content = 'New answer content';
//     const mockedInsertedId = 123;

//     // Mocking the response for addAnswer query
//     const mockAddAnswerQuery = jest.fn((query, params, callback) => {
//       // Simulate successful insertion
//       callback(null, { insertId: mockedInsertedId });
//     });

//     // Mock pool.query to resolve with successful insertion
//     (pool.query as jest.Mock).mockImplementation(mockAddAnswerQuery);

//     // Call the addAnswer method from the service
//     const insertedId = await answerService.addAnswer(questionId, userId, content);

//     // Verify the service method behavior
//     expect(pool.query).toHaveBeenCalled();
//     expect(insertedId).toEqual(mockedInsertedId);

//     // Verify the correct SQL query was executed
//     expect(mockAddAnswerQuery.mock.calls[0][0]).toBe('INSERT INTO Answers (QuestionID, UserID, Content) VALUES (?, ?, ?)');
//     expect(mockAddAnswerQuery.mock.calls[0][1]).toEqual([questionId, userId, content]);
//   });

//   // Add tests for other methods like updateAnswer, deleteAnswer, markAnswerAsAccepted, getFavoritesByUser, getAnswersSorted, and updateAnswerScore.
// });



// import axios from 'axios';
// import pool from '../src/mysql-pool';
// import app from '../src/app';
// import answerService, { Answer } from '../src/services/answers-Services';

// const testAnswer: Answer[] = [
//   { answerId: 1, questionId: 1, userId: 1, content: 'Some answer', isAccepted:false, score: 1, createdAt: new Date(2023-11-14),modifiedAt: new Date(2023-11-14)},
//   { answerId: 2, questionId: 2, userId: 1, content: 'Some answer2', isAccepted:false, score: 3, createdAt: new Date(2023-11-14),modifiedAt: new Date(2023-11-14)},
//   { answerId: 3, questionId: 1, userId: 1, content: 'Some answer3', isAccepted:false, score: 2, createdAt: new Date(2023-11-14),modifiedAt: new Date(2023-11-14)},
// ];

// // Since API is not compatible with v1, API version is increased to v2
// axios.defaults.baseURL = 'http://localhost:3001/api/v2';

// let webServer: any;
// beforeAll((done) => {
//   // Use separate port for testing
//   webServer = app.listen(3001, () => done());
// });

// beforeEach((done) => {
//   // Delete all tasks, and reset id auto-increment start value
//   pool.query('TRUNCATE TABLE Answers', (error) => {
//     if (error) return done(error);

//     pool.query('ALTER TABLE Answers AUTO_INCREMENT = 1', (error) => {
//       if (error) return done(error);

//     // Create testAnswer sequentially in order to set correct id, and call done() when finished
//     answerService
//       .addAnswer(testAnswer[0].questionId, testAnswer[0].userId,testAnswer[0].content )
//       .then(() => answerService.addAnswer(testAnswer[1].questionId, testAnswer[1].userId,testAnswer[1].content )) // Create testAnswers[1] after testAnswers[0] has been created
//       .then(() => answerService.addAnswer(testAnswer[2].questionId, testAnswer[2].userId,testAnswer[2].content ))  // Create testAnswer[2] after testAnswer[1] has been created
//       .then(() => done()); // Call done() after testAnswer[2] has been created
//     });
//   });
// });

// // Stop web server and close connection to MySQL server
// afterAll((done) => {
//   if (!webServer) return done(new Error());
//   webServer.close(() => pool.end(() => done()));
// });



// describe('Fetch answers (GET)', () => {
//   test('Fetch all answers for a question (200 OK)', (done) => {
//     const expectedAnswer = testAnswer.filter(answer => answer.questionId === 1)

//     axios.get('/answers/question/1').then((response) => {
//       expect(response.status).toEqual(200);
//       expect(response.data).toEqual(expectedAnswer);
//       done();
//     }).catch(error => done(error));;
//   });

//   test.skip('Fetch task (200 OK)', (done) => {
//     axios.get('/tasks/1').then((response) => {
//       expect(response.status).toEqual(200);
//       expect(response.data).toEqual(testAnswer[0]);
//       done();
//     });
//   });

//   test.skip('Fetch task (404 Not Found)', (done) => {
//     axios
//       .get('/tasks/4')
//       .then((_response) => done(new Error()))
//       .catch((error) => {
//         expect(error.message).toEqual('Request failed with status code 404');
//         done();
//       });
//   });
// });

// describe('Create new task (POST)', () => {
//   test.skip('Create new task (200 OK)', (done) => {
//     axios.post('/tasks', { title: 'Ny oppgave' ,description: 'Noe med oppgave' }).then((response) => {
//       expect(response.status).toEqual(200);
//       expect(response.data).toEqual({ id: 4 });
//       done();
//     });
//   });

//   test.skip('Create new task (400)', (done) => {
//     axios.post('/tasks', { title: 'Ny oppgave' })
//     .catch((error) => {
//       expect(error.message).toEqual('Request failed with status code 400');
//       done();
//     });
//   });
// });

// describe('Update task (UPDATE)', () => {
//   test.skip('Update task (200 OK)', (done) => {
//     const newTask = { id: 3, title: 'Gjør øving',description:"Noe om øving", done: true }
//     axios.put('/tasks/', newTask).then((response) => {
//       expect(response.status).toEqual(200);
//       done();
//     });
//   });


//   test.skip('Update task fail (400 OK)', (done) => {
//     const newTask = { id: 5, title: '',description:"Noe veldig feil", done: false }
//     axios.put('/tasks/', newTask)
//     .catch((error) => {
//       expect(error.message).toEqual('Request failed with status code 400');
//       done();
//     });
//     });
//     test.skip('Update task fail (404 OK)', (done) => {
//       const newTask = { id: 5, title: 'noe noe',description:"Noe veldig feil", done: false }
//       axios.put('/tasks/'+ newTask.id , newTask)
//       .catch((error) => {
//         expect(error.message).toEqual('Request failed with status code 404');
//         done();
//       });
//       });


// });


// describe('Delete task (DELETE)', () => {
//   test.skip('Delete task (200 OK)', (done) => {
//     axios.delete('/tasks/2').then((response) => {
//       expect(response.status).toEqual(200);
//       done();
//     });
//   });
// });
