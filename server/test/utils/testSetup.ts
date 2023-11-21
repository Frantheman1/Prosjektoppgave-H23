import axios from 'axios';
import pool from '../../src/mysql-pool';
import answerService, { Answer } from '../../src/services/answers-Services';
import commentService, { Comment } from '../../src/services/comments-Services';
import questionService, { Question } from '../../src/services/questions-Services';
import favoriteService, { Favorite } from '../../src/services/favorites-Services';
import tagService, { Tag } from '../../src/services/tags-Services';
import voteServices, { Vote } from '../../src/services/votes-Services';
import userService, { User } from '../../src/services/users-Services';
import app from '../../src/app';

export class TestDatabaseManager {
  static testUser: User[] = [
    { id: 1, username: 'testuser1', email: 'testuser1@example.com', password: 'hashedpassword1' },
  ];

  static testQuestions: Question[] = [
    {
      questionId: 1,
      userId: 1,
      title: 'testquestion1',
      content: 'testing1',
      createdAt: new Date(),
      modifiedAt: new Date(),
      viewCount: 1,
    },
    {
      questionId: 2,
      userId: 1,
      title: 'testquestion2',
      content: 'testing2',
      createdAt: new Date(),
      modifiedAt: new Date(),
      viewCount: 10,
    },
    {
      questionId: 3,
      userId: 1,
      title: 'testquestion3',
      content: 'testing3',
      createdAt: new Date(),
      modifiedAt: new Date(),
      viewCount: 25,
    },
    {
      questionId: 4,
      userId: 1,
      title: 'testquestion4',
      content: 'testing4',
      createdAt: new Date(),
      modifiedAt: new Date(),
      viewCount: 4,
    },
    {
      questionId: 5,
      userId: 1,
      title: 'testquestion5',
      content: 'testing5',
      createdAt: new Date(),
      modifiedAt: new Date(),
      viewCount: 1,
    },
  ];
  static testAnswers: Answer[] = [
    {
      answerId: 1,
      questionId: 1,
      userId: 1,
      content: 'Some answer',
      isAccepted: false,
      score: 0,
      createdAt: new Date(),
      modifiedAt: new Date(),
    },
    {
      answerId: 2,
      questionId: 2,
      userId: 1,
      content: 'Some answer2',
      isAccepted: false,
      score: 1,
      createdAt: new Date(),
      modifiedAt: new Date(),
    },
    {
      answerId: 3,
      questionId: 1,
      userId: 1,
      content: 'Some answer3',
      isAccepted: false,
      score: 0,
      createdAt: new Date(),
      modifiedAt: new Date(),
    },
  ];

  static testComments: Comment[] = [
    {
      commentId: 1,
      userId: 1,
      questionId: 1,
      answerId: 0,
      content: 'Some question comment1',
      createdAt: new Date(),
      modifiedAt: new Date(),
    },
    {
      commentId: 2,
      userId: 1,
      questionId: 2,
      answerId: 0,
      content: 'Some question comment2',
      createdAt: new Date(),
      modifiedAt: new Date(),
    },
    {
      commentId: 3,
      userId: 1,
      questionId: 0,
      answerId: 1,
      content: 'Some answer comment1',
      createdAt: new Date(),
      modifiedAt: new Date(),
    },
    {
      commentId: 4,
      userId: 1,
      questionId: 0,
      answerId: 2,
      content: 'Some answer comment2',
      createdAt: new Date(),
      modifiedAt: new Date(),
    },
  ];

  static testTags: Tag[] = [
    { tagId: 1, name: 'testname1' },
    { tagId: 2, name: 'testname2' },
    { tagId: 3, name: 'testname3' },
    { tagId: 4, name: 'testname4' },
    { tagId: 5, name: 'testname5' },
  ];

  static testQuestionTags = [
    { tagId: 1, questionId:1 },
    { tagId: 2, questionId:1 },
    { tagId: 3, questionId:2 },
  ];

  static testVotes: Vote[] = [
    { voteId: 1, answerId: 1, userId: 1, voteType: false },
    { voteId: 2, answerId: 2, userId: 1, voteType: true },
    { voteId: 3, answerId: 3, userId: 1, voteType: true },
  ];

  static testFavorites: Favorite[] = [
    { favoriteId: 1, answerId: 1, userId: 1 },
    { favoriteId: 2, answerId: 2, userId: 1 },
    { favoriteId: 3, answerId: 3, userId: 1 },
  ];

  static async processTestData(type: string, item: any) {
    switch (type) {
      case 'testUser':
        const user = item as User;
        await userService.createUser(user.username, user.email, user.password);
        break;
      case 'testQuestions':
        const question = item as Question;
        await questionService.create(question.title, question.content, question.userId);
        break;
      case 'testAnswers':
        const answer = item as Answer;
        await answerService.addAnswer(answer.questionId, answer.userId, answer.content);
        break;
      case 'testComments':
        const comment = item as Comment;
        await commentService.addComment(
          comment.userId,
          comment.questionId,
          comment.answerId,
          comment.content,
        );
        break;
      case 'testTags':
        const tag = item as Tag;
        await tagService.createTag(tag.name);
        break;
      case 'testQuestionTags':
          const tagq = item;
          await tagService.addTagToQuestion(tagq.tagId, tagq.questionId);
          break;
      case 'testFavorites':
        const favorite = item as Favorite;
        await favoriteService.addFavorite(favorite.answerId, favorite.userId);
        break;
      default:
        throw new Error('Unknown data type in test data array');
    }
  }

  static async insertTestData() {
    const dataSets = {
      testUser: TestDatabaseManager.testUser,
      testQuestions: TestDatabaseManager.testQuestions,
      testAnswers: TestDatabaseManager.testAnswers,
      testComments: TestDatabaseManager.testComments,
      testTags: TestDatabaseManager.testTags,
      // testVotes: TestDatabaseManager.testVotes,
      testFavorites: TestDatabaseManager.testFavorites,
      testQuestionTags:TestDatabaseManager.testQuestionTags,
    };


     for (const testData of Object.entries(dataSets)) {
       let type: string = testData[0] || 'unknown';
       await Promise.all(
         testData[1].map(async (item) => {
           await TestDatabaseManager.processTestData(type, item);
         }),
       );
     }
  }

  static async setupDatabase() {
    pool.query('SET FOREIGN_KEY_CHECKS=0');

    // Truncate all tables
    pool.query('TRUNCATE TABLE Favorites');
    pool.query('TRUNCATE TABLE Votes');
    pool.query('TRUNCATE TABLE Comments');
    pool.query('TRUNCATE TABLE Answers');
    pool.query('TRUNCATE TABLE Questions');
    pool.query('TRUNCATE TABLE Question_Tags');
    pool.query('TRUNCATE TABLE Tags');
    pool.query('TRUNCATE TABLE Users');

    try {
      await this.insertTestData();
    } catch (e) {
      console.error(e);
    }

    pool.query('SET FOREIGN_KEY_CHECKS=1');
  }
}
