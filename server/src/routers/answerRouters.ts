// answerRouters.ts
//
// Author: Valentin Stoyanov
// Last updated: 20/11/2023 


import express from 'express';
import answerService from '../services/answers-Services';

const routerAnswers = express.Router();

// Get a specific answer by its Id
routerAnswers.get('/answers/:answerId', (request, response) => {
 const answerId = Number(request.params.answerId);

 answerService.getAnswer(answerId)
   .then((answer) => (answer ? response.send(answer) : response.status(404).send('Answer not found')))
   .catch(error => response.status(500).send(error));
});


// Get answers for a specific question
routerAnswers.get('/answers/question/:questionId', (request, response) => {
  const questionId = Number(request.params.questionId);

  if (isNaN(questionId)) {
    return response.status(400).send('Invalid question ID format');
  }

  answerService.getAnswersForQuestion(questionId)
    .then(answers => answers.length ? response.send(answers) : response.status(404).send('Request failed with status code 404'))
    .catch(error => response.status(500).send(error));
});

// Add a new answer to a question
routerAnswers.post('/answers', (request, response) => {
  const { questionId, userId, content } = request.body;
  if (questionId && userId && content) {
    answerService.addAnswer(questionId, userId, content)
      .then(answerId => response.status(201).send({ id: answerId }))
      .catch(error => response.status(500).send(error));
  } else {
    response.status(400).send('Missing required fields: questionId, userId, or content');
  }
});

// Update an existing answer
routerAnswers.put('/answers/:answerId', (request, response) => {
  const answerId = Number(request.params.answerId);
  const { content } = request.body;
  if (answerId && content) {
    answerService.updateAnswer(answerId, content)
      .then(() => response.send({ id: answerId }))
      .catch(error => response.status(500).send(error));
  } else {
    response.status(400).send('Invalid input for updating answer');
  }
});

// Delete an answer
routerAnswers.delete('/answers/:answerId', (request, response) => {
  const answerId = Number(request.params.answerId);
  answerService.deleteAnswer(answerId)
    .then(() => response.send())
    .catch(error => response.status(500).send(error));
});

// Toggle the accepted state of an answer
routerAnswers.put('/answers/:answerId/accept', (request, response) => {
  const answerId = Number(request.params.answerId);
 
  const { isAccepted } = request.body;
  if (typeof isAccepted === 'boolean') {
    answerService.getAnswer(answerId)
    .then(answer => {
      if (answer) {
        return answerService.markAnswerAsAccepted(answerId, isAccepted);
      } else {
        response.status(404).send('Answer not found');
      }
    })
    .then(() => response.send())
    .catch(error => response.status(500).send(error));
} else {
  response.status(400).send('Invalid input for toggling accepted state');
}
});

// Returns the count of answers per question
routerAnswers.get('/answerCounts', (_request, response) => {
 answerService.getAnswerCounts()
   .then(counts => response.send(counts))
   .catch(error => response.status(500).send(error));
});


export default routerAnswers;