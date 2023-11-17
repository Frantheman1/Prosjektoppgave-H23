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
           <NavLink to={'/questions/' + favAnswer.questionId}>
            <Row key={favAnswer.answerId}>
                   <Row>
            <Column width={2}>Content:</Column>
            <Column>{favAnswer.content}</Column>
          </Row>
          <Row>
            <Column width={2}>Created at:</Column>
            <Column>{new Date(favAnswer.createdAt).toDateString()}</Column>
          </Row>
          <Row>
            <Column width={2}>Last modified:</Column>
            <Column>{new Date(favAnswer.modifiedAt).toDateString()}</Column>
          </Row>
          <Row>
            <Column width={2}>isAccepted:</Column>
            <Column>{favAnswer.isAccepted ? "Yes" : "No"}</Column>
          </Row>
          <Row>
            <Column width={2}>Score:</Column>
            <Column>{favAnswer.score}</Column>
          </Row>
          <Row>
            <Column width={2}>User:</Column>
            <Column>{favAnswer.userId}</Column>
          </Row>             
            </Row>
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

