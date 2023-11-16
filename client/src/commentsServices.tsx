import axios from 'axios';

// Assuming the baseURL is the same as for the QuestionService
axios.defaults.baseURL = 'http://localhost:3000/api/v1';

export type Comment = {
 commentId: number;
 questionId: number;
 answerId: number;
 userId: number;
 content: string;
 createdAt: Date;
 modifiedAt: Date;
};

export type CommentCountMap = {
  [key: number]: number;
};

enum CommentType{
  Question = 'question',
  Answer = 'answer',
}

class CommentService {
  /**
   * Get comment with given id.
   */
  getComment(id: number) {
    return axios.get<Comment>(`/comments/${id}`).then((response) => response.data);
  }

  /**
   * Get all comments.
   */

  getComments(id: number, commentType: CommentType) {
    const endpoint = commentType === CommentType.Question ? 'question' : 'answer';
    console.log("YOLO")
    console.log(endpoint, id)
    return axios.get<Comment[]>(`/comments/${endpoint}/${id}`).then(response => response.data);
    // return axios.get<Comment[]>(`/comments/answer/${id}`).then(response => response.data);
    
  }

  // /**
  //  * Get comments for a specific question.
  //  */
  // getCommentsForQuestion(questionId: number) {
  //   return axios.get<Comment[]>(`/comments/question/${questionId}`).then(response => response.data);
  // }
  // /**
  //  * Get comments for a specific answer.
  // */
  // getCommentsForAnswer(answerId: number) {
  //   return axios.get<Comment[]>(`/comments/answer/${answerId}`).then(response => response.data);
  // }

  /**
   * Add a new comment to a question.
   */
  addComment(answerId: number, questionId: number, userId: number, content: string) {
    return axios
      .post<{ id: number }>('/comments', { answerId, questionId, userId, content })
      .then(response => response.data.id);
  }

  /**
   * Update an existing comment.
   */
  updateComment(commentId: number, content: string) {
    return axios
      .put(`/comments/${commentId}`, { content })
      .then(response => response.data);
  }

  /**
   * Delete a comment.
   */
  deleteComment(commentId: number) {
    return axios
      .delete<void>(`/comments/${commentId}`)
      .then(response => response.data);
  }

  /**
   * Get the Count of comments a Question with an id has 
   */
  getCommentCounts() {
    return axios.get<{ questionId: number, count: number }[]>('/commentCounts').then(response => response.data);
  }
}

const commentService = new CommentService();
export default commentService;