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

class CommentService {
  /**
   * Get all comments.
   */

  getComments() {
      return axios.get<Comment[]>(`/comments`).then(response => response.data);    
  }

  /**
   * Get a single comment by its ID.
   */
  getComment(commentId: number) {
   return axios.get<Comment>(`/comments/${commentId}`).then(response => response.data);
 }

  /**
   * Add a new comment to a question.
   */
  addComment(userId: number, questionId: number | null, answerId: number | null, content: string) {
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

}

const commentService = new CommentService();
export default commentService;