import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api';

export type Question = {
  questionId: number;
  userId: number;
  title: string;
  content: string;
  createdAt: Date;
  modifiedAt: Date;
  viewCount: number;
};

class QuestionService {
  /**
   * Get question with given id.
   */
  get(id: number) {
    return axios.get<Question>(`/questions/${id}`).then((response) => response.data);
  }

  /**
   * Create a new question.
   */
  create(title: string, content: string, userId: number) {
    return axios
      .post<{ id: number }>('/questions', { title, content, userId })
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
   * Search for questions by text.
   */
  searchByText(searchTerm: string) {
    return axios
      .get<Question[]>('/questions/search', { params: { searchTerm } })
      .then((response) => response.data);
  }

  /**
   * Get a list of questions sorted by a specified criterion.
   */
  getQuestionsSorted(sortBy: 'views' | 'answers' | 'date' = 'date') {
    return axios
      .get<Question[]>('/questions/sorted', { params: { sortBy } })
      .then((response) => response.data);
  }

  /**
   * Get unanswered questions.
   */
  getUnansweredQuestions() {
    return axios.get<Question[]>('/questions/unanswered').then((response) => response.data);
  }
}

const questionService = new QuestionService();
export default questionService;