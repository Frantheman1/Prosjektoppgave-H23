import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Row, Column,Button } from './widgets';
import tagsService, { TagWithCount } from './services/tagsServices';
import { createHashHistory } from 'history';

const history = createHashHistory();


export class TagsList extends Component {
 tags: TagWithCount[] = []
 displayedTags: TagWithCount[] = []
 userId: number = 1

 render() {
  return(
   <>
     <Card title='Tags'>
          <Button.Success onClick={() => this.sortByProperty('name')}>Sort by Name</Button.Success>
          <Button.Success onClick={() => this.sortByProperty('questionCount')}>Sort by questionCount</Button.Success>
                
          {this.displayedTags.map((tag) => (
            <Row key={tag.name}>
             <Row>
              <Column width={2}>TagName:</Column>
              <Column>{tag.name}</Column>
              <Column>{tag.questionCount}</Column>
             </Row>       
            </Row>
          ))}

        </Card>
     </>
  )
 }

 sortByProperty = (propertyName: keyof TagWithCount ) => {
  this.displayedTags = [...this.tags].sort((a, b) => {

    if (typeof a[propertyName] === 'number' && typeof b[propertyName] === 'number') {
      return (b[propertyName] as number)  - (a[propertyName] as number) ;
    }
    return String(a[propertyName]).localeCompare(String(b[propertyName]));
  });
 };

 mounted() {
  tagsService
   .getAllTagsWithQuestionCount()
   .then((tags) => {
     this.displayedTags = tags
     this.tags = tags
   })
   .catch(error => console.error('Error fetching tags:', error))
 }
}

