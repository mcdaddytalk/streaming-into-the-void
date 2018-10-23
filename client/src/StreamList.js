import React from 'react';
import Stream from './Stream';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';

// Pouch DB setup
PouchDB.plugin(PouchDBFind);
const dbURL = process.env.REACT_APP_STAGE === 'dev'
  ? 'http://localhost:5000/db/voids'
  : 'https://api.void.kitay.co/voids';  

const Voids = new PouchDB(dbURL);

class StreamList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      streams: [],
      seen: []
    }
  }

  randInterval(min, max) {
      return Math.random()*(max-min+1)+min;
  }

  getStreams = (count = 2) => {
    try {
      let queryAtTime = Date.now() - Math.floor(this.randInterval(0, 2) * 60 * 1000);
      let query = {
        selector: {
          _id: {
            $nin: this.state.seen
          },
          created_at: {
            $gte: queryAtTime
          }
        },
        sort: ['created_at'],
        limit: count
      };
      Voids.find(query).then((response) => {
        let seen = this.state.seen.slice();
        seen.push(...response.docs.reduce((ids, doc) => {
          ids.push(doc._id);
          return ids;
        }, []));

         this.setState({
          fetching: false,
          streams: response.docs,
          seen
        });
      });
      Voids.explain(query).then(console.log)
    } catch(e) {
      console.log(e);
    }
  }

  nextOnClick = () => {
    this.setState({
      fetching: true
    });
    this.getStreams();
  }

  async componentDidMount() {
    this.getStreams();
  }

  render() {
    return (
      <div className="StreamList">
        {this.state.streams.map((stream, index) => (
          <Stream
            key={stream.id + '-' + index}
            data={stream}
          />
        ))}
        <button className="next" onClick={this.nextOnClick}>
          {this.state.fetching
          ? "searching..."
          : "go deeper"}
        </button>
      </div>
    );
  }
}

export default StreamList;