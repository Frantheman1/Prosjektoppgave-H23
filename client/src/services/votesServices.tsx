import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v1';


class VoteService  {

   /**
   * Cast a vote on an answer.
   * @param {number} answerId - The ID of the answer being voted on.
   * @param {number} userId - The ID of the user casting the vote.
   * @param {number} voteType - The type of vote (1 for upvote, 0 for downvote).
   * @return {Promise} A promise that resolves with the server response.
   */
   voteOnAnswer(answerId: number, userId: number, voteType: number) {
    return axios.post(`/votes/${answerId}`, { userId, voteType })
      .then(response => response.data);
  }


}

const voteService = new VoteService();
export default voteService;