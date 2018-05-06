import React, { Component } from 'react';
import axios from 'axios';
import Fontawesome from 'react-fontawesome';
import {sortBy} from 'lodash';
//import PropTypes from 'prop-types';

import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP='100';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

//const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}${'0'}&${PARAM_HPP}${DEFAULT_HPP}`;
//console.log(url);

const largeColumn ={
  width: '40%'
};
const midColumn = {
  width: '30%'
};
const smallColumn = {
  width: '10%'
};

const Loading = () => {
  return (
    <div>
      <Fontawesome
        className='super-crazy-colors'
        name='rocket'
        size='2x'
        spin
        style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
        />
      Loading
    </div>
  );
};
//const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());
const withLoading = (Component) => ({
  isLoading, ...rest}) =>
  isLoading
  ? <Loading />
  : <Component { ...rest} />



class App extends Component {
  _isMounted = false;

  constructor(props){
    super(props);
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
    };
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }


  fetchSearchTopStories(searchTerm, page=0) {
    this.setState({isLoading: true});
    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
//    .then(response => response.json())
    .then(result => this._isMounted && this.setSearchTopStories(result.data))
    .catch(error => this._isMounted && this.setState({error}));
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  onSearchSubmit(event) {
    const {searchTerm} = this.state;
    this.setState({searchKey: searchTerm});
    if (this.needsToSearchTopStories(searchTerm)) this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  setSearchTopStories(result) {
    const {hits,page} = result;
    const {searchKey, results} = this.state;

    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];
    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    this.setState({
      results: {
        ...results,
        [searchKey]: {hits: updatedHits, page},
      },
      isLoading: false
    });
  }

  componentDidMount() {
    this._isMounted = true;
    const {searchTerm} = this.state;
    this.setState({searchKey: searchTerm});
    this.fetchSearchTopStories(searchTerm);
  }

  componentWillUnmount () {
    this._isMounted = false;
  }

  onDismiss(id) {
    const {searchKey, results} = this.state;
    const {hits, page} = results[searchKey];

    const isNotId = item => item.objectID !== id;
    // const updatedList = this.state.list.filter(isNotId);
    const updatedHits = hits.filter(isNotId);

    this.setState({
      results: {
        ...results,
        [searchKey]: {hits: updatedHits, page}
      }
    });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value})
  }

  render() {
    const {searchTerm, results, searchKey, error,isLoading} = this.state;
    // console.log(this.state);
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
            >
            Search
          </Search>
        </div>
        { error
          ? <div className="interactions">
            <p>Algo salio mal</p>
          </div>
        :

        <Table
          list={list}
          onDismiss={this.onDismiss}
          />
        }
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={()=>this.fetchSearchTopStories(searchKey, page+1)}>
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

class Search extends Component {
  componentDidMount() {
    if (this.input) {
      this.input.focus();
    }
  }
  render() {
    const {
      value,
      onChange,
      onSubmit,
      children,
    } = this.props;
    return (
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={value}
          onChange={onChange}
          ref={(node)=> {this.input = node;}}
          />
        <button type="submit">
          {children}
        </button>
      </form>
    );
  }
}

// const Search = ({value, onChange, onSubmit, children}) => {
//   return (
//     <form onSubmit ={onSubmit}>
//       <input
//         type="text"
//         value={value}
//         onChange = {onChange}
//       />
//       <button type="submit">
//         {children}
//       </button>
//     </form>
//   );
// }

 const Table = ({list, onDismiss}) => {
     return (
      <div className="table">
        {list.map(item =>
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

const Button = ({onClick, className='',children}) => {
    return (
      <button
        onClick={onClick}
        className={className}
        type="button"
        >
        {children}
      </button>
    );
}

const ButtonWithLoading = withLoading(Button);

class Developer {
  constructor(firstname, lastname) {
    this.firstname = firstname;
    this.lastname = lastname;
  }
  getName() {
    return this.firstname+' '+this.lastname;
  }
}

const robin = new Developer('Robin', 'Wier');
console.log(robin.getName());
export default App;
export {
  Button,
  Table,
  Search,
};
