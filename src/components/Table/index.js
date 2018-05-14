import React, { Component } from 'react';
import {Button,Sort,} from '../App';

import {
  SORTS,
  largeColumn,
  midColumn,
  smallColumn,
} from '../../constants';
import './index.css';

class Table extends Component {
  constructor(props) {
    super(props);
    this.state={
      sortKey: 'NONE',
      isSortReverse: false,
    };
    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }

  render () {
    const {
      list,
      onDismiss,
    } = this.props;
    const {
      sortKey,
      isSortReverse,
    } = this.state;
    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;
    return (
       <div className="table">
         <div className="table-header">
           <span style={largeColumn}>
             <Sort sortKey={'TITLE'} onSort={this.onSort} activeSortKey={sortKey}>
               Title
             </Sort>
           </span>
           <span style={midColumn}>
             <Sort sortKey={'AUTHOR'} onSort={this.onSort} activeSortKey={sortKey}>
               Author
             </Sort>
           </span>
           <span style={smallColumn}>
             <Sort sortKey={'COMMENTS'} onSort={this.onSort} activeSortKey={sortKey}>
               Comments
             </Sort>
           </span>
           <span style={smallColumn}>
             <Sort sortKey={'POINTS'} onSort={this.onSort} activeSortKey={sortKey}>
               Points
             </Sort>
           </span>
           <span style={smallColumn}>
             Archive
           </span>
         </div>
         {reverseSortedList.map(item =>
           <div key={item.objectID} className="table-row">
             <span style={largeColumn}> <a href={item.url}>{item.title}</a></span>
             <span style={midColumn}> {item.author}</span>
             <span style={smallColumn}> {item.num_comments}</span>
             <span style={smallColumn}> {item.points}</span>
             <span style={smallColumn}>
               <Button onClick={() => onDismiss(item.objectID)} className="button-inline">
                 Dismiss
               </Button>
             </span>
           </div>
         )}
       </div>
    );
  }
}

export default Table;