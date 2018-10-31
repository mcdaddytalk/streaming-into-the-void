import React from 'react';
import Stream from './Stream';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import classNames from 'classnames';

PouchDB.plugin(PouchDBFind);

let env = 'production'; // process.env.REACT_APP_STAGE;
const dbURL =
  env === 'dev'
    ? 'http://localhost:5000/voids'
    : 'https://api.void.kitay.co/voids';

const randInterval = (min, max) => {
  return Math.random() * (max - min + 1) + min;
};

class StreamList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      fetchSecs: 0,
      streams: [],
      seen: []
    };
    this.db = null;
    this.interval = null;
  }

  getStreams = (count = 8) => {
    try {
      let queryAtTime = Date.now() - Math.floor(randInterval(0, 2) * 60 * 1000);
      let query = {
        selector: {
          created_at: {
            $gte: queryAtTime
          },
          _id: {
            $nin: this.state.seen
          }
        },
        limit: count
      };
      this.db.find(query).then(response => {
        let seen = this.state.seen.slice();
        seen.push(
          ...response.docs.reduce((ids, doc) => {
            ids.push(doc._id);
            return ids;
          }, [])
        );

        // If nothing comes back, try again.
        if (response.docs.length === 0) {
          console.log('received no streams');
          return this.getStreams();
        }

        console.log('got streams', response.docs);

        // Otherwise, update state with the new streams.
        this.setState({
          fetching: false,
          fetchSecs: 0,
          streams: response.docs,
          seen
        });

        // Clear the fetch counter.
        clearInterval(this.interval);
      });

      // For debugging: explains the query being made
      // this.db.explain(query).then(console.log);
    } catch (e) {
      console.log('Failed to get streams', e);

      // Try again!
      this.getStreams();
    }
  };

  tickTock = () => {
    this.setState({
      fetchSecs: this.state.fetchSecs + 1
    });
  };

  nextOnClick = () => {
    // set fetching state
    this.setState({
      fetching: true
    });

    // start an interval for our cute message
    this.interval = setInterval(() => this.tickTock(), 1000);

    // grab streams
    this.getStreams();
  };

  componentDidMount() {
    try {
      // Connect to PouchDB
      this.db = new PouchDB(dbURL);
      console.log('connected to db');

      // Grab streams
      this.getStreams();
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    let buttonMessage = 'contacting the void';
    if (this.db) {
      buttonMessage = 'go deeper';
    }
    if (this.state.fetching) {
      buttonMessage = 'reaching into the void';
      if (this.state.fetchSecs > 3) {
        buttonMessage = 'the void is cranky...';
      }
      if(this.state.fetchSecs > 10) {
        buttonMessage = 'wtf, void?';
      }
    }

    return (
      <div className="StreamList">
        {this.state.streams.map((stream, index) => (
          <Stream key={stream.id + '-' + index} data={stream} />
        ))}
        <button
          className={classNames('next', { loading: this.state.fetching })}
          onClick={this.nextOnClick}
        >
          {buttonMessage}
        </button>
      </div>
    );
  }
}

export default StreamList;
