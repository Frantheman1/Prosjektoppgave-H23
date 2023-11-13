import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Component } from 'react-simplified';
import { NavBar, Card, Form, Alert,Row} from './widgets';
import { HashRouter, Route } from 'react-router-dom';

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
        {/* Add other routes for tags, users, about, etc. */}
      </div>
    </HashRouter>
  );
}