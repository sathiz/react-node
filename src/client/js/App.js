import React, { Component } from 'react';
import '../css/App.css';
import Header from './Header';
import Search from './Search';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Search />
      </div>
    );
  }
}

export default App;
