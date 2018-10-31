import React from 'react';
import './App.css';
import StreamList from './StreamList';

class App extends React.Component {
  render() {
    return (
      <main className="App">
        <h4>You are flying through a sunless void searching for a way out. There are other lost souls here, too. You can see them, but they cannot see you. Some have perished. There are monsters.  You must press on through the dark.</h4>
        <StreamList />
        <aside className="credit">
          made by <a href="https://twitter.com/kkitay">@kkitay</a>
        </aside>
      </main>
    );
  }
}

export default App;
