import React, { ChangeEvent } from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from './widgets';
import { NavLink } from 'react-router-dom';
import questionService, { Question } from './questionsServices'
import { createHashHistory } from 'history';

const history = createHashHistory();

/**
 * Renders question list.
 */
export class QuestionList extends Component {
  questions: Question[] = [];

  render() {
    return (
      <>
        <Card title="Questions">
          {this.questions.map((question) => (
            <Row key={question.questionId}>
              <Column>
                <NavLink to={'/questions/' + question.questionId}>{question.title}</NavLink>
              </Column>
            </Row>
          ))}
        </Card>
        <Button.Success onClick={() => history.push('/questions/new')}>New question</Button.Success>
      </>
    );
  }

  mounted() {
    questionService
      .getQuestionsSorted() // You may want to specify the sort or fetch all questions
      .then((questions) => (this.questions = questions))
      .catch((error) => Alert.danger('Error getting questions: ' + error.message));
  }
}

/**
 * Renders a specific question.
 */
export class QuestionDetails extends Component<{ match: { params: { id: string } } }> {
 question: Question | null = null;

 render() {
   // Check if this.question is not null before rendering
   if (!this.question) { // If this.question is null, render a placeholder or message
     return <div>Loading question details or question not found...</div>;
   }

   // The non-null assertion operator '!' is used after this.question below because we've
   // already checked that it's not null above in this render method.
   return (
     <>
       <Card title="Question">
         <Row>
           <Column width={2}>Title:</Column>
           <Column>{this.question.title}</Column>
         </Row>
         <Row>
           <Column width={2}>Content:</Column>
           <Column>{this.question.content}</Column>
         </Row>
         {/* Add other question details here */}
       </Card>
       <Button.Success onClick={() => history.push('/questions/' + this.question!.questionId + '/edit')}>
         Edit
       </Button.Success>
     </>
   );
 }

 mounted() {
   questionService
     .get(Number(this.props.match.params.id))
     .then((question) => (this.question = question))
     .catch((error) => {
       console.error(error);
       Alert.danger('Error getting question: ' + error.message);
     });
 }
}

/**
 * Renders form to edit a specific question.
 */
export class QuestionEdit extends Component<{ match: { params: { id: string } } }> {
  question: Question | null = null;

  handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (this.question) {
      this.question.title = event.target.value;
      this.forceUpdate(); // Since we're directly mutating the state, we need to force a re-render
    }
  };

  handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (this.question) {
      this.question.content = event.target.value;
      this.forceUpdate(); // Same as above
    }
  };

  render() {
    if (!this.question) {
      return;
    }

    return (
      <div>
        <h2>Edit Question</h2>
        <form>
          <Form.Label>Title</Form.Label>
          <Form.Input
            type="text"
            value={this.question.title}
            onChange={this.handleTitleChange}
          />

          <Form.Label>Content</Form.Label>
          <Form.Textarea
            value={this.question.content}
            onChange={this.handleContentChange}
          />

          <Button.Success onClick={this.save}>Save</Button.Success>
          <Button.Danger onClick={this.delete}>Delete</Button.Danger>
        </form>
      </div>
    );
  }

  save() {
    if (this.question) {
      // Assuming you have the updated question title and content from your form
      const updatedTitle = this.question.title; // Should be bound to form input
      const updatedContent = this.question.content; // Should be bound to form textarea

      questionService
        .update(this.question.questionId, updatedTitle, updatedContent)
        .then(() => {
          Alert.success('Question updated successfully');
          // Possibly redirect or perform further actions upon success
        })
        .catch((error) => {
          Alert.danger('Error updating question: ' + error.message);
        });
    } else {
      Alert.danger('No question to save');
    }
  }

  delete() {
    if (this.question) {
      questionService
        .delete(this.question.questionId)
        .then(() => {
          Alert.success('Question deleted successfully');
          // Possibly redirect or perform further actions upon success
        })
        .catch((error) => {
          Alert.danger('Error deleting question: ' + error.message);
        });
    } else {
      Alert.danger('No question to delete');
    }
  }

  mounted() {
    questionService
      .get(Number(this.props.match.params.id))
      .then((question) => (this.question = question))
      .catch((error) => Alert.danger('Error getting question: ' + error.message));
  }
}
/**
 * Renders form to create new question.
 */
export class QuestionNew extends Component {
  state = {
    title: '',
    content: '',
    userId: 1, // Assuming you have a logged-in user ID
  };

  render() {
    return (
      <>
        <Card title="New Question">
          <form onSubmit={this.handleSubmit}>
            <Form.Label>Title</Form.Label>
            <Form.Input
              type="text"
              value={this.state.title}
              onChange={(event) => this.setState({ title: event.target.value })}
            />

            <Form.Label>Content</Form.Label>
            <Form.Textarea
              value={this.state.content}
              onChange={(event) => this.setState({ content: event.target.value })}
            />

            <Button.Success type="submit">Create</Button.Success>
          </form>
        </Card>
      </>
    );
  }

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submit action
    const { title, content, userId } = this.state;

    if (!title.trim() || !content.trim()) {
      Alert.danger('Title and content are required.');
      return;
    }

    questionService
      .create(title, content, userId)
      .then((questionId) => history.push('/questions/' + questionId))
      .catch((error) => Alert.danger('Error creating question: ' + error.message));
  };
}