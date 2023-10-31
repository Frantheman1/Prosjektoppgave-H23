import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Component } from 'react-simplified';
import { NavBar, Card} from './widgets';
import { HashRouter, Route } from 'react-router-dom';
import "../public/styles/style.css"


class Menu extends Component {
 render() {
   return (
    <>
     <NavBar brand="Todo App">
       <NavBar.Link to="/tasks">Tasks</NavBar.Link>
     </NavBar>
     <Card title="Noe"></Card>
    </>
   );
 }
}

class Home extends Component {
 render() {
   return <Card title="Welcome">This is Todo App</Card>;
 }
}

class TaskList extends Component {
 render() {
   return <Card title="Welcome">Maika vi shte eba vuv gaza</Card>;
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
