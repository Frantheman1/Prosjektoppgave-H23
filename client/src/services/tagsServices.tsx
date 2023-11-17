import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v1';

export type Tag = {
 tagId: number;
 name: string;
 questionCount?: number; // La til denne linjen, gjør den valgfri
 description?: string; // La til denne linjen, gjør den valgfri
};

export type TagWithCount = {
  name: string;
  questionCount: number;
};


class TagsServices {

 /**
   * Get all tags.
   */
 getAllTags() {
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

getAllTagsWithQuestionCount() {
  return axios.get<TagWithCount[]>('/tags/count').then(response => response.data);
}

}


const tagService = new TagsServices();
export default tagService;