import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Component } from 'react-simplified';
import { NavBar, Card, Form} from './widgets';
import { HashRouter, Route } from 'react-router-dom';
import "../public/styles/style.css"


class Menu extends Component {
  value: string = ""
 render() {
 
   return (
    <>
     <NavBar brand="images/NewLogo4.png" brandAlt='Logo av Side'>
      <Form.Input 
          type="text" 
          value={this.value} 
          onChange={(e)=> this.value = e.currentTarget.value}
          isSearchBar={true}
          placeholder="Search">
      </Form.Input>
       <NavBar.Link to="/tasks">Questions</NavBar.Link>
       <NavBar.Link to="/tasks">Tags</NavBar.Link>
       <NavBar.Link to="/tasks">Users</NavBar.Link>
       <NavBar.Link to="/tasks">About</NavBar.Link>
     </NavBar>
    </>
   );
 }
}

class Home extends Component {
 render() {
   return <Card title=""></Card>;
 }
}

class TaskList extends Component {
 render() {
   return <Card title="Noe"></Card>;
 }
}





let root = document.getElementById('root');
if (root)
  createRoot(root).render(
    <HashRouter>
      <div>
        <Menu />
        <Route exact path="/" component={Home} />
        <Route exact path="/tasks" component={TaskList} />
      </div>
    </HashRouter>,
  );
