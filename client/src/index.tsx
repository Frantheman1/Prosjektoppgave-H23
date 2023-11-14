import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Component } from 'react-simplified';
import { NavBar, Card, Form, Alert,Row} from './widgets';
import { HashRouter, Route } from 'react-router-dom';
import { QuestionsList, QuestionsNew, QuestionDetails, QuestionEdit } from './questionsComponent';
import { AnswerEdit, AnswerNew } from './answerComponent';
import questionService, {Question}  from './questionsServices';
import { CommentEdit, CommentNew } from './commentsComponent';

interface MenuState {
  questions: Question[];
  searchValue: string;
}

class Menu extends Component {
  state: MenuState = {
    questions: [],
    searchValue: '',
  };

  render() {
    const { questions, searchValue } = this.state;
    let filteredQuestions: Question[] = [];

    if (searchValue) {
      filteredQuestions = questions.filter(question =>
       question.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        question.content.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    return (
      <NavBar brand="images/NewLogo4.png" brandAlt='Logo of the Site'>
        <Form.Input
          type="text"
          value={this.state.searchValue}
          onChange={(e) => {
            this.setState({ searchValue: e.target.value });
            console.log(filteredQuestions)
          }}
          isSearchBar={true}
          placeholder="Search"
        />
        <NavBar.Link to="/questions">Questions</NavBar.Link>
        <NavBar.Link to="/tags">Tags</NavBar.Link>
        <NavBar.Link to="/users">Users</NavBar.Link>
        <NavBar.Link to="/about">About</NavBar.Link>
        {filteredQuestions.length > 0 && (
          <Row>
            {filteredQuestions.map((question, index) => (
              <Row key={index}>{question.title}</Row>
            ))}
          </Row>
        )}
      </NavBar>
    );
  }

  mounted() {
    questionService
    .getAll()
    .then(questions => this.setState({ questions }))
    .catch(error => Alert.danger('Error getting questions: ' + error.message));
}
}


let root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <HashRouter>
      <div>
        <Menu />
        <Route exact path='/questions' component={QuestionsList}/>
        <Route exact path='/questions/new' component={QuestionsNew}/>
        <Route exact path='/questions/:id(\d+)' component={QuestionDetails}/>
        <Route exact path='/questions/:id(\d+)/edit' component={QuestionEdit}/>
        <Route exact path='/answers/:id(\d+)/edit' component={AnswerEdit}/>
        <Route path="/answers/new/:id(\d+)" component={AnswerNew} />
        <Route exact path='/comments/:id(\d+)/edit' component={CommentEdit}/>
        <Route path="/comments/new/:id(\d+)" component={CommentNew} />
        {/* Add other routes for tags, users, about, etc. */}
      </div>
    </HashRouter>
  );
}