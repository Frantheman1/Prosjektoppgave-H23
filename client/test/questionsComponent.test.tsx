import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import {
  QuestionList,
  QuestionDetails,
  QuestionEdit,
  QuestionNew,
} from '../src/questionsComponent';

jest.mock('./questionsServices', () => ({
  getQuestionsSorted: jest.fn(() => Promise.resolve([])),
  get: jest.fn(() => Promise.resolve(null)),
  update: jest.fn(() => Promise.resolve()),
  delete: jest.fn(() => Promise.resolve()),
  create: jest.fn(() => Promise.resolve(1)),
}));

describe('QuestionList', () => {
    it('renders a list of questions', async () => {
      const mockedQuestions = [
        { questionId: 1, title: 'Question 1' },
        { questionId: 2, title: 'Question 2' },
      ];
  
      // Mock getQuestionsSorted to return questions
      const mockGetQuestionsSorted = jest.fn(() => Promise.resolve(mockedQuestions));
      jest.mock('./questionsServices', () => ({
        getQuestionsSorted: mockGetQuestionsSorted,
      }));
  
      const { container } = render(
        <BrowserRouter>
          <QuestionList />
        </BrowserRouter>
      );
  
      await waitFor(() => expect(mockGetQuestionsSorted).toHaveBeenCalled());
  
      // Check if the "Questions" title is present
      const questionsTitle = container.querySelector('h5');
      expect(questionsTitle).toBeTruthy();
      expect(questionsTitle!.textContent).toBe('Questions');
  
      // Check if the expected number of question titles are rendered
      mockedQuestions.forEach((question) => {
        const questionTitle = container.querySelector(`a[href="/questions/${question.questionId}"]`);
        expect(questionTitle).toBeTruthy();
        expect(questionTitle!.textContent).toBe(question.title);
      });
  
      // Check if the correct number of question elements are rendered
      const questionElements = container.querySelectorAll('.card-body a');
      expect(questionElements.length).toBe(mockedQuestions.length);
  
    });
  });
  
  

  describe('QuestionDetails', () => {
    it('renders question details', async () => {
      const mockedQuestion = {
        questionId: 1,
        title: 'Sample Question',
        content: 'Sample content for the question',
      };
  
      // Mock get to return the question details
      const mockGet = jest.fn(() => Promise.resolve(mockedQuestion));
      jest.mock('./questionsServices', () => ({
        get: mockGet,
      }));
  
      const { container } = render(
        <BrowserRouter>
          <QuestionDetails match={{ params: { id: '1' } }} />
        </BrowserRouter>
      );
  
      await waitFor(() => expect(mockGet).toHaveBeenCalled());
  
      // Check if the title and content of the question are rendered
      const questionTitle = container.querySelector('h2');
      expect(questionTitle).toBeTruthy();
      expect(questionTitle!.textContent).toBe('Sample Question');
  
      const questionContent = container.querySelector('.card-body');
      expect(questionContent).toBeTruthy();
      expect(questionContent!.textContent).toBe('Sample content for the question');
  
    });
  });
  

describe('QuestionEdit', () => {
  it('renders form to edit question', async () => {
    const { getByLabelText, getByText } = render(
      <BrowserRouter>
        <QuestionEdit match={{ params: { id: '1' } }} />
      </BrowserRouter>
    );

    // Mock question details
    await waitFor(() => expect(getByLabelText('Title')).toBeTruthy());
    expect(getByText('Edit')).toBeTruthy();

    // Simulate changes in form inputs
    fireEvent.change(getByLabelText('Title'), { target: { value: 'Updated Title' } });
    fireEvent.change(getByLabelText('Content'), { target: { value: 'Updated Content' } });

    // Simulate button clicks (Save and Delete)
    fireEvent.click(getByText('Save'));
    fireEvent.click(getByText('Delete'));

  });
});

describe('QuestionNew', () => {
  it('renders form to create new question', async () => {
    const { getByLabelText, getByText } = render(
      <BrowserRouter>
        <QuestionNew />
      </BrowserRouter>
    );

    expect(getByText('New Question')).toBeTruthy();

    // Simulate changes in form inputs
    fireEvent.change(getByLabelText('Title'), { target: { value: 'New Title' } });
    fireEvent.change(getByLabelText('Content'), { target: { value: 'New Content' } });

    // Simulate form submission
    fireEvent.click(getByText('Create'));

  });
});
