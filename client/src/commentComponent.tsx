import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from './widgets';
import answerService, { Answer } from './services/answersServices';
import commentService, { Comment } from './services/commentsSevrvices';
import { createHashHistory } from 'history';

const history = createHashHistory();

export class CommentEdit extends Component <
{ match: { params: { id: number, backId:number } } },
{ comment: Partial<Comment> }> {
 comment = { commentId: 0,  content: '', userId:1}
 backPath: number = 0
  render(){
    return(
      <>
        <Card title='Edit answer'>
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
    const { commentId, content } = this.comment;

    commentService
      .updateComment(commentId, content)
      .then(() => history.push('/questions/' + this.backPath))
      .catch((error) => Alert.danger('Error saving question: ' + error.message));
  };

  delete = () => {
   const { commentId } = this.comment;
    commentService
      .deleteComment(commentId)
      .then(() => history.push('/questions/'+ this.backPath))
      .catch((error) => Alert.danger('Error deleting a question: ' + error.message));
  };

  mounted() {
   commentService
      .getComment(this.props.match.params.id)
      .then((comment) => {
       this.comment = comment
       this.backPath = this.props.match.params.backId
      })
      .catch((error) => Alert.danger('Error getting task: ' + error.message));
      console.log('Answer>>>>',this.comment)
  }


}

export class CommentNew extends Component <
{ match: {
  params: { id: number, backId:number | undefined };
  path: string;
 }; 
}>
{
 content: string = ''
 userId: number = 1
 questionId: number = 0
 answerId: number = 0
 backPath: number = 0


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
    .addComment(this.userId, this.questionId, this.answerId , this.content )
    .then(() => history.push( '/questions/' + (this.backPath? this.backPath : this.questionId)))
    .catch((error) => {
      Alert.danger( 'Error creating comment: ' + error.message )
    })
}
 mounted() {
  const pathname = this.props.match.path;
  const pathSegments = pathname.split('/');

  console.log('hehe', pathSegments)

  if (pathSegments.includes('answer')) {
   this.answerId = Number(this.props.match.params.id);
   this.backPath = Number(this.props.match.params.backId);
 } else if (pathSegments.includes('question')) {
   this.questionId = Number(this.props.match.params.id);
 }
}
}

