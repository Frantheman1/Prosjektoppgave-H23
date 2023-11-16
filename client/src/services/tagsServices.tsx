import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v1';

export type Tag = {
 tagId: number;
 name: string;
};

class TagsServices {
 /**
   * Get all tags.
   */
 getAll() {
  return axios.get<Tag[]>('/tags').then(response => response.data);
}

/**
 * Get tags for a specific question.
 */
getTagsForQuestion(questionId: number) {
  return axios.get<Tag[]>(`/tags/question/${questionId}`).then(response => response.data);
}

/**
 * Add a tag to a question
 */
addTagToQuestion(questionId: number, tagId: number) {
 return axios.post('/tags/associate', { questionId, tagId })
   .then(response => response.data);
}
}


const tagService = new TagsServices();
export default tagService;