import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from './widgets';
import { NavLink } from 'react-router-dom';
import questionService, { Question } from './services/questionsServices';
import tagServices, { Tag } from './services/tagsServices'
import answerService, { Answer, AnswerCountMap } from './services/answersServices';
import voteService from './services/votesServices';
import favoriteService from './services/favoritesServices';
import commentService, { Comment } from './services/commentsSevrvices';
import { createHashHistory } from 'history';

const history = createHashHistory();
/**
 * Renders Questions list.
 */

export class QuestionsList extends Component {
  questions: Question[] = []
  tags:{ [key: number]: Tag[] }  = {}
  answerCounts: AnswerCountMap = {};
  displayedQuestions: Question[] = [];

  render() {
    return (
      <>
       <Button.Success onClick={() => history.push('/questions/new')}>New question</Button.Success>
       <Button.Success onClick={() => this.sortByProperty('viewCount')}>Sort by View Count</Button.Success>
       <Button.Success onClick={() => this.sortByProperty('answerCount')}>Sort by Answer Count</Button.Success>
       <Button.Success onClick={() => this.sortByProperty('createdAt')}>Sort by Date</Button.Success>
       <Button.Success onClick={() => this.showUnanswered()}>Show Unanswered Questions</Button.Success>
        <Card title='Questions'>
          
          {this.displayedQuestions.map((question) => (
            <Row key={question.questionId}>
              <NavLink  
                to={'/questions/' + question.questionId} 
                onClick={() => this.updateView(question.questionId)}
                >
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

  showUnanswered() {
    const unansweredQuestions = this.questions.filter(question => {
      const hasAnswer = this.answerCounts.hasOwnProperty(question.questionId);
      return !hasAnswer;
    });
  
    this.displayedQuestions = unansweredQuestions;
  }

  sortByProperty = (propertyName: keyof Question | 'answerCount') => {
    this.displayedQuestions = [...this.questions].sort((a, b) => {

      if (propertyName === 'answerCount') {
        const countA = this.answerCounts[a.questionId] || 0;
        const countB = this.answerCounts[b.questionId] || 0;
        return countB - countA;
      }

      if (typeof a[propertyName] === 'number' && typeof b[propertyName] === 'number') {
        return (b[propertyName] as number)  - (a[propertyName] as number) ;
      }
      if (a[propertyName] instanceof Date && b[propertyName] instanceof Date) {
        return (b[propertyName] as Date).getTime() - (a[propertyName] as Date).getTime();
      }
      return String(a[propertyName]).localeCompare(String(b[propertyName]));
    });
};

  updateView(questionId: number) {
    questionService
      .updateViewCount(questionId)
      .then(response => {
        console.log('View count updated:', response);
      })
      .catch(error => {
        console.error('Error updating view count:', error);
      });

  }

  getTagsForQuestions(questionId: number ) {
    tagServices
      .getTagsForQuestion(questionId)
      .then(tags => {
        this.tags[questionId] = tags;
      })
      .catch(error => {
        Alert.danger('Error getting tags: ' + error.message);
      });
  }


  mounted() {
    questionService.getAll()
      .then((questions) => {
        this.displayedQuestions = questions;
        this.questions = questions;        
        questions.forEach(question => {
          this.getTagsForQuestions(question.questionId);
        });})
      .catch((error) => Alert.danger('Error getting questions: ' + error.message))
    
    answerService.getAnswerCounts()
    .then((answersCount) => {
      this.answerCounts = answersCount.reduce((acc: AnswerCountMap, curr) => {
        if (curr.questionId !== undefined && curr.count !== undefined) {
          acc[curr.questionId] = curr.count;
        } else {
          console.log('Invalid data:', curr);
        }
        return acc;
      }, {});
      
    })

}
}

export class QuestionDetails extends Component<
{ match: {
  params: { id: number };
  path: string;
}; }> {
  question: Question = {
                questionId:0,
                userId: 1, 
                title:'',
                content:'', 
                createdAt: new Date(), 
                modifiedAt:new Date(), 
                viewCount: 0
              }
  answer: Answer[] = []
  displayedAnswer: Answer[] = []
  comment: Comment[] = []
  

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
        <Button.Success
          onClick={() => history.push(`/answers/new/` + this.props.match.params.id)}
        >
          Answer
        </Button.Success>
        <Button.Success
          onClick={() => history.push(`/comments/question/${this.question.questionId}/new/`)}
        >
          Comment
        </Button.Success>
        <Card title="Comments for Question">
          {this.comment.map((comment)=> {
            if(comment.questionId == this.question.questionId) {
              return(
              <Row>
                <Column>{comment.content}</Column>
                <Column>{new Date(comment.createdAt).toDateString()}</Column>
                <Column>{new Date(comment.modifiedAt).toDateString()}</Column>
                <Column>{comment.userId}</Column>
                <Button.Success
                  onClick={() => history.push(`/comment/${comment.commentId}/edit/${this.question.questionId}`)}
                >
                 Edit
                </Button.Success>
              </Row>
              )
            }
          })}

        </Card>


        <Card title='Answers'>
          <Button.Success onClick={() => this.sortByProperty('score')}>Sort by Answer Count</Button.Success>
          <Button.Success onClick={() => this.sortByProperty('modifiedAt')}>Sort by Date</Button.Success>
          {this.displayedAnswer.map((answer)=> (
          
            <Row>
              {console.log("yo",this.comment)}
               <Row>
            <Column width={2}>Content:</Column>
            <Column>{answer.content}</Column>
          </Row>
          <Row>
            <Column width={2}>Created at:</Column>
            <Column>{new Date(answer.createdAt).toDateString()}</Column>
          </Row>
          <Row>
            <Column width={2}>Last modified:</Column>
            <Column>{new Date(answer.modifiedAt).toDateString()}</Column>
          </Row>
          <Row>
            <Column width={2}>isAccepted:</Column>
            <Column>{answer.isAccepted ? "Yes" : "No"}</Column>
          </Row>
          <Row>
            <Column width={2}>Score:</Column>
            <Column>{answer.score}</Column>
          </Row>
          <Row>
            <Column width={2}>User:</Column>
            <Column>{answer.userId}</Column>
          </Row>
          <Button.Success
          onClick={() => history.push(`/answers/${answer.answerId}/edit`)}
        >
          Edit
        </Button.Success>
          <Row>
            <Button.Success onClick={() => this.voteForAnswer(answer.answerId,answer.userId, 1)}>
              Upvote
            </Button.Success>
            <Button.Danger onClick={() => this.voteForAnswer(answer.answerId,answer.userId, 0)}>
              Downvote
            </Button.Danger>
            <Form.Checkbox 
              checked={answer.isAccepted} 
              onChange={(e) => this.toggleAcceptance(answer.answerId, e.target.checked)}></Form.Checkbox>
            <Button.Success onClick={() => this.addToFavorites(answer.userId,answer.answerId)}>
              Add to Favorites
            </Button.Success>  
            <Button.Success
              onClick={() => history.push(`/comments/answer/${answer.answerId}/new/${answer.questionId}`)}
            >
              Comment
            </Button.Success>          
          </Row>
          <Card title="Comments for Answers">
          {this.comment.map((comment)=> {
            if(comment.answerId == answer.answerId) {
              return(
              <Row>
                <Column>{comment.content}</Column>
                <Column>{new Date(comment.createdAt).toDateString()}</Column>
                <Column>{new Date(comment.modifiedAt).toDateString()}</Column>
                <Column>{comment.userId}</Column>
                <Button.Success
                  onClick={() => history.push(`/comment/${comment.commentId}/edit/${answer.questionId}`)}
                >
                 Edit
                </Button.Success>
              </Row>
              )
            }
          })}

        </Card>
        </Row> 
          )        
          )}
        </Card>
        
      </>
    )
  }

  sortByProperty = (propertyName: keyof Answer ) => {
    this.displayedAnswer = [...this.answer].sort((a, b) => {

      if (typeof a[propertyName] === 'number' && typeof b[propertyName] === 'number') {
        return (b[propertyName] as number)  - (a[propertyName] as number) ;
      }
      if (a[propertyName] instanceof Date && b[propertyName] instanceof Date) {
        return (b[propertyName] as Date).getTime() - (a[propertyName] as Date).getTime();
      }
      return String(a[propertyName]).localeCompare(String(b[propertyName]));
    });
  };

  addToFavorites(userId:number,answerId: number) {
    favoriteService
      .addFavorite(userId, answerId)
      .then(() => console.log('Succesfully added a answer to favorite'))
      .catch(error => Alert.danger('Error adding to favorites: ' + error.message));
  }

  toggleAcceptance(answerId: number, isAccepted: boolean) {
    const previouslyAcceptedAnswer = this.displayedAnswer.find(answer => answer.isAccepted);

    const updatedAnswers = this.displayedAnswer.map(answer => ({
      ...answer,
      isAccepted: answer.answerId === answerId ? isAccepted : false
    }));
  
    this.displayedAnswer = updatedAnswers;
  
    answerService
      .markAnswerAsAccepted(answerId, isAccepted)
      .then(() => {
        console.log('Answer acceptance updated');
        
        if (previouslyAcceptedAnswer) {
          answerService
            .markAnswerAsAccepted(previouslyAcceptedAnswer.answerId, false)
            .then(() => console.log('Previously accepted answer unaccepted on the server'))
            .catch(error => console.error('Error updating previously accepted answer on the server: ' + error.message));
        }
      })
      .catch(error => Alert.danger('Error updating answer acceptance: ' + error.message));
  }

  voteForAnswer(answerId: number, userId: number, voteType: number) {
    voteService
      .voteOnAnswer(answerId, userId, voteType)
      .then(() => {
        answerService
          .getAnswersForQuestion(this.props.match.params.id)
          .then(updatedAnswers => {
            this.displayedAnswer = updatedAnswers;
           console.log('Vote updated and answers refreshed for answer:', answerId);
         })
          .catch(error => Alert.danger('Error fetching updated answers: ' + error.message));
      })
      .catch(error => Alert.danger('Error voting on answer: ' + error.message));
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

    answerService
      .getAnswersForQuestion(this.props.match.params.id)
      .then((answer) => {
        this.displayedAnswer = answer
        this.answer = answer;
      })
      .catch((error) => Alert.danger('Error getting answers: ' + error.message));

      commentService
        .getComments()
        .then((comment) => this.comment = comment)
        .catch((error) => Alert.danger('Error getting comments: ' + error.message));
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