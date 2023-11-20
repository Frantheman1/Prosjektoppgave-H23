// commentRouters.ts
//
// Author: Valentin Stoyanov
// Co-author: Kine Alte Weiseth
// Last updated: 20/11/2023 


import express from 'express';
import commentService from '../services/comments-Services';

const routerComments = express.Router();

// Get all comments
routerComments.get('/comments', (_request, response) => {
  commentService
   .getComments()
   .then((comments) => response.send(comments))
   .catch((error) => response.status(500).send(error))
});

// Get a single comment by its ID
routerComments.get('/comments/:commentId', (request, response) => {
 const commentId = Number(request.params.commentId);
 
 if (!commentId) {
   return response.status(400).send('Invalid comment ID');
 }

 commentService.getComment(commentId)
   .then(comment => {
     if (!comment) {
       return response.status(404).send('Comment not found');
     }
     response.send(comment);
   })
   .catch(error => response.status(500).send(error));
});



// Add a new comment to a question
routerComments.post('/comments', (request, response) => {
  const { userId, questionId, answerId, content } = request.body;


  if (userId && content && (questionId !== null || answerId !== null)) {
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


export default routerComments;