import React from 'react';
import Stream from './Stream';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);
const Voids = new PouchDB('https://void.kitay.co/voids');

class StreamList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      streams: [],
    }
  }

  randInterval(min, max) {
      return Math.random()*(max-min+1)+min;
  }

  getStreams = () => {
    try {
      let queryAtTime = Date.now() - Math.floor(this.randInterval(0, 3) * 60 * 1000);
      let query = {
        selector: {
          created_at: {
            $gte: queryAtTime
          }
        },
        sort: ['created_at'],
        limit: 2
      };
      Voids.find(query).then((response) => {
        this.setState({
          fetching: false,
          streams: response.docs
        });
      });
      
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
          : "next"}
        </button>
      </div>
    );
  }
}

export default StreamList;