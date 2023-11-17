import * as React from 'react';
import { Component } from 'react-simplified';
import tagService, { Tag } from './tagsServices';



interface TagsListState {
  tags: Tag[];
  filterValue: string;
  sortBy: 'Popular' | 'Name'; // FILTER KNAPPENE
}

class TagsList extends Component<{}, TagsListState> {
  state: TagsListState = {
    tags: [],
    filterValue: '',
    sortBy: 'Popular',
  };

  componentDidMount() {
    tagService.getAll()
      .then((tags: Tag[]) => this.setState({ tags }))
      .catch((error: any) => {
        console.error('Error fetching tags:', error);
      });
  }

  setSortBy(sortBy: 'Popular' | 'Name') {
    this.setState({ sortBy });
    // Additional logic to sort the tags based on selection
  }

  render() {
    // Implement filtering logic here
    // Implement sorting logic here

    return (
      <div>
        <div className="tags-header">
          <h2>Tags</h2>
          <div className="tags-sort-buttons">
            <button onClick={() => this.setSortBy('Popular')}>Popular</button>
            <button onClick={() => this.setSortBy('Name')}>Name</button>
          </div>
        </div>
        <input
          type="text"
          placeholder="Filter by tag name"
          value={this.state.filterValue}
          onChange={(e) => this.setState({ filterValue: e.target.value })}
          className='tags-search-input' 
        />
        <div className="tags-list">
          {this.state.tags.map(tag => (
            <div className="tag-item" key={tag.tagId}>
              <h3>{tag.name}</h3>
              <p>{tag.description}</p> 
              <span>{tag.questionCount} questions</span>
            </div>
            
          ))}
        </div>
      </div>
    );
  }
}

export default TagsList;
