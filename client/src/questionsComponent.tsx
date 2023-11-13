import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from './widgets';
import { NavLink } from 'react-router-dom';
import questionService, { Question } from './questionsServices';
import tagServices, { Tag } from './tagsServices'
import { createHashHistory } from 'history';

const history = createHashHistory();


/**
 * Renders Questions list.
 */

export class QuestionsList extends Component {
  questions: Question[] = []
  tags:{ [key: number]: Tag[] }  = {}

  render() {
    return (
      <>
       <Button.Success onClick={() => history.push('/questions/new')}>New question</Button.Success>
        <Card title='Questions'>
          {this.questions.map((question) => (
            <Row key={question.questionId}>
              <NavLink to={'/questions/' + question.questionId}>
                <Column>
                  <Row>{question.title}-</Row>
                  <Row>{question.content}</Row>
                  <Row>
                  {this.tags[question.questionId]?.map((tag, index) => (
                    <Row key={index}>{tag.name}</Row>
                  ))}
                    </Row>
                 </Column>
              </NavLink>
              
            </Row>
          ))}

        </Card>
      </>
    )
  }

  getTagsForQuestions(questionId: number) {
    tagServices
      .getTagsForQuestion(questionId)
      .then(tags => {
        console.log('Current tags state:', this.tags);
        this.tags[questionId] = tags;
        console.log('Updated tags state:', this.tags);
      })
      .catch(error => {
        Alert.danger('Error getting tags: ' + error.message);
      });
  }


  mounted() {
    questionService
      .getAll()
      .then((questions) => {
        this.questions = questions
        questions.forEach(question => {
          this.getTagsForQuestions(question.questionId);
        });})
      .catch((error) => Alert.danger('Error getting questions: ' + error.message))

  }

}

export class QuestionDetails extends Component<{ match: { params: { id: number } } }> {
  question: Question = {
                questionId:0,
                userId: 1, 
                title:'',
                content:'', 
                createdAt: new Date(), 
                modifiedAt:new Date(), 
                viewCount: 0
              }  
  render() {
    return (
      <>
        <Card title='Question'>
          <Row>
            <Column width={2}>Title:</Column>
            <Column>{this.question.title}</Column>
          </Row>
          <Row>
            <Column width={2}>Content:</Column>
            <Column>{this.question.content}</Column>
          </Row>
          <Row>
            <Column width={2}>User:</Column>
            <Column>{this.question.userId}</Column>
          </Row>
          <Row>
            <Column width={2}>Created at:</Column>
            <Column>{this.question.createdAt.toDateString()}</Column>
          </Row>
          <Row>
            <Column width={2}>Last modified:</Column>
            <Column>{this.question.modifiedAt.toDateString()}</Column>
          </Row>
          <Row>
            <Column width={2}>ViewCount:</Column>
            <Column>{this.question.viewCount}</Column>
          </Row>
        </Card>
        <Button.Success
          onClick={() => history.push('/questions/' + this.props.match.params.id + '/edit')}
        >
          Edit
        </Button.Success>
      </>
    )
  }
  mounted() {
    questionService
      .get(this.props.match.params.id)
      .then((question) => {
        question.createdAt = new Date(question.createdAt);
        question.modifiedAt = new Date(question.modifiedAt);
        this.question = question;
      })
      .catch((error) => Alert.danger('Error getting question: ' + error.message));
  }
}

export class QuestionEdit extends Component<
{ match: { params: { id: number } } },
{ question: Partial<Question> }
> 
{
  question = {questionId: 0, title:'', content: '', userId:1}
  render(){
    return(
      <>
        <Card title='Edit question'>
         <Row>
            <Column width={2}>
              <Form.Label>Title:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                type="text"
                value={this.question.title}
                onChange={(event) => (this.question.title = event.currentTarget.value)}
              />
            </Column>
           </Row>
          <Row>
            <Column width={2}>
              <Form.Label>Content:</Form.Label>
            </Column>
            <Column>
              <Form.Textarea 
              value={this.question.content} 
              onChange={(event) => (this.question.content = event.currentTarget.value)} 
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
    const { questionId, title, content } = this.question;

    questionService
      .update(questionId, title, content)
      .then(() => history.push('/questions/' + questionId))
      .catch((error) => Alert.danger('Error saving question: ' + error.message));
  };

  delete = () => {
    questionService
      .delete(this.question.questionId)
      .then(() => history.push('/questions/'))
      .catch((error) => Alert.danger('Error deleting a question: ' + error.message));
  };

  mounted() {
    questionService
      .get(this.props.match.params.id)
      .then((question) => (this.question = question))
      .catch((error) => Alert.danger('Error getting task: ' + error.message));
      console.log(this.question)
  }

}


export class QuestionsNew extends Component {
  title: string = ''
  content: string = ''
  userId: number = 1

  render(){
    return (
      <>
        <Card title='New Question'>
          <Row>
            <Column width={2}>
              <Form.Label>Title:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                type="text"
                value={this.title}
                onChange={(event) => (this.title = event.currentTarget.value)}
              />
            </Column>
          </Row>
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
    questionService
      .create(this.title,this.content, this.userId)
      .then((id) => history.push('/questions/' + id))
      .catch((error) => {
        console.error("Detailed error:", error);
        console.log(this.title, this.content, this.userId)
        Alert.danger('Error creating task: ' + error.message)
      })
  }
}