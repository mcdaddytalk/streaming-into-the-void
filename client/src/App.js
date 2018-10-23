import React from 'react';
import './App.css';
import StreamList from './StreamList';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <h1>Streaming Into the Void</h1>
        <h4>People streaming with nobody watching.</h4>
        <StreamList />
        <div className="credit">
          made by <a href="https://twitter.com/kkitay">@kkitay</a>
        </div>
      </div>
    );
  }
}

export default App;
