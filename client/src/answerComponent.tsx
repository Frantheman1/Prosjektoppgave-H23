import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from './widgets';
import { NavLink } from 'react-router-dom';
import answerService, { Answer, AnswerCountMap } from './services/answersServices';
import { createHashHistory } from 'history';

const history = createHashHistory();

export class AnswerEdit extends Component <
{ match: { params: { id: number } } },
{ answer: Partial<Answer> }> {
 answer = {questionId:0, answerId: 0,  content: '', userId:1}
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
              value={this.answer.content} 
              onChange={(event) => (this.answer.content = event.currentTarget.value)} 
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
    const { answerId, content, questionId } = this.answer;

    answerService
      .updateAnswer(answerId, content)
      .then(() => history.push('/questions/' + questionId))
      .catch((error) => Alert.danger('Error saving question: ' + error.message));
  };

  delete = () => {
   const { answerId, questionId } = this.answer;
    answerService
      .deleteAnswer(answerId)
      .then(() => history.push('/questions/'+ questionId))
      .catch((error) => Alert.danger('Error deleting a question: ' + error.message));
  };

  mounted() {
   answerService
      .getAnswer(this.props.match.params.id)
      .then((answer) => {
       
       this.answer = answer})
      .catch((error) => Alert.danger('Error getting task: ' + error.message));
      console.log('Answer>>>>',this.answer)
  }


}

export class AnswerNew extends Component <{ match: { params: { id: number } } }>{
 content: string = ''
 userId: number = 1
 questionId: number = 0

 render(){
   return (
     <>
       <Card title='New Answer'>
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
   answerService
     .addAnswer(this.questionId,this.userId, this.content )
     .then((id) => history.push('/questions/' + this.questionId))
     .catch((error) => {
       console.error("Detailed error:", error);
       Alert.danger('Error creating task: ' + error.message)
     })
 }

 mounted() {
  this.questionId = Number(this.props.match.params.id);
}
}

