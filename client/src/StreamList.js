import React from 'react';
import Stream from './Stream';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import classNames from 'classnames';

PouchDB.plugin(PouchDBFind);

let env = process.env.REACT_APP_STAGE;
const dbURL =
  env === 'dev'
    ? 'http://localhost:5000/voids'
    : 'https://api.void.kitay.co/voids';

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

  randInterval(min, max) {
    return Math.random() * (max - min + 1) + min;
  }

  getStreams = (count = 8) => {
    try {
      let queryAtTime =
        Date.now() - Math.floor(this.randInterval(0, 2) * 60 * 1000);
      let query = {
        selector: {
          created_at: {
            $gte: queryAtTime
          }
          // ,_id: {
          //   $nin: this.state.seen
          // }
        },
        limit: count
      };
      this.db.find(query).then(response => {
        // let seen = this.state.seen.slice();
        // seen.push(
        //   ...response.docs.reduce((ids, doc) => {
        //     ids.push(doc._id);
        //     return ids;
        //   }, [])
        // );
        if (response.docs.length === 0) {
          console.log('got length 0');
          return this.getStreams();
        }
        this.setState({
          fetching: false,
          fetchSecs: 0,
          streams: response.docs
          // seen
        });
        clearInterval(this.interval);
      });
      this.db.explain(query).then(console.log);
    } catch (e) {
      // try again!!!
      this.getStreams();
    }
  };

  tickTock = () => {
    this.setState({ fetchSecs: this.state.fetchSecs + 1 });
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

  async componentDidMount() {
    try {
      // Connect to PouchDB
      this.db = await new PouchDB(dbURL);
      console.log('connected to db');

      // Grab streams
      this.getStreams();
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <div className="StreamList">
        {this.state.streams.map((stream, index) => (
          <Stream key={stream.id + '-' + index} data={stream} />
        ))}
        <button
          className={classNames('next', { loading: this.state.fetching })}
          onClick={this.nextOnClick}
        >
          {this.state.fetching
            ? this.state.fetchSecs < 3
              ? 'communing with the void'
              : 'the void is cranky...'
            : 'go deeper'}
        </button>
      </div>
    );
  }
}

export default StreamList;
