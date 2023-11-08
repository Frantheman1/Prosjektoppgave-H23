import express from 'express';
import questionService from '../services/questions-Services';

const router = express.Router();

router.get('/questions/:id', (request, response) => {
  const id = Number(request.params.id);
  questionService
    .get(id)
    .then((question) => (question ? response.send(question) : response.status(404).send('Question not found')))
    .catch((error) => response.status(500).send(error));
});

router.post('/questions', (request, response) => {
  const { title, content, userId } = request.body;
  if (title && content && typeof userId === 'number') {
    questionService
      .create(title, content, userId)
      .then((questionId) => response.status(201).send({ id: questionId }))
      .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Missing question title, content, or userId');
  }
});

router.put('/questions/:id', (request, response) => {
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

router.delete('/questions/:id', (request, response) => {
  const id = Number(request.params.id);
  questionService
    .delete(id)
    .then(() => response.status(204).send())
    .catch((error) => response.status(500).send(error));
});

router.get('/questions/search', (request, response) => {
 const searchTerm = request.query.searchTerm;
 if (typeof searchTerm === 'string') {
   questionService
     .searchByText(searchTerm)
     .then((questions) => response.send(questions))
     .catch((error) => response.status(500).send(error));
 } else {
   response.status(400).send('Search term must be a string');
 }
});

router.get('/questions/sorted', (request, response) => {
 const sortBy = request.query.sortBy;

 // Allowed sort options
 const validSortBys = ['views', 'answers', 'date'];
 // Validate sortBy to be one of the allowed strings or use default
 const validatedSortBy = (typeof sortBy === 'string' && validSortBys.includes(sortBy))
   ? sortBy
   : 'date'; // default sort

 questionService
   .getQuestionsSorted(validatedSortBy as 'views' | 'answers' | 'date')
   .then((questions) => response.send(questions))
   .catch((error) => response.status(500).send(error));
});

router.get('/questions/unanswered', (_request, response) => {
  questionService
    .getUnansweredQuestions()
    .then((questions) => response.send(questions))
    .catch((error) => response.status(500).send(error));
});

export default router;