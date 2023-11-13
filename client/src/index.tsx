import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Component } from 'react-simplified';
import { NavBar, Card, Form} from './widgets';
import { HashRouter, Route } from 'react-router-dom';
import Login from './components/authetication/login';
import Register from './components/authetication/register';



class Menu extends Component {
  value: string = "";

  render() {
    return (
      <NavBar brand="images/NewLogo4.png" brandAlt='Logo of the Site'>
        <Form.Input
          type="text"
          value={this.value}
          onChange={(e) => (this.value = e.currentTarget.value)}
          isSearchBar={true}
          placeholder="Search"
        />
        <NavBar.Link to="/questions">Questions</NavBar.Link>
        <NavBar.Link to="/tags">Tags</NavBar.Link>
        <NavBar.Link to="/users">Users</NavBar.Link>
        <NavBar.Link to="/about">About</NavBar.Link>
        <NavBar.Link to="/login">Log in</NavBar.Link>
        <NavBar.Link to="/register">Register</NavBar.Link>
      </NavBar>
    );
  }
}


let root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <HashRouter>
      <div>
        <Menu />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        {/* Add other routes for tags, users, about, etc. */}
      </div>
    </HashRouter>
  );
}