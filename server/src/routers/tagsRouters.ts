import express from 'express';
import tagService from '../services/tags-Services';

const routerTags = express.Router();

/**
 * Get all tags
 */
routerTags.get('/tags', (_request,response) => {
 tagService
  .getAllTags()
  .then((tags) => response.send(tags))
  .catch((error) => response.status(500).send(error));
});

/**
 * Get tags for a specific question
 */
routerTags.get('/tags/question/:questionId', (request, response) => {
 tagService
  .getTagsForQuestion(Number(request.params.questionId))
  .then((tags) => response.send(tags))
  .catch((error) => response.status(500).send(error))
})

/**
 * Adds a tag to a question
 */

routerTags.post('/tags/question', (request,response) => {
 const {tagId, questionId} = request.body;


 if(typeof tagId === 'number' && typeof questionId === 'number') {
  tagService
   .addTagToQuestion(tagId,questionId)
   .then(() => response.status(201).send('Tag added to question successfully'))
   .catch((error) => response.status(500).send(error.message));
 } else {
   response.status(400).send('Invalid tagId or questionId');
 }
});



export default routerTags


