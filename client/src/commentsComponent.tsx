import * as React from 'react';
import { Component } from 'react-simplified';
import { useLocation } from 'react-router-dom';
import { Alert, Card, Row, Column, Form, Button } from './widgets';
import { NavLink } from 'react-router-dom';
import commentService, { Comment, CommentCountMap } from './commentsServices';
import { createHashHistory } from 'history';

const history = createHashHistory();

export class CommentEdit extends Component <
{ match: { params: { id: number } } },
{ comment: Partial<Comment> }> {
  comment = {answerId:0, questionId:0, commentId: 0,  content: '', userId:1}
  render(){
    return(
      <>
        <Card title='Edit comment'>
          <Row>
            <Column width={2}>
              <Form.Label>Content:</Form.Label>
            </Column>
            <Column>
              <Form.Textarea 
              value={this.comment.content} 
              onChange={(event) => (this.comment.content = event.currentTarget.value)} 
              rows={10}/>
            </Column>
          </Row>
        </Card>
        <Row>
          <Column>
            <Button.Success onClick={this.save}>Save</Button.Success>
          </Column>
          <Column right>
            <Button.Danger onClick={this.delete}>Delete</Button.Danger>
          </Column>
        </Row>
      </>
    )
  }

  save = () => {
    const { commentId, content, questionId } = this.comment;
    commentService
      .updateComment(commentId, content)
      .then(() => history.push('/questions/' + questionId))
      .catch((error) => Alert.danger('Error saving question: ' + error.message));
  };

  delete = () => {
    const { commentId, questionId } = this.comment;
    commentService
      .deleteComment(commentId)
      .then(() => history.push('/questions/'+ questionId))
      .catch((error) => Alert.danger('Error deleting a question: ' + error.message));
  };

  mounted() {
    commentService
      .getComment(this.props.match.params.id)
      .then((comment) => {this.comment = comment})
      .catch((error) => Alert.danger('Error getting comment: ' + error.message));
  }
}

export class CommentNew extends Component <{ match: {path: any; params: { id: number } } }>{
  content: string = ''
  userId: number = 1
  questionId: number = 0
  answerId: number = 0

  render(){
    return (
      <>
        <Card title='New Comment'>
          <Row>
            <Column width={2}>
              <Form.Label>Content:</Form.Label>
            </Column>
            <Column>
              <Form.Textarea 
              type="text"
              value={this.content} 
              onChange={(event) => {this.content = event.currentTarget.value}} 
              rows={10}/>
            </Column>
          </Row>
        </Card>
        <Button.Success
          onClick={this.create}
        >
          Create
        </Button.Success>
      </>
    )
  }

  create() {
    commentService
      .addComment( this.answerId, this.questionId ,this.userId, this.content )
      .then((id) => history.push( '/questions/' + this.questionId ))
      .catch((error) => {
        console.error( "Detailed error:", error );
        Alert.danger( 'Error creating comment: ' + error.message )
      })
  }

  mounted() {
    const pathname = this.props.match.path;
    const pathSegments = pathname.split('/');

    console.log("HER:" + pathSegments)

    // Check if the path includes 'answer' or 'question' and set the id
    if (pathSegments.includes('answer')) {
      this.answerId = Number(this.props.match.params.id);
    } else if (pathSegments.includes('question')) {
      this.questionId = Number(this.props.match.params.id);
    }
  }
}

