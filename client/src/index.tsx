import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Component } from 'react-simplified';
import { NavBar, Card, Form, Alert,Row} from './widgets';
import { HashRouter, NavLink, Route } from 'react-router-dom';
import { QuestionsList, QuestionsNew, QuestionDetails, QuestionEdit } from './questionsComponent';
import { AnswerEdit, AnswerNew } from './answerComponent';
import { FavoritesList } from './favoriteComponent';
import { CommentNew, CommentEdit } from './commentComponent';
import { TagsList } from './tagsComponent';
import questionService, {Question}  from './services/questionsServices';
import AboutPage from './about';


class Menu extends Component {
  state: {
    questions: Question[];
    searchValue: string;
  } = {questions: [],
       searchValue: ''};
  filteredQuestions: Question[] = [];

  render() {
    
    return (
      <NavBar brand="images/NewLogo4.png" brandAlt='Logo of the Site'>
        <Form.Input
          type="text"
          value={this.state.searchValue}
          onChange={(e) => {
            this.setState({ searchValue: e.target.value });
            this.search()
          }}
          isSearchBar={true}
          placeholder="Search"
        />
        {this.filteredQuestions.length > 0 && (
          <Row>
            {this.filteredQuestions.map((question, index) => (
              <NavLink to={'/questions/' + question.questionId} >{question.title}</NavLink>
            ))}
          </Row>
        )}
        <NavBar.Link to="/questions">Questions</NavBar.Link>
        <NavBar.Link to="/tags">Tags</NavBar.Link>
        <NavBar.Link to="/favorites">Favorites</NavBar.Link>
        <NavBar.Link to="/about">About</NavBar.Link>
        
      </NavBar>
    );
  }

  search() {
    const { questions, searchValue } = this.state;
    
    if (searchValue) {
      this.filteredQuestions = questions.filter(question =>
       question.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        question.content.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
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
        <Route path="/favorites" component={FavoritesList} />
        <Route path="/tags" component={TagsList} />
        <Route path='/comment/:id(\d+)/edit/:backId(\d+)' component={CommentEdit}/>
        <Route path="/comments/answer/:id(\d+)/new/:backId(\d+)" component={CommentNew} />
        <Route path="/comments/question/:id(\d+)/new/" component={CommentNew} />
        <Route path="/about" component={AboutPage} />
        {/* Add other routes for tags, users, about, etc. */}
      </div>
    </HashRouter>
  );
}