// answersServices.ts
//
// Author: Valentin Stoyanov
// Last updated: 20/11/2023 

import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v1';

export type Answer = {
 answerId: number;
 questionId: number;
 userId: number;
 content: string;
 isAccepted: boolean;
 createdAt: Date;
 modifiedAt: Date;
 score: number;
};

// Type used for AnswerCount
export type AnswerCountMap = {
 [key: number]: number;
};

class AnswerService {
  /**
   * Get question with given id.
   */
  getAnswer(id: number) {
   return axios.get<Answer>(`/answers/${id}`).then((response) => response.data);
 }

 
  /**
   * Get answers for a specific question.
   */
  getAnswersForQuestion(questionId: number) {
    return axios.get<Answer[]>(`/answers/question/${questionId}`).then(response => response.data);
  }

  /**
   * Add a new answer to a question.
   */
  addAnswer(questionId: number, userId: number, content: string) {
    return axios
      .post<{ id: number }>('/answers', { questionId, userId, content })
      .then(response => response.data.id);
  }

  /**
   * Update an existing answer.
   */
  updateAnswer(answerId: number, content: string) {
    return axios
      .put(`/answers/${answerId}`, { content })
      .then(response => response.data);
  }

  /**
   * Delete an answer.
   */
  deleteAnswer(answerId: number) {
    return axios
      .delete<void>(`/answers/${answerId}`)
      .then(response => response.data);
  }

  /**
   * Toggle the accepted state of an answer.
   */
  markAnswerAsAccepted(answerId: number, isAccepted: boolean) {
    return axios
      .put(`/answers/${answerId}/accept`, { isAccepted })
      .then(response => response.data);
  }

  /**
   * Get the Count of answers a Question with an id has 
   */
  getAnswerCounts() {
   return axios.get<{ questionId: number, count: number }[]>('/answerCounts').then(response => response.data);
 }

 /**
   * Vote on an answer. Vote can be 1 for upvote and -1 for downvote.
   */
 voteOnAnswer(answerId: number, vote: number) {
  return axios
    .post<void>(`/answers/${answerId}/vote`, { vote })
    .then(response => response.data);
 }
}

const answerService = new AnswerService();
export default answerService;