import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v1';

export type Question = {
  questionId: number;
  userId: number;
  title: string;
  content: string;
  createdAt: Date;
  modifiedAt: Date;
  viewCount: number;
  score: number;
};

class QuestionService {
  /**
   * Get question with given id.
   */
  get(id: number) {
    return axios.get<Question>(`/questions/${id}`).then((response) => response.data);
  }

  /**
   * Get all questions.
   */
  getAll() {
    return axios.get<Question[]>('/questions').then((response) => response.data);
  }

  /**
   * Create a new question.
   */
  create(title: string, content: string, userId: number) {
    return axios
      .post<{ id: number }>('/questions', { 
        title: title, 
        content: content, 
        userId: userId })
      .then((response) => response.data.id);
  }

  /**
   * Update an existing question.
   */
  update(questionId: number, title: string, content: string) {
    return axios
      .put(`/questions/${questionId}`, { title, content })
      .then((response) => response.data);
  }

  /**
   * Delete a question.
   */
  delete(questionId: number) {
    return axios
      .delete<void>(`/questions/${questionId}`)
      .then((response) => response.data);
  }

   /**
   * Update view count of a question.
   */
   updateViewCount(questionId: number) {
    return axios
      .put('/updateViewCount', { questionId })
      .then(response => response.data);
  }
  

  updateQuestionScore(questionId: number, score: number) {
    return axios
      .put(`/questions/${questionId}/score`, { score })
      .then(response => response.data);
  }
}

const questionService = new QuestionService();
export default questionService;