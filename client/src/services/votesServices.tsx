// votesServices.ts
//
// Author: Valentin Stoyanov
// Last updated: 20/11/2023 

import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v1';


class VoteService  {

   /**
   * Cast a vote on an answer.
   */
   voteOnAnswer(answerId: number, userId: number, voteType: number) {
    return axios.post(`/votes/${answerId}`, { userId, voteType })
      .then(response => response.data);
  }


}

const voteService = new VoteService();
export default voteService;