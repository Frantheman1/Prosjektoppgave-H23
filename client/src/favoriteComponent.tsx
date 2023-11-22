import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from './widgets';
import { NavLink } from 'react-router-dom';
import  { Answer } from './services/answersServices';
import favoriteService from './services/favoritesServices';
import { createHashHistory } from 'history';

const history = createHashHistory();


export class FavoritesList extends Component {
 favorites: Answer[] = []
 userId: number = 1

 render() {
  return(
   <>
     <Card title='Favorites'>
  {this.favorites.map((favAnswer) => (
    <NavLink key={favAnswer.answerId} to={'/questions/' + favAnswer.questionId} className="question-link">
      <div className="question-container">
        <div className="row">
          <div className="question-title">Content:</div>
          <div className="question-content">{favAnswer.content}</div>
        </div>
        <div className="row">
          <div className="question-title">Created at:</div>
          <div className="question-content">{new Date(favAnswer.createdAt).toDateString()}</div>
        </div>
        <div className="row">
          <div className="question-title">Last modified:</div>
          <div className="question-content">{new Date(favAnswer.modifiedAt).toDateString()}</div>
        </div>
        <div className="row">
          <div className="question-title">isAccepted:</div>
          <div className="question-content">{favAnswer.isAccepted ? "Yes" : "No"}</div>
        </div>
        <div className="row">
          <div className="question-title">Score:</div>
          <div className="question-content">{favAnswer.score}</div>
        </div>
        <div className="row">
          <div className="question-title">User:</div>
          <div className="question-content">{favAnswer.userId}</div>
        </div>
      </div>
    </NavLink>
  ))}
</Card>

     </>
  )
 }

 mounted() {
  favoriteService
   .getFavorites(this.userId)
   .then((favorites) => {
    this.favorites = favorites
   })
   .catch(error => console.error('Error fetching favorites:', error))
 }
}

