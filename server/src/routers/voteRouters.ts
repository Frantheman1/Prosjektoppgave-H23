import express from 'express';
import voteService from '../services/votes-Services';

const routerVotes = express.Router();

routerVotes.post('/votes/:answerId', (request, response) => {
 const answerId = Number(request.params.answerId);
 const userId = request.body.userId; 
 const voteType = request.body.voteType; 

 if (voteType != 1 && voteType != 0) {
   return response.status(400).send('Invalid userId or voteType');
 }

 voteService.voteOnAnswer(answerId, userId, voteType)
   .then(() => response.send(`Vote updated for answer ${answerId}`))
   .catch(error => response.status(500).send(error.message));
});

export default routerVotes


