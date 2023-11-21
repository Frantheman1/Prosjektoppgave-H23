import axios from 'axios';
import pool from '../../src/mysql-pool';
import answerService, { Answer} from '../../src/services/answers-Services';
import commentService, { Comment }from '../../src/services/comments-Services';
import questionService, { Question } from '../../src/services/questions-Services';
import favoriteService, { Favorite } from '../../src/services/favorites-Services';
import tagService, { Tag } from '../../src/services/tags-Services';
import voteServices, { Vote } from '../../src/services/votes-Services';
import userService, { User } from '../../src/services/users-Services';
import app from '../../src/app';

export class TestDatabaseManager  {
 static insertTestData() {
  
  const testUser: User[] = [
   { id: 1, username: 'testuser1', email: 'testuser1@example.com', password: 'hashedpassword1' },
  ]
  
  const testQuestion: Question[] = [
   { questionId: 1, userId: 1, title: "math question", content: "hva er 2+2?", createdAt: new Date(2023-11-24), modifiedAt: new Date(2023-11-24), viewCount: 1 },
   { questionId: 2, userId: 1, title: "math question", content: "hva er 4*1?", createdAt: new Date(2023-11-24), modifiedAt: new Date(2023-11-24), viewCount: 10 },
   { questionId: 3, userId: 1, title: "dating help plez", content: "how to rizz?", createdAt: new Date(2023-11-24), modifiedAt: new Date(2023-11-24), viewCount: 25 },
   { questionId: 4, userId: 1, title: "cooking", content: "how long do i cook eggs?", createdAt: new Date(2023-11-24), modifiedAt: new Date(2023-11-24), viewCount: 4 },
   { questionId: 5, userId: 1, title: "math question", content: "hva er 10 gangen?", createdAt: new Date(2023-11-24), modifiedAt: new Date(2023-11-24), viewCount: 1 }
  ]
  const testAnswer: Answer[] = [
   { answerId: 1, questionId: 1, userId: 1, content: 'Some answer', isAccepted:false, score: -1, createdAt: new Date(2023-11-14),modifiedAt: new Date(2023-11-14)},
   { answerId: 2, questionId: 2, userId: 1, content: 'Some answer2', isAccepted:false, score: 1, createdAt: new Date(2023-11-14),modifiedAt: new Date(2023-11-14)},
   { answerId: 3, questionId: 1, userId: 1, content: 'Some answer3', isAccepted:false, score: 0, createdAt: new Date(2023-11-14),modifiedAt: new Date(2023-11-14)},
  ];

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
  
 const testTags: Tag[] = [
  { tagId: 1, name: 'testname1' },
  { tagId: 2, name: 'testname2' },
  { tagId: 3, name: 'testname3' },
  { tagId: 4, name: 'testname4' },
  { tagId: 5, name: 'testname5' },
 ];

 const testVotes: Vote[] = [
  { voteId: 1, answerId: 1,userId: 1, voteType: false },
  { voteId: 2, answerId: 2,userId: 1, voteType: true },
  { voteId: 3, answerId: 3,userId: 1, voteType: true }
 ];
 
 const testFavorite: Favorite[] = [
  { favoriteId: 1, answerId: 1, userId: 1 },
  { favoriteId: 2, answerId: 2, userId: 1 },
  { favoriteId: 3, answerId: 3, userId: 1 }
 ];

 const completeArray: any[] = [
  testUser,
  testQuestion,
  testAnswer,
  testComments,
  testTags,
  testVotes,
  testFavorite
 ]

 
 for (const testData of completeArray) {
  for (const item of testData) {
   switch (testData) {
     case testUser:
       userService.createUser(item.username, item.email, item.password);
       break;
     case testQuestion:
       questionService.create(item.userId, item.title, item.content);
       break;
     case testAnswer:
       answerService.addAnswer(item.questionId, item.userId, item.content);
       break;
     case testComments:
       commentService.addComment(item.userId, item.questionId, item.answerId, item.content);
       break;
     case testTags:
       tagService.createTag(item.name);
       break;
     case testFavorite:
       favoriteService.addFavorite(item.answerId, item.userId);
       break;
     default:
      throw new Error('Unknown data type in test data array');
 }
 
 }

}
}

 static async setupDatabase() {
  await pool.query('SET FOREIGN_KEY_CHECKS=0');
  await pool.query('TRUNCATE TABLE Favorites');
  await pool.query('TRUNCATE TABLE Votes');
  await pool.query('TRUNCATE TABLE Comments');
  await pool.query('TRUNCATE TABLE Answers');
  await pool.query('TRUNCATE TABLE Questions');
  await pool.query('TRUNCATE TABLE Question_Tags');
  await pool.query('TRUNCATE TABLE Tags');
  await pool.query('TRUNCATE TABLE Users');

  await this.insertTestData();

  await pool.query('SET FOREIGN_KEY_CHECKS=1');

 }
}