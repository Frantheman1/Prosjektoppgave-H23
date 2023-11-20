// import voteService from '../src/services/votes-Services';
// import pool from '../src/mysql-pool';

// jest.mock('../src/mysql-pool', () => ({
//   query: jest.fn(),
// }));

// describe('VoteService', () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('casts a vote on an answer', async () => {
//     // Mocking the response for the initial SELECT query
//     const mockSelectQuery = jest.fn((query, params, callback) => {
//       // Simulate that the user hasn't voted yet
//       callback(null, []);
//     });

//     // Mocking the response for the subsequent INSERT query
//     const mockInsertQuery = jest.fn((query, params, callback) => {
//       // Simulate successful insertion
//       callback(null, { affectedRows: 1 });
//     });

//     // Mock pool.query to simulate SELECT and INSERT queries
//     (pool.query as jest.Mock)
//       .mockImplementationOnce(mockSelectQuery)
//       .mockImplementationOnce(mockInsertQuery);

//     // Call the vote method from the service
//     await voteService.vote(1, 123, true); // Assuming answerId is 1, userId is 123, and voteType is true

//     // Verify the service method behavior
//     expect(pool.query).toHaveBeenCalledTimes(2);

//     // Verify the SELECT query was called with the expected parameters
//     expect(mockSelectQuery.mock.calls[0][0]).toBe('SELECT VoteID FROM Votes WHERE AnswerID = ? AND UserID = ?');
//     expect(mockSelectQuery.mock.calls[0][1]).toEqual([1, 123]);

//     // Verify the INSERT query was called with the expected parameters
//     expect(mockInsertQuery.mock.calls[0][0]).toBe('INSERT INTO Votes (AnswerID, UserID, VoteType) VALUES (?, ?, ?)');
//     expect(mockInsertQuery.mock.calls[0][1]).toEqual([1, 123, 1]); // Assuming the vote type is true, mapped to 1
//   });
// });


import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import { TestDatabaseManager } from './utils/testSetup';
import  { Vote } from '../src/services/votes-Services'
import  { Answer } from '../src/services/answers-Services';


const testAnswer: Answer[] = [
 { answerId: 1, questionId: 1, userId: 1, content: 'Some answer', isAccepted:false, score: -1, createdAt: new Date(2023-11-14),modifiedAt: new Date(2023-11-14)},
 { answerId: 2, questionId: 2, userId: 1, content: 'Some answer2', isAccepted:false, score: 1, createdAt: new Date(2023-11-14),modifiedAt: new Date(2023-11-14)},
 { answerId: 3, questionId: 1, userId: 1, content: 'Some answer3', isAccepted:false, score: 0, createdAt: new Date(2023-11-14),modifiedAt: new Date(2023-11-14)},
];

const testVotes: Vote[] = [
  { voteId: 1, answerId: 1,userId: 1, voteType: false },
  { voteId: 2, answerId: 2,userId: 1, voteType: true },
  { voteId: 3, answerId: 3,userId: 1, voteType: true }
];

// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3001/api/v2';

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(3001, () => done());
});

beforeEach((done) => {
 TestDatabaseManager.setupDatabase()
 .then(() => done())
 .catch((error) => done(error));
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});

describe('Votes Router', () => {
 test('Successfully cast a vote', (done) => {
   axios.post('/votes/1', { userId: 1, voteType: 1 }) // Assuming answerId 1 exists
     .then((response) => {
       expect(response.status).toEqual(200);
       // Add more assertions here
       done();
     })
     .catch((error) => {
       done(error);
     });
 });

 test('Invalid voteType', (done) => {
   axios.post('/votes/1', { userId: 1, voteType: 'invalid' })
     .then(() => done(new Error("Should have failed")))
     .catch((error) => {
       expect(error.response.status).toEqual(400);
       done();
     });
 });

 // Additional tests for error handling and other scenarios
});

