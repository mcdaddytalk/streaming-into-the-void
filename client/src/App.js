import React from 'react';
import './App.css';
import StreamList from './StreamList';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <h1>Streaming Into the Void</h1>
        <h4>Folks streaming <a href="https://www.twitch.tv/directory/tags/2610cff9-10ae-4cb3-8500-778e6722fbb5">IRL</a> with nobody watching</h4>
        <StreamList />
      </div>
    );
  }
}

export default App;
