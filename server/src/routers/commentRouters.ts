import express from 'express';
import commentService from '../services/comments-Services';

const routerComments = express.Router();

// Get comments for a specific question
routerComments.get('/comments/question/:questionId', (request, response) => {
  const questionId = Number(request.params.questionId);

  commentService.getCommentsForQuestion(questionId)
    .then(comments => comments.length ? response.send(comments) : response.status(404).send('No comments found for this question'))
    .catch(error => response.status(500).send(error));
});

// Get comments for a specific answer
routerComments.get('/comments/answer/:answerId', (request, response) => {
  const answerId = Number(request.params.answerId);
  
  console.log(answerId)
  commentService.getCommentsForAnswer(answerId)
    .then(comments => comments.length ? response.send(comments) : response.status(404).send('No comments found for this answer'))
    .catch(error => response.status(500).send(error));
});

// Add a new comment to a question
routerComments.post('/comments', (request, response) => {
  const { userId, questionId, answerId, content } = request.body;
  if (userId && questionId && answerId && content) {
    commentService.addComment(userId, questionId, answerId, content)
      .then(commentId => response.status(201).send({ id: commentId }))
      .catch(error => response.status(500).send(error));
  } else {
    response.status(400).send('Missing required fields: questionId, userId, answerId or content');
  }
});

// Update an existing comment
routerComments.put('/comments/:commentId', (request, response) => {
  const commentId = Number(request.params.commentId);
  const { content } = request.body;
  if (commentId && content) {
    commentService.updateComment(commentId, content)
      .then(() => response.send({ id: commentId }))
      .catch(error => response.status(500).send(error));
  } else {
    response.status(400).send('Invalid input for updating comment');
  }
});

// Delete an comment
routerComments.delete('/comments/:commentId', (request, response) => {
  const commentId = Number(request.params.commentId);
  commentService.deleteComment(commentId)
    .then(() => response.send())
    .catch(error => response.status(500).send(error));
});

routerComments.get('/commentCounts', (_request, response) => {
 commentService.getCommentCounts()
   .then(counts => response.send(counts))
   .catch(error => response.status(500).send(error));
});

export default routerComments;