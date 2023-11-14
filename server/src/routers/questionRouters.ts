import express, { response } from 'express';
import questionService from '../services/questions-Services';

const routerQuestions = express.Router();

routerQuestions.get('/questions', (_request, response) => {
  questionService
    .getAll()
    .then((questions) => response.send(questions))
    .catch((error) => response.status(500).send(error))
})

routerQuestions.get('/questions/:id', (request, response) => {
  const id = Number(request.params.id);
  questionService
    .get(id)
    .then((question) => (question ? response.send(question) : response.status(404).send('Question not found')))
    .catch((error) => response.status(500).send(error));
});

// Example request body: { title: "Ny oppgave", content: 'random tekst' ,userId: 5}
routerQuestions.post('/questions', (request, response) => {
  const { title, content, userId } = request.body;
  if(title && content) {
    title.trim()
    content.trim()
  }
  if (
    title && 
    title.length !== 0 && 
    content && 
    content.length !== 0 && 
    typeof userId === 'number'
    ) {
    questionService
      .create(title, content, userId)
      .then((questionId) => response.send({ id: questionId }))
      .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Missing question title, content, or userId');
  }
});

routerQuestions.put('/questions/:id', (request, response) => {
  const { title, content } = request.body;
  const id = Number(request.params.id);
  if (typeof id === 'number' && title && content) {
    questionService
      .update(id, title, content)
      .then(() => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Invalid input for updating question');
  }
});

routerQuestions.put('/updateViewCount', (request, response) => {
  const { questionId } = request.body;

  if(!questionId) {
    return response.status(400).send('Question ID is required');
  }

  questionService
    .updateViewCount(Number(questionId))
    .then(() => response.send())
    .catch((error) => response.status(500).send(error));
});

routerQuestions.delete('/questions/:id', (request, response) => {
  questionService
    .delete(Number(request.params.id))
    .then(() => response.send())
    .catch((error) => response.status(500).send(error));
});

export default routerQuestions;